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
      calls: {
        Row: {
          attended: boolean | null
          created_at: string | null
          date: string
          duration: number
          id: number
          link: string | null
          number: number
          opportunity_id: number
          type: Database["public"]["Enums"]["call_type"]
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          created_at?: string | null
          date: string
          duration: number
          id?: number
          link?: string | null
          number: number
          opportunity_id: number
          type: Database["public"]["Enums"]["call_type"]
          user_id: string
        }
        Update: {
          attended?: boolean | null
          created_at?: string | null
          date?: string
          duration?: number
          id?: number
          link?: string | null
          number?: number
          opportunity_id?: number
          type?: Database["public"]["Enums"]["call_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          cash_collected: number
          created_at: string | null
          id: number
          lead_source: string
          name: string
          opportunity_status: string
          proposal_status: string
          revenue: number
          salesperson_id: number
          user_id: string
        }
        Insert: {
          cash_collected?: number
          created_at?: string | null
          id?: number
          lead_source: string
          name: string
          opportunity_status?: string
          proposal_status?: string
          revenue?: number
          salesperson_id: number
          user_id: string
        }
        Update: {
          cash_collected?: number
          created_at?: string | null
          id?: number
          lead_source?: string
          name?: string
          opportunity_status?: string
          proposal_status?: string
          revenue?: number
          salesperson_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_salesperson_id_fkey"
            columns: ["salesperson_id"]
            isOneToOne: false
            referencedRelation: "salespeople"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          linkedin_url: string | null
          name: string
          opportunity_id: number
          phone: string | null
          position: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          opportunity_id: number
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          opportunity_id?: number
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_contacts_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          opportunity_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          opportunity_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          opportunity_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_files_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_notes: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          opportunity_id: number
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          opportunity_id: number
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          opportunity_id?: number
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_notes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      salespeople: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      call_type:
        | "Discovery 1"
        | "Discovery 2"
        | "Discovery 3"
        | "Closing 1"
        | "Closing 2"
        | "Closing 3"
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
    Enums: {
      call_type: [
        "Discovery 1",
        "Discovery 2",
        "Discovery 3",
        "Closing 1",
        "Closing 2",
        "Closing 3",
      ],
    },
  },
} as const
