'use client';
import { CompanyInfoForm } from '@/components/app/company-info-form';
import { ClientInfoForm } from '@/components/app/client-info-form';
import { ItemsTable } from '@/components/app/items-table';
import { CustomizationForm } from '@/components/app/customization-form';
import { Totals } from '@/components/app/totals';
import { ExportButtons } from '@/components/app/export-buttons';
import { Accordion } from '@/components/ui/accordion';
import { Logo } from '@/components/icons/logo';
import { Separator } from '@/components/ui/separator';

export function QuoteEditor() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <header className="flex justify-between items-center">
        <Logo />
        <ExportButtons />
      </header>
      <Separator />
      <Accordion type="multiple" defaultValue={['company', 'client', 'items']} className="w-full">
        <CompanyInfoForm />
        <ClientInfoForm />
        <ItemsTable />
        <CustomizationForm />
      </Accordion>
      <Totals />
    </div>
  );
}
