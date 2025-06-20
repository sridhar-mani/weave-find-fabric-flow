
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PageHeader from "@/components/PageHeader";
import B2BMessagingSystem, {
  Participant,
  Conversation,
  Message,
} from "@/components/B2BMessagingSystem";

const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const supplierId = searchParams.get("supplier");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Active user based on authenticated user
  const activeUser: Participant = {
    id: user?.id || "user-1",
    name: user?.email?.split('@')[0] || "User",
    email: user?.email || "user@example.com",
    role: "buyer",
    company: user?.user_metadata?.company || "My Company",
    avatar: "",
  };

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        // Fetch conversations for the current user
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('conversations')
          .select(`
            *,
            messages (
              id,
              content,
              sender_id,
              sender_name,
              sender_email,
              created_at,
              message_type,
              file_url
            )
          `)
          .eq('buyer_id', user.id)
          .order('updated_at', { ascending: false });

        if (conversationsError) throw conversationsError;

        // Transform data to match the expected format
        const transformedConversations: Conversation[] = (conversationsData || []).map(conv => ({
          id: conv.id,
          title: `Conversation with ${conv.supplier_name}`,
          participants: [
            activeUser,
            {
              id: conv.supplier_id,
              name: conv.supplier_name,
              email: conv.supplier_email,
              role: "supplier" as const,
              company: conv.supplier_name,
              avatar: "",
            }
          ],
          messages: (conv.messages || []).map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            senderId: msg.sender_id,
            timestamp: new Date(msg.created_at),
            type: msg.message_type || 'text',
            fileUrl: msg.file_url,
          })),
          createdAt: new Date(conv.created_at).toISOString(),
          lastActivity: new Date(conv.updated_at).toISOString(),
          lastMessageAt: new Date(conv.updated_at).toISOString(),
          unreadCount: 0,
          fabricId: conv.fabric_id,
          fabricName: conv.fabric_name,
        }));

        // Filter for specific supplier if requested
        const filteredConversations = supplierId
          ? transformedConversations.filter((conv) =>
              conv.participants.some((p) => p.id === supplierId)
            )
          : transformedConversations;

        setConversations(filteredConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message received:', payload);
          loadConversations(); // Reload conversations when new message arrives
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supplierId]);

  const handleSendMessage = async (conversationId: string, content: string) => {
    if (!user) return;

    try {
      // Insert new message
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content,
          sender_id: user.id,
          sender_name: user.email?.split('@')[0] || 'User',
          sender_email: user.email || '',
        });

      if (error) throw error;

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Updated to match the expected signature from B2BMessagingSystem
  const handleCreateConversation = (participants: string[], title: string, initialMessage: string) => {
    if (!user || participants.length === 0) return;
    
    // Extract supplier info from the first participant (assuming it's the supplier email)
    const supplierEmail = participants[0];
    const supplierName = title.replace('Conversation with ', '') || supplierEmail.split('@')[0];
    
    // Call the actual creation function
    createConversationWithSupplier(supplierName, supplierEmail, undefined, undefined, initialMessage);
  };

  const createConversationWithSupplier = async (supplierName: string, supplierEmail: string, fabricId?: string, fabricName?: string, initialMessage?: string) => {
    if (!user) return;

    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('supplier_email', supplierEmail)
        .eq('fabric_id', fabricId || '')
        .single();

      if (existingConv) {
        console.log('Conversation already exists');
        return;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          buyer_id: user.id,
          supplier_id: supplierEmail, // Using email as ID for now
          supplier_name: supplierName,
          supplier_email: supplierEmail,
          fabric_id: fabricId,
          fabric_name: fabricName,
        })
        .select()
        .single();

      if (error) throw error;

      // If there's an initial message, send it
      if (initialMessage && newConv) {
        await supabase
          .from('messages')
          .insert({
            conversation_id: newConv.id,
            content: initialMessage,
            sender_id: user.id,
            sender_name: user.email?.split('@')[0] || 'User',
            sender_email: user.email || '',
          });
      }

      // Reload conversations
      window.location.reload();
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Messages"
          description="View and manage your conversations"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Messages" }]}
        />
        <div className="flex items-center justify-center h-64">
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Messages"
        description="View and manage your conversations"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Messages" }]}
      />
      <B2BMessagingSystem
        conversations={conversations}
        activeUser={activeUser}
        onSendMessage={handleSendMessage}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
};

export default MessagesPage;
