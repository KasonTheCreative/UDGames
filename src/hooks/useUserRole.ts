import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserRoleData {
  id: string;
  sessionId: string;
  username: string;
  role: UserRole;
}

export function useUserRole() {
  const [role, setRole] = useState<UserRole>('user');
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      // Get or create session ID
      let storedSessionId = localStorage.getItem('userSessionId');
      if (!storedSessionId) {
        storedSessionId = generateSessionId();
        localStorage.setItem('userSessionId', storedSessionId);
      }
      setSessionId(storedSessionId);

      // Check if user exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('session_id', storedSessionId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user role:', fetchError);
      }

      if (existingUser) {
        setRole(existingUser.role as UserRole);
      } else {
        // Create new user with default role
        const username = `User${Math.random().toString(36).substring(2, 8)}`;
        const { data: newUser, error: insertError } = await supabase
          .from('user_roles')
          .insert({
            session_id: storedSessionId,
            username,
            role: 'user'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user role:', insertError);
        } else if (newUser) {
          setRole(newUser.role as UserRole);
        }
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error updating role:', error);
      } else {
        setRole(newRole);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return { role, sessionId, isLoading, updateRole };
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
