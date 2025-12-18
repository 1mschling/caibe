import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { MarkdownPreview } from './MarkdownPreview';
import { ArchitectureViewer } from './ArchitectureViewer';
import { generateReadme } from '../lib/generateReadme';

export function DocumentationGenerator() {
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const markdown = generateReadme();
      setGeneratedMarkdown(markdown);
      setIsGenerating(false);
      toast.success('README.md generated successfully!');
    }, 500);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CAIBE-README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('README.md downloaded successfully!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    toast.success('Copied to clipboard!');
  };

  // Auto-generate on mount
  useState(() => {
    handleGenerate();
  });

  return (
    <div className="space-y-6">
      {/* Documentation and Architecture Tabs */}
      <Tabs defaultValue="documentation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
        </TabsList>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>README.md Documentation</CardTitle>
                  <CardDescription>
                    Complete enterprise-grade documentation including CAIBE vs Traditional IAM comparison
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Regenerate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!generatedMarkdown}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={!generatedMarkdown}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4">
                  <ScrollArea className="h-[600px] rounded-lg border border-border bg-muted/30 p-6">
                    {generatedMarkdown ? (
                      <MarkdownPreview content={generatedMarkdown} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <FileText className="mx-auto h-12 w-12 opacity-50" />
                          <p className="mt-4">Generating documentation...</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="markdown" className="mt-4">
                  <ScrollArea className="h-[600px] rounded-lg border border-border bg-muted/30">
                    <pre className="p-6 text-sm">
                      <code>{generatedMarkdown || '// Generating documentation...'}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="mt-6">
          <ArchitectureViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
