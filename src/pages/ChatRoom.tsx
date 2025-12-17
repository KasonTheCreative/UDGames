import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Send, MessageCircle, Users } from 'lucide-react';
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
  const [hasJoined, setHasJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages using polling (every 2 seconds)
  useEffect(() => {
    if (!hasJoined) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
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
  }, [hasJoined]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setHasJoined(true);
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
        message: newMessage.trim()
      });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      // Immediately reload messages after sending
      const { data } = await supabase
        .from('messages')
        .select('*')
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
        
        <main className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="mb-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <MessageCircle className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h1 className="mb-2 text-3xl font-bold text-foreground">Join Chat Room</h1>
                <p className="text-muted-foreground">Enter your name to start chatting</p>
              </div>

              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="text-center text-lg"
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={!username.trim()}
                >
                  <Users className="h-5 w-5" />
                  Join Chat
                </Button>
              </form>
            </CardContent>
          </Card>
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
            <h1 className="text-3xl font-bold text-foreground">Chat Room</h1>
            <p className="text-muted-foreground">Chatting as <span className="font-semibold text-primary">{username}</span></p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setHasJoined(false)}
          >
            Change Name
          </Button>
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
      </main>
    </div>
  );
}
