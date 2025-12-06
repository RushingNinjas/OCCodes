import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Select } from '@shared/components/Select';
import { Badge } from '@shared/components/Badge';
import { X, Plus, Save, Eye } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import type { CodeTemplate, Severity, Channel, TemplateStatus, TemplateVariable } from '@shared/types';

export const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [template, setTemplate] = useState<Partial<CodeTemplate>>({
    name: '',
    description: '',
    severity: 'medium',
    channels: [],
    messageBody: '',
    ttsScript: '',
    requiredFields: [],
    distributionListIds: [],
    routingRules: {
      fixedLists: [],
      dynamicRecipients: false,
    },
    status: 'active',
    version: 1,
    versionHistory: [],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [newVariable, setNewVariable] = useState<Partial<TemplateVariable>>({
    key: '',
    label: '',
    required: false,
    type: 'text',
  });

  const distributionLists = storage.get<any[]>('distributionLists') || [];

  useEffect(() => {
    if (!isNew) {
      const templates = storage.get<CodeTemplate[]>('templates') || [];
      const found = templates.find(t => t.id === id);
      if (found) {
        setTemplate(found);
      }
    }
  }, [id, isNew]);

  const handleChannelToggle = (channel: Channel) => {
    const channels = template.channels || [];
    if (channels.includes(channel)) {
      setTemplate({ ...template, channels: channels.filter(c => c !== channel) });
    } else {
      setTemplate({ ...template, channels: [...channels, channel] });
    }
  };

  const handleAddVariable = () => {
    if (newVariable.key && newVariable.label) {
      const variables = template.requiredFields || [];
      setTemplate({
        ...template,
        requiredFields: [...variables, newVariable as TemplateVariable],
      });
      setNewVariable({ key: '', label: '', required: false, type: 'text' });
    }
  };

  const handleRemoveVariable = (index: number) => {
    const variables = template.requiredFields || [];
    setTemplate({
      ...template,
      requiredFields: variables.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!template.name || !template.description) {
      alert('Please fill in all required fields');
      return;
    }

    const templates = storage.get<CodeTemplate[]>('templates') || [];
    const now = new Date().toISOString();

    if (isNew) {
      const newTemplate: CodeTemplate = {
        ...template as CodeTemplate,
        id: `template-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        createdBy: 'current-user', // In real app, get from auth
        versionHistory: [],
      };
      templates.push(newTemplate);
    } else {
      const index = templates.findIndex(t => t.id === id);
      if (index !== -1) {
        const oldTemplate = templates[index];
        const newVersion = {
          version: oldTemplate.version + 1,
          timestamp: now,
          editor: 'current-user',
          changes: 'Template updated',
        };
        templates[index] = {
          ...template as CodeTemplate,
          id: id!,
          version: oldTemplate.version + 1,
          versionHistory: [...oldTemplate.versionHistory, newVersion],
          updatedAt: now,
        };
      }
    }

    storage.set('templates', templates);
    navigate('/templates');
  };

  const renderPreview = () => {
    if (!template.messageBody) return null;

    let preview = template.messageBody;
    template.requiredFields?.forEach(field => {
      preview = preview.replace(`{${field.key}}`, `[${field.label}]`);
    });

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Email Preview</h4>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm">{preview}</p>
          </div>
        </div>
        {template.channels?.includes('sms') && (
          <div>
            <h4 className="font-medium mb-2">SMS Preview</h4>
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm">{preview.substring(0, 160)}</p>
            </div>
          </div>
        )}
        {template.channels?.includes('voice') && template.ttsScript && (
          <div>
            <h4 className="font-medium mb-2">TTS Script Preview</h4>
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm">{template.ttsScript}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Create Template' : 'Edit Template'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Basic Information">
            <div className="space-y-4">
              <Input
                label="Code Name"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                rows={3}
                required
              />
              <Select
                label="Severity"
                value={template.severity}
                onChange={(e) => setTemplate({ ...template, severity: e.target.value as Severity })}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' },
                ]}
              />
              <Select
                label="Status"
                value={template.status}
                onChange={(e) => setTemplate({ ...template, status: e.target.value as TemplateStatus })}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </div>
          </Card>

          <Card title="Communication Channels">
            <div className="space-y-3">
              {(['email', 'sms', 'pager', 'voice'] as Channel[]).map(channel => (
                <label key={channel} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.channels?.includes(channel)}
                    onChange={() => handleChannelToggle(channel)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{channel}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Message Content">
            <div className="space-y-4">
              <Textarea
                label="Message Body"
                value={template.messageBody}
                onChange={(e) => setTemplate({ ...template, messageBody: e.target.value })}
                rows={6}
                placeholder="Enter message body. Use {VariableName} for placeholders."
              />
              {template.channels?.includes('voice') && (
                <Textarea
                  label="TTS Script"
                  value={template.ttsScript}
                  onChange={(e) => setTemplate({ ...template, ttsScript: e.target.value })}
                  rows={4}
                  placeholder="Text-to-speech script for voice calls"
                />
              )}
            </div>
          </Card>

          <Card title="Required Fields (Variables)">
            <div className="space-y-4">
              {template.requiredFields?.map((field, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">{field.label}</span>
                    <span className="text-sm text-gray-500 ml-2">({field.key})</span>
                    {field.required && <Badge variant="warning" size="sm" className="ml-2">Required</Badge>}
                  </div>
                  <button
                    onClick={() => handleRemoveVariable(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Variable Key (e.g., RoomNumber)"
                  value={newVariable.key}
                  onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Label (e.g., Room Number)"
                  value={newVariable.label}
                  onChange={(e) => setNewVariable({ ...newVariable, label: e.target.value })}
                  className="flex-1"
                />
                <select
                  value={newVariable.type}
                  onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                </select>
                <label className="flex items-center px-3">
                  <input
                    type="checkbox"
                    checked={newVariable.required}
                    onChange={(e) => setNewVariable({ ...newVariable, required: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm">Required</span>
                </label>
                <Button onClick={handleAddVariable}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Distribution Lists">
            <div className="space-y-3">
              {distributionLists.map(list => (
                <label key={list.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.distributionListIds?.includes(list.id)}
                    onChange={(e) => {
                      const ids = template.distributionListIds || [];
                      if (e.target.checked) {
                        setTemplate({ ...template, distributionListIds: [...ids, list.id] });
                      } else {
                        setTemplate({ ...template, distributionListIds: ids.filter(id => id !== list.id) });
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{list.name}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {showPreview && (
          <div className="lg:col-span-1">
            <Card title="Preview">
              {renderPreview()}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

