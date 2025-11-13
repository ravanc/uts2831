'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Mail, UserPlus, CheckCircle, Clock, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferenceRequest {
  id: string;
  refereeName: string;
  refereeEmail: string;
  relationship: string;
  message: string;
  status: 'pending' | 'completed' | 'declined';
  requestedDate: string;
  completedDate?: string;
}

interface Reference {
  id: string;
  refereeName: string;
  refereeEmail: string;
  refereePosition: string;
  refereeCompany: string;
  relationship: string;
  rating: number;
  text: string;
  skills: string[];
  date: string;
  verified: boolean;
}

export default function ReferencesPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ReferenceRequest[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    refereeName: '',
    refereeEmail: '',
    relationship: '',
    message: '',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const storedRequests = localStorage.getItem('referenceRequests');
    const storedReferences = localStorage.getItem('references');

    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
    if (storedReferences) {
      setReferences(JSON.parse(storedReferences));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitRequest = () => {
    if (!formData.refereeName || !formData.refereeEmail || !formData.relationship) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newRequest: ReferenceRequest = {
      id: `req-${Date.now()}`,
      refereeName: formData.refereeName,
      refereeEmail: formData.refereeEmail,
      relationship: formData.relationship,
      message: formData.message || `Hi ${formData.refereeName}, I would appreciate if you could provide a reference for me. Thank you!`,
      status: 'pending',
      requestedDate: new Date().toISOString(),
    };

    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem('referenceRequests', JSON.stringify(updatedRequests));

    toast({
      title: 'Reference Request Sent!',
      description: `An email invitation has been sent to ${formData.refereeEmail}`,
    });

    setFormData({
      refereeName: '',
      refereeEmail: '',
      relationship: '',
      message: '',
    });
    setIsDialogOpen(false);
  };

  const handleDeleteRequest = (id: string) => {
    const updatedRequests = requests.filter(req => req.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem('referenceRequests', JSON.stringify(updatedRequests));

    toast({
      title: 'Request Deleted',
      description: 'The reference request has been removed.',
    });
  };

  const handleDeleteReference = (id: string) => {
    const updatedReferences = references.filter(ref => ref.id !== id);
    setReferences(updatedReferences);
    localStorage.setItem('references', JSON.stringify(updatedReferences));

    toast({
      title: 'Reference Deleted',
      description: 'The reference has been removed from your profile.',
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const completedRequests = requests.filter(r => r.status === 'completed');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">References</h1>
            <p className="text-muted-foreground">
              Request and manage professional references to strengthen your profile
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Request Reference
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request a Reference</DialogTitle>
                <DialogDescription>
                  Send an email invitation to request a professional reference
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="refereeName">Referee Name *</Label>
                    <Input
                      id="refereeName"
                      placeholder="John Doe"
                      value={formData.refereeName}
                      onChange={(e) => handleInputChange('refereeName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refereeEmail">Referee Email *</Label>
                    <Input
                      id="refereeEmail"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.refereeEmail}
                      onChange={(e) => handleInputChange('refereeEmail', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Input
                    id="relationship"
                    placeholder="e.g., Former Manager, Colleague, Professor"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message to your reference request..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                  />
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Email Preview</p>
                      <p className="text-muted-foreground">
                        {formData.refereeName || '[Referee Name]'} will receive an email invitation with your message and a link to submit their reference.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList>
            <TabsTrigger value="received">
              Received ({references.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {references.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No references yet</p>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Request references from colleagues, managers, or professors to strengthen your profile
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Request Your First Reference
                  </Button>
                </CardContent>
              </Card>
            ) : (
              references.map((reference) => (
                <Card key={reference.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {reference.refereeName}
                          {reference.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {reference.refereePosition} at {reference.refereeCompany}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{reference.relationship}</Badge>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < reference.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReference(reference.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground italic">"{reference.text}"</p>
                    <div>
                      <p className="text-sm font-medium mb-2">Skills Highlighted:</p>
                      <div className="flex flex-wrap gap-2">
                        {reference.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Received on {new Date(reference.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No pending requests</p>
                  <p className="text-muted-foreground">
                    All your reference requests have been completed or declined
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {request.refereeName}
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </CardTitle>
                        <CardDescription>{request.refereeEmail}</CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {request.relationship}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRequest(request.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Message sent:</strong>
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        "{request.message}"
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Requested on {new Date(request.requestedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No completed requests yet</p>
                  <p className="text-muted-foreground">
                    Completed reference requests will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {request.refereeName}
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </CardTitle>
                        <CardDescription>{request.refereeEmail}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Completed on {request.completedDate ? new Date(request.completedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
