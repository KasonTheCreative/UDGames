import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Generate a unique session ID for this browser session
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export function useOnlineUsers() {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const sessionId = getSessionId();

  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    // Register this session as online
    const registerSession = async () => {
      try {
        await supabase
          .from('online_users')
          .upsert({ 
            session_id: sessionId,
            last_active: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error registering session:', error);
      }
    };

    // Update heartbeat
    const updateHeartbeat = async () => {
      try {
        await supabase
          .from('online_users')
          .update({ last_active: new Date().toISOString() })
          .eq('session_id', sessionId);
      } catch (error) {
        console.error('Error updating heartbeat:', error);
      }
    };

    // Fetch online user count
    const fetchOnlineCount = async () => {
      try {
        // First, cleanup stale sessions
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        await supabase
          .from('online_users')
          .delete()
          .lt('last_active', twoMinutesAgo);

        // Then get count of active sessions (updated in last 2 minutes)
        const { count, error } = await supabase
          .from('online_users')
          .select('*', { count: 'exact', head: true })
          .gte('last_active', twoMinutesAgo);

        if (error) {
          console.error('Error fetching online count:', error);
        } else {
          setOnlineCount(count || 0);
        }
      } catch (error) {
        console.error('Error in fetchOnlineCount:', error);
      }
    };

    // Remove session on cleanup
    const removeSession = async () => {
      try {
        await supabase
          .from('online_users')
          .delete()
          .eq('session_id', sessionId);
      } catch (error) {
        console.error('Error removing session:', error);
      }
    };

    // Initialize
    registerSession();
    fetchOnlineCount();

    // Set up intervals
    heartbeatInterval = setInterval(updateHeartbeat, 30000); // Update every 30 seconds
    pollInterval = setInterval(fetchOnlineCount, 10000); // Poll every 10 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(pollInterval);
      removeSession();
    };
  }, [sessionId]);

  return { onlineCount };
}
