'use client';
import { useQuote } from '@/hooks/use-quote';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Copy, GripVertical } from 'lucide-react';
import { initialLineItem } from '@/lib/initial-quote';
import { Textarea } from '../ui/textarea';

export function ItemsTable() {
  const { state, dispatch } = useQuote();

  const handleItemChange = (id: string, field: 'description' | 'technology' | 'quantity' | 'unitPrice', value: string | number) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, field, value } });
  };

  const addItem = () => dispatch({ type: 'ADD_ITEM', payload: { ...initialLineItem, description: '', technology: '' } });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const duplicateItem = (id: string) => dispatch({ type: 'DUPLICATE_ITEM', payload: id });

  const total = (quantity: number, unitPrice: number) => (quantity * unitPrice).toFixed(2);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("startIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, endIndex: number) => {
    const startIndex = parseInt(e.dataTransfer.getData("startIndex"), 10);
    dispatch({ type: 'REORDER_ITEMS', payload: { startIndex, endIndex } });
    e.currentTarget.classList.remove('border-primary');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-primary');
  };

  return (
    <AccordionItem value="items">
      <AccordionTrigger className="text-lg font-medium">Line Items</AccordionTrigger>
      <AccordionContent className="space-y-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 items-center text-sm font-medium text-muted-foreground px-2">
          <span>Description</span>
          <span>Technology</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Unit Price</span>
          <span className="text-right">Total</span>
          <span />
        </div>

        {/* Items */}
        <div className="space-y-4">
          {state.items.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 items-start p-2 rounded-lg border border-transparent transition-all"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Textarea
                placeholder="Item description"
                value={item.description}
                onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                className="md:hidden"
                rows={2}
              />
               <Textarea
                placeholder="Item description"
                value={item.description}
                onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                className="hidden md:block"
                rows={2}
              />

              <Textarea
                placeholder="Technology used"
                value={item.technology}
                onChange={e => handleItemChange(item.id, 'technology', e.target.value)}
                rows={2}
              />

              <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="text-right"
                  />
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={e => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="text-right"
                  />
                  <Input
                    value={total(item.quantity, item.unitPrice)}
                    readOnly
                    className="text-right bg-muted/50"
                  />
              </div>

              <div className="flex items-center justify-end md:justify-start gap-1 pt-1 md:pt-0">
                <Button variant="ghost" size="icon" onClick={() => duplicateItem(item.id)} className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="cursor-grab p-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={addItem} variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
