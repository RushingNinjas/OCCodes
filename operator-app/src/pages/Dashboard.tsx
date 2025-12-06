import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Input } from '@shared/components/Input';
import { Radio, Send } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import type { CodeTemplate, Severity } from '@shared/types';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const stored = storage.get<CodeTemplate[]>('templates') || [];
    const activeTemplates = stored.filter(t => t.status === 'active');
    setTemplates(activeTemplates);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || template.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
    }
  };

  const handleDispatch = (templateId: string) => {
    navigate(`/dispatch/${templateId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Code Dispatch Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">Select a template to dispatch a code</p>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2"
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as Severity | 'all')}
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <Radio className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No active templates available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDispatch(template.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <Badge variant={getSeverityColor(template.severity) as any}>
                    {template.severity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {template.channels.map(channel => (
                      <Badge key={channel} variant="info" size="sm">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDispatch(template.id);
                    }}
                  >
                    <Send className="mr-1 h-3 w-3" />
                    Dispatch
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

