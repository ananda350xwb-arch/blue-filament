import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
}

const STORAGE_CONFIG_KEY = 'blue_filament_supabase_config';

export function normalizeSupabaseUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

const DEFAULT_SUPABASE_URL = 'https://lnamfrfbwdxuihhhqzle.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYW1mcmZid2R4dWloaGhxemxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTA2NjEsImV4cCI6MjEwNDA4NjY2MX0.NbvvpNmQkQn5HVuxWywEAZjIxw_tj5l1IlIvGxz0NB0';

export function getSupabaseConfig(): SupabaseConfig {
  // 1. Try env variables
  const envUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      connected: true,
    };
  }

  // 2. Try localStorage config (set from Admin Settings UI)
  try {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const url = normalizeSupabaseUrl(parsed.url || '');
      const anonKey = (parsed.anonKey || '').trim();
      if (url && anonKey) {
        return {
          url,
          anonKey,
          connected: true,
        };
      }
    }
  } catch {
    // ignore parsing errors
  }

  // 3. Built-in default live Supabase credentials for seamless zero-config deployment
  if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY) {
    return {
      url: DEFAULT_SUPABASE_URL,
      anonKey: DEFAULT_SUPABASE_ANON_KEY,
      connected: true,
    };
  }

  return {
    url: '',
    anonKey: '',
    connected: false,
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify({ url, anonKey }));
    window.dispatchEvent(new CustomEvent('blue_filament_supabase_config_updated'));
  } catch (e) {
    console.error('Failed to save Supabase config to localStorage:', e);
  }
}

export function clearSupabaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_CONFIG_KEY);
    window.dispatchEvent(new CustomEvent('blue_filament_supabase_config_updated'));
  } catch (e) {
    console.error('Failed to clear Supabase config:', e);
  }
}

// Singleton client instance
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: false,
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export async function testSupabaseConnection(rawUrl: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const url = normalizeSupabaseUrl(rawUrl);
    if (!url.startsWith('https://') || !url.includes('supabase.co')) {
      return { success: false, message: 'URL ต้องขึ้นต้นด้วย https:// และลงท้ายด้วย .supabase.co' };
    }
    if (!anonKey || anonKey.length < 20) {
      return { success: false, message: 'anon public key ไม่ถูกต้อง' };
    }

    const testClient = createClient(url, anonKey, { auth: { persistSession: false } });
    const { error } = await testClient.from('bf_orders').select('order_id').limit(1);

    if (error) {
      // If table doesn't exist yet, it's connected to Supabase but needs SQL run
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'เชื่อมต่อ Supabase สำเร็จ! (กรุณารันไฟล์ supabase-schema.sql ใน SQL Editor ของ Supabase)',
        };
      }
      return { success: false, message: `Supabase ตอบกลับข้อผิดพลาด: ${error.message}` };
    }

    return {
      success: true,
      message: 'เชื่อมต่อ Cloud Database สำเร็จ 100%! พร้อมรับออเดอร์แบบ Real-time',
    };
  } catch (err: any) {
    return { success: false, message: `ไม่สามารถเชื่อมต่อได้: ${err.message || 'Network error'}` };
  }
}
