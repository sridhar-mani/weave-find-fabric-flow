
-- Create conversations table for messaging
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_email TEXT NOT NULL,
  fabric_id TEXT,
  fabric_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url TEXT
);

-- Create quote_requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rfq_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_email TEXT NOT NULL,
  material_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'accepted', 'rejected', 'expired')),
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  price_value DECIMAL,
  price_currency TEXT DEFAULT 'USD',
  price_per_unit BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  has_attachments BOOLEAN DEFAULT false,
  has_unread_messages BOOLEAN DEFAULT false
);

-- Create sample_requests table (enhanced version)
CREATE TABLE public.sample_requests_new (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fabric_id TEXT NOT NULL,
  fabric_name TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_email TEXT NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_company TEXT,
  quantity INTEGER NOT NULL,
  address TEXT NOT NULL,
  urgency TEXT DEFAULT 'standard' CHECK (urgency IN ('standard', 'urgent', 'rush')),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'shipped')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table (enhanced version)
CREATE TABLE public.reservations_new (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fabric_id TEXT NOT NULL,
  fabric_name TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_email TEXT NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_company TEXT,
  yards INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- days
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_requests_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations_new ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversations
CREATE POLICY "Users can view their own conversations" 
  ON public.conversations 
  FOR SELECT 
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create conversations" 
  ON public.conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their conversations" 
  ON public.messages 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND conversations.buyer_id = auth.uid()
  ));

CREATE POLICY "Users can create messages in their conversations" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND conversations.buyer_id = auth.uid()
  ));

-- Create RLS policies for quote_requests
CREATE POLICY "Users can view their own quote requests" 
  ON public.quote_requests 
  FOR SELECT 
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create quote requests" 
  ON public.quote_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own quote requests" 
  ON public.quote_requests 
  FOR UPDATE 
  USING (auth.uid() = buyer_id);

-- Create RLS policies for sample_requests_new
CREATE POLICY "Users can view their own sample requests" 
  ON public.sample_requests_new 
  FOR SELECT 
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create sample requests" 
  ON public.sample_requests_new 
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

-- Create RLS policies for reservations_new
CREATE POLICY "Users can view their own reservations" 
  ON public.reservations_new 
  FOR SELECT 
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create reservations" 
  ON public.reservations_new 
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

-- Create indexes for better performance
CREATE INDEX idx_conversations_buyer_id ON public.conversations(buyer_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_quote_requests_buyer_id ON public.quote_requests(buyer_id);
CREATE INDEX idx_sample_requests_buyer_id ON public.sample_requests_new(buyer_id);
CREATE INDEX idx_reservations_buyer_id ON public.reservations_new(buyer_id);
