import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Input } from '@shared/components/Input';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import type { DistributionList } from '@shared/types';

export const DistributionLists = () => {
  const [lists, setLists] = useState<DistributionList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = () => {
    const stored = storage.get<DistributionList[]>('distributionLists') || [];
    setLists(stored);
  };

  const deleteList = (id: string) => {
    if (window.confirm('Are you sure you want to delete this distribution list?')) {
      const updated = lists.filter(l => l.id !== id);
      storage.set('distributionLists', updated);
      setLists(updated);
    }
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'static': return 'danger';
      case 'editable': return 'warning';
      case 'operator-must-add': return 'info';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Distribution Lists</h2>
        <Link to="/distribution-lists/new">
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Create List
          </Button>
        </Link>
      </div>

      <Card>
        <div className="mb-6">
          <Input
            placeholder="Search distribution lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredLists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No distribution lists found. Create your first list to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLists.map((list) => (
              <div key={list.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{list.name}</h3>
                  <div className="flex gap-2">
                    <Link to={`/distribution-lists/${list.id}`}>
                      <button className="text-primary-600 hover:text-primary-900">
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteList(list.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {list.description && (
                  <p className="text-sm text-gray-500 mb-3">{list.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {list.members.length} members
                  </div>
                  <Badge variant={getTagColor(list.tag) as any}>
                    {list.tag}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

