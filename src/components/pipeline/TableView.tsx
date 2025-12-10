import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Square,
  Mail,
  Phone,
  Globe,
  MoreHorizontal,
  Calendar,
  Clock,
  AlertCircle,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Deal, SortField, SortDirection } from '@/types/pipeline'
import { STAGE_COLORS } from '@/types/pipeline'
import { usePipelineStore, useFilteredDeals } from '@/hooks/usePipelineStore'

interface TableViewProps {
  onViewDeal: (deal: Deal) => void
}

interface Column {
  id: SortField | 'actions' | 'select' | 'stage'
  label: string
  sortable: boolean
  width?: string
}

const columns: Column[] = [
  { id: 'select', label: '', sortable: false, width: 'w-10' },
  { id: 'companyName', label: 'Company', sortable: true },
  { id: 'contactName', label: 'Contact', sortable: true },
  { id: 'stage', label: 'Stage', sortable: false, width: 'w-36' },
  { id: 'dealValue', label: 'Value', sortable: true, width: 'w-28' },
  { id: 'expectedCloseDate', label: 'Close Date', sortable: true, width: 'w-28' },
  { id: 'lastActivityAt', label: 'Last Activity', sortable: true, width: 'w-28' },
  { id: 'stageEnteredAt', label: 'Days in Stage', sortable: true, width: 'w-28' },
  { id: 'actions', label: '', sortable: false, width: 'w-10' },
]

export function TableView({ onViewDeal }: TableViewProps) {
  const filteredDeals = useFilteredDeals()
  const {
    settings,
    sort,
    setSort,
    selectedDealIds,
    toggleDealSelection,
    setSelectedDealIds,
    deleteDeal,
    moveDeal,
  } = usePipelineStore()

  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)

  const handleSort = (field: SortField) => {
    setSort(field)
  }

  const handleSelectAll = () => {
    if (selectedDealIds.length === filteredDeals.length) {
      setSelectedDealIds([])
    } else {
      setSelectedDealIds(filteredDeals.map((d) => d.id))
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getDaysInStage = (deal: Deal) => {
    return Math.floor(
      (Date.now() - new Date(deal.stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '-'
    const days = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const isStale = (deal: Deal) => {
    const stage = pipeline?.stages.find((s) => s.id === deal.stageId)
    if (stage?.isWonStage || stage?.isLostStage) return false
    const lastActivity = deal.lastActivityAt || deal.createdAt
    const days = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    )
    return days > settings.staleDealsThreshold
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
    return sort.direction === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    )
  }

  return (
    <div className="border border-border/30 rounded-xl overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-surface/50 border-b border-border/30">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-muted-foreground',
                    col.width
                  )}
                >
                  {col.id === 'select' ? (
                    <Checkbox
                      checked={
                        filteredDeals.length > 0 &&
                        selectedDealIds.length === filteredDeals.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  ) : col.sortable ? (
                    <button
                      onClick={() => handleSort(col.id as SortField)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {col.label}
                      <SortIcon field={col.id as SortField} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-border/20">
            {filteredDeals.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <Building2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No deals found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </td>
              </tr>
            ) : (
              filteredDeals.map((deal, index) => {
                const stage = pipeline?.stages.find((s) => s.id === deal.stageId)
                const stageColors = stage
                  ? STAGE_COLORS[stage.color] || STAGE_COLORS.blue
                  : STAGE_COLORS.blue
                const stale = isStale(deal)
                const isSelected = selectedDealIds.includes(deal.id)

                return (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      'hover:bg-surface/30 transition-colors cursor-pointer',
                      isSelected && 'bg-primary/5',
                      stale && 'bg-amber-500/5'
                    )}
                    onClick={() => onViewDeal(deal)}
                  >
                    {/* Select */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleDealSelection(deal.id)}
                      />
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{deal.companyName}</p>
                            {stale && (
                              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {deal.email && (
                              <Mail className="h-3 w-3 text-muted-foreground" />
                            )}
                            {deal.phone && (
                              <Phone className="h-3 w-3 text-muted-foreground" />
                            )}
                            {deal.website && (
                              <Globe className="h-3 w-3 text-muted-foreground" />
                            )}
                            {deal.nextFollowUp && (
                              <Calendar
                                className={cn(
                                  'h-3 w-3',
                                  new Date(deal.nextFollowUp.date) < new Date()
                                    ? 'text-red-400'
                                    : 'text-primary'
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      <p className="text-muted-foreground">
                        {deal.contactName || '-'}
                      </p>
                    </td>

                    {/* Stage */}
                    <td className="px-4 py-3">
                      <Badge
                        variant="default"
                        className={cn('text-xs', stageColors.text, stageColors.bg)}
                      >
                        {stage?.name || 'Unknown'}
                      </Badge>
                    </td>

                    {/* Value */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-success">
                          {formatCurrency(deal.dealValue * deal.contractLength)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {deal.contractLength}mo
                        </p>
                      </div>
                    </td>

                    {/* Close Date */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(deal.expectedCloseDate)}
                    </td>

                    {/* Last Activity */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {getRelativeTime(deal.lastActivityAt)}
                    </td>

                    {/* Days in Stage */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {getDaysInStage(deal)} days
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onViewDeal(deal)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {pipeline?.stages
                            .filter((s) => s.id !== deal.stageId)
                            .map((s) => (
                              <DropdownMenuItem
                                key={s.id}
                                onClick={() => moveDeal(deal.id, s.id)}
                              >
                                Move to {s.name}
                              </DropdownMenuItem>
                            ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteDeal(deal.id)}
                          >
                            Delete Deal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredDeals.length > 0 && (
        <div className="px-4 py-3 border-t border-border/30 bg-surface/30 text-sm text-muted-foreground">
          Showing {filteredDeals.length} deals
          {selectedDealIds.length > 0 && (
            <span className="ml-2 text-primary">
              ({selectedDealIds.length} selected)
            </span>
          )}
        </div>
      )}
    </div>
  )
}
