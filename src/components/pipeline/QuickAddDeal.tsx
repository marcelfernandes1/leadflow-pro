import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, DollarSign, Building2, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePipelineStore } from '@/hooks/usePipelineStore'
import { toast } from 'sonner'

interface QuickAddDealProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultStageId?: string
}

export function QuickAddDeal({ open, onOpenChange, defaultStageId }: QuickAddDealProps) {
  const { settings, createDeal } = usePipelineStore()
  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)
  const stages = pipeline?.stages.sort((a, b) => a.order - b.order) || []
  const firstStage = stages[0]

  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dealValue, setDealValue] = useState('')
  const [contractLength, setContractLength] = useState(settings.defaultContractLength.toString())
  const [vertical, setVertical] = useState('other')
  const [leadSource, setLeadSource] = useState('other')
  const [stageId, setStageId] = useState(defaultStageId || firstStage?.id || '')
  const [showMore, setShowMore] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyName.trim()) {
      toast.error('Company name is required')
      return
    }

    createDeal({
      pipelineId: settings.activePipelineId,
      stageId: stageId || firstStage?.id || '',
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      dealValue: parseFloat(dealValue) || 0,
      contractLength: parseInt(contractLength) || settings.defaultContractLength,
      vertical,
      leadSource,
      tags: [],
      files: [],
    })

    toast.success('Deal created')
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setCompanyName('')
    setContactName('')
    setEmail('')
    setPhone('')
    setDealValue('')
    setContractLength(settings.defaultContractLength.toString())
    setVertical('other')
    setLeadSource('other')
    setStageId(defaultStageId || firstStage?.id || '')
    setShowMore(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Quick Add Deal
          </DialogTitle>
          <DialogDescription>
            Add a new deal to your pipeline. You can fill in details later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Essential Fields */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="companyName" className="text-xs text-muted-foreground">
                Company Name *
              </Label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  className="pl-9"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactName" className="text-xs text-muted-foreground">
                Contact Name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Smith"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dealValue" className="text-xs text-muted-foreground">
                  Monthly Value
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dealValue"
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    placeholder="2000"
                    className="pl-9"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contractLength" className="text-xs text-muted-foreground">
                  Contract (months)
                </Label>
                <Input
                  id="contractLength"
                  type="number"
                  value={contractLength}
                  onChange={(e) => setContractLength(e.target.value)}
                  placeholder="3"
                  className="mt-1"
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="stage" className="text-xs text-muted-foreground">
                Stage
              </Label>
              <Select value={stageId} onValueChange={setStageId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Show More Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => setShowMore(!showMore)}
          >
            <ChevronDown
              className={`h-4 w-4 mr-1 transition-transform ${showMore ? 'rotate-180' : ''}`}
            />
            {showMore ? 'Less fields' : 'More fields'}
          </Button>

          {/* Additional Fields */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="email" className="text-xs text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@acme.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs text-muted-foreground">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="vertical" className="text-xs text-muted-foreground">
                      Business Vertical
                    </Label>
                    <Select value={vertical} onValueChange={setVertical}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {settings.verticals.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="leadSource" className="text-xs text-muted-foreground">
                      Lead Source
                    </Label>
                    <Select value={leadSource} onValueChange={setLeadSource}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {settings.leadSources.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-1" />
              Add Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
