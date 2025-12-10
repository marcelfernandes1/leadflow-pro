import { useState } from 'react';
import { useSimplePipelineStore } from '@/hooks/useSimplePipelineStore';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { toast } from 'sonner';

export function AddLeadDialog() {
    const { addLead, columns } = useSimplePipelineStore();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        value: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.company) {
            toast.error('Name and Company are required');
            return;
        }

        addLead({
            name: formData.name,
            company: formData.company,
            email: formData.email,
            notes: formData.notes,
            value: formData.value ? Number(formData.value) : undefined,
            columnId: columns[0]?.id || 'lead-in',
        });

        toast.success('Lead added to pipeline');
        setFormData({ name: '', company: '', email: '', value: '', notes: '' });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new lead. They will be added to the first column.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="company" className="text-right">
                            Company
                        </Label>
                        <Input
                            id="company"
                            placeholder="Acme Inc."
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">
                            Value ($)
                        </Label>
                        <Input
                            id="value"
                            type="number"
                            placeholder="5000"
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input // Using Input instead of Textarea to be safe if Textarea component isn't present
                            id="notes"
                            placeholder="Met at conference..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add to Pipeline</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
