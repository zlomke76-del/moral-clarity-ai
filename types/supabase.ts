<<<<<<< HEAD
﻿export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      entitlements: {
        Row: {
          allowed_modes: string[] | null
          memory_cap_mb: number | null
          ministry_mode: boolean | null
          minor_limits: Json | null
          model_max: string | null
          rate_limits: Json | null
          seat_limit: number | null
          seats: number
          tier: Database["public"]["Enums"]["tier_t"] | null
          updated_at: string | null
          workspace_id: string
          zero_knowledge: boolean | null
        }
        Insert: {
          allowed_modes?: string[] | null
          memory_cap_mb?: number | null
          ministry_mode?: boolean | null
          minor_limits?: Json | null
          model_max?: string | null
          rate_limits?: Json | null
          seat_limit?: number | null
          seats?: number
          tier?: Database["public"]["Enums"]["tier_t"] | null
          updated_at?: string | null
          workspace_id: string
          zero_knowledge?: boolean | null
        }
        Update: {
          allowed_modes?: string[] | null
          memory_cap_mb?: number | null
          ministry_mode?: boolean | null
          minor_limits?: Json | null
          model_max?: string | null
          rate_limits?: Json | null
          seat_limit?: number | null
          seats?: number
          tier?: Database["public"]["Enums"]["tier_t"] | null
          updated_at?: string | null
          workspace_id?: string
          zero_knowledge?: boolean | null
        }
        Relationships: []
      }
      folders: {
        Row: {
          created_at: string
          id: string
          name: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "folders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "folders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          author_user_id: string | null
          bucket_id: string | null
          content: string
          created_at: string
          id: string
          source: Json | null
          tags: string[] | null
          tokens: number | null
          user_id: string
          visibility: Database["public"]["Enums"]["vis_t"] | null
          workspace_id: string | null
        }
        Insert: {
          author_user_id?: string | null
          bucket_id?: string | null
          content: string
          created_at?: string
          id?: string
          source?: Json | null
          tags?: string[] | null
          tokens?: number | null
          user_id: string
          visibility?: Database["public"]["Enums"]["vis_t"] | null
          workspace_id?: string | null
        }
        Update: {
          author_user_id?: string | null
          bucket_id?: string | null
          content?: string
          created_at?: string
          id?: string
          source?: Json | null
          tags?: string[] | null
          tokens?: number | null
          user_id?: string
          visibility?: Database["public"]["Enums"]["vis_t"] | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_memories_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_memories_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_memories_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_buckets: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          name: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_mb_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_mb_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_mb_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_buckets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "memory_buckets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "memory_buckets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          author: string | null
          content: string
          created_at: string
          id: string
          role: string
          thread_id: string
          workspace_id: string | null
        }
        Insert: {
          attachments?: Json | null
          author?: string | null
          content: string
          created_at?: string
          id?: string
          role: string
          thread_id: string
          workspace_id?: string | null
        }
        Update: {
          attachments?: Json | null
          author?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          thread_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_messages_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_messages_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      model_access: {
        Row: {
          last_updated: string
          max_model: string
          modes_allowed: string[]
          workspace_id: string
        }
        Insert: {
          last_updated?: string
          max_model: string
          modes_allowed?: string[]
          workspace_id: string
        }
        Update: {
          last_updated?: string
          max_model?: string
          modes_allowed?: string[]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_access_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "model_access_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "model_access_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string | null
          org_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          org_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          org_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          plan: string | null
          seat_limit: number | null
          stripe_customer_id: string | null
          verified_ministry: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          plan?: string | null
          seat_limit?: number | null
          stripe_customer_id?: string | null
          verified_ministry?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          plan?: string | null
          seat_limit?: number | null
          stripe_customer_id?: string | null
          verified_ministry?: boolean | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_total: number | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          description: string | null
          id: string
          invoice_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount_total?: number | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          description?: string | null
          id: string
          invoice_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount_total?: number | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "effective_caps"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "entitlements_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "me"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_billing_snapshot"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_billing"
            referencedColumns: ["user_id"]
          },
        ]
      }
      personas: {
        Row: {
          capabilities: Json
          created_at: string | null
          disclaimer: string | null
          is_default: boolean | null
          mode: Database["public"]["Enums"]["mode_t"] | null
          name: string
          plan_min: string
          prompt: Json | null
          slug: string
          style: string
          system_prompt: string
          workspace_id: string | null
        }
        Insert: {
          capabilities?: Json
          created_at?: string | null
          disclaimer?: string | null
          is_default?: boolean | null
          mode?: Database["public"]["Enums"]["mode_t"] | null
          name: string
          plan_min?: string
          prompt?: Json | null
          slug: string
          style: string
          system_prompt: string
          workspace_id?: string | null
        }
        Update: {
          capabilities?: Json
          created_at?: string | null
          disclaimer?: string | null
          is_default?: boolean | null
          mode?: Database["public"]["Enums"]["mode_t"] | null
          name?: string
          plan_min?: string
          prompt?: Json | null
          slug?: string
          style?: string
          system_prompt?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_personas_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_personas_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_personas_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          care_level: string | null
          current_period_end: string | null
          display_name: string | null
          email: string | null
          founders_bonus: boolean | null
          id: string
          invited_at: string | null
          last_login_link_sent_at: string | null
          memory_quota_mb: number | null
          memory_used_mb: number | null
          onboarded_at: string | null
          org_id: string | null
          plan: string | null
          pro: boolean | null
          role: string | null
          seat_count: number | null
          stripe_customer_id: string | null
          verified_ministry: boolean | null
        }
        Insert: {
          care_level?: string | null
          current_period_end?: string | null
          display_name?: string | null
          email?: string | null
          founders_bonus?: boolean | null
          id: string
          invited_at?: string | null
          last_login_link_sent_at?: string | null
          memory_quota_mb?: number | null
          memory_used_mb?: number | null
          onboarded_at?: string | null
          org_id?: string | null
          plan?: string | null
          pro?: boolean | null
          role?: string | null
          seat_count?: number | null
          stripe_customer_id?: string | null
          verified_ministry?: boolean | null
        }
        Update: {
          care_level?: string | null
          current_period_end?: string | null
          display_name?: string | null
          email?: string | null
          founders_bonus?: boolean | null
          id?: string
          invited_at?: string | null
          last_login_link_sent_at?: string | null
          memory_quota_mb?: number | null
          memory_used_mb?: number | null
          onboarded_at?: string | null
          org_id?: string | null
          plan?: string | null
          pro?: boolean | null
          role?: string | null
          seat_count?: number | null
          stripe_customer_id?: string | null
          verified_ministry?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          status: Database["public"]["Enums"]["status_t"] | null
          subscription_id: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          status?: Database["public"]["Enums"]["status_t"] | null
          subscription_id: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          status?: Database["public"]["Enums"]["status_t"] | null
          subscription_id?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_projects_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_projects_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_subscription_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["stripe_subscription_id"]
          },
          {
            foreignKeyName: "projects_subscription_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "v_user_billing"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      shared_nodes: {
        Row: {
          created_at: string
          extra: Json
          id: string
          source_user: string
          space_id: string
          summary: string | null
          tags: string[] | null
          title: string
          vector_ref: string | null
          visibility: string
        }
        Insert: {
          created_at?: string
          extra?: Json
          id?: string
          source_user: string
          space_id: string
          summary?: string | null
          tags?: string[] | null
          title: string
          vector_ref?: string | null
          visibility?: string
        }
        Update: {
          created_at?: string
          extra?: Json
          id?: string
          source_user?: string
          space_id?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          vector_ref?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_nodes_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "my_spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_nodes_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      space_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_by: string
          email: string
          expires_at: string
          id: string
          role: string
          space_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_by: string
          email: string
          expires_at: string
          id?: string
          role: string
          space_id: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_by?: string
          email?: string
          expires_at?: string
          id?: string
          role?: string
          space_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "space_invites_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "my_spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_invites_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      space_members: {
        Row: {
          joined_at: string
          role: string
          space_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          role: string
          space_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          role?: string
          space_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "space_members_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "my_spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_members_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      space_memberships: {
        Row: {
          created_at: string
          role: string
          space_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          space_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          space_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "space_memberships_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "my_spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_memberships_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      space_messages: {
        Row: {
          attachments: Json
          content: string | null
          created_at: string
          id: string
          is_ai: boolean
          space_id: string
          user_id: string | null
        }
        Insert: {
          attachments?: Json
          content?: string | null
          created_at?: string
          id?: string
          is_ai?: boolean
          space_id: string
          user_id?: string | null
        }
        Update: {
          attachments?: Json
          content?: string | null
          created_at?: string
          id?: string
          is_ai?: boolean
          space_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "space_messages_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "my_spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_messages_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean
          name: string
          owner_id: string | null
          topic: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          owner_id?: string | null
          topic?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          owner_id?: string | null
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          email: string | null
          id: number
          stripe_customer_id: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          stripe_customer_id?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          stripe_customer_id?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          is_active: boolean | null
          price_id: string | null
          quantity: number | null
          seats: number | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated: string | null
          updated_at: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id: string
          is_active?: boolean | null
          price_id?: string | null
          quantity?: number | null
          seats?: number | null
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated?: string | null
          updated_at?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_active?: boolean | null
          price_id?: string | null
          quantity?: number | null
          seats?: number | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated?: string | null
          updated_at?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_subscriptions_scid_fkey"
            columns: ["stripe_customer_id"]
            isOneToOne: false
            referencedRelation: "stripe_customers"
            referencedColumns: ["stripe_customer_id"]
          },
          {
            foreignKeyName: "stripe_subscriptions_workspace_fk"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "stripe_subscriptions_workspace_fk"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "stripe_subscriptions_workspace_fk"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_ledger: {
        Row: {
          id: string
          received_at: string | null
          type: string | null
        }
        Insert: {
          id: string
          received_at?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          received_at?: string | null
          type?: string | null
        }
        Relationships: []
      }
      sub_members: {
        Row: {
          joined_at: string
          subscription_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          subscription_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_members_subscription_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["stripe_subscription_id"]
          },
          {
            foreignKeyName: "sub_members_subscription_fk"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "v_user_billing"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          customer_id: string | null
          grace_until: string | null
          invite_token: string | null
          kind: string | null
          last_payment_id: string | null
          plan: string | null
          plan_name: string | null
          price_id: string | null
          quantity: number | null
          seats: number
          seats_claimed: number
          seats_max: number | null
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string | null
          grace_until?: string | null
          invite_token?: string | null
          kind?: string | null
          last_payment_id?: string | null
          plan?: string | null
          plan_name?: string | null
          price_id?: string | null
          quantity?: number | null
          seats?: number
          seats_claimed?: number
          seats_max?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string | null
          grace_until?: string | null
          invite_token?: string | null
          kind?: string | null
          last_payment_id?: string | null
          plan?: string | null
          plan_name?: string | null
          price_id?: string | null
          quantity?: number | null
          seats?: number
          seats_claimed?: number
          seats_max?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          message: string
          sender: string
          support_request_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          message: string
          sender: string
          support_request_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          message?: string
          sender?: string
          support_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_support_request_id_fkey"
            columns: ["support_request_id"]
            isOneToOne: false
            referencedRelation: "support_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_support_request_id_fkey"
            columns: ["support_request_id"]
            isOneToOne: false
            referencedRelation: "v_support_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      support_replies: {
        Row: {
          author: string
          body: string
          created_at: string | null
          id: string
          request_id: string
        }
        Insert: {
          author: string
          body: string
          created_at?: string | null
          id?: string
          request_id: string
        }
        Update: {
          author?: string
          body?: string
          created_at?: string | null
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_replies_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "support_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_replies_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "v_support_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      support_requests: {
        Row: {
          attachment_url: string | null
          auto_resolved: boolean | null
          body: string | null
          category: string
          created_at: string | null
          description: string
          email: string
          id: string
          name: string | null
          needs_human: boolean | null
          priority: string
          status: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          auto_resolved?: boolean | null
          body?: string | null
          category?: string
          created_at?: string | null
          description: string
          email: string
          id?: string
          name?: string | null
          needs_human?: boolean | null
          priority?: string
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          auto_resolved?: boolean | null
          body?: string | null
          category?: string
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          name?: string | null
          needs_human?: boolean | null
          priority?: string
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      support_routing: {
        Row: {
          assignee: string
          category: string
        }
        Insert: {
          assignee: string
          category: string
        }
        Update: {
          assignee?: string
          category?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          created_at: string
          created_by: string | null
          faith_lens_override: string | null
          folder_id: string | null
          id: string
          last_activity_at: string | null
          mode: Database["public"]["Enums"]["mode_t"] | null
          persona_slug: string
          project_id: string | null
          title: string | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          faith_lens_override?: string | null
          folder_id?: string | null
          id?: string
          last_activity_at?: string | null
          mode?: Database["public"]["Enums"]["mode_t"] | null
          persona_slug?: string
          project_id?: string | null
          title?: string | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          faith_lens_override?: string | null
          folder_id?: string | null
          id?: string
          last_activity_at?: string | null
          mode?: Database["public"]["Enums"]["mode_t"] | null
          persona_slug?: string
          project_id?: string | null
          title?: string | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_threads_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_threads_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "fk_threads_ws"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_caps: {
        Row: {
          cap: string
          manual_override: boolean
          max_members_per_space: number
          max_spaces: number
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          cap: string
          manual_override?: boolean
          max_members_per_space?: number
          max_spaces?: number
          updated_at?: string | null
          user_id: string
          value: number
        }
        Update: {
          cap?: string
          manual_override?: boolean
          max_members_per_space?: number
          max_spaces?: number
          updated_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      user_memories: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          expires_at: string | null
          id: string
          kind: string
          updated_at: string
          user_key: string
          weight: number
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          expires_at?: string | null
          id?: string
          kind: string
          updated_at?: string
          user_key: string
          weight?: number
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          expires_at?: string | null
          id?: string
          kind?: string
          updated_at?: string
          user_key?: string
          weight?: number
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          apply_faith_globally: boolean
          faith_lens: string
          scripture_version: string
          updated_at: string
          user_id: string
        }
        Insert: {
          apply_faith_globally?: boolean
          faith_lens?: string
          scripture_version?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          apply_faith_globally?: boolean
          faith_lens?: string
          scripture_version?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stripe_customers: {
        Row: {
          customer_id: string
          user_id: string | null
        }
        Insert: {
          customer_id: string
          user_id?: string | null
        }
        Update: {
          customer_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "effective_caps"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "entitlements_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "me"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_billing_snapshot"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_billing"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          plan: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          plan?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          plan?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          joined_at: string
          role: Database["public"]["Enums"]["role_t"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          joined_at?: string
          role?: Database["public"]["Enums"]["role_t"]
          user_id: string
          workspace_id: string
        }
        Update: {
          joined_at?: string
          role?: Database["public"]["Enums"]["role_t"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_entitlement_status"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "v_workspace_seat_usage"
            referencedColumns: ["workspace_id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      effective_caps: {
        Row: {
          cap_name: string | null
          cap_value_mb: number | null
          email: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      entitlements_view: {
        Row: {
          access_until: string | null
          plan: string | null
          seats: number | null
          status: string | null
          user_id: string | null
        }
        Relationships: []
      }
      me: {
        Row: {
          display_name: string | null
          email: string | null
          id: string | null
          onboarded_at: string | null
          role: string | null
        }
        Insert: {
          display_name?: string | null
          email?: string | null
          id?: string | null
          onboarded_at?: string | null
          role?: string | null
        }
        Update: {
          display_name?: string | null
          email?: string | null
          id?: string | null
          onboarded_at?: string | null
          role?: string | null
        }
        Relationships: []
      }
      my_spaces: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_public: boolean | null
          name: string | null
          owner_id: string | null
          topic: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      space_feed: {
        Row: {
          attachments: Json | null
          content: string | null
          created_at: string | null
          id: string | null
          is_ai: boolean | null
          space_id: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_ai?: boolean | null
          space_id?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_ai?: boolean | null
          space_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "space_messages_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "my_spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_messages_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_billing_snapshot: {
        Row: {
          email: string | null
          last_payment_at: string | null
          stripe_customer_id: string | null
          total_payments: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_entitlement_status: {
        Row: {
          current_users: number | null
          expires_at: string | null
          memory_cap_mb: number | null
          model_max: string | null
          seat_limit: number | null
          seats_remaining: number | null
          tier: Database["public"]["Enums"]["tier_t"] | null
          updated_at: string | null
          workspace_id: string | null
        }
        Relationships: []
      }
      v_my_payments: {
        Row: {
          amount_total: number | null
          amount_usd: number | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          invoice_id: string | null
          normalized_status: string | null
          payment_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_total?: number | null
          amount_usd?: never
          created_at?: string | null
          currency?: never
          customer_id?: string | null
          invoice_id?: string | null
          normalized_status?: never
          payment_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_total?: number | null
          amount_usd?: never
          created_at?: string | null
          currency?: never
          customer_id?: string | null
          invoice_id?: string | null
          normalized_status?: never
          payment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "effective_caps"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "entitlements_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "me"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_billing_snapshot"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_billing"
            referencedColumns: ["user_id"]
          },
        ]
      }
      v_payments_admin: {
        Row: {
          amount_total: number | null
          amount_usd: number | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          invoice_id: string | null
          latest_subscription_status: string | null
          normalized_status: string | null
          payment_id: string | null
          raw_status: string | null
          user_email: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "effective_caps"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "entitlements_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "me"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_billing_snapshot"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_billing"
            referencedColumns: ["user_id"]
          },
        ]
      }
      v_support_requests: {
        Row: {
          age: unknown
          category: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string | null
          name: string | null
          priority: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          age?: never
          category?: string | null
          created_at?: string | null
          description?: string | null
          email?: never
          id?: string | null
          name?: never
          priority?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          age?: never
          category?: string | null
          created_at?: string | null
          description?: string | null
          email?: never
          id?: string | null
          name?: never
          priority?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      v_user_billing: {
        Row: {
          cancel_at_period_end: boolean | null
          current_period_end: string | null
          current_period_start: string | null
          email: string | null
          grace_until: string | null
          kind: string | null
          last_amount: number | null
          last_payment_at: string | null
          plan: string | null
          stripe_customer_id: string | null
          sub_status: string | null
          subscription_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_user_space_counts: {
        Row: {
          spaces_owned: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_workspace_seat_usage: {
        Row: {
          seats_used: number | null
          workspace_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_member: {
        Args: { p_role?: string; p_space: string; p_user: string }
        Returns: undefined
      }
      admin_create_space: {
        Args: {
          p_description: string
          p_is_public: boolean
          p_name: string
          p_topic: string
          p_user_id: string
        }
        Returns: string
      }
      api_add_member: {
        Args: { p_role?: string; p_space_id: string; p_user_id: string }
        Returns: undefined
      }
      api_create_space: {
        Args: {
          p_description?: string
          p_is_public?: boolean
          p_name: string
          p_topic?: string
        }
        Returns: string
      }
      can_add_memory: { Args: { p_uid: string }; Returns: boolean }
      cleanup_expired_entitlements: { Args: never; Returns: undefined }
      create_space: {
        Args: {
          p_description: string
          p_is_public: boolean
          p_name: string
          p_topic: string
        }
        Returns: string
      }
      debug_uid: { Args: never; Returns: string }
      decrement_memory_quota: {
        Args: { p_delta_gb: number; p_user_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["role_t"]
          _uid: string
          _ws: string
        }
        Returns: boolean
      }
      increment_memory_quota: {
        Args: { p_delta_gb: number; p_user_id: string }
        Returns: undefined
      }
      is_pro: { Args: { p_uid: string }; Returns: boolean }
      is_space_member: { Args: { p_space: string }; Returns: boolean }
      is_space_owner: { Args: { p_space: string }; Returns: boolean }
      is_user_in_workspace: { Args: { sub_id: string }; Returns: boolean }
      is_workspace_member: {
        Args: { _uid: string; _ws: string }
        Returns: boolean
      }
      leave_space: { Args: { p_space: string }; Returns: undefined }
      match_user_memories: {
        Args: {
          p_match_count?: number
          p_query_embedding: string
          p_user_key: string
        }
        Returns: {
          content: string
          id: string
          kind: string
          similarity: number
          weight: number
        }[]
      }
      memory_usage: { Args: { uid: string }; Returns: number }
      post_message: {
        Args: { p_attachments?: Json; p_content: string; p_space: string }
        Returns: string
      }
      seats_remaining: { Args: { _ws: string }; Returns: number }
      set_memory_addon_quota: {
        Args: { p_gb_per_unit?: number; p_units: number; p_user_id: string }
        Returns: undefined
      }
      set_model_access: {
        Args: { _max_model: string; _modes: string[]; _workspace_id: string }
        Returns: undefined
      }
      share_node: {
        Args: {
          p_extra?: Json
          p_space: string
          p_summary: string
          p_tags?: string[]
          p_title: string
          p_vector_ref?: string
          p_visibility?: string
        }
        Returns: string
      }
    }
    Enums: {
      mode_t: "create" | "next_steps" | "red_team" | "ministry" | "neutral"
      role_t: "owner" | "admin" | "member" | "viewer"
      status_t: "active" | "parked" | "archived"
      support_status: "open" | "in_progress" | "resolved"
      tier_t: "family" | "ministry" | "business" | "plus" | "enterprise"
      vis_t: "workspace" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mode_t: ["create", "next_steps", "red_team", "ministry", "neutral"],
      role_t: ["owner", "admin", "member", "viewer"],
      status_t: ["active", "parked", "archived"],
      support_status: ["open", "in_progress", "resolved"],
      tier_t: ["family", "ministry", "business", "plus", "enterprise"],
      vis_t: ["workspace", "private"],
    },
  },
} as const
=======
// types/supabase.ts
// Minimal placeholder. Replace with real generated types when available.
// Run (example):
//   supabase gen types typescript --project-id <id> --schema public > types/supabase.ts
// and export `Database`.

export type Database = any;
>>>>>>> 7ecd048aa320dc75b3e6028cbdbba0a37155b083
