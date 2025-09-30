'use client';
import { useQuote } from '@/hooks/use-quote';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ClientInfoForm() {
  const { state, dispatch } = useQuote();

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'client', field, value } });
  };

  return (
    <AccordionItem value="client">
      <AccordionTrigger className="text-lg font-medium">Client Details</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client-name">Client Name</Label>
          <Input id="client-name" value={state.client.name} onChange={e => handleFieldChange('name', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-company">Client's Company</Label>
          <Input id="client-company" value={state.client.company} onChange={e => handleFieldChange('company', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-address">Address</Label>
          <Textarea id="client-address" value={state.client.address} onChange={e => handleFieldChange('address', e.target.value)} rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-contact">Contact Info</Label>
          <Input id="client-contact" value={state.client.contact} onChange={e => handleFieldChange('contact', e.target.value)} placeholder="E.g., email or phone" />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
