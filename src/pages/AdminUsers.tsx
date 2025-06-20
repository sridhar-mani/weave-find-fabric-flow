
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import AdminGuard from '@/components/AdminGuard';
import PageHeader from '@/components/PageHeader';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name, created_at, role')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching users:', error.message);
        } else if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
        <div className="p-6">
          <PageHeader 
            title="User Management" 
            description="Manage application users" 
            breadcrumbs={[{ label: "Admin", path: "/admin" }, { label: "Users" }]}
          />
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Users ({users.length})</span>
                  <div className="text-sm text-gray-500">
                    Total registered users
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <span className="ml-2">Loading users...</span>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No users found. Users will appear here once they sign up for the application.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.full_name || 'Not provided'}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role || 'user'}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminUsers;
