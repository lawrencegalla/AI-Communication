import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Inbox, 
  BarChart3, 
  Settings, 
  Search, 
  Filter,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  priority: 'urgent' | 'normal' | 'low';
  status: 'pending' | 'resolved';
  phone?: string;
  extractedRequirements?: string[];
}

const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'Sarah Johnson',
    senderEmail: 'sarah.j@company.com',
    subject: 'URGENT: Cannot access my account - Critical business meeting today',
    body: 'Hi support team, I desperately need help! I cannot log into my account and I have a critical presentation with clients in 2 hours. This is extremely urgent. Please help me immediately!',
    timestamp: '2024-01-15T09:30:00Z',
    sentiment: 'negative',
    priority: 'urgent',
    status: 'pending',
    phone: '+1-555-0123',
    extractedRequirements: ['Account access issue', 'Time-sensitive request', 'Business critical']
  },
  {
    id: '2',
    sender: 'Mike Chen',
    senderEmail: 'mike.chen@techcorp.com',
    subject: 'Question about billing cycle',
    body: 'Hello, I have a quick question about when my next billing cycle starts. Just want to understand the timing better. Thanks!',
    timestamp: '2024-01-15T08:45:00Z',
    sentiment: 'neutral',
    priority: 'normal',
    status: 'pending',
    extractedRequirements: ['Billing inquiry', 'General information']
  },
  {
    id: '3',
    sender: 'Emma Davis',
    senderEmail: 'emma.davis@startup.io',
    subject: 'Amazing support experience!',
    body: 'Just wanted to thank your team for the excellent support yesterday. The technician was incredibly helpful and solved my issue quickly. Great service!',
    timestamp: '2024-01-15T07:20:00Z',
    sentiment: 'positive',
    priority: 'low',
    status: 'resolved',
    extractedRequirements: ['Positive feedback', 'No action required']
  },
  {
    id: '4',
    sender: 'Robert Wilson',
    senderEmail: 'r.wilson@enterprise.com',
    subject: 'Server downtime affecting production',
    body: 'Our production servers have been down for 30 minutes. This is causing significant business impact. We need immediate assistance to resolve this critical issue.',
    timestamp: '2024-01-15T10:15:00Z',
    sentiment: 'negative',
    priority: 'urgent',
    status: 'pending',
    phone: '+1-555-0456',
    extractedRequirements: ['Server downtime', 'Production impact', 'Critical resolution needed']
  }
];

const generateAIResponse = (email: Email): string => {
  const templates = {
    urgent: `Dear ${email.sender},

Thank you for contacting our support team. I understand the urgency of your situation and I'm here to help resolve this immediately.

I've escalated your case to our priority queue and our technical team is already investigating the issue. You should expect a resolution within the next 30 minutes.

In the meantime, I've sent you a direct phone number where you can reach our priority support line.

Best regards,
AI Support Assistant`,
    
    normal: `Dear ${email.sender},

Thank you for reaching out to us. I'm happy to help you with your inquiry.

Based on your message, I understand you need information about your billing cycle. I'll provide you with the details and ensure all your questions are answered.

Please expect a detailed response within 2-4 hours. If you need immediate assistance, please don't hesitate to contact our support line.

Best regards,
AI Support Assistant`,

    positive: `Dear ${email.sender},

Thank you so much for taking the time to share your positive feedback! We're thrilled to hear about your excellent experience with our support team.

Your kind words mean a lot to us and I'll make sure to share this with the technician who assisted you. We're committed to maintaining this level of service excellence.

Thank you for being a valued customer!

Best regards,
AI Support Assistant`
  };

  if (email.priority === 'urgent') return templates.urgent;
  if (email.sentiment === 'positive') return templates.positive;
  return templates.normal;
};

