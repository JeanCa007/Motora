import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id ?? null;

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, province, role, created_at')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;

      if (data) {
        setProfile(data as Profile);
        return;
      }

      const metadata = session?.user?.user_metadata ?? {};
      const draft = {
        id: userId,
        full_name: typeof metadata.full_name === 'string' ? metadata.full_name : '',
        phone: typeof metadata.phone === 'string' ? metadata.phone : '',
        province: '',
      };
      const { data: created } = await supabase
        .from('profiles')
        .upsert(draft, { onConflict: 'id' })
        .select('id, full_name, phone, province, role, created_at')
        .maybeSingle();
      setProfile((created as Profile) ?? null);
    } catch {
      setProfile(null);
    }
  }, [userId, session?.user?.user_metadata]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      loading,
      signOut,
      refreshProfile: loadProfile,
    }),
    [session, profile, loading, signOut, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}