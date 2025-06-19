
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { sendSampleRequest, sendSupplierEmail } from '@/lib/emailService';

interface SampleRequestData {
  fabricId: string;
  fabricName: string;
  supplierName: string;
  supplierEmail: string;
  quantity: number;
  address: string;
  urgency: 'standard' | 'urgent' | 'rush';
  notes?: string;
}

interface ReservationData {
  fabricId: string;
  fabricName: string;
  supplierName: string;
  supplierEmail: string;
  yards: number;
  duration: number; // days
  notes?: string;
}

export const useSampleRequest = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SampleRequestData) => {
      if (!user) throw new Error('User must be logged in');

      const requestData = {
        ...data,
        user_id: user.id,
        buyer_name: user.email?.split('@')[0] || 'User',
        buyer_email: user.email || '',
        buyer_company: user.user_metadata?.company || 'N/A',
        status: 'pending'
      };

      if (isSupabaseConfigured) {
        // Save to database
        const { error } = await supabase
          .from('sample_requests')
          .insert(requestData);

        if (error) throw error;
      }

      // Send email to supplier
      await sendSampleRequest({
        supplierName: data.supplierName,
        supplierEmail: data.supplierEmail,
        buyerName: requestData.buyer_name,
        buyerEmail: requestData.buyer_email,
        buyerCompany: requestData.buyer_company,
        fabricName: data.fabricName,
        fabricId: data.fabricId,
        quantity: data.quantity,
        address: data.address,
        urgency: data.urgency,
        notes: data.notes
      });

      return requestData;
    },
    onSuccess: () => {
      toast({
        title: 'Sample Request Sent',
        description: 'Your sample request has been sent to the supplier. They will contact you shortly.',
      });
      queryClient.invalidateQueries({ queryKey: ['sample-requests'] });
    },
    onError: (error) => {
      console.error('Sample request error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send sample request. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useReserveYardage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReservationData) => {
      if (!user) throw new Error('User must be logged in');

      const reservationData = {
        ...data,
        user_id: user.id,
        buyer_name: user.email?.split('@')[0] || 'User',
        buyer_email: user.email || '',
        buyer_company: user.user_metadata?.company || 'N/A',
        status: 'pending',
        expires_at: new Date(Date.now() + data.duration * 24 * 60 * 60 * 1000).toISOString()
      };

      if (isSupabaseConfigured) {
        // Save to database
        const { error } = await supabase
          .from('reservations')
          .insert(reservationData);

        if (error) throw error;
      }

      // Send email to supplier
      await sendSupplierEmail({
        supplierName: data.supplierName,
        supplierEmail: data.supplierEmail,
        buyerName: reservationData.buyer_name,
        buyerEmail: reservationData.buyer_email,
        buyerCompany: reservationData.buyer_company,
        subject: `Yardage Reservation Request for ${data.fabricName}`,
        message: `I would like to reserve ${data.yards} yards of ${data.fabricName} for ${data.duration} days.\n\n${data.notes || ''}`,
        fabricName: data.fabricName,
        fabricId: data.fabricId
      });

      return reservationData;
    },
    onSuccess: () => {
      toast({
        title: 'Reservation Request Sent',
        description: 'Your yardage reservation request has been sent to the supplier.',
      });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error) => {
      console.error('Reservation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reservation request. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useContactSupplier = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      supplierName: string;
      supplierEmail: string;
      subject: string;
      message: string;
      fabricName?: string;
      fabricId?: string;
    }) => {
      if (!user) throw new Error('User must be logged in');

      await sendSupplierEmail({
        supplierName: data.supplierName,
        supplierEmail: data.supplierEmail,
        buyerName: user.email?.split('@')[0] || 'User',
        buyerEmail: user.email || '',
        buyerCompany: user.user_metadata?.company || 'N/A',
        subject: data.subject,
        message: data.message,
        fabricName: data.fabricName,
        fabricId: data.fabricId
      });

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the supplier.',
      });
    },
    onError: (error) => {
      console.error('Contact supplier error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
