import { useState, useEffect } from 'react';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { Badge } from '@shared/components/Badge';
import { Input } from '@shared/components/Input';
import { Select } from '@shared/components/Select';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { storage } from '@shared/utils/storage';
import type { User } from '@shared/types';

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const stored = storage.get<User[]>('users') || [];
    setUsers(stored);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    const userList = [...users];

    if (editingUser) {
      const index = userList.findIndex(u => u.id === editingUser.id);
      if (index !== -1) {
        userList[index] = { ...editingUser, ...userData } as User;
      }
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone,
        role: userData.role || 'operator',
        department: userData.department,
        specialty: userData.specialty,
        location: userData.location,
        permissions: userData.permissions || {
          canSendHighSeverity: false,
          canModifyDistributionLists: false,
          canAddOneTimeRecipients: false,
        },
      };
      userList.push(newUser);
    }

    storage.set('users', userList);
    setUsers(userList);
    setEditingUser(null);
    setShowAddForm(false);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter(u => u.id !== id);
      storage.set('users', updated);
      setUsers(updated);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Users & Roles</h2>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showAddForm && (
          <UserForm
            onSave={handleSaveUser}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {editingUser && (
          <UserForm
            user={editingUser}
            onSave={handleSaveUser}
            onCancel={() => setEditingUser(null)}
          />
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.role === 'manager' ? 'primary' : 'info'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.canSendHighSeverity && (
                        <Badge variant="warning" size="sm">High Severity</Badge>
                      )}
                      {user.permissions.canModifyDistributionLists && (
                        <Badge variant="info" size="sm">Modify Lists</Badge>
                      )}
                      {user.permissions.canAddOneTimeRecipients && (
                        <Badge variant="success" size="sm">Add Recipients</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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
      </Card>
    </div>
  );
};

interface UserFormProps {
  user?: User;
  onSave: (userData: Partial<User>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'operator',
    department: user?.department || '',
    specialty: user?.specialty || '',
    location: user?.location || '',
    permissions: user?.permissions || {
      canSendHighSeverity: false,
      canModifyDistributionLists: false,
      canAddOneTimeRecipients: false,
    },
  });

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-primary-200">
      <h3 className="text-lg font-semibold mb-4">{user ? 'Edit User' : 'Add New User'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'manager' | 'operator' })}
          options={[
            { value: 'operator', label: 'Operator' },
            { value: 'manager', label: 'Manager' },
          ]}
        />
        <Input
          label="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />
        <Input
          label="Specialty"
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
        />
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Permissions</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.permissions?.canSendHighSeverity}
              onChange={(e) => setFormData({
                ...formData,
                permissions: { ...formData.permissions!, canSendHighSeverity: e.target.checked },
              })}
              className="rounded border-gray-300"
            />
            <span className="ml-2 text-sm">Can send high-severity codes</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.permissions?.canModifyDistributionLists}
              onChange={(e) => setFormData({
                ...formData,
                permissions: { ...formData.permissions!, canModifyDistributionLists: e.target.checked },
              })}
              className="rounded border-gray-300"
            />
            <span className="ml-2 text-sm">Can modify distribution lists</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.permissions?.canAddOneTimeRecipients}
              onChange={(e) => setFormData({
                ...formData,
                permissions: { ...formData.permissions!, canAddOneTimeRecipients: e.target.checked },
              })}
              className="rounded border-gray-300"
            />
            <span className="ml-2 text-sm">Can add one-time recipients</span>
          </label>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={() => onSave(formData)}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

