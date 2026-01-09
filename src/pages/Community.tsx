import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Heart, Image as ImageIcon, Send, User, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';

interface Post {
  id: string;
  username: string;
  content: string;
  image_url: string | null;
  likes: number;
  created_at: string;
}

export function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load posts using polling (every 3 seconds)
  useEffect(() => {
    if (!hasJoined) return;

    const loadPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading posts:', error);
      } else if (data) {
        setPosts(data);
      }
    };

    loadPosts();
    const interval = setInterval(loadPosts, 3000);

    return () => clearInterval(interval);
  }, [hasJoined]);

  // Load liked posts from localStorage
  useEffect(() => {
    const liked = localStorage.getItem('likedPosts');
    if (liked) {
      setLikedPosts(new Set(JSON.parse(liked)));
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Image too large',
          description: 'Please select an image under 10MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newPost.trim() && !selectedImage) || isPosting) return;

    setIsPosting(true);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert post
      const { error } = await supabase
        .from('posts')
        .insert({
          username: username,
          content: newPost.trim(),
          image_url: imageUrl,
        });

      if (error) throw error;

      setNewPost('');
      setSelectedImage(null);
      setImagePreview(null);

      toast({
        title: 'Posted!',
        description: 'Your post has been shared',
      });

      // Reload posts
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (data) {
        setPosts(data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }

    setIsPosting(false);
  };

  const handleLike = async (postId: string, currentLikes: number) => {
    const isLiked = likedPosts.has(postId);
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

    // Update local state immediately
    const newLikedPosts = new Set(likedPosts);
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify([...newLikedPosts]));

    // Update database
    const { error } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', postId);

    if (error) {
      console.error('Error updating likes:', error);
      // Revert on error
      setLikedPosts(likedPosts);
      localStorage.setItem('likedPosts', JSON.stringify([...likedPosts]));
    } else {
      // Update posts list
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: newLikes } : p));
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  // Join screen
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Join Community</h1>
                <p className="text-muted-foreground">Share posts, images, and connect with others</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (username.trim()) setHasJoined(true);
              }}>
                <div className="mb-4">
                  <label className="text-sm font-semibold text-foreground mb-2 block">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={!username.trim()}
                >
                  <User className="h-5 w-5" />
                  Enter Community
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Community feed
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Community</h1>
            <p className="text-muted-foreground">Posting as <span className="font-semibold text-primary">{username}</span></p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setHasJoined(false)}
          >
            Change Name
          </Button>
        </div>

        {/* Create Post */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handlePost}>
              <div className="mb-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  maxLength={500}
                  className="min-h-[100px] resize-none"
                  disabled={isPosting}
                />
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full rounded-lg max-h-64 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isPosting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                    disabled={isPosting}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Add Image
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  disabled={(!newPost.trim() && !selectedImage) || isPosting}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <Send className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>No posts yet. Be the first to share something!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="animate-fade-in">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{post.username}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(post.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  {post.content && (
                    <p className="mb-3 text-foreground whitespace-pre-wrap break-words">
                      {post.content}
                    </p>
                  )}

                  {/* Image */}
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt="Post" 
                      className="w-full rounded-lg mb-3 max-h-96 object-cover"
                    />
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id, post.likes)}
                      className={`gap-2 ${
                        likedPosts.has(post.id) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      <Heart 
                        className="h-4 w-4" 
                        fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                      />
                      <span>{post.likes}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
