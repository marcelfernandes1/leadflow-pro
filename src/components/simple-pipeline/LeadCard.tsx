import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SimpleLead, useSimplePipelineStore } from '@/hooks/useSimplePipelineStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail, Building2, DollarSign, Trash2, Calendar } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface LeadCardProps {
    lead: SimpleLead;
}

export function LeadCard({ lead }: LeadCardProps) {
    const { deleteLead } = useSimplePipelineStore();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteLead(lead.id);
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-3 group relative touch-none">
            <motion.div
                initial={false}
                animate={isDragging ? { scale: 1.05, rotate: 2, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' } : { scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
                <Card
                    className={`
            border-l-[3px] border-t-0 border-b-0 border-r-0 overflow-hidden backdrop-blur-sm transition-all duration-200
            ${isDragging ? 'opacity-90 ring-2 ring-primary/20' : 'bg-card/95 hover:bg-card'}
            shadow-sm group-hover:shadow-md
          `}
                    style={{
                        borderLeftColor: lead.value && lead.value > 1000 ? '#10b981' : '#3b82f6'
                    }}
                    {...attributes}
                    {...listeners}
                >
                    <CardContent className="p-3">
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate text-card-foreground">
                                    {lead.name}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                    <Building2 className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{lead.company}</span>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 -mr-1 text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleDelete}>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Lead
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                                {lead.value && (
                                    <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                        <DollarSign className="w-2.5 h-2.5 mr-0.5" />
                                        {lead.value.toLocaleString()}
                                    </Badge>
                                )}
                            </div>

                            {lead.email && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `mailto:${lead.email}`;
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    title={lead.email}
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </div>

                        {lead.notes && (
                            <div className="mt-2 text-[10px] text-muted-foreground/70 bg-muted/30 p-1.5 rounded line-clamp-2">
                                {lead.notes}
                            </div>
                        )}

                        <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/40 font-mono">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
