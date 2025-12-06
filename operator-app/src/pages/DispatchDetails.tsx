import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@shared/components/Card';
import { Badge } from '@shared/components/Badge';
import { Button } from '@shared/components/Button';
import { ArrowLeft, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import { formatDate } from '@shared/utils/formatDate';
import { dispatchToChannels } from '@shared/services/stubServices';
import type { DispatchEvent, CodeTemplate } from '@shared/types';

export const DispatchDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<DispatchEvent | null>(null);
  const [template, setTemplate] = useState<CodeTemplate | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = () => {
    const events = storage.get<DispatchEvent[]>('dispatchEvents') || [];
    const found = events.find(e => e.id === eventId);
    if (found) {
      setEvent(found);
      loadTemplate(found.templateId);
    }
  };

  const loadTemplate = (templateId: string) => {
    const templates = storage.get<CodeTemplate[]>('templates') || [];
    const found = templates.find(t => t.id === templateId);
    if (found) {
      setTemplate(found);
    }
  };

  const handleRetry = async (recipientId: string, channel: string) => {
    if (!event || !template) return;

    setIsRetrying(true);
    const recipient = event.recipients.find(r => r.id === recipientId);
    if (!recipient) return;

    // Retry the specific channel
    const channelResults = await dispatchToChannels(
      recipient,
      [channel as any],
      template.messageBody,
      template.ttsScript
    );

    // Update the event
    const events = storage.get<DispatchEvent[]>('dispatchEvents') || [];
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      const recipientIndex = events[eventIndex].recipients.findIndex(r => r.id === recipientId);
      if (recipientIndex !== -1) {
        const channelIndex = events[eventIndex].recipients[recipientIndex].channels.findIndex(
          c => c.channel === channel
        );
        if (channelIndex !== -1) {
          events[eventIndex].recipients[recipientIndex].channels[channelIndex] = channelResults[0];
        }
      }
      storage.set('dispatchEvents', events);
      setEvent(events[eventIndex]);
    }

    setIsRetrying(false);
  };

  const getChannelStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  const successCount = event.recipients.reduce((acc, r) => {
    return acc + r.channels.filter(c => c.status === 'delivered').length;
  }, 0);
  const totalChannels = event.recipients.reduce((acc, r) => acc + r.channels.length, 0);
  const failedChannels = event.recipients.flatMap(r =>
    r.channels.filter(c => c.status === 'failed')
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/history')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{event.templateName}</h2>
          <p className="text-sm text-gray-500">{formatDate(event.dispatchedAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-500">Status</div>
          <Badge variant={event.status === 'completed' ? 'success' : event.status === 'failed' ? 'danger' : 'warning'}>
            {event.status}
          </Badge>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Recipients</div>
          <div className="text-2xl font-bold">{event.recipients.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Delivery Success</div>
          <div className="text-2xl font-bold text-green-600">
            {successCount} / {totalChannels}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Acknowledged</div>
          <div className="text-2xl font-bold">
            {event.recipients.filter(r => r.acknowledged).length} / {event.recipients.length}
          </div>
        </Card>
      </div>

      <Card title="Input Parameters">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(event.inputParameters).map(([key, value]) => (
            <div key={key}>
              <div className="text-sm text-gray-500">{key}</div>
              <div className="font-medium">{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Recipients & Delivery Status">
        <div className="space-y-4">
          {event.recipients.map((recipient) => (
            <div key={recipient.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{recipient.name}</h4>
                  {recipient.email && <div className="text-sm text-gray-500">{recipient.email}</div>}
                  {recipient.phone && <div className="text-sm text-gray-500">{recipient.phone}</div>}
                </div>
                {recipient.acknowledged && (
                  <Badge variant="success">Acknowledged</Badge>
                )}
              </div>
              <div className="space-y-2">
                {recipient.channels.map((channel, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getChannelStatusIcon(channel.status)}
                      <span className="font-medium capitalize">{channel.channel}</span>
                      {channel.status === 'delivered' && channel.deliveredAt && (
                        <span className="text-xs text-gray-500">
                          {formatDate(channel.deliveredAt)}
                        </span>
                      )}
                      {channel.status === 'failed' && channel.error && (
                        <span className="text-xs text-red-600">{channel.error}</span>
                      )}
                    </div>
                    {channel.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetry(recipient.id, channel.channel)}
                        disabled={isRetrying}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {failedChannels.length > 0 && (
        <Card title="Failed Deliveries">
          <div className="space-y-2">
            {failedChannels.map((channel, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded">
                <div>
                  <span className="font-medium capitalize">{channel.channel}</span>
                  {channel.error && <span className="text-sm text-red-600 ml-2">{channel.error}</span>}
                </div>
                <Badge variant="danger">Failed</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

