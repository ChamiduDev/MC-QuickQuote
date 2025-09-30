export interface Company {
  name: string;
  address: string;
  contact: string;
  logo: string; // Data URI
}

export interface Client {
  name:string;
  company: string;
  address: string;
  contact: string;
}

export interface LineItem {
  id: string;
  description: string;
  technology: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteData {
  company: Company;
  client: Client;
  items: LineItem[];
  currency: string;
  discount: number;
  tax: number;
  hostingCost: number;
  developmentCost: number;
  headerText: string;
  footerText: string;
  notes: string;
  theme: {
    primaryColor: string;
    fontFamily: string;
    fontSize: number;
    template: 'modern' | 'classic' | 'creative';
  };
  quoteNumber: string;
  date: string;
}
