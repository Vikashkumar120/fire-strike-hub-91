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
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          game_name: string
          id: string
          joined_at: string | null
          payment_data: Json | null
          payment_method: string | null
          result: string | null
          result_marked_at: string | null
          result_screenshot: string | null
          slot_number: number | null
          teammates: Json | null
          tournament_id: string | null
          uid: string
          user_id: string | null
          whatsapp_number: string
        }
        Insert: {
          game_name: string
          id?: string
          joined_at?: string | null
          payment_data?: Json | null
          payment_method?: string | null
          result?: string | null
          result_marked_at?: string | null
          result_screenshot?: string | null
          slot_number?: number | null
          teammates?: Json | null
          tournament_id?: string | null
          uid: string
          user_id?: string | null
          whatsapp_number: string
        }
        Update: {
          game_name?: string
          id?: string
          joined_at?: string | null
          payment_data?: Json | null
          payment_method?: string | null
          result?: string | null
          result_marked_at?: string | null
          result_screenshot?: string | null
          slot_number?: number | null
          teammates?: Json | null
          tournament_id?: string | null
          uid?: string
          user_id?: string | null
          whatsapp_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string | null
          current_players: number | null
          custom_code: string | null
          duration: string | null
          entry_fee: number
          id: string
          map: string | null
          max_players: number
          prize: string
          start_time: string
          status: string | null
          thumbnail: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          current_players?: number | null
          custom_code?: string | null
          duration?: string | null
          entry_fee: number
          id?: string
          map?: string | null
          max_players: number
          prize: string
          start_time: string
          status?: string | null
          thumbnail?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          current_players?: number | null
          custom_code?: string | null
          duration?: string | null
          entry_fee?: number
          id?: string
          map?: string | null
          max_players?: number
          prize?: string
          start_time?: string
          status?: string | null
          thumbnail?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          admin_notes: string | null
          amount: number
          coins: number | null
          created_at: string | null
          description: string | null
          id: string
          screenshot: string | null
          status: string | null
          transaction_id: string | null
          type: string
          updated_at: string | null
          upi_id: string | null
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          coins?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          screenshot?: string | null
          status?: string | null
          transaction_id?: string | null
          type: string
          updated_at?: string | null
          upi_id?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          coins?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          screenshot?: string | null
          status?: string | null
          transaction_id?: string | null
          type?: string
          updated_at?: string | null
          upi_id?: string | null
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          coins: number | null
          created_at: string | null
          id: string
          last_daily_bonus: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          coins?: number | null
          created_at?: string | null
          id?: string
          last_daily_bonus?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          coins?: number | null
          created_at?: string | null
          id?: string
          last_daily_bonus?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
