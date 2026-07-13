export type Json =
  | string | number | boolean | null
  | { [key: string]: Json | undefined }
  | Json[]

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type BookingType   = "airport" | "tour" | "custom";
export type UserRole      = "user" | "admin";

export interface Database {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      profiles: {
        Row: {
          id:         string
          full_name:  string | null
          phone:      string | null
          role:       UserRole
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id:         string
          full_name?: string | null
          phone?:     string | null
          role?:      UserRole
          avatar_url?: string | null
        }
        Update: {
          full_name?: string | null
          phone?:     string | null
          role?:      UserRole
          avatar_url?: string | null
        }
      }
      bookings: {
        Row: {
          id:           string
          user_id:      string
          type:         BookingType
          full_name:    string
          email:        string
          phone:        string
          pickup:       string
          dropoff:      string
          scheduled_at: string
          passengers:   number
          vehicle_id:   string
          tour_slug:    string | null
          tour_name:    string | null
          total_usd:    number
          status:       BookingStatus
          notes:        string | null
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:          string
          user_id:      string
          type?:        BookingType
          full_name:    string
          email:        string
          phone:        string
          pickup:       string
          dropoff:      string
          scheduled_at: string
          passengers?:  number
          vehicle_id:   string
          tour_slug?:   string | null
          tour_name?:   string | null
          total_usd:    number
          status?:      BookingStatus
          notes?:       string | null
        }
        Update: {
          status?:  BookingStatus
          notes?:   string | null
          pickup?:  string
          dropoff?: string
        }
      }
    }
    Views:     { [_ in never]: never }
    Functions: {
      is_admin: { Args: Record<never, never>; Returns: boolean }
    }
    Enums: {
      booking_status: BookingStatus
      booking_type:   BookingType
      user_role:      UserRole
    }
    CompositeTypes: { [_ in never]: never }
  }
}

// Convenience row types
export type BookingRow  = Database["public"]["Tables"]["bookings"]["Row"]
export type ProfileRow  = Database["public"]["Tables"]["profiles"]["Row"]
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"]
