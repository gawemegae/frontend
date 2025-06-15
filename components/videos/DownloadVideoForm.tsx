'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Download, Cloud } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DownloadVideoFormProps {
  onDownload: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function DownloadVideoForm({ onDownload, isLoading }: DownloadVideoFormProps) {
  const [url, setUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      await onDownload(url.trim());
      setUrl('');
      setIsOpen(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50/80 to-blue-50/60 dark:from-slate-900/40 dark:to-blue-950/30 backdrop-blur-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-slate-50/90 hover:to-blue-50/70 dark:hover:from-slate-900/50 dark:hover:to-blue-950/40 transition-all duration-200 rounded-t-lg py-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-gradient-to-r from-slate-400 to-blue-400 rounded-md">
                  <Cloud className="h-3 w-3 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent text-sm">
                  Unduh dari Google Drive
                </span>
              </div>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-muted-foreground`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="gdrive-url" className="text-xs font-medium">URL Google Drive atau ID File</Label>
                <Input
                  id="gdrive-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  disabled={isLoading}
                  className="h-8 text-sm bg-white/60 dark:bg-black/20 border-slate-200 dark:border-slate-700 focus:border-blue-300 dark:focus:border-blue-600"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !url.trim()}
                size="sm"
                className="w-full sm:w-auto bg-gradient-to-r from-slate-400 to-blue-400 hover:from-slate-500 hover:to-blue-500 border-0 text-sm"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-1.5" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-1.5" />
                    Unduh Video
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}