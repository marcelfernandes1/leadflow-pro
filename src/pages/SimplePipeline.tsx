import { useMemo, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
    closestCorners,
} from '@dnd-kit/core';

import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';

import { useSimplePipelineStore, SimpleLead } from '@/hooks/useSimplePipelineStore';
import { PipelineColumn } from '@/components/simple-pipeline/PipelineColumn';
import { LeadCard } from '@/components/simple-pipeline/LeadCard';
import { AddLeadDialog } from '@/components/simple-pipeline/AddLeadDialog';

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.4',
            },
        },
    }),
};

export default function SimplePipeline() {
    const { columns, leads, moveLead } = useSimplePipelineStore();
    const [activeLead, setActiveLead] = useState<SimpleLead | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const leadsByColumn = useMemo(() => {
        const grouped: Record<string, SimpleLead[]> = {};
        columns.forEach((col) => {
            grouped[col.id] = leads.filter((l) => l.columnId === col.id);
        });
        return grouped;
    }, [leads, columns]);

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Column') {
            return;
        }
        const leadId = event.active.id as string;
        const lead = leads.find((l) => l.id === leadId);
        if (lead) setActiveLead(lead);
    };

    const onDragOver = () => {
        // Optional: Handling complex sortable over sortable or droppable
        // For simple column moving, dragEnd is often sufficient if we just want "move to column"
    };

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveLead(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the lead
        const lead = leads.find((l) => l.id === activeId);
        if (!lead) return;

        // Determine target column
        let targetColumnId: string | null = null;

        // Check if over a column
        const overColumn = columns.find(c => c.id === overId);
        if (overColumn) {
            targetColumnId = overColumn.id;
        } else {
            // Check if over another lead
            const overLead = leads.find(l => l.id === overId);
            if (overLead) {
                targetColumnId = overLead.columnId;
            }
        }

        if (targetColumnId && targetColumnId !== lead.columnId) {
            moveLead(lead.id, targetColumnId);

            // Effect for "Won" column
            if (targetColumnId === 'won') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#34d399', '#f59e0b'],
                });
            }
        }
    };

    return (
        <div className="h-full flex flex-col bg-background/50">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Pipeline</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your leads and track progress.</p>
                </div>
                <AddLeadDialog />
            </div>

            {/* Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="h-full flex px-8 py-6 gap-6 min-w-max">
                        {columns.map((column) => (
                            <PipelineColumn
                                key={column.id}
                                column={column}
                                leads={leadsByColumn[column.id] || []}
                            />
                        ))}
                    </div>
                </div>

                {createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeLead && <LeadCard lead={activeLead} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
