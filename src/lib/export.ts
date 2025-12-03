import type { Lead, PipelineStage, ContactMethod } from '@/types'

interface ExportableLead extends Omit<Lead, 'stage' | 'lastContactMethod'> {
  stage?: PipelineStage | string
  lastContactMethod?: ContactMethod | string
  addedAt?: string
}

export function exportLeadsToCSV(leads: ExportableLead[], filename: string = 'leads') {
  // Define CSV headers
  const headers = [
    'Business Name',
    'Category',
    'Address',
    'City',
    'State',
    'Phone',
    'Email',
    'Website',
    'Instagram',
    'Facebook',
    'LinkedIn',
    'Twitter',
    'Google Rating',
    'Review Count',
    'Lead Score',
    'Stage',
    'Tags',
    'Last Contacted',
    'Contact Method',
    'Next Follow-up',
    'Added Date',
  ]

  // Convert leads to CSV rows
  const rows = leads.map((lead) => [
    escapeCSV(lead.businessName),
    escapeCSV(lead.category),
    escapeCSV(lead.address || ''),
    escapeCSV(lead.city),
    escapeCSV(lead.state),
    escapeCSV(lead.phone || ''),
    escapeCSV(lead.email || ''),
    escapeCSV(lead.website || ''),
    escapeCSV(lead.instagram || ''),
    escapeCSV(lead.facebook || ''),
    escapeCSV(lead.linkedin || ''),
    escapeCSV(lead.twitter || ''),
    lead.googleRating?.toFixed(1) || '',
    lead.reviewCount?.toString() || '',
    lead.leadScore?.toString() || '',
    escapeCSV(lead.stage || ''),
    escapeCSV(lead.tags?.join(', ') || ''),
    lead.lastContactedAt ? formatDate(lead.lastContactedAt) : '',
    escapeCSV(lead.lastContactMethod || ''),
    lead.nextFollowUpAt ? formatDate(lead.nextFollowUpAt) : '',
    lead.addedAt ? formatDate(lead.addedAt) : '',
  ])

  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}-${formatDateForFilename(new Date())}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

function escapeCSV(value: string): string {
  if (!value) return ''
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return dateString
  }
}

function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0]
}
