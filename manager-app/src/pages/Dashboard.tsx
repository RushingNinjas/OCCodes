import { Card } from '@shared/components/Card';
import { Badge } from '@shared/components/Badge';
import { Button } from '@shared/components/Button';
import { Plus, FileText, Users, List, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '@shared/utils/storage';

export const Dashboard = () => {
  const templates = storage.get<any[]>('templates') || [];
  const distributionLists = storage.get<any[]>('distributionLists') || [];
  const users = storage.get<any[]>('users') || [];
  const dispatchEvents = storage.get<any[]>('dispatchEvents') || [];

  const activeTemplates = templates.filter(t => t.status === 'active').length;
  const recentEvents = dispatchEvents.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Templates</dt>
                <dd className="text-lg font-medium text-gray-900">{activeTemplates}</dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <List className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Distribution Lists</dt>
                <dd className="text-lg font-medium text-gray-900">{distributionLists.length}</dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Operators</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {users.filter(u => u.role === 'operator').length}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Dispatches</dt>
                <dd className="text-lg font-medium text-gray-900">{dispatchEvents.length}</dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link to="/templates/new">
              <Button className="w-full justify-start" variant="primary">
                <Plus className="mr-2 h-4 w-4" />
                Create New Template
              </Button>
            </Link>
            <Link to="/distribution-lists/new">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Distribution List
              </Button>
            </Link>
            <Link to="/users">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
          </div>
        </Card>

        <Card title="Recent Dispatch Events">
          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-500">No dispatch events yet</p>
            ) : (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.templateName}</p>
                    <p className="text-xs text-gray-500">
                      by {event.operatorName} • {new Date(event.dispatchedAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={event.status === 'completed' ? 'success' : 'warning'}>
                    {event.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

