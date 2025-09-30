'use client';
import React, from 'react';
import { useQuote } from '@/hooks/use-quote';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

export function CompanyInfoForm() {
  const { state, dispatch } = useQuote();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_NESTED_FIELD', payload: { section: 'company', field, value } });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    handleFieldChange('logo', '');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <AccordionItem value="company">
      <AccordionTrigger className="text-lg font-medium">Your Company</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input id="company-name" value={state.company.name} onChange={e => handleFieldChange('name', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-address">Address</Label>
          <Textarea id="company-address" value={state.company.address} onChange={e => handleFieldChange('address', e.target.value)} rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-contact">Contact Info</Label>
          <Input id="company-contact" value={state.company.contact} onChange={e => handleFieldChange('contact', e.target.value)} placeholder="E.g., email or phone" />
        </div>
        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div className="flex items-center gap-4">
            {state.company.logo ? (
              <div className="relative group">
                <Image src={state.company.logo} alt="Company Logo" width={80} height={80} className="rounded-md object-contain border p-1" />
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={removeLogo}>
                    <X className="h-4 w-4"/>
                </Button>
              </div>
            ) : (
                <div 
                    className="w-20 h-20 rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-accent"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadCloud className="h-8 w-8" />
                </div>
            )}
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              {state.company.logo ? 'Change Logo' : 'Upload Logo'}
            </Button>
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleLogoUpload} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
