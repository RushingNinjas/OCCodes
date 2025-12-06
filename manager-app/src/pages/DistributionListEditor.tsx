import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Select } from '@shared/components/Select';
import { Badge } from '@shared/components/Badge';
import { X, Plus, Save } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import type { DistributionList, DistributionListMember, DistributionListTag } from '@shared/types';

export const DistributionListEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [list, setList] = useState<Partial<DistributionList>>({
    name: '',
    description: '',
    members: [],
    tag: 'static',
  });

  const [newMember, setNewMember] = useState<Partial<DistributionListMember>>({
    name: '',
    email: '',
    phone: '',
  });

  const users = storage.get<any[]>('users') || [];

  useEffect(() => {
    if (!isNew) {
      const lists = storage.get<DistributionList[]>('distributionLists') || [];
      const found = lists.find(l => l.id === id);
      if (found) {
        setList(found);
      }
    }
  }, [id, isNew]);

  const handleAddMember = () => {
    if (newMember.name) {
      const members = list.members || [];
      setList({
        ...list,
        members: [...members, newMember as DistributionListMember],
      });
      setNewMember({ name: '', email: '', phone: '' });
    }
  };

  const handleRemoveMember = (index: number) => {
    const members = list.members || [];
    setList({
      ...list,
      members: members.filter((_, i) => i !== index),
    });
  };

  const handleAddUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const members = list.members || [];
      setList({
        ...list,
        members: [...members, {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        }],
      });
    }
  };

  const handleSave = () => {
    if (!list.name) {
      alert('Please enter a list name');
      return;
    }

    const lists = storage.get<DistributionList[]>('distributionLists') || [];
    const now = new Date().toISOString();

    if (isNew) {
      const newList: DistributionList = {
        ...list as DistributionList,
        id: `list-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      lists.push(newList);
    } else {
      const index = lists.findIndex(l => l.id === id);
      if (index !== -1) {
        lists[index] = {
          ...list as DistributionList,
          id: id!,
          updatedAt: now,
        };
      }
    }

    storage.set('distributionLists', lists);
    navigate('/distribution-lists');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Create Distribution List' : 'Edit Distribution List'}
        </h2>
        <Button variant="primary" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Basic Information">
            <div className="space-y-4">
              <Input
                label="List Name"
                value={list.name}
                onChange={(e) => setList({ ...list, name: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                value={list.description}
                onChange={(e) => setList({ ...list, description: e.target.value })}
                rows={3}
              />
              <Select
                label="List Type"
                value={list.tag}
                onChange={(e) => setList({ ...list, tag: e.target.value as DistributionListTag })}
                options={[
                  { value: 'static', label: 'Static (cannot be changed by operator)' },
                  { value: 'editable', label: 'Editable by operator' },
                  { value: 'operator-must-add', label: 'Operator must add at least one recipient' },
                ]}
              />
            </div>
          </Card>

          <Card title="Members">
            <div className="space-y-4">
              {list.members?.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{member.name}</div>
                    {member.email && <div className="text-sm text-gray-500">{member.email}</div>}
                    {member.phone && <div className="text-sm text-gray-500">{member.phone}</div>}
                  </div>
                  <button
                    onClick={() => handleRemoveMember(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Add from Users</h4>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddUser(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Add New Member</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                  <Input
                    placeholder="Phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                  <Button onClick={handleAddMember} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="List Info">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Members</div>
                <div className="text-lg font-semibold">{list.members?.length || 0}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <Badge variant={list.tag === 'static' ? 'danger' : list.tag === 'editable' ? 'warning' : 'info'}>
                  {list.tag}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

