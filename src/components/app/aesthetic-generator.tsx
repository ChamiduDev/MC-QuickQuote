'use client';
import React, { useState } from 'react';
import { useQuote } from '@/hooks/use-quote';
import { generateAesthetic, GenerateAestheticOutput } from '@/ai/flows/generate-aesthetic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export function AestheticGenerator() {
  const { state, dispatch } = useQuote();
  const [isLoading, setIsLoading] = useState(false);
  const [aesthetic, setAesthetic] = useState<GenerateAestheticOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!state.company.logo) {
      toast({
        variant: 'destructive',
        title: 'No Logo Found',
        description: 'Please upload a company logo first to generate a style.',
      });
      return;
    }

    setIsLoading(true);
    setAesthetic(null);
    try {
      const result = await generateAesthetic({ logoDataUri: state.company.logo });
      setAesthetic(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate aesthetic. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!aesthetic || !aesthetic.colorScheme.length) return;
    dispatch({
      type: 'UPDATE_NESTED_FIELD',
      payload: { section: 'theme', field: 'primaryColor', value: aesthetic.colorScheme[0] },
    });
    // Font application would require more complex logic to update global styles or CSS variables
    // For now, we'll just update the primary color.
    toast({
        title: "Style Applied!",
        description: `Primary color set to ${aesthetic.colorScheme[0]}.`
    })
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <span>AI Style Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate a color palette and font suggestion based on your company logo.
        </p>
        <Button onClick={handleGenerate} disabled={isLoading || !state.company.logo}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate with AI
        </Button>
        {aesthetic && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label>Suggested Colors</Label>
              <div className="flex gap-2 mt-2">
                {aesthetic.colorScheme.map((color, index) => (
                  <div key={index} className="h-10 w-10 rounded-md border" style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            </div>
            <div>
                <Label>Suggested Font</Label>
                <p className='font-semibold'>{aesthetic.fontRecommendation}</p>
            </div>
            <div>
                <Label>Overall Aesthetic</Label>
                <p className='text-sm text-muted-foreground'>{aesthetic.overallAesthetic}</p>
            </div>
            <Button onClick={handleApply} variant="outline">Apply Style</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
