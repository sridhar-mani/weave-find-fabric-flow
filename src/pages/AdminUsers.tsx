
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import AdminGuard from '@/components/AdminGuard';
import PageHeader from '@/components/PageHeader';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUsers = async () => {
      // Note: supabase anon key cannot list auth users. Replace with proper API or table.
      const { data, error } = await supabase
        .from('users')
        .select('id, email, created_at');
      if (error) {
        console.error('Error fetching users:', error.message);
      } else if (data) {
        setUsers(data);
      }
      setLoading(false);
    };
    loadUsers();
  }, []);

  return (
    <AdminGuard>
      <div>
        <PageHeader title="User Management" description="Manage application users" />
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        {new Date(u.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
};

export default AdminUsers;
