import { useState, useEffect } from 'react';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Input } from '@shared/components/Input';
import { Select } from '@shared/components/Select';
import { Download, Filter, Calendar } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import { formatDate } from '@shared/utils/formatDate';
import type { DispatchEvent, Severity } from '@shared/types';

export const Reports = () => {
  const [events, setEvents] = useState<DispatchEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<DispatchEvent[]>([]);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    template: '',
    operator: '',
    severity: '' as Severity | '',
    status: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters]);

  const loadEvents = () => {
    const stored = storage.get<DispatchEvent[]>('dispatchEvents') || [];
    setEvents(stored);
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (filters.dateFrom) {
      filtered = filtered.filter(e => new Date(e.dispatchedAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(e => new Date(e.dispatchedAt) <= new Date(filters.dateTo));
    }
    if (filters.template) {
      filtered = filtered.filter(e => e.templateName.toLowerCase().includes(filters.template.toLowerCase()));
    }
    if (filters.operator) {
      filtered = filtered.filter(e => e.operatorName.toLowerCase().includes(filters.operator.toLowerCase()));
    }
    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    setFilteredEvents(filtered);
  };

  const handleExport = () => {
    const csv = [
      ['Event ID', 'Template', 'Operator', 'Dispatched At', 'Status', 'Recipients'].join(','),
      ...filteredEvents.map(e => [
        e.id,
        e.templateName,
        e.operatorName,
        e.dispatchedAt,
        e.status,
        e.recipients.length,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispatch-events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const templates = storage.get<any[]>('templates') || [];
  const operators = storage.get<any[]>('users')?.filter(u => u.role === 'operator') || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'dispatched': return 'info';
      case 'failed': return 'danger';
      default: return 'warning';
    }
  };

  const stats = {
    total: filteredEvents.length,
    completed: filteredEvents.filter(e => e.status === 'completed').length,
    failed: filteredEvents.filter(e => e.status === 'failed').length,
    pending: filteredEvents.filter(e => e.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Audit Logs</h2>
        <Button variant="primary" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-500">Total Dispatches</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Failed</div>
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </Card>
      </div>

      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Input
            label="Date From"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />
          <Input
            label="Date To"
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
          <Input
            label="Template"
            placeholder="Search template..."
            value={filters.template}
            onChange={(e) => setFilters({ ...filters, template: e.target.value })}
          />
          <Input
            label="Operator"
            placeholder="Search operator..."
            value={filters.operator}
            onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'dispatched', label: 'Dispatched' },
              { value: 'completed', label: 'Completed' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({
                dateFrom: '',
                dateTo: '',
                template: '',
                operator: '',
                severity: '',
                status: '',
              })}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Dispatch Events">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispatched At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No dispatch events found
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => {
                  const successCount = event.recipients.reduce((acc, r) => {
                    return acc + r.channels.filter(c => c.status === 'delivered').length;
                  }, 0);
                  const totalChannels = event.recipients.reduce((acc, r) => acc + r.channels.length, 0);
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.templateName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.operatorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(event.dispatchedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.recipients.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(event.status) as any}>
                          {event.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {successCount} / {totalChannels} delivered
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

