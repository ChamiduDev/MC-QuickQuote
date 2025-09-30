import { QuoteData } from '@/lib/types';
import { format } from 'date-fns';

export const initialLineItem = {
  id: '1',
  description: 'E.g. Website Design & Development',
  technology: 'E.g. React, Next.js, and Tailwind CSS',
  quantity: 1,
  unitPrice: 5000,
};

export const initialQuote: QuoteData = {
  company: {
    name: 'Your Company',
    address: '123 Main Street, Anytown, USA 12345',
    contact: 'contact@yourcompany.com',
    logo: '',
  },
  client: {
    name: 'Client Name',
    company: 'Client Company',
    address: '456 Oak Avenue, Otherville, USA 54321',
    contact: 'client@email.com',
  },
  items: [initialLineItem],
  currency: '$',
  discount: 0,
  tax: 10,
  hostingCost: 0,
  developmentCost: 0,
  headerText: 'Quotation',
  footerText: 'Thank you for your business!',
  notes: 'This quote is valid for 30 days.',
  theme: {
    primaryColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 14,
    template: 'modern',
  },
  quoteNumber: 'QT-001',
  date: format(new Date(), 'yyyy-MM-dd'),
};
