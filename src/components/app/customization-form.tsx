'use client';
import React from 'react';
import { useQuote } from '@/hooks/use-quote';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AestheticGenerator } from './aesthetic-generator';
import { format } from 'date-fns';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { QuoteData } from '@/lib/types';

export function CustomizationForm() {
  const { state, dispatch } = useQuote();

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { section: 'quote', field, value } });
  };
  
  const handleThemeFieldChange = (field: string, value: any) => {
    dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'theme', field, value } });
  };
  
  const handleDateChange = (dateString: string) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      handleFieldChange('date', format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <AccordionItem value="customization">
      <AccordionTrigger className="text-lg font-medium">Customization</AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quote-number">Quote Number</Label>
              <Input id="quote-number" value={state.quoteNumber} onChange={e => handleFieldChange('quoteNumber', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-date">Date</Label>
              <Input type="date" id="quote-date" value={state.date} onChange={e => handleDateChange(e.target.value)} />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="header-text">Header Text</Label>
              <Input id="header-text" value={state.headerText} onChange={e => handleFieldChange('headerText', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency Symbol</Label>
              <Input id="currency" value={state.currency} onChange={e => handleFieldChange('currency', e.target.value)} />
            </div>
        </div>
         <div className="space-y-2">
          <Label htmlFor="notes">Notes / Terms</Label>
          <Textarea id="notes" value={state.notes} onChange={e => handleFieldChange('notes', e.target.value)} rows={4}/>
        </div>
         <div className="space-y-2">
          <Label htmlFor="footer-text">Footer Text</Label>
          <Input id="footer-text" value={state.footerText} onChange={e => handleFieldChange('footerText', e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label>Template</Label>
            <Select
                value={state.theme.template}
                onValueChange={(value: QuoteData['theme']['template']) => handleThemeFieldChange('template', value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="template-color">Template Color</Label>
            <Input 
                id="template-color" 
                type="color" 
                value={state.theme.primaryColor} 
                onChange={e => handleThemeFieldChange('primaryColor', e.target.value)}
                className="w-full h-10 p-1"
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="font-size">Text Size ({state.theme.fontSize}px)</Label>
            <Slider
                id="font-size"
                min={10}
                max={16}
                step={1}
                value={[state.theme.fontSize]}
                onValueChange={value => handleThemeFieldChange('fontSize', value[0])}
            />
        </div>
        <AestheticGenerator />
      </AccordionContent>
    </AccordionItem>
  );
}
