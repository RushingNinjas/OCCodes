import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Badge } from '@shared/components/Badge';
import { Send, X, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import { dispatchToChannels } from '@shared/services/stubServices';
import type { CodeTemplate, DispatchEvent, DispatchRecipient, ChannelDelivery } from '@shared/types';

export const DispatchFlow = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<CodeTemplate | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [recipients, setRecipients] = useState<DispatchRecipient[]>([]);
  const [notes, setNotes] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, ChannelDelivery[]>>({});

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = () => {
    const templates = storage.get<CodeTemplate[]>('templates') || [];
    const found = templates.find(t => t.id === templateId);
    if (found) {
      setTemplate(found);
      loadRecipients(found);
    }
  };

  const loadRecipients = (tpl: CodeTemplate) => {
    const distributionLists = storage.get<any[]>('distributionLists') || [];
    const allRecipients: DispatchRecipient[] = [];

    tpl.distributionListIds.forEach(listId => {
      const list = distributionLists.find(l => l.id === listId);
      if (list) {
        list.members.forEach((member: any) => {
          allRecipients.push({
            id: `recipient-${Date.now()}-${Math.random()}`,
            name: member.name,
            email: member.email,
            phone: member.phone,
            channels: [],
          });
        });
      }
    });

    setRecipients(allRecipients);
  };

  const handleAddRecipient = () => {
    const name = prompt('Enter recipient name:');
    const email = prompt('Enter email (optional):');
    const phone = prompt('Enter phone (optional):');
    
    if (name) {
      setRecipients([...recipients, {
        id: `recipient-${Date.now()}`,
        name,
        email: email || undefined,
        phone: phone || undefined,
        channels: [],
      }]);
    }
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleDispatch = async () => {
    if (!template) return;

    // Validate required fields
    const missingFields = template.requiredFields
      .filter(f => f.required && !inputValues[f.key]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    if (recipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    setIsDispatching(true);
    setDispatchStatus({});

    // Replace variables in message
    let messageBody = template.messageBody;
    template.requiredFields.forEach(field => {
      messageBody = messageBody.replace(`{${field.key}}`, inputValues[field.key] || '');
    });

    // Dispatch to all recipients
    const statusMap: Record<string, ChannelDelivery[]> = {};
    
    for (const recipient of recipients) {
      const channelResults = await dispatchToChannels(
        recipient,
        template.channels,
        messageBody,
        template.ttsScript
      );
      statusMap[recipient.id] = channelResults;
    }

    setDispatchStatus(statusMap);

    // Create dispatch event
    const event: DispatchEvent = {
      id: `event-${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      operatorId: 'current-operator', // In real app, get from auth
      operatorName: 'Current Operator',
      inputParameters: inputValues,
      recipients: recipients.map(r => ({
        ...r,
        channels: statusMap[r.id] || [],
      })),
      status: 'dispatched',
      dispatchedAt: new Date().toISOString(),
    };

    const events = storage.get<DispatchEvent[]>('dispatchEvents') || [];
    events.push(event);
    storage.set('dispatchEvents', events);

    setIsDispatching(false);
    
    // Navigate to details after a short delay
    setTimeout(() => {
      navigate(`/history/${event.id}`);
    }, 2000);
  };

  const getChannelStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Template not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dispatch: {template.name}</h2>
          <p className="mt-1 text-sm text-gray-500">{template.description}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Required Information">
            <div className="space-y-4">
              {template.requiredFields.map((field) => (
                <div key={field.key}>
                  {field.type === 'text' || field.type === 'number' ? (
                    <Input
                      label={field.label}
                      type={field.type}
                      value={inputValues[field.key] || ''}
                      onChange={(e) => setInputValues({ ...inputValues, [field.key]: e.target.value })}
                      required={field.required}
                    />
                  ) : field.type === 'select' && field.options ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={inputValues[field.key] || ''}
                      onChange={(e) => setInputValues({ ...inputValues, [field.key]: e.target.value })}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : null}
                </div>
              ))}
              <Textarea
                label="Additional Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </Card>

          <Card title="Recipients">
            <div className="space-y-3">
              {recipients.map((recipient) => (
                <div key={recipient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{recipient.name}</div>
                    {recipient.email && <div className="text-sm text-gray-500">{recipient.email}</div>}
                    {recipient.phone && <div className="text-sm text-gray-500">{recipient.phone}</div>}
                    {dispatchStatus[recipient.id] && (
                      <div className="flex gap-2 mt-2">
                        {dispatchStatus[recipient.id].map((channel, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-xs">
                            {getChannelStatusIcon(channel.status)}
                            <span className="capitalize">{channel.channel}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {!isDispatching && (
                    <button
                      onClick={() => handleRemoveRecipient(recipient.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {!isDispatching && (
                <Button variant="outline" onClick={handleAddRecipient}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recipient
                </Button>
              )}
            </div>
          </Card>

          <Card title="Channels">
            <div className="flex gap-2">
              {template.channels.map(channel => (
                <Badge key={channel} variant="info">
                  {channel}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Dispatch Summary">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Template</div>
                <div className="font-medium">{template.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Severity</div>
                <Badge variant={template.severity === 'critical' ? 'danger' : template.severity === 'high' ? 'warning' : 'info'}>
                  {template.severity}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-500">Recipients</div>
                <div className="font-medium">{recipients.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Channels</div>
                <div className="font-medium">{template.channels.length}</div>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleDispatch}
                disabled={isDispatching}
              >
                {isDispatching ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Dispatch Code
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

