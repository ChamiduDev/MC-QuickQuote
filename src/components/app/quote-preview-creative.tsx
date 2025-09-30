'use client';
import { QuoteData } from '@/lib/types';
import Image from 'next/image';
import { format } from 'date-fns';
import { Gem } from 'lucide-react';

interface QuotePreviewProps {
  quote: QuoteData;
}

export function QuotePreviewCreative({ quote }: QuotePreviewProps) {
  const { company, client, items, currency, discount, tax, headerText, footerText, notes, quoteNumber, date, theme, hostingCost, developmentCost } = quote;

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const discountAmount = (subtotal * discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * tax) / 100;
  const grandTotal = subtotalAfterDiscount + taxAmount + (hostingCost || 0) + (developmentCost || 0);
  
  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };
  
  return (
    <div id="quote-preview" className="bg-white text-gray-800 shadow-lg rounded-lg w-full max-w-[210mm] min-h-[297mm] p-0 flex" style={{fontFamily: `'Cormorant Garamond', serif`, fontSize: `${theme.fontSize}px`}}>
      <div className="w-1/4 p-8 text-white" style={{backgroundColor: theme.primaryColor}}>
         {company.logo ? (
             <Image src={company.logo} alt="Company Logo" width={80} height={80} className="object-contain rounded-full bg-white p-2 mb-8" />
         ) : (
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-8">
                <Gem className="h-10 w-10" style={{color: theme.primaryColor}}/>
            </div>
         )}
         <div className="mb-8">
            <h2 className="font-bold uppercase tracking-wider text-sm opacity-80 mb-2">From</h2>
            <p className="font-bold text-lg">{company.name}</p>
            <p className="text-sm whitespace-pre-wrap opacity-90">{company.address}</p>
            <p className="text-sm opacity-90">{company.contact}</p>
         </div>
         <div>
            <h2 className="font-bold uppercase tracking-wider text-sm opacity-80 mb-2">To</h2>
            <p className="font-bold text-lg">{client.name}</p>
            <p className="text-sm">{client.company}</p>
            <p className="text-sm whitespace-pre-wrap opacity-90">{client.address}</p>
            <p className="text-sm opacity-90">{client.contact}</p>
         </div>

         {notes && (
            <div className="mt-12">
                <h3 className="font-bold mb-2 uppercase text-sm opacity-80">Notes</h3>
                <p className="text-sm whitespace-pre-wrap opacity-90">{notes}</p>
            </div>
        )}
      </div>
      <div className="w-3/4 p-12">
        <header className="text-right mb-16">
          <h1 className="text-6xl font-bold uppercase" style={{color: theme.primaryColor}}>{headerText}</h1>
          <p className="text-gray-500 mt-2">#{quoteNumber}</p>
          <p className="text-gray-500 mt-1"><span className="font-bold">Date:</span> {format(new Date(date), 'MMM dd, yyyy')}</p>
        </header>

        <section>
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{borderColor: theme.primaryColor}}>
                <th className="p-3 text-left font-bold uppercase text-sm tracking-wider w-2/5">Description</th>
                <th className="p-3 text-left font-bold uppercase text-sm tracking-wider w-2/5">Technology</th>
                <th className="p-3 text-right font-bold uppercase text-sm tracking-wider">Qty</th>
                <th className="p-3 text-right font-bold uppercase text-sm tracking-wider">Price</th>
                <th className="p-3 text-right font-bold uppercase text-sm tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="p-3 font-semibold">{item.description}</td>
                  <td className="p-3 text-gray-600">{item.technology}</td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="flex justify-end mt-8">
            <div className="w-1/2">
                <div className="flex justify-between p-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className='font-medium'>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between p-2">
                    <span className="text-gray-600">Discount ({discount}%)</span>
                    <span className='font-medium'>-{formatCurrency(discountAmount)}</span>
                    </div>
                )}
                {tax > 0 && (
                    <div className="flex justify-between p-2">
                    <span className="text-gray-600">Tax ({tax}%)</span>
                    <span className='font-medium'>{formatCurrency(taxAmount)}</span>
                    </div>
                )}
                {(hostingCost || 0) > 0 && (
                    <div className="flex justify-between p-2">
                        <span className="text-gray-600">Hosting Cost</span>
                        <span className='font-medium'>{formatCurrency(hostingCost!)}</span>
                    </div>
                )}
                {(developmentCost || 0) > 0 && (
                    <div className="flex justify-between p-2">
                        <span className="text-gray-600">Development Cost</span>
                        <span className='font-medium'>{formatCurrency(developmentCost!)}</span>
                    </div>
                )}
                <div className="flex justify-between p-4 mt-4 text-2xl" style={{backgroundColor: theme.primaryColor, color: 'white'}}>
                    <span className='font-bold'>Grand Total</span>
                    <span className='font-bold'>{formatCurrency(grandTotal)}</span>
                </div>
            </div>
        </section>

        <footer className="absolute bottom-12 right-12 text-right">
            <div className="text-center text-gray-500 text-xs">
                <p>{footerText}</p>
            </div>
        </footer>
      </div>
    </div>
  );
}
