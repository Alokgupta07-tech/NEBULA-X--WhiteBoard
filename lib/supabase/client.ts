import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          theme: string;
          thumbnail: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
          last_accessed_at: string;
        };
        Insert: Omit<Database['public']['Tables']['boards']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['boards']['Insert']>;
      };
      board_objects: {
        Row: {
          id: string;
          board_id: string;
          type: string;
          data: Record<string, any>;
          x: number;
          y: number;
          width: number;
          height: number;
          rotation: number;
          z_index: number;
          locked: boolean;
          locked_by: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['board_objects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['board_objects']['Insert']>;
      };
      board_members: {
        Row: {
          board_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          joined_at: string;
        };
        Insert: Database['public']['Tables']['board_members']['Row'];
        Update: Partial<Database['public']['Tables']['board_members']['Row']>;
      };
    };
  };
}
