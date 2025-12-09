/**
 * Email Verification Service using NeverBounce API
 *
 * Pricing: $0.008 per verification (98% accuracy)
 * API Docs: https://developers.neverbounce.com/
 */

const NEVERBOUNCE_API_URL = 'https://api.neverbounce.com/v4'

export type VerificationStatus =
  | 'valid'        // Safe to send
  | 'invalid'      // Doesn't exist, will bounce
  | 'disposable'   // Temporary email (mailinator, etc)
  | 'catchall'     // Server accepts all emails (can't verify)
  | 'unknown'      // Unable to verify

export interface EmailVerificationResult {
  email: string
  status: VerificationStatus
  isValid: boolean
  isSafeToSend: boolean
  score: number // 0-100 confidence score
  details: {
    freeEmail: boolean      // gmail, yahoo, etc
    roleAddress: boolean    // info@, support@, etc
    disposable: boolean     // temporary email
    catchAll: boolean       // accepts all emails
    suggestion?: string     // Suggested correction
  }
  verifiedAt: string
}

export interface BatchVerificationResult {
  results: EmailVerificationResult[]
  summary: {
    total: number
    valid: number
    invalid: number
    disposable: number
    catchall: number
    unknown: number
  }
  creditsUsed: number
}

/**
 * Verify a single email address using NeverBounce
 */
export async function verifyEmail(email: string): Promise<EmailVerificationResult> {
  const apiKey = process.env.NEVERBOUNCE_API_KEY

  if (!apiKey) {
    console.warn('[EmailVerification] NEVERBOUNCE_API_KEY not set - using mock verification')
    return mockVerifyEmail(email)
  }

  try {
    const response = await fetch(`${NEVERBOUNCE_API_URL}/single/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        email: email,
        address_info: 1,   // Include additional info
        credits_info: 1,   // Include credit usage
      }),
    })

    if (!response.ok) {
      throw new Error(`NeverBounce API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'success') {
      throw new Error(data.message || 'Verification failed')
    }

    return parseNeverBounceResult(email, data)
  } catch (error) {
    console.error('[EmailVerification] Error verifying email:', error)
    // Return unknown status on error
    return {
      email,
      status: 'unknown',
      isValid: false,
      isSafeToSend: false,
      score: 0,
      details: {
        freeEmail: false,
        roleAddress: false,
        disposable: false,
        catchAll: false,
      },
      verifiedAt: new Date().toISOString(),
    }
  }
}

/**
 * Verify multiple emails in batch (more cost-effective)
 * NeverBounce batch verification is async - this polls until complete
 */
