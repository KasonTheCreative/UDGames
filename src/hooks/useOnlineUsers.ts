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
    let cleanupInterval: NodeJS.Timeout;

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

    // Clean up stale sessions (older than 1 minute)
    const cleanupStale = async () => {
      try {
        const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
        await supabase
          .from('online_users')
          .delete()
          .lt('last_active', oneMinuteAgo);
      } catch (error) {
        console.error('Error cleaning up stale sessions:', error);
      }
    };

    // Fetch online user count - only count users active in last 30 seconds
    const fetchOnlineCount = async () => {
      try {
        const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
        
        const { count, error } = await supabase
          .from('online_users')
          .select('*', { count: 'exact', head: true })
          .gte('last_active', thirtySecondsAgo);

        if (error) {
          console.error('Error fetching online count:', error);
        } else {
          // Show actual real user count
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
    cleanupStale();

    // Set up intervals
    heartbeatInterval = setInterval(updateHeartbeat, 10000); // Update every 10 seconds
    pollInterval = setInterval(fetchOnlineCount, 3000); // Poll every 3 seconds for real-time feel
    cleanupInterval = setInterval(cleanupStale, 30000); // Cleanup every 30 seconds

    // Handle page visibility to pause/resume heartbeat
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - remove session
        removeSession();
      } else {
        // Page visible - re-register
        registerSession();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(pollInterval);
      clearInterval(cleanupInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      removeSession();
    };
  }, [sessionId]);

  return { onlineCount };
}
