'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'merchant' | 'customer';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at?: string;
}

export interface MerchantProfile {
  merchant_id: string;
  store_name: string;
  commercial_record?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  /** Informational notice on success (e.g. email confirmation required) */
  message?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  merchantProfile: MerchantProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, password?: string) => Promise<AuthResult>;
  signup: (
    email: string,
    password?: string,
    fullName?: string,
    phone?: string,
    role?: UserRole,
    storeName?: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  setDemoUserRole: (role: UserRole) => void;
  impersonateMerchant: (merchantId: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo fallback is only allowed when Supabase is NOT configured (no real env keys).
// When Supabase is configured, auth errors must be shown to the user, never hidden.
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes('placeholder');
};

// Translate common Supabase auth errors to Arabic
const translateAuthError = (message: string): string => {
  const msg = message.toLowerCase();
  if (msg.includes('invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  if (msg.includes('email not confirmed')) return 'يرجى تأكيد بريدك الإلكتروني أولاً — تحقق من صندوق الوارد';
  if (msg.includes('user already registered')) return 'هذا البريد الإلكتروني مسجل مسبقاً، جرّب تسجيل الدخول';
  if (msg.includes('password') && msg.includes('at least')) return 'كلمة المرور قصيرة — يجب أن تكون 6 أحرف على الأقل';
  if (msg.includes('rate limit')) return 'محاولات كثيرة جداً — يرجى المحاولة بعد قليل';
  if (msg.includes('unable to validate email') || msg.includes('invalid email')) return 'صيغة البريد الإلكتروني غير صحيحة';
  return message;
};

// Initial Demo State for testing out-of-the-box before connecting Supabase DB
const MOCK_PROFILES: Record<UserRole, UserProfile> = {
  customer: {
    id: 'demo-customer-id',
    full_name: 'أحمد محمود (عميل)',
    phone: '+20 100 123 4567',
    role: 'customer',
  },
  merchant: {
    id: 'demo-merchant-id',
    full_name: 'شركة التقنية الحديثة (تاجر)',
    phone: '+20 111 987 6543',
    role: 'merchant',
  },
  admin: {
    id: 'demo-admin-id',
    full_name: 'مدير منصة تشارك (Admin)',
    phone: '+20 122 000 1111',
    role: 'admin',
  },
};

const MOCK_MERCHANT: MerchantProfile = {
  merchant_id: 'demo-merchant-id',
  store_name: 'متجر تشارك للالكترونيات',
  commercial_record: 'CR-102938475',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
        if (data.role === 'merchant') {
          const { data: mData } = await supabase
            .from('merchant_profiles')
            .select('*')
            .eq('merchant_id', userId)
            .single();
          if (mData) setMerchantProfile(mData as MerchantProfile);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          // Check local storage for persistent demo session
          const savedRole = localStorage.getItem('tasharok_demo_role') as UserRole | null;
          if (savedRole) {
            enableDemoMode(savedRole);
          }
        }
      } catch {
        // Default to demo customer mode if Supabase credentials are unavailable
        enableDemoMode('customer');
      } finally {
        setIsLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsDemoMode(false);
        await fetchProfile(session.user.id);
      } else if (!isDemoMode) {
        setUser(null);
        setProfile(null);
        setMerchantProfile(null);
      }
      setIsLoading(false);
    });

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const enableDemoMode = (role: UserRole) => {
    setIsDemoMode(true);
    const mockProfile = MOCK_PROFILES[role];
    setProfile(mockProfile);
    if (role === 'merchant') {
      setMerchantProfile(MOCK_MERCHANT);
    } else {
      setMerchantProfile(null);
    }
    setUser({
      id: mockProfile.id,
      email: `${role}@tasharok.com`,
      user_metadata: { full_name: mockProfile.full_name, role: role },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User);
    localStorage.setItem('tasharok_demo_role', role);
    document.cookie = `tasharok_demo_role=${role}; path=/; max-age=31536000`;
  };

  const setDemoUserRole = (role: UserRole) => {
    enableDemoMode(role);
  };

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Demo fallback ONLY when Supabase isn't configured; otherwise show the real error
          if (!isSupabaseConfigured()) {
            if (email.includes('admin')) setDemoUserRole('admin');
            else if (email.includes('merchant')) setDemoUserRole('merchant');
            else setDemoUserRole('customer');
            setIsLoading(false);
            return { success: true };
          }
          setIsLoading(false);
          return { success: false, error: translateAuthError(error.message) };
        }

        if (data.user) {
          setUser(data.user);
          await fetchProfile(data.user.id);
        }
        setIsLoading(false);
        return { success: true };
      }

      // Demo login
      if (email.includes('admin')) setDemoUserRole('admin');
      else if (email.includes('merchant')) setDemoUserRole('merchant');
      else setDemoUserRole('customer');
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: (err as Error).message || 'حدث خطأ في التسجيل' };
    }
  };

  const signup = async (
    email: string,
    password?: string,
    fullName: string = 'مستخدم تشارك',
    phone: string = '',
    role: UserRole = 'customer',
    storeName: string = ''
  ) => {
    setIsLoading(true);
    try {
      if (password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: role,
              store_name: storeName,
            },
          },
        });

        if (error) {
          if (!isSupabaseConfigured()) {
            setDemoUserRole(role);
            setIsLoading(false);
            return { success: true };
          }
          setIsLoading(false);
          return { success: false, error: translateAuthError(error.message) };
        }

        if (data.user) {
          // Create profile record if trigger didn't run
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            phone: phone,
            role: role,
          });

          if (role === 'merchant' && storeName) {
            await supabase.from('merchant_profiles').upsert({
              merchant_id: data.user.id,
              store_name: storeName,
            });
          }

          // Email confirmation enabled: account created but no session yet
          if (!data.session) {
            setIsLoading(false);
            return {
              success: true,
              message: 'تم إنشاء حسابك بنجاح. يرجى تأكيد بريدك الإلكتروني ثم تسجيل الدخول.',
            };
          }
        }
        setIsLoading(false);
        return { success: true };
      }

      setDemoUserRole(role);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: (err as Error).message || 'حدث خطأ أثناء الإنشاء' };
    }
  };

  const impersonateMerchant = async (merchantId: string) => {
    setIsLoading(true);
    try {
      const { data: pData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', merchantId)
        .single();

      const { data: mData } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('merchant_id', merchantId)
        .single();

      if (pData && mData) {
        setProfile({ ...pData, role: 'merchant' } as UserProfile);
        setMerchantProfile(mData as MerchantProfile);
        
        setIsDemoMode(true);
        // We override the user so that any insert queries using user.id will work as this merchant
        setUser({
          id: pData.id,
          email: `${pData.id}@tasharok.com`,
          user_metadata: { full_name: pData.full_name, role: 'merchant' },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User);

        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'التاجر غير موجود' };
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: (err as Error).message || 'حدث خطأ' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    setUser(null);
    setProfile(null);
    setMerchantProfile(null);
    setIsDemoMode(false);
    localStorage.removeItem('tasharok_demo_role');
    document.cookie = 'tasharok_demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        merchantProfile,
        isLoading,
        isDemoMode,
        login,
        signup,
        logout,
        setDemoUserRole,
        impersonateMerchant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
