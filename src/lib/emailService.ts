
import { supabase, isSupabaseConfigured } from './supabase';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface SupplierContactData {
  supplierName: string;
  supplierEmail: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany: string;
  subject: string;
  message: string;
  fabricName?: string;
  fabricId?: string;
}

export const sendSupplierEmail = async (data: SupplierContactData) => {
  if (!isSupabaseConfigured) {
    // Mock implementation for demo
    console.log('Mock email sent:', data);
    return { success: true, messageId: 'mock-' + Date.now() };
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0;">New Inquiry from Weave Platform</h2>
      </div>
      
      <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
        <p><strong>Company:</strong> ${data.buyerCompany}</p>
        <p><strong>Contact Person:</strong> ${data.buyerName}</p>
        <p><strong>Email:</strong> ${data.buyerEmail}</p>
        
        ${data.fabricName ? `
          <h3 style="color: #374151;">Product of Interest</h3>
          <p><strong>Fabric:</strong> ${data.fabricName}</p>
          ${data.fabricId ? `<p><strong>Reference ID:</strong> ${data.fabricId}</p>` : ''}
        ` : ''}
        
        <h3 style="color: #374151;">Message</h3>
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #d97706;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This message was sent through the Weave platform. Reply directly to this email to respond to the buyer.</p>
          <p><strong>Weave</strong> - Modern Textile Sourcing Platform</p>
        </div>
      </div>
    </div>
  `;

  try {
    const { data: result, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: data.supplierEmail,
        subject: `New Inquiry: ${data.subject}`,
        html: emailHtml,
        replyTo: data.buyerEmail
      }
    });

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendSampleRequest = async (data: {
  supplierName: string;
  supplierEmail: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany: string;
  fabricName: string;
  fabricId: string;
  quantity: number;
  address: string;
  urgency: string;
  notes?: string;
}) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0;">Sample Request from Weave Platform</h2>
      </div>
      
      <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="color: #374151; margin-top: 0;">Requester Details</h3>
        <p><strong>Company:</strong> ${data.buyerCompany}</p>
        <p><strong>Contact Person:</strong> ${data.buyerName}</p>
        <p><strong>Email:</strong> ${data.buyerEmail}</p>
        
        <h3 style="color: #374151;">Sample Request Details</h3>
        <p><strong>Fabric:</strong> ${data.fabricName}</p>
        <p><strong>Reference ID:</strong> ${data.fabricId}</p>
        <p><strong>Quantity:</strong> ${data.quantity} yards</p>
        <p><strong>Urgency:</strong> ${data.urgency}</p>
        
        <h3 style="color: #374151;">Shipping Address</h3>
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px;">
          ${data.address.replace(/\n/g, '<br>')}
        </div>
        
        ${data.notes ? `
          <h3 style="color: #374151;">Additional Notes</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px;">
            ${data.notes.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This sample request was sent through the Weave platform. Reply directly to this email to confirm sample availability and shipping details.</p>
          <p><strong>Weave</strong> - Modern Textile Sourcing Platform</p>
        </div>
      </div>
    </div>
  `;

  return sendSupplierEmail({
    supplierName: data.supplierName,
    supplierEmail: data.supplierEmail,
    buyerName: data.buyerName,
    buyerEmail: data.buyerEmail,
    buyerCompany: data.buyerCompany,
    subject: `Sample Request for ${data.fabricName}`,
    message: emailHtml,
    fabricName: data.fabricName,
    fabricId: data.fabricId
  });
};
