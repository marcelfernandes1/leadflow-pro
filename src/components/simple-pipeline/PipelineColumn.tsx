import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, SimpleLead } from '@/hooks/useSimplePipelineStore';
import { LeadCard } from './LeadCard';

interface PipelineColumnProps {
    column: Column;
    leads: SimpleLead[];
}

export function PipelineColumn({ column, leads }: PipelineColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    return (
        <div className="flex flex-col h-full min-w-[300px] w-[300px] rounded-xl bg-muted/40 border border-border/60 shadow-sm">
            {/* Header */}
            <div
                className={`
          p-4 rounded-t-xl border-b border-border/50 flex items-center justify-between
          backdrop-blur-sm
          ${column.color === 'bg-blue-500' ? 'mt-0' : ''}
        `}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ring-2 ring-offset-2 ring-offset-background ${column.color}`} />
                    <span className="font-semibold text-sm text-foreground/90">{column.title}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-background/80 px-2.5 py-1 rounded-full border border-border/50 shadow-sm">
                    {leads.length}
                </span>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className={`
          flex-1 p-3 overflow-y-auto space-y-3 transition-colors duration-200
          ${isOver ? 'bg-primary/5' : ''}
        `}
            >
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </SortableContext>

                {leads.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-muted-foreground/10 rounded-xl flex flex-col items-center justify-center text-muted-foreground/40 text-xs gap-2">
                        <div className="p-2 rounded-full bg-muted/50">
                            <span className="opacity-50">Empty</span>
                        </div>
                        Drop leads here
                    </div>
                )}
            </div>
        </div>
    );
}
