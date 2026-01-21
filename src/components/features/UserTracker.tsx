import { useEffect, useState } from 'react';
import { Users, RefreshCw, Crown, ShieldCheck, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { UserRole } from '../../hooks/useUserRole';

interface TrackedUser {
  id: string;
  session_id: string;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export function UserTracker() {
  const [users, setUsers] = useState<TrackedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (sessionId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error updating user role:', error);
      } else {
        // Update local state
        setUsers(users.map(user => 
          user.session_id === sessionId 
            ? { ...user, role: newRole, updated_at: new Date().toISOString() }
            : user
        ));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'moderator':
        return <ShieldCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'moderator':
        return 'bg-blue-500/10 border-blue-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">User Tracker</h3>
          <span className="text-sm text-muted-foreground">({users.length} users)</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`glass-card p-4 border ${getRoleColor(user.role)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getRoleIcon(user.role)}
                <div>
                  <p className="font-semibold text-foreground">{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Session: {user.session_id.substring(0, 20)}...
                  </p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={user.role === 'user' ? 'default' : 'outline'}
                onClick={() => updateUserRole(user.session_id, 'user')}
                className="flex-1 gap-2"
              >
                <Shield className="h-3 w-3" />
                User
              </Button>
              <Button
                size="sm"
                variant={user.role === 'moderator' ? 'default' : 'outline'}
                onClick={() => updateUserRole(user.session_id, 'moderator')}
                className="flex-1 gap-2"
              >
                <ShieldCheck className="h-3 w-3" />
                Moderator
              </Button>
              <Button
                size="sm"
                variant={user.role === 'admin' ? 'default' : 'outline'}
                onClick={() => updateUserRole(user.session_id, 'admin')}
                className="flex-1 gap-2"
              >
                <Crown className="h-3 w-3" />
                Admin
              </Button>
            </div>
          </div>
        ))}

        {users.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            No users tracked yet
          </div>
        )}
      </div>
    </div>
  );
}
