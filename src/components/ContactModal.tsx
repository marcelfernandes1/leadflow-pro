import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Phone,
  Instagram,
  Globe,
  Linkedin,
  MessageCircle,
  Users,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { ContactMethod, Lead } from '@/types'

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
  onContact: (method: ContactMethod, notes?: string) => void
}

const contactMethods: Array<{
  id: ContactMethod
  label: string
  icon: React.ElementType
  color: string
  getUrl?: (lead: Lead) => string | null
}> = [
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    color: 'bg-blue-500 hover:bg-blue-600',
    getUrl: (lead) => (lead.email ? `mailto:${lead.email}` : null),
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: Phone,
    color: 'bg-green-500 hover:bg-green-600',
    getUrl: (lead) => (lead.phone ? `tel:${lead.phone}` : null),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    color: 'bg-pink-500 hover:bg-pink-600',
    getUrl: (lead) =>
      lead.instagram
        ? `https://instagram.com/${lead.instagram.replace('@', '')}`
        : null,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: MessageCircle,
    color: 'bg-blue-600 hover:bg-blue-700',
    getUrl: (lead) =>
      lead.facebook
        ? lead.facebook.startsWith('http')
          ? lead.facebook
          : `https://facebook.com/${lead.facebook}`
        : null,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700 hover:bg-blue-800',
    getUrl: (lead) =>
      lead.linkedin
        ? lead.linkedin.startsWith('http')
          ? lead.linkedin
          : `https://linkedin.com/company/${lead.linkedin}`
        : null,
  },
  {
    id: 'twitter',
    label: 'Twitter/X',
    icon: X,
    color: 'bg-gray-800 hover:bg-gray-900',
    getUrl: (lead) =>
      lead.twitter
        ? `https://twitter.com/${lead.twitter.replace('@', '')}`
        : null,
  },
  {
    id: 'website',
    label: 'Website',
    icon: Globe,
    color: 'bg-purple-500 hover:bg-purple-600',
    getUrl: (lead) => lead.website || null,
  },
  {
    id: 'in_person',
    label: 'In Person',
    icon: Users,
    color: 'bg-amber-500 hover:bg-amber-600',
    getUrl: () => null,
  },
]

export function ContactModal({
  open,
  onOpenChange,
  lead,
  onContact,
}: ContactModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(
    null
  )
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState<'select' | 'confirm'>('select')

  const handleMethodClick = (method: ContactMethod) => {
    const methodConfig = contactMethods.find((m) => m.id === method)
    if (!methodConfig || !lead) return

    // Get the URL for this contact method
    const url = methodConfig.getUrl?.(lead)

    // If there's a URL, open it
    if (url) {
      window.open(url, '_blank')
    }

    // Show confirmation step
    setSelectedMethod(method)
    setStep('confirm')
  }

  const handleConfirm = () => {
    if (selectedMethod) {
      onContact(selectedMethod, notes || undefined)
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedMethod(null)
    setNotes('')
    setStep('select')
    onOpenChange(false)
  }

  const availableMethods = contactMethods.filter((method) => {
    if (!lead) return false
    if (method.id === 'in_person') return true
    return method.getUrl?.(lead) !== null
  })

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? (
              <>Contact {lead?.businessName}</>
            ) : (
              <>Confirm Contact</>
            )}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'select' ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                How did you contact them?
              </p>

              <div className="grid grid-cols-2 gap-2">
                {availableMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMethodClick(method.id)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg text-white font-medium transition-colors',
                        method.color
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {method.label}
                    </motion.button>
                  )
                })}
              </div>

              {availableMethods.length === 1 && (
                <p className="text-xs text-muted-foreground text-center">
                  Only in-person contact is available (no contact info found)
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Method:</span>
                <span className="font-medium capitalize">
                  {selectedMethod?.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Notes (optional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the contact..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('select')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1">
                  Confirm Contact
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
