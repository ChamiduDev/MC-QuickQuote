'use client';
import { useQuote } from '@/hooks/use-quote';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function Totals() {
  const { state, dispatch } = useQuote();

  const subtotal = state.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const discountAmount = (subtotal * state.discount) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * state.tax) / 100;
  const grandTotal = subtotalAfterDiscount + taxAmount + (state.hostingCost || 0) + (state.developmentCost || 0);
  
  const formatCurrency = (amount: number) => {
    return `${state.currency}${amount.toFixed(2)}`;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Totals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center">
            <Label htmlFor="discount" className="text-muted-foreground">Discount (%)</Label>
            <Input
                id="discount"
                type="number"
                value={state.discount}
                onChange={e => dispatch({type: 'UPDATE_FIELD', payload: {section: 'quote', field: 'discount', value: parseFloat(e.target.value) || 0}})}
                className="w-24 text-right"
            />
        </div>
        
        <div className="flex justify-between items-center">
            <Label htmlFor="tax" className="text-muted-foreground">Tax (%)</Label>
            <Input
                id="tax"
                type="number"
                value={state.tax}
                onChange={e => dispatch({type: 'UPDATE_FIELD', payload: {section: 'quote', field: 'tax', value: parseFloat(e.target.value) || 0}})}
                className="w-24 text-right"
            />
        </div>

        <div className="flex justify-between items-center">
            <Label htmlFor="hosting-cost" className="text-muted-foreground">Hosting Cost</Label>
            <Input
                id="hosting-cost"
                type="number"
                value={state.hostingCost || ''}
                onChange={e => dispatch({type: 'UPDATE_FIELD', payload: {section: 'quote', field: 'hostingCost', value: parseFloat(e.target.value) || 0}})}
                className="w-24 text-right"
            />
        </div>

        <div className="flex justify-between items-center">
            <Label htmlFor="development-cost" className="text-muted-foreground">Development Cost</Label>
            <Input
                id="development-cost"
                type="number"
                value={state.developmentCost || ''}
                onChange={e => dispatch({type: 'UPDATE_FIELD', payload: {section: 'quote', field: 'developmentCost', value: parseFloat(e.target.value) || 0}})}
                className="w-24 text-right"
            />
        </div>

        <Separator />

        <div className="flex justify-between items-center text-lg font-bold">
          <span>Grand Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
