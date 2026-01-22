import { supabase } from './supabase';
import { AuthUser } from '../contexts/AuthContext';

export class AuthService {
  // Simple signup with email, password, and username
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error) throw error;
    return data.user;
  }

  // Sign in with password
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Update profile
  async updateProfile(userId: string, updates: { username?: string; bio?: string; profile_picture_url?: string }) {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
  }

  // Upload profile picture
  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // Search users
  async searchUsers(query: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, username, email, profile_picture_url')
      .ilike('username', `%${query}%`)
      .limit(10);
    
    if (error) throw error;
    return data;
  }

  // Send friend request
  async sendFriendRequest(fromUserId: string, toUserId: string) {
    const { error } = await supabase
      .from('friend_requests')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        status: 'pending'
      });
    
    if (error) throw error;
  }

  // Get friend requests (received)
  async getFriendRequests(userId: string) {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        id,
        from_user_id,
        status,
        created_at,
        from_user:user_profiles!friend_requests_from_user_id_fkey(id, username, profile_picture_url)
      `)
      .eq('to_user_id', userId)
      .eq('status', 'pending');
    
    if (error) throw error;
    return data;
  }

  // Get sent friend requests
  async getSentFriendRequests(userId: string) {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        id,
        to_user_id,
        status,
        created_at,
        to_user:user_profiles!friend_requests_to_user_id_fkey(id, username, profile_picture_url)
      `)
      .eq('from_user_id', userId)
      .eq('status', 'pending');
    
    if (error) throw error;
    return data;
  }

  // Accept friend request
  async acceptFriendRequest(requestId: string, fromUserId: string, toUserId: string) {
    // Update request status
    const { error: updateError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', requestId);
    
    if (updateError) throw updateError;

    // Create friend relationships (both ways)
    const { error: friendError } = await supabase
      .from('friends')
      .insert([
        { user_id: fromUserId, friend_id: toUserId },
        { user_id: toUserId, friend_id: fromUserId }
      ]);
    
    if (friendError) throw friendError;
  }

  // Reject friend request
  async rejectFriendRequest(requestId: string) {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', requestId);
    
    if (error) throw error;
  }

  // Get friends
  async getFriends(userId: string) {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        friend_id,
        friend:user_profiles!friends_friend_id_fkey(id, username, profile_picture_url, bio)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  // Remove friend
  async removeFriend(userId: string, friendId: string) {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);
    
    if (error) throw error;
  }
}

export const authService = new AuthService();
