import { useEffect, useState, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  User, 
  Camera, 
  Loader2, 
  UserPlus, 
  Check, 
  X, 
  Users,
  Search,
  LogOut,
  Edit2,
  Save
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface Friend {
  id: string;
  friend_id: string;
  friend: {
    id: string;
    username: string;
    profile_picture_url?: string;
    bio?: string;
  };
}

interface FriendRequest {
  id: string;
  from_user_id?: string;
  to_user_id?: string;
  status: string;
  created_at: string;
  from_user?: {
    id: string;
    username: string;
    profile_picture_url?: string;
  };
  to_user?: {
    id: string;
    username: string;
    profile_picture_url?: string;
  };
}

interface SearchResult {
  id: string;
  username: string;
  email: string;
  profile_picture_url?: string;
}

export function Profile() {
  const { user, logout, login } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setUsername(user.username);
    setBio(user.bio || '');
    loadFriends();
    loadFriendRequests();
  }, [user]);

  const loadFriends = async () => {
    if (!user) return;
    try {
      const data = await authService.getFriends(user.id);
      setFriends(data);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadFriendRequests = async () => {
    if (!user) return;
    try {
      const [received, sent] = await Promise.all([
        authService.getFriendRequests(user.id),
        authService.getSentFriendRequests(user.id)
      ]);
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;
    
    setSearching(true);
    try {
      const results = await authService.searchUsers(searchQuery);
      // Filter out current user
      setSearchResults(results.filter(r => r.id !== user.id));
    } catch (error: any) {
      toast({
        title: 'Search Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSendFriendRequest = async (toUserId: string) => {
    if (!user) return;
    try {
      await authService.sendFriendRequest(user.id, toUserId);
      toast({
        title: 'Friend Request Sent!',
        description: 'Your request has been sent.',
      });
      loadFriendRequests();
      setSearchQuery('');
      setSearchResults([]);
    } catch (error: any) {
      toast({
        title: 'Failed to Send Request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAcceptRequest = async (request: FriendRequest) => {
    if (!user || !request.from_user_id) return;
    try {
      await authService.acceptFriendRequest(request.id, request.from_user_id, user.id);
      toast({
        title: 'Friend Request Accepted!',
        description: 'You are now friends.',
      });
      loadFriends();
      loadFriendRequests();
    } catch (error: any) {
      toast({
        title: 'Failed to Accept Request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await authService.rejectFriendRequest(requestId);
      toast({
        title: 'Friend Request Rejected',
      });
      loadFriendRequests();
    } catch (error: any) {
      toast({
        title: 'Failed to Reject Request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const url = await authService.uploadProfilePicture(user.id, file);
      await authService.updateProfile(user.id, { profile_picture_url: url });
      
      login({ ...user, avatar: url });
      
      toast({
        title: 'Profile Picture Updated!',
        description: 'Your new profile picture has been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await authService.updateProfile(user.id, {
        username,
        bio,
      });
      
      login({ ...user, username, bio });
      
      toast({
        title: 'Profile Updated!',
        description: 'Your changes have been saved.',
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Picture */}
              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div 
                  onClick={handleProfilePictureClick}
                  className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 cursor-pointer group-hover:border-primary transition-all"
                >
                  {uploading ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  ) : (
                    <>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <User className="h-16 w-16 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                {isEditing ? (
                  <>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="text-2xl font-bold"
                    />
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-4xl font-black gradient-text">{user.username}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    {user.bio && <p className="text-foreground">{user.bio}</p>}
                  </>
                )}

                <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(user.username);
                          setBio(user.bio || '');
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Friends */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Friends ({friends.length})
              </h2>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-white/10"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                      {friend.friend.profile_picture_url ? (
                        <img src={friend.friend.profile_picture_url} alt={friend.friend.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{friend.friend.username}</p>
                      {friend.friend.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{friend.friend.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {friends.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No friends yet. Start adding some!
                  </div>
                )}
              </div>
            </div>

            {/* Search & Friend Requests */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Search className="h-6 w-6 text-primary" />
                Find Friends
              </h2>

              {/* Search */}
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by username..."
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Search Results</p>
                  {searchResults.map((result) => {
                    const alreadyFriends = friends.some(f => f.friend_id === result.id);
                    const requestSent = sentRequests.some(r => r.to_user_id === result.id);
                    
                    return (
                      <div
                        key={result.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-white/10"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                          {result.profile_picture_url ? (
                            <img src={result.profile_picture_url} alt={result.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground">{result.username}</p>
                        </div>
                        {alreadyFriends ? (
                          <Button size="sm" variant="outline" disabled>
                            <Check className="h-4 w-4 mr-1" />
                            Friends
                          </Button>
                        ) : requestSent ? (
                          <Button size="sm" variant="outline" disabled>
                            Sent
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleSendFriendRequest(result.id)}>
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Received Requests */}
              {receivedRequests.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Friend Requests Received</p>
                  {receivedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-primary/20"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                        {request.from_user?.profile_picture_url ? (
                          <img src={request.from_user.profile_picture_url} alt={request.from_user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{request.from_user?.username}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleAcceptRequest(request)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sent Requests */}
              {sentRequests.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Sent Requests</p>
                  {sentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                        {request.to_user?.profile_picture_url ? (
                          <img src={request.to_user.profile_picture_url} alt={request.to_user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{request.to_user?.username}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
