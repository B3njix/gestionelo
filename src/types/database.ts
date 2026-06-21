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
      tenants: {
        Row: {
          id: string
          nombre: string
          slug: string
          config: Json | null
          activo: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          config?: Json | null
          activo?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          config?: Json | null
          activo?: boolean
          created_at?: string | null
        }
        Relationships: []
      }
      branches: {
        Row: {
          id: string
          tenant_id: string
          nombre: string
          direccion: string | null
          telefono: string | null
          activo: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          nombre: string
          direccion?: string | null
          telefono?: string | null
          activo?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string
          nombre?: string
          direccion?: string | null
          telefono?: string | null
          activo?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          id: string
          tenant_id: string | null
          nombre: string
          permissions: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          nombre: string
          permissions?: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string | null
          nombre?: string
          permissions?: Json
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string | null
          avatar_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          nombre: string
          email: string
          telefono?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          telefono?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_branch_roles: {
        Row: {
          id: string
          user_id: string
          branch_id: string
          role_id: string
          activo: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          branch_id: string
          role_id: string
          activo?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          branch_id?: string
          role_id?: string
          activo?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_branch_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_branch_roles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_branch_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      invitations: {
        Row: {
          id: string
          tenant_id: string
          branch_id: string
          role_id: string
          email: string
          token: string
          estado: string
          expira_at: string
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          branch_id: string
          role_id: string
          email: string
          token: string
          estado?: string
          expira_at: string
          created_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string
          branch_id?: string
          role_id?: string
          email?: string
          token?: string
          estado?: string
          expira_at?: string
          created_by?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          nombre: string
          tenant_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          tenant_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          tenant_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string | null
          ciudad: string | null
          tenant_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          telefono?: string | null
          ciudad?: string | null
          tenant_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          telefono?: string | null
          ciudad?: string | null
          tenant_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          nombre: string
          category_id: string | null
          precio: number
          stock_total: number
          stock_reservado: number
          imagen: string | null
          descripcion: string | null
          variantes: Json | null
          tenant_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          category_id?: string | null
          precio: number
          stock_total?: number
          stock_reservado?: number
          imagen?: string | null
          descripcion?: string | null
          variantes?: Json | null
          tenant_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          category_id?: string | null
          precio?: number
          stock_total?: number
          stock_reservado?: number
          imagen?: string | null
          descripcion?: string | null
          variantes?: Json | null
          tenant_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: string
          nombre: string
          customer_id: string | null
          fecha: string
          lugar: string | null
          invitados: number | null
          tipo: string
          estado: string
          total: number | null
          tenant_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          customer_id?: string | null
          fecha: string
          lugar?: string | null
          invitados?: number | null
          tipo: string
          estado?: string
          total?: number | null
          tenant_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          customer_id?: string | null
          fecha?: string
          lugar?: string | null
          invitados?: number | null
          tipo?: string
          estado?: string
          total?: number | null
          tenant_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      quotes: {
        Row: {
          id: string
          codigo: string
          customer_id: string | null
          event_id: string | null
          fecha: string
          estado: string
          subtotal: number
          descuento: number | null
          impuesto: number | null
          total: number
          tenant_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          codigo: string
          customer_id?: string | null
          event_id?: string | null
          fecha?: string
          estado?: string
          subtotal?: number
          descuento?: number | null
          impuesto?: number | null
          total?: number
          tenant_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          codigo?: string
          customer_id?: string | null
          event_id?: string | null
          fecha?: string
          estado?: string
          subtotal?: number
          descuento?: number | null
          impuesto?: number | null
          total?: number
          tenant_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          product_id: string | null
          nombre: string
          cantidad: number
          precio_unitario: number
          variantes: Json | null
          tenant_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          quote_id: string
          product_id?: string | null
          nombre: string
          cantidad?: number
          precio_unitario: number
          variantes?: Json | null
          tenant_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          quote_id?: string
          product_id?: string | null
          nombre?: string
          cantidad?: number
          precio_unitario?: number
          variantes?: Json | null
          tenant_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
