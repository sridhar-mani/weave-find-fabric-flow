
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  created_at: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
}

interface ChatSystemProps {
  conversationId: string;
  supplierName: string;
  supplierEmail: string;
  open: boolean;
  onClose: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({
  conversationId,
  supplierName,
  supplierEmail,
  open,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && conversationId) {
      loadMessages();
      if (isSupabaseConfigured) {
        subscribeToMessages();
      }
    }
  }, [open, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!isSupabaseConfigured) {
      // Mock messages for demo
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hello! I\'m interested in your organic cotton fabric.',
          sender_id: user?.id || 'buyer',
          sender_name: user?.email?.split('@')[0] || 'Buyer',
          sender_email: user?.email || 'buyer@example.com',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          message_type: 'text'
        },
        {
          id: '2',
          content: 'Thank you for your interest! I\'d be happy to provide more details. What quantity are you looking for?',
          sender_id: 'supplier',
          sender_name: supplierName,
          sender_email: supplierEmail,
          created_at: new Date(Date.now() - 1800000).toISOString(),
          message_type: 'text'
        }
      ];
      setMessages(mockMessages);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive'
      });
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`conversation-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    const tempMessage: Message = {
      id: 'temp-' + Date.now(),
      content: messageContent,
      sender_id: user.id,
      sender_name: user.email?.split('@')[0] || 'You',
      sender_email: user.email || '',
      created_at: new Date().toISOString(),
      message_type: 'text'
    };

    setMessages(prev => [...prev, tempMessage]);

    if (!isSupabaseConfigured) {
      // Mock response for demo
      setTimeout(() => {
        const response: Message = {
          id: 'response-' + Date.now(),
          content: 'Thank you for your message. I\'ll get back to you shortly with the information you requested.',
          sender_id: 'supplier',
          sender_name: supplierName,
          sender_email: supplierEmail,
          created_at: new Date().toISOString(),
          message_type: 'text'
        };
        setMessages(prev => prev.map(m => m.id === tempMessage.id ? tempMessage : m).concat(response));
      }, 2000);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        content: messageContent,
        sender_id: user.id,
        sender_name: user.email?.split('@')[0] || 'User',
        sender_email: user.email,
        message_type: 'text'
      });

      if (error) throw error;

      // Send email notification to supplier
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: supplierEmail,
            subject: `New message from ${user.email?.split('@')[0]}`,
            html: `
              <div style="font-family: Arial, sans-serif;">
                <h3>New message on Weave platform</h3>
                <p><strong>From:</strong> ${user.email}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                  ${messageContent}
                </div>
                <p><a href="${window.location.origin}/messages?conversation=${conversationId}">Reply on Weave</a></p>
              </div>
            `
          }
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{supplierName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{supplierName}</div>
                <div className="text-sm text-stone-500">{supplierEmail}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender_id === user?.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-100 text-stone-900'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender_id === user?.id
                        ? 'text-amber-100'
                        : 'text-stone-500'
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={isLoading || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSystem;
