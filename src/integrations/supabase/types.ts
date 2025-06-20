export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cert: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id?: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          buyer_id: string
          created_at: string
          fabric_id: string | null
          fabric_name: string | null
          id: string
          supplier_email: string
          supplier_id: string
          supplier_name: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          fabric_id?: string | null
          fabric_name?: string | null
          id?: string
          supplier_email: string
          supplier_id: string
          supplier_name: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          fabric_id?: string | null
          fabric_name?: string | null
          id?: string
          supplier_email?: string
          supplier_id?: string
          supplier_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      event: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          props: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          props?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          props?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      fabric: {
        Row: {
          base_price: number | null
          code: string | null
          construction: string | null
          finishes: string[] | null
          gsm: number | null
          id: string
          inserted_at: string | null
          min_order_m: number | null
          name: string | null
          updated_at: string | null
          width_cm: number | null
        }
        Insert: {
          base_price?: number | null
          code?: string | null
          construction?: string | null
          finishes?: string[] | null
          gsm?: number | null
          id?: string
          inserted_at?: string | null
          min_order_m?: number | null
          name?: string | null
          updated_at?: string | null
          width_cm?: number | null
        }
        Update: {
          base_price?: number | null
          code?: string | null
          construction?: string | null
          finishes?: string[] | null
          gsm?: number | null
          id?: string
          inserted_at?: string | null
          min_order_m?: number | null
          name?: string | null
          updated_at?: string | null
          width_cm?: number | null
        }
        Relationships: []
      }
      fabric_cert: {
        Row: {
          cert_id: string
          fabric_id: string
          url: string | null
        }
        Insert: {
          cert_id: string
          fabric_id: string
          url?: string | null
        }
        Update: {
          cert_id?: string
          fabric_id?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fabric_cert_cert_id_fkey"
            columns: ["cert_id"]
            isOneToOne: false
            referencedRelation: "cert"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_cert_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_cert_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric_mv"
            referencedColumns: ["id"]
          },
        ]
      }
      fabric_searches: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          results_count: number | null
          search_query: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          results_count?: number | null
          search_query?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          results_count?: number | null
          search_query?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fabric_trim: {
        Row: {
          fabric_id: string
          recommended: boolean | null
          trim_id: string
        }
        Insert: {
          fabric_id: string
          recommended?: boolean | null
          trim_id: string
        }
        Update: {
          fabric_id?: string
          recommended?: boolean | null
          trim_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fabric_trim_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_trim_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fabric_trim_trim_id_fkey"
            columns: ["trim_id"]
            isOneToOne: false
            referencedRelation: "trim"
            referencedColumns: ["id"]
          },
        ]
      }
      fabrics: {
        Row: {
          care_instructions: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          material: string | null
          name: string
          pattern: string | null
          price_per_yard: number | null
          stock_quantity: number | null
          supplier: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          weight: number | null
          width: number | null
        }
        Insert: {
          care_instructions?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          material?: string | null
          name: string
          pattern?: string | null
          price_per_yard?: number | null
          stock_quantity?: number | null
          supplier?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
          width?: number | null
        }
        Update: {
          care_instructions?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          material?: string | null
          name?: string
          pattern?: string | null
          price_per_yard?: number | null
          stock_quantity?: number | null
          supplier?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
          width?: number | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          fabric_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          fabric_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          fabric_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabrics"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          file_url: string | null
          id: string
          message_type: string | null
          sender_email: string
          sender_id: string
          sender_name: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          file_url?: string | null
          id?: string
          message_type?: string | null
          sender_email: string
          sender_id: string
          sender_name: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          file_url?: string | null
          id?: string
          message_type?: string | null
          sender_email?: string
          sender_id?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      price_break: {
        Row: {
          fabric_id: string | null
          id: string
          min_meters: number | null
          price: number | null
        }
        Insert: {
          fabric_id?: string | null
          id?: string
          min_meters?: number | null
          price?: number | null
        }
        Update: {
          fabric_id?: string | null
          id?: string
          min_meters?: number | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_break_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_break_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric_mv"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          buyer_id: string
          created_at: string
          has_attachments: boolean | null
          has_unread_messages: boolean | null
          id: string
          material_type: string
          notes: string | null
          price_currency: string | null
          price_per_unit: boolean | null
          price_value: number | null
          quantity: number
          rfq_id: string
          status: string | null
          supplier_email: string
          supplier_id: string
          supplier_name: string
          target_date: string
          title: string
          unit: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          has_attachments?: boolean | null
          has_unread_messages?: boolean | null
          id?: string
          material_type: string
          notes?: string | null
          price_currency?: string | null
          price_per_unit?: boolean | null
          price_value?: number | null
          quantity: number
          rfq_id: string
          status?: string | null
          supplier_email: string
          supplier_id: string
          supplier_name: string
          target_date: string
          title: string
          unit: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          has_attachments?: boolean | null
          has_unread_messages?: boolean | null
          id?: string
          material_type?: string
          notes?: string | null
          price_currency?: string | null
          price_per_unit?: boolean | null
          price_value?: number | null
          quantity?: number
          rfq_id?: string
          status?: string | null
          supplier_email?: string
          supplier_id?: string
          supplier_name?: string
          target_date?: string
          title?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservation: {
        Row: {
          created_at: string | null
          fabric_id: string | null
          id: string
          meters: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          fabric_id?: string | null
          id?: string
          meters?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          fabric_id?: string | null
          id?: string
          meters?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric_mv"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations_new: {
        Row: {
          buyer_company: string | null
          buyer_email: string
          buyer_id: string
          buyer_name: string
          created_at: string
          duration: number
          expires_at: string
          fabric_id: string
          fabric_name: string
          id: string
          notes: string | null
          status: string | null
          supplier_email: string
          supplier_name: string
          updated_at: string
          yards: number
        }
        Insert: {
          buyer_company?: string | null
          buyer_email: string
          buyer_id: string
          buyer_name: string
          created_at?: string
          duration: number
          expires_at: string
          fabric_id: string
          fabric_name: string
          id?: string
          notes?: string | null
          status?: string | null
          supplier_email: string
          supplier_name: string
          updated_at?: string
          yards: number
        }
        Update: {
          buyer_company?: string | null
          buyer_email?: string
          buyer_id?: string
          buyer_name?: string
          created_at?: string
          duration?: number
          expires_at?: string
          fabric_id?: string
          fabric_name?: string
          id?: string
          notes?: string | null
          status?: string | null
          supplier_email?: string
          supplier_name?: string
          updated_at?: string
          yards?: number
        }
        Relationships: []
      }
      sample_request: {
        Row: {
          created_at: string | null
          id: string
          metres: number | null
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metres?: number | null
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metres?: number | null
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sample_request_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_requests_new: {
        Row: {
          address: string
          buyer_company: string | null
          buyer_email: string
          buyer_id: string
          buyer_name: string
          created_at: string
          fabric_id: string
          fabric_name: string
          id: string
          notes: string | null
          quantity: number
          status: string | null
          supplier_email: string
          supplier_name: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          address: string
          buyer_company?: string | null
          buyer_email: string
          buyer_id: string
          buyer_name: string
          created_at?: string
          fabric_id: string
          fabric_name: string
          id?: string
          notes?: string | null
          quantity: number
          status?: string | null
          supplier_email: string
          supplier_name: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          address?: string
          buyer_company?: string | null
          buyer_email?: string
          buyer_id?: string
          buyer_name?: string
          created_at?: string
          fabric_id?: string
          fabric_name?: string
          id?: string
          notes?: string | null
          quantity?: number
          status?: string | null
          supplier_email?: string
          supplier_name?: string
          updated_at?: string
          urgency?: string | null
        }
        Relationships: []
      }
      trim: {
        Row: {
          description: string | null
          id: string
          image_url: string | null
          lead_days: number | null
          min_units: number | null
          supplier_sku: string | null
          type: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          image_url?: string | null
          lead_days?: number | null
          min_units?: number | null
          supplier_sku?: string | null
          type?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          image_url?: string | null
          lead_days?: number | null
          min_units?: number | null
          supplier_sku?: string | null
          type?: string | null
        }
        Relationships: []
      }
      variant: {
        Row: {
          fabric_id: string | null
          hex: string | null
          id: string
          image_url: string | null
          label: string | null
        }
        Insert: {
          fabric_id?: string | null
          hex?: string | null
          id?: string
          image_url?: string | null
          label?: string | null
        }
        Update: {
          fabric_id?: string | null
          hex?: string | null
          id?: string
          image_url?: string | null
          label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variant_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabric_mv"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      fabric_mv: {
        Row: {
          base_price: number | null
          certs: string[] | null
          code: string | null
          construction: string | null
          doc: unknown | null
          finishes: string[] | null
          gsm: number | null
          id: string | null
          inserted_at: string | null
          min_order_m: number | null
          name: string | null
          updated_at: string | null
          width_cm: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
