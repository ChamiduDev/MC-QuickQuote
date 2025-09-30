'use client';

import React from 'react';
import { QuoteProvider, QuoteContext } from '@/contexts/quote-context';
import { QuoteEditor } from '@/components/app/quote-editor';
import { QuotePreview } from '@/components/app/quote-preview';
import { Button } from '@/components/ui/button';
import { Eye, Code } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const MainContent = () => {
  const context = React.useContext(QuoteContext);
  if (!context) {
    return null; // Or a loading spinner
  }
  
  const { state } = context;

  // This ensures the component only renders client-side, avoiding hydration issues with localStorage.
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading skeleton
  }
  
  const quotePreview = <QuotePreview quote={state} />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      <div className="w-full md:w-1/2 lg:w-2/5 md:h-full overflow-y-auto no-print">
        <QuoteEditor />
      </div>
      <div className="hidden md:flex flex-col items-center justify-center w-full md:w-1/2 lg:w-3/5 h-full bg-muted/40 overflow-y-auto print-area p-4 sm:p-8">
        {quotePreview}
      </div>

      <div className="md:hidden fixed bottom-4 right-4 z-50 no-print">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
              <Eye className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[540px] p-0">
            <SheetHeader className="p-4 border-b">
              <div className="flex justify-between items-center">
                <SheetTitle>Live Preview</SheetTitle>
                <SheetClose />
              </div>
            </SheetHeader>
            <div className="h-[calc(100vh-65px)] overflow-y-auto p-4 bg-muted/40">
                {quotePreview}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export function MainLayout() {
  return (
    <QuoteProvider>
      <MainContent />
    </QuoteProvider>
  );
}
