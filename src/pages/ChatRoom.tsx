import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Send, MessageCircle, Users, Clock, Lock, Hash, Copy, Check, Phone, Mic, MicOff, PhoneOff } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Message {
  id: string;
  username: string;
  message: string;
  created_at: string;
}

export function ChatRoom() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [isInVoiceCall, setIsInVoiceCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceRoomCode, setVoiceRoomCode] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastResetCheckRef = useRef<string>('');

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Calculate time until midnight and update countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
      
      // Check if it's midnight (reset time)
      const currentDate = now.toDateString();
      if (now.getHours() === 0 && now.getMinutes() === 0 && lastResetCheckRef.current !== currentDate) {
        lastResetCheckRef.current = currentDate;
        clearChatMessages();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to clear all chat messages
  const clearChatMessages = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all messages
      
      if (error) {
        console.error('Error clearing messages:', error);
      } else {
        setMessages([]);
        console.log('Chat reset at midnight');
      }
    } catch (err) {
      console.error('Failed to clear messages:', err);
    }
  };

  // Load messages using polling (every 2 seconds)
  useEffect(() => {
    if (!hasJoined || !currentRoom) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_code', currentRoom)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('Error loading messages:', error);
      } else if (data) {
        setMessages(data);
      }
    };

    // Load immediately
    loadMessages();

    // Poll every 2 seconds
    const interval = setInterval(loadMessages, 2000);

    return () => clearInterval(interval);
  }, [hasJoined, currentRoom]);

  const handleJoinPublic = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentRoom('public');
      setHasJoined(true);
    }
  };

  const handleJoinPrivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomCode.trim() && roomCode.length === 6) {
      setCurrentRoom(roomCode.toUpperCase());
      setHasJoined(true);
    }
  };

  const handleCreateRoom = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(newCode);
    setIsCreatingRoom(true);
  };

  const handleCopyCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    const { error } = await supabase
      .from('messages')
      .insert({
        username: username,
        message: newMessage.trim(),
        room_code: currentRoom || 'public'
      });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      // Immediately reload messages after sending
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room_code', currentRoom || 'public')
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (data) {
        setMessages(data);
      }
    }

    setIsSending(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Join screen
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <MessageCircle className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="mb-2 text-4xl font-bold gradient-text">Join Chat Room</h1>
              <p className="text-muted-foreground">Choose a public or private room to start chatting</p>
            </div>

            {/* Username Input */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <label className="text-sm font-semibold text-foreground mb-2 block">Your Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="text-lg"
                    autoFocus
                  />
                </div>
              </CardContent>
            </Card>

            {/* Room Options */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Public Room */}
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="mb-4 text-center">
                    <div className="mb-3 flex justify-center">
                      <div className="rounded-full bg-green-500/10 p-3">
                        <Users className="h-8 w-8 text-green-400" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Public Room</h2>
                    <p className="text-sm text-muted-foreground">Join the main chat room. Open to everyone!</p>
                  </div>
                  <form onSubmit={handleJoinPublic}>
                    <Button 
                      type="submit" 
                      className="w-full gap-2" 
                      size="lg"
                      disabled={!username.trim()}
                    >
                      <Users className="h-5 w-5" />
                      Join Public Room
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Private Room */}
              <Card className="border-purple-500/20">
                <CardContent className="p-6">
                  <div className="mb-4 text-center">
                    <div className="mb-3 flex justify-center">
                      <div className="rounded-full bg-purple-500/10 p-3">
                        <Lock className="h-8 w-8 text-purple-400" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Private Room</h2>
                    <p className="text-sm text-muted-foreground">Create or join a private chat with a code</p>
                  </div>

                  {!isCreatingRoom ? (
                    <div className="space-y-3">
                      <Button 
                        type="button" 
                        onClick={handleCreateRoom}
                        className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500" 
                        size="lg"
                        disabled={!username.trim()}
                      >
                        <Hash className="h-5 w-5" />
                        Create New Room
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">or</span>
                        </div>
                      </div>
                      <form onSubmit={handleJoinPrivate} className="space-y-2">
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={roomCode}
                          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                          maxLength={6}
                          className="text-center text-lg tracking-widest font-mono"
                        />
                        <Button 
                          type="submit" 
                          variant="outline"
                          className="w-full gap-2" 
                          size="lg"
                          disabled={!username.trim() || roomCode.length !== 6}
                        >
                          <Lock className="h-5 w-5" />
                          Join Private Room
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="glass-card p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-2">Your Room Code:</p>
                        <p className="text-3xl font-black tracking-widest font-mono gradient-text mb-2">{roomCode}</p>
                        <p className="text-xs text-muted-foreground">Share this code with friends!</p>
                      </div>
                      <form onSubmit={handleJoinPrivate}>
                        <Button 
                          type="submit" 
                          className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500" 
                          size="lg"
                        >
                          <Lock className="h-5 w-5" />
                          Enter Room
                        </Button>
                      </form>
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsCreatingRoom(false);
                          setRoomCode('');
                        }}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Chat room
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {currentRoom === 'public' ? 'Public Chat Room' : 'Private Chat Room'}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-muted-foreground">Chatting as <span className="font-semibold text-primary">{username}</span></p>
              {currentRoom !== 'public' && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-1">
                    <Hash className="h-3 w-3 text-purple-400" />
                    <span className="font-mono text-sm font-bold text-purple-400">{currentRoom}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCode}
                    className="h-7 w-7 p-0"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isInVoiceCall ? "destructive" : "default"}
              onClick={() => setIsVoiceChatOpen(true)}
              className="gap-2"
            >
              <Phone className="h-4 w-4" />
              {isInVoiceCall ? 'In Voice Call' : 'Voice Call'}
            </Button>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <div className="text-xs text-muted-foreground">Reset in</div>
                <div className="font-mono font-semibold text-foreground">{timeUntilReset}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setHasJoined(false)}
            >
              Change Name
            </Button>
          </div>
        </div>

        <Card className="mx-auto h-[calc(100vh-250px)] max-w-4xl">
          <CardContent className="flex h-full flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No messages yet. Be the first to say hello!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`animate-fade-in ${
                      msg.username === username ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className={`inline-block max-w-[70%] rounded-lg px-4 py-2 ${
                      msg.username === username
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <div className="mb-1 text-xs font-semibold opacity-80">
                        {msg.username}
                      </div>
                      <div className="break-words">{msg.message}</div>
                      <div className="mt-1 text-xs opacity-60">
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  maxLength={500}
                  disabled={isSending}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Voice Chat Modal */}
        {isVoiceChatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                {!isInVoiceCall ? (
                  <div>
                    <div className="text-center mb-6">
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-primary/10 p-4">
                          <Phone className="h-12 w-12 text-primary" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold gradient-text mb-2">Join Voice Call</h2>
                      <p className="text-muted-foreground">Connect with others through voice</p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setIsInVoiceCall(true);
                          setVoiceRoomCode('PUBLIC');
                          toast({
                            title: 'Joined Public Voice',
                            description: 'You are now in the public voice channel',
                          });
                        }}
                        className="w-full gap-2"
                        size="lg"
                      >
                        <Users className="h-5 w-5" />
                        Join Public Voice
                      </Button>

                      {currentRoom !== 'public' && (
                        <Button
                          onClick={() => {
                            setIsInVoiceCall(true);
                            setVoiceRoomCode(currentRoom || '');
                            toast({
                              title: 'Joined Private Voice',
                              description: `Connected to voice room ${currentRoom}`,
                            });
                          }}
                          className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
                          size="lg"
                        >
                          <Lock className="h-5 w-5" />
                          Join Private Voice
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => setIsVoiceChatOpen(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-6">
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-green-500/10 p-4 animate-pulse">
                          <Phone className="h-12 w-12 text-green-400" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">Voice Call Active</h2>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <p className="text-sm text-muted-foreground">
                          {voiceRoomCode === 'PUBLIC' ? 'Public Voice Channel' : `Room: ${voiceRoomCode}`}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Connected as {username}</p>
                    </div>

                    <div className="glass-card p-6 mb-6">
                      <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                          <div className="mb-2 flex justify-center">
                            <div className="rounded-full bg-primary/10 p-3">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">You</p>
                        </div>
                        <div className="text-center opacity-50">
                          <div className="mb-2 flex justify-center">
                            <div className="rounded-full bg-muted p-3">
                              <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Waiting...</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant={isMuted ? "destructive" : "outline"}
                        onClick={() => setIsMuted(!isMuted)}
                        className="flex-1 gap-2"
                        size="lg"
                      >
                        {isMuted ? (
                          <>
                            <MicOff className="h-5 w-5" />
                            Unmute
                          </>
                        ) : (
                          <>
                            <Mic className="h-5 w-5" />
                            Mute
                          </>
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsInVoiceCall(false);
                          setIsVoiceChatOpen(false);
                          setIsMuted(false);
                          toast({
                            title: 'Call Ended',
                            description: 'You have left the voice call',
                          });
                        }}
                        className="flex-1 gap-2"
                        size="lg"
                      >
                        <PhoneOff className="h-5 w-5" />
                        Leave Call
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      💡 Voice calls are simulated. Full voice functionality requires WebRTC integration.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
