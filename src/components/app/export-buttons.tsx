'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileDown, Printer, ChevronDown } from 'lucide-react';
import { useQuote } from '@/hooks/use-quote';
import { exportToPdf, exportToWord } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

export function ExportButtons() {
    const { state } = useQuote();
    const { toast } = useToast();

    const handlePrint = () => {
        window.print();
    }

    const handlePdfExport = async () => {
        const previewEl = document.getElementById('quote-preview');
        if (previewEl) {
            toast({ title: 'Generating PDF...', description: 'Please wait a moment.' });
            try {
                await exportToPdf(previewEl, state.quoteNumber);
                toast({ title: 'PDF Generated!', description: 'Your download should start shortly.' });
            } catch (e) {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate PDF.' });
                console.error(e);
            }
        }
    }
    
    const handleWordExport = async () => {
        toast({ title: 'Generating DOCX...', description: 'Please wait a moment.' });
        try {
            await exportToWord(state);
            toast({ title: 'DOCX Generated!', description: 'Your download should start shortly.' });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate DOCX file.' });
            console.error(e);
        }
    }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Export
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handlePdfExport}>Export as PDF</DropdownMenuItem>
          <DropdownMenuItem onClick={handleWordExport}>Export as Word (.docx)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}