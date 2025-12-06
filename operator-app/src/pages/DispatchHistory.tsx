import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@shared/components/Card';
import { Badge } from '@shared/components/Badge';
import { Input } from '@shared/components/Input';
import { Eye, Copy } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import { formatDate } from '@shared/utils/formatDate';
import type { DispatchEvent } from '@shared/types';

export const DispatchHistory = () => {
  const [events, setEvents] = useState<DispatchEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const stored = storage.get<DispatchEvent[]>('dispatchEvents') || [];
    // Filter to current operator's events (in real app, filter by auth)
    setEvents(stored.reverse());
  };

  const handleClone = (event: DispatchEvent) => {
    // Navigate to dispatch flow with template pre-filled
    window.location.href = `/dispatch/${event.templateId}`;
  };

  const filteredEvents = events.filter(event =>
    event.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'dispatched': return 'info';
      case 'failed': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dispatch History</h2>
      </div>

      <Card>
        <div className="mb-6">
          <Input
            placeholder="Search dispatch events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No dispatch events found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const successCount = event.recipients.reduce((acc, r) => {
                return acc + r.channels.filter(c => c.status === 'delivered').length;
              }, 0);
              const totalChannels = event.recipients.reduce((acc, r) => acc + r.channels.length, 0);

              return (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.templateName}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(event.dispatchedAt)}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(event.status) as any}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Recipients</div>
                      <div className="font-medium">{event.recipients.length}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Delivery</div>
                      <div className="font-medium">
                        {successCount} / {totalChannels}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Operator</div>
                      <div className="font-medium">{event.operatorName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Acknowledged</div>
                      <div className="font-medium">
                        {event.recipients.filter(r => r.acknowledged).length} / {event.recipients.length}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/history/${event.id}`}>
                      <button className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </Link>
                    <button
                      onClick={() => handleClone(event)}
                      className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-1"
                    >
                      <Copy className="h-4 w-4" />
                      Clone & Re-dispatch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

