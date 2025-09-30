'use client';
import { QuoteData } from '@/lib/types';
import Image from 'next/image';
import { format } from 'date-fns';
import { QuotePreviewCreative } from './quote-preview-creative';

interface QuotePreviewProps {
  quote: QuoteData;
}

export function QuotePreview({ quote }: QuotePreviewProps) {
  const { company, client, items, currency, discount, tax, headerText, footerText, notes, quoteNumber, date, theme, hostingCost, developmentCost } = quote;

  if (theme.template === 'creative') {
    return <QuotePreviewCreative quote={quote} />;
  }

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const discountAmount = (subtotal * discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * tax) / 100;
  const grandTotal = subtotalAfterDiscount + taxAmount + (hostingCost || 0) + (developmentCost || 0);
  
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };
  
  const isClassic = theme.template === 'classic';

  return (
    <div 
      id="quote-preview" 
      className="bg-white text-black shadow-lg rounded-lg w-full max-w-[210mm] min-h-[297mm] p-[12mm]" 
      style={{fontFamily: isClassic ? 'serif' : theme.fontFamily, fontSize: `${theme.fontSize}px`}}
    >
      {/* Header */}
      <header className={`flex justify-between items-start pb-8 ${isClassic ? 'border-b-4 border-double' : 'border-b-2'}`} style={{borderColor: theme.primaryColor}}>
        <div>
          {company.logo && <Image src={company.logo} alt="Company Logo" width={isClassic ? 80 : 100} height={isClassic ? 80 : 100} className="object-contain" />}
        </div>
        <div className="text-right">
          <h1 className={`${isClassic ? 'text-5xl' : 'text-4xl'} font-bold uppercase`} style={{color: theme.primaryColor, fontFamily: isClassic ? 'serif' : 'inherit'}}>{headerText}</h1>
          <p className="text-gray-500 mt-2">#{quoteNumber}</p>
        </div>
      </header>

      {/* From/To Section */}
      <section className="grid grid-cols-3 gap-8 my-8">
        <div>
          <h2 className="font-bold text-gray-500 uppercase tracking-wider text-sm">From</h2>
          <p className="font-bold">{company.name}</p>
          <p className="text-gray-600 whitespace-pre-wrap">{company.address}</p>
          <p className="text-gray-600">{company.contact}</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-500 uppercase tracking-wider text-sm">To</h2>
          <p className="font-bold">{client.name}</p>
          <p className="text-gray-600">{client.company}</p>
          <p className="text-gray-600 whitespace-pre-wrap">{client.address}</p>
          <p className="text-gray-600">{client.contact}</p>
        </div>
        <div className="text-right">
            <p><span className="font-bold text-gray-500">Date:</span> {format(new Date(date), 'MMM dd, yyyy')}</p>
        </div>
      </section>

      {/* Items Table */}
      <section>
        <table className="w-full">
          <thead style={{backgroundColor: isClassic ? 'transparent' : theme.primaryColor}} className={isClassic ? 'text-black' : 'text-white'}>
            <tr className={isClassic ? 'border-b-2 border-t-2' : ''} style={{borderColor: theme.primaryColor}}>
              <th className="p-3 text-left font-bold w-2/5">Description</th>
              <th className="p-3 text-left font-bold w-2/5">Technology</th>
              <th className="p-3 text-right font-bold">Qty</th>
              <th className="p-3 text-right font-bold">Unit Price</th>
              <th className="p-3 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-gray-600">{item.technology}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="p-3 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Totals Section */}
      <section className="flex justify-end mt-8">
        <div className="w-1/2">
          <div className="flex justify-between p-2">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between p-2">
              <span className="text-gray-600">Discount ({discount}%)</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between p-2">
              <span className="text-gray-600">Tax ({tax}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          )}
          {(hostingCost || 0) > 0 && (
            <div className="flex justify-between p-2">
                <span className="text-gray-600">Hosting Cost</span>
                <span>{formatCurrency(hostingCost!)}</span>
            </div>
          )}
          {(developmentCost || 0) > 0 && (
            <div className="flex justify-between p-2">
                <span className="text-gray-600">Development Cost</span>
                <span>{formatCurrency(developmentCost!)}</span>
            </div>
          )}
          <div className="flex justify-between p-3 mt-2 font-bold text-lg" style={{backgroundColor: theme.primaryColor, color: isClassic ? theme.primaryColor && (parseInt(theme.primaryColor.substring(1, 3), 16) * 0.299 + parseInt(theme.primaryColor.substring(3, 5), 16) * 0.587 + parseInt(theme.primaryColor.substring(5, 7), 16) * 0.114) > 186 ? '#000000' : '#ffffff' : 'white'}}>
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </section>

      {/* Notes & Footer */}
      <footer className="mt-12">
        {notes && (
            <div className="mb-8">
                <h3 className="font-bold mb-2">Notes</h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{notes}</p>
            </div>
        )}
        <div className="text-center text-gray-500 text-sm pt-4 border-t">
          <p>{footerText}</p>
        </div>
      </footer>
    </div>
  );
}
