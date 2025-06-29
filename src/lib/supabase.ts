import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      company_data: {
        Row: {
          id: string;
          data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          data?: any;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          name: string;
          type: string;
          size: string;
          url: string;
          category: string;
          access_level: string;
          created_at: string;
          updated_at: string;
          downloads: number;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          size: string;
          url: string;
          category: string;
          access_level: string;
          created_at?: string;
          updated_at?: string;
          downloads?: number;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          size?: string;
          url?: string;
          category?: string;
          access_level?: string;
          updated_at?: string;
          downloads?: number;
        };
      };
    };
  };
}

// Authentication functions
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
};

export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}
      }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, error };
  }
};

// Helper functions for data operations
export const saveCompanyData = async (data: any) => {
  try {
    const { error } = await supabase
      .from('company_data')
      .upsert({ 
        id: 'main', 
        data,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving company data:', error);
    return { success: false, error };
  }
};

export const loadCompanyData = async () => {
  try {
    const { data, error } = await supabase
      .from('company_data')
      .select('data')
      .eq('id', 'main')
      .maybeSingle();
    
    if (error) throw error;
    return { success: true, data: data?.data || null };
  } catch (error) {
    console.error('Error loading company data:', error);
    return { success: false, error };
  }
};

export const saveDocument = async (document: any) => {
  try {
    const { error } = await supabase
      .from('documents')
      .upsert({
        ...document,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving document:', error);
    return { success: false, error };
  }
};

export const loadDocuments = async () => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error loading documents:', error);
    return { success: false, error };
  }
};

export const deleteDocument = async (id: string) => {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error };
  }
};