export function EmailDashboard() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(mockEmails[0]);
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');

  const filteredEmails = mockEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment === 'all' || email.sentiment === filterSentiment;
    const matchesPriority = filterPriority === 'all' || email.priority === filterPriority;
    
    return matchesSearch && matchesSentiment && matchesPriority;
  });

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    setAiResponse(generateAIResponse(email));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'normal': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-white to-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="font-medium text-xl text-gray-900">AI Support Assistant</h1>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'inbox' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Inbox className="h-5 w-5" />
            Inbox
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 space-y-4">
          <Card className="rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today's Emails</span>
                <span className="font-medium">{mockEmails.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-medium text-orange-600">
                  {mockEmails.filter(e => e.status === 'pending').length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Urgent</span>
                <span className="font-medium text-red-600">
                  {mockEmails.filter(e => e.priority === 'urgent').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {activeTab === 'inbox' && (
          <>
            {/* Email List Panel */}
            <div className="w-1/2 border-r border-gray-200 bg-white">
              <div className="p-4 border-b border-gray-200">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search emails..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-lg"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={filterSentiment} onValueChange={setFilterSentiment}>
                      <SelectTrigger className="w-32 rounded-lg">
                        <SelectValue placeholder="Sentiment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sentiment</SelectItem>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-32 rounded-lg">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100vh-140px)]">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleEmailSelect(email)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedEmail?.id === email.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{email.sender}</span>
                          {email.priority === 'urgent' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{email.subject}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={`text-xs ${getSentimentColor(email.sentiment)}`}>
                          {email.sentiment}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(email.priority)}`}>
                          {email.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatTimestamp(email.timestamp)}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{email.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Detail Panel */}
            <div className="w-1/2 bg-white">
              {selectedEmail ? (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="font-medium text-lg text-gray-900 mb-1">
                          {selectedEmail.subject}
                        </h2>
                        <p className="text-gray-600">From: {selectedEmail.sender}</p>
                        <p className="text-sm text-gray-500">{selectedEmail.senderEmail}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getSentimentColor(selectedEmail.sentiment)}>
                          {selectedEmail.sentiment}
                        </Badge>
                        <Badge className={getPriorityColor(selectedEmail.priority)}>
                          {selectedEmail.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="font-medium text-sm text-gray-900 mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{selectedEmail.senderEmail}</span>
                        </div>
                        {selectedEmail.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedEmail.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatTimestamp(selectedEmail.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Extracted Requirements */}
                    {selectedEmail.extractedRequirements && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-sm text-gray-900 mb-2">Extracted Requirements</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedEmail.extractedRequirements.map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Email Content</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{selectedEmail.body}</p>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <h3 className="font-medium text-gray-900 mb-4">AI Generated Response</h3>
                    <Textarea
                      value={aiResponse}
                      onChange={(e) => setAiResponse(e.target.value)}
                      className="h-48 mb-4 rounded-lg"
                      placeholder="AI response will appear here..."
                    />
                    <div className="flex gap-3">
                      <Button className="flex items-center gap-2 rounded-lg">
                        <Send className="h-4 w-4" />
                        Send Response
                      </Button>
                      <Button variant="outline" className="rounded-lg">
                        Save Draft
                      </Button>
                      <Button variant="outline" className="rounded-lg">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select an email to view details
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="flex-1 p-6 bg-white">
            <h2 className="font-medium text-xl text-gray-900 mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Positive</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-green-200 rounded">
                          <div className="w-1/4 h-2 bg-green-500 rounded"></div>
                        </div>
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Neutral</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-blue-200 rounded">
                          <div className="w-1/4 h-2 bg-blue-500 rounded"></div>
                        </div>
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Negative</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-red-200 rounded">
                          <div className="w-2/4 h-2 bg-red-500 rounded"></div>
                        </div>
                        <span className="text-sm">50%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Priority Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Urgent</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-red-200 rounded">
                          <div className="w-2/4 h-2 bg-red-500 rounded"></div>
                        </div>
                        <span className="text-sm">50%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Normal</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-yellow-200 rounded">
                          <div className="w-1/4 h-2 bg-yellow-500 rounded"></div>
                        </div>
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-1/4 h-2 bg-gray-500 rounded"></div>
                        </div>
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle>Response Time Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-medium text-green-600">15 min</div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium text-blue-600">95%</div>
                      <div className="text-sm text-gray-600">Customer Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium text-purple-600">78%</div>
                      <div className="text-sm text-gray-600">AI Response Accuracy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex-1 p-6 bg-white">
            <h2 className="font-medium text-xl text-gray-900 mb-6">Settings</h2>
            <div className="max-w-2xl space-y-6">
              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Email Provider</label>
                    <Select defaultValue="gmail">
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="outlook">Outlook</SelectItem>
                        <SelectItem value="imap">IMAP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">API Key</label>
                    <Input type="password" placeholder="Enter your API key" className="rounded-lg" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg">
                <CardHeader>
                  <CardTitle>AI Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">AI Model</label>
                    <Select defaultValue="gpt4">
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt4">GPT-4</SelectItem>
                        <SelectItem value="gpt3">GPT-3.5</SelectItem>
                        <SelectItem value="bert">BERT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Response Tone</label>
                    <Select defaultValue="professional">
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}