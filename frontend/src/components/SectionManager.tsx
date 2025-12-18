import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import {
  useAddTemplate,
  useAddGuideline,
  useAddExampleFlow,
  useAddCertificateAuthority,
  useAddSAMLConfig,
} from '../hooks/useQueries';

export function SectionManager() {
  return (
    <Tabs defaultValue="templates" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        <TabsTrigger value="flows">Flows</TabsTrigger>
        <TabsTrigger value="ca">CA</TabsTrigger>
        <TabsTrigger value="saml">SAML</TabsTrigger>
      </TabsList>

      <TabsContent value="templates" className="mt-6">
        <TemplateForm />
      </TabsContent>

      <TabsContent value="guidelines" className="mt-6">
        <GuidelineForm />
      </TabsContent>

      <TabsContent value="flows" className="mt-6">
        <ExampleFlowForm />
      </TabsContent>

      <TabsContent value="ca" className="mt-6">
        <CertificateAuthorityForm />
      </TabsContent>

      <TabsContent value="saml" className="mt-6">
        <SAMLConfigForm />
      </TabsContent>
    </Tabs>
  );
}

function TemplateForm() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const addTemplate = useAddTemplate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTemplate.mutateAsync({ id, title, content });
      toast.success('Template added successfully!');
      setId('');
      setTitle('');
      setContent('');
    } catch (error) {
      toast.error('Failed to add template');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Documentation Template</CardTitle>
        <CardDescription>Create a new documentation template section</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-id">Template ID</Label>
            <Input
              id="template-id"
              placeholder="e.g., architecture-overview"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-title">Title</Label>
            <Input
              id="template-title"
              placeholder="e.g., Architecture Overview"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-content">Content (Markdown)</Label>
            <Textarea
              id="template-content"
              placeholder="Enter markdown content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
            />
          </div>
          <Button type="submit" disabled={addTemplate.isPending}>
            {addTemplate.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function GuidelineForm() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const addGuideline = useAddGuideline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGuideline.mutateAsync({ id, title, content });
      toast.success('Guideline added successfully!');
      setId('');
      setTitle('');
      setContent('');
    } catch (error) {
      toast.error('Failed to add guideline');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Implementation Guideline</CardTitle>
        <CardDescription>Create a new implementation guideline</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guideline-id">Guideline ID</Label>
            <Input
              id="guideline-id"
              placeholder="e.g., setup-internet-identity"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guideline-title">Title</Label>
            <Input
              id="guideline-title"
              placeholder="e.g., Setup Internet Identity"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guideline-content">Content (Markdown)</Label>
            <Textarea
              id="guideline-content"
              placeholder="Enter markdown content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
            />
          </div>
          <Button type="submit" disabled={addGuideline.isPending}>
            {addGuideline.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Guideline
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ExampleFlowForm() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const addExampleFlow = useAddExampleFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExampleFlow.mutateAsync({ id, title, content });
      toast.success('Example flow added successfully!');
      setId('');
      setTitle('');
      setContent('');
    } catch (error) {
      toast.error('Failed to add example flow');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Example Flow</CardTitle>
        <CardDescription>Create a new workflow example</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flow-id">Flow ID</Label>
            <Input
              id="flow-id"
              placeholder="e.g., internal-app-access"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flow-title">Title</Label>
            <Input
              id="flow-title"
              placeholder="e.g., Internal Application Access"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flow-content">Content (Markdown)</Label>
            <Textarea
              id="flow-content"
              placeholder="Enter markdown content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
            />
          </div>
          <Button type="submit" disabled={addExampleFlow.isPending}>
            {addExampleFlow.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Example Flow
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CertificateAuthorityForm() {
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const addCA = useAddCertificateAuthority();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCA.mutateAsync({ id, description });
      toast.success('Certificate Authority added successfully!');
      setId('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to add Certificate Authority');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Certificate Authority</CardTitle>
        <CardDescription>Register a new Certificate Authority configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ca-id">CA ID</Label>
            <Input
              id="ca-id"
              placeholder="e.g., root-ca"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ca-description">Description</Label>
            <Textarea
              id="ca-description"
              placeholder="Enter CA description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>
          <Button type="submit" disabled={addCA.isPending}>
            {addCA.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add CA
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SAMLConfigForm() {
  const [serviceProvider, setServiceProvider] = useState('');
  const [certificate, setCertificate] = useState('');
  const [metadata, setMetadata] = useState('');
  const addSAML = useAddSAMLConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSAML.mutateAsync({ serviceProvider, certificate, metadata });
      toast.success('SAML configuration added successfully!');
      setServiceProvider('');
      setCertificate('');
      setMetadata('');
    } catch (error) {
      toast.error('Failed to add SAML configuration');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add SAML Configuration</CardTitle>
        <CardDescription>Register a new SAML Service Provider</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="saml-sp">Service Provider</Label>
            <Input
              id="saml-sp"
              placeholder="e.g., partner-app.example.com"
              value={serviceProvider}
              onChange={(e) => setServiceProvider(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="saml-cert">Certificate</Label>
            <Textarea
              id="saml-cert"
              placeholder="-----BEGIN CERTIFICATE-----..."
              value={certificate}
              onChange={(e) => setCertificate(e.target.value)}
              rows={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="saml-metadata">Metadata</Label>
            <Textarea
              id="saml-metadata"
              placeholder="Enter SAML metadata XML..."
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              rows={5}
              required
            />
          </div>
          <Button type="submit" disabled={addSAML.isPending}>
            {addSAML.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add SAML Config
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
