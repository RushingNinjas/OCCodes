import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Input } from '@shared/components/Input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import type { CodeTemplate, Severity, TemplateStatus } from '@shared/types';

export const Templates = () => {
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TemplateStatus | 'all'>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const stored = storage.get<CodeTemplate[]>('templates') || [];
    setTemplates(stored);
  };

  const deleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const updated = templates.filter(t => t.id !== id);
      storage.set('templates', updated);
      setTemplates(updated);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || template.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || template.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
    }
  };

  const getStatusColor = (status: TemplateStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'archived': return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Code Templates</h2>
        <Link to="/templates/new">
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </Link>
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
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TemplateStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found. Create your first template to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channels
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{template.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getSeverityColor(template.severity) as any}>
                        {template.severity}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {template.channels.map(channel => (
                          <Badge key={channel} variant="info" size="sm">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(template.status) as any}>
                        {template.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      v{template.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link to={`/templates/${template.id}`}>
                          <button className="text-primary-600 hover:text-primary-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