export async function verifyEmailsBatch(
  emails: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<BatchVerificationResult> {
  const apiKey = process.env.NEVERBOUNCE_API_KEY

  if (!apiKey) {
    console.warn('[EmailVerification] NEVERBOUNCE_API_KEY not set - using mock batch verification')
    return mockBatchVerify(emails)
  }

  if (emails.length === 0) {
    return {
      results: [],
      summary: { total: 0, valid: 0, invalid: 0, disposable: 0, catchall: 0, unknown: 0 },
      creditsUsed: 0,
    }
  }

  // For small batches, use individual verification (faster)
  if (emails.length <= 5) {
    const results: EmailVerificationResult[] = []
    for (let i = 0; i < emails.length; i++) {
      const result = await verifyEmail(emails[i])
      results.push(result)
      onProgress?.(i + 1, emails.length)
    }
    return summarizeBatchResults(results)
  }

  try {
    // Create batch job
    const createResponse = await fetch(`${NEVERBOUNCE_API_URL}/jobs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
        input: emails.map((email) => ({ email })),
        auto_start: 1,
        auto_parse: 1,
      }),
    })

    if (!createResponse.ok) {
      throw new Error(`Failed to create batch job: ${createResponse.status}`)
    }

    const createData = await createResponse.json()
    const jobId = createData.job_id

    if (!jobId) {
      throw new Error('No job ID returned from NeverBounce')
    }

    console.log(`[EmailVerification] Batch job created: ${jobId}`)

    // Poll for job completion
    let attempts = 0
    const maxAttempts = 60 // Max 5 minutes (5s intervals)
    let jobStatus = 'pending'

    while (jobStatus !== 'complete' && attempts < maxAttempts) {
      await sleep(5000) // Wait 5 seconds between polls

      const statusResponse = await fetch(
        `${NEVERBOUNCE_API_URL}/jobs/status?key=${apiKey}&job_id=${jobId}`
      )
      const statusData = await statusResponse.json()

      jobStatus = statusData.job_status

      if (statusData.total && statusData.processed) {
        onProgress?.(statusData.processed, statusData.total)
      }

      if (jobStatus === 'failed') {
        throw new Error('Batch verification job failed')
      }

      attempts++
    }

    if (jobStatus !== 'complete') {
      throw new Error('Batch verification timed out')
    }

    // Download results
    const resultsResponse = await fetch(
      `${NEVERBOUNCE_API_URL}/jobs/results?key=${apiKey}&job_id=${jobId}`
    )
    const resultsData = await resultsResponse.json()

    const results: EmailVerificationResult[] = resultsData.results.map(
      (item: any) => parseNeverBounceResult(item.email || item.data?.email, item)
    )

    return summarizeBatchResults(results, resultsData.credits_used || emails.length)
  } catch (error) {
    console.error('[EmailVerification] Batch verification error:', error)
    // Fallback to individual verification on error
    const results: EmailVerificationResult[] = []
    for (let i = 0; i < emails.length; i++) {
      const result = await verifyEmail(emails[i])
      results.push(result)
      onProgress?.(i + 1, emails.length)
    }
    return summarizeBatchResults(results)
  }
}

/**
 * Quick check if email format is valid (no API call)
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Check if email is from a free provider (Gmail, Yahoo, etc)
 */
export function isFreeEmailProvider(email: string): boolean {
  const freeProviders = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
    'live.com',
    'msn.com',
  ]

  const domain = email.split('@')[1]?.toLowerCase()
  return freeProviders.includes(domain)
}

/**
 * Check if email is a role-based address (info@, support@, etc)
 */
export function isRoleBasedEmail(email: string): boolean {
  const rolePatterns = [
    /^info@/i,
    /^contact@/i,
    /^support@/i,
    /^sales@/i,
    /^admin@/i,
    /^help@/i,
    /^service@/i,
    /^marketing@/i,
    /^billing@/i,
    /^hr@/i,
    /^jobs@/i,
    /^careers@/i,
    /^press@/i,
    /^media@/i,
    /^team@/i,
    /^hello@/i,
    /^enquir(y|ies)@/i,
    /^office@/i,
    /^feedback@/i,
  ]

  return rolePatterns.some((pattern) => pattern.test(email))
}

// Helper functions

function parseNeverBounceResult(email: string, data: any): EmailVerificationResult {
  // NeverBounce result codes
  const resultCodes: Record<number, VerificationStatus> = {
    0: 'valid',
    1: 'invalid',
    2: 'disposable',
    3: 'catchall',
    4: 'unknown',
  }

  const resultCode = data.result || data.verification?.result || 4
  const status = resultCodes[resultCode] || 'unknown'

  // Calculate confidence score
  let score = 0
  if (status === 'valid') score = 95
  else if (status === 'catchall') score = 60
  else if (status === 'unknown') score = 30
  else if (status === 'disposable') score = 10
  else if (status === 'invalid') score = 0

  const addressInfo = data.address_info || {}

  return {
    email,
    status,
    isValid: status === 'valid',
    isSafeToSend: status === 'valid' || status === 'catchall',
    score,
    details: {
      freeEmail: addressInfo.free || isFreeEmailProvider(email),
      roleAddress: addressInfo.role || isRoleBasedEmail(email),
      disposable: status === 'disposable',
      catchAll: status === 'catchall',
      suggestion: data.suggested_correction,
    },
    verifiedAt: new Date().toISOString(),
  }
}

function summarizeBatchResults(
  results: EmailVerificationResult[],
  creditsUsed?: number
): BatchVerificationResult {
  const summary = {
    total: results.length,
    valid: 0,
    invalid: 0,
    disposable: 0,
    catchall: 0,
    unknown: 0,
  }

  results.forEach((result) => {
    switch (result.status) {
      case 'valid':
        summary.valid++
        break
      case 'invalid':
        summary.invalid++
        break
      case 'disposable':
        summary.disposable++
        break
      case 'catchall':
        summary.catchall++
        break
      default:
        summary.unknown++
    }
  })

  return {
    results,
    summary,
    creditsUsed: creditsUsed ?? results.length,
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Mock functions for development without API key

function mockVerifyEmail(email: string): EmailVerificationResult {
  // Basic mock logic for testing
  const isValid = isValidEmailFormat(email)
  const isFree = isFreeEmailProvider(email)
  const isRole = isRoleBasedEmail(email)

  // Simulate different results based on email patterns
  let status: VerificationStatus = 'unknown'
  let score = 30

  if (!isValid) {
    status = 'invalid'
    score = 0
  } else if (email.includes('test') || email.includes('fake')) {
    status = 'invalid'
    score = 0
  } else if (email.includes('temp') || email.includes('disposable')) {
    status = 'disposable'
    score = 10
  } else if (isFree || isRole) {
    status = 'valid'
    score = 85
  } else {
    status = 'catchall'
    score = 60
  }

  return {
    email,
    status,
    isValid: status === 'valid',
    isSafeToSend: status === 'valid' || status === 'catchall',
    score,
    details: {
      freeEmail: isFree,
      roleAddress: isRole,
      disposable: status === 'disposable',
      catchAll: status === 'catchall',
    },
    verifiedAt: new Date().toISOString(),
  }
}

function mockBatchVerify(emails: string[]): BatchVerificationResult {
  const results = emails.map((email) => mockVerifyEmail(email))
  return summarizeBatchResults(results)
}
