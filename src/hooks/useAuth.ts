import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuthState, getUserProfile, signIn, signUp, signOutUser } from '@/lib/auth';
import type { FirestoreUser, UserRole } from '@/types/firestore';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

const MOCK_USER: FirestoreUser = {
  id: 'doctor1',
  uid: 'doctor1',
  name: 'Dr. Priya Sharma',
  role: 'doctor',
  phone: '+919999000001',
  licenseId: 'MCI-2024-001',
  teamId: 'team1',
  createdAt: { toDate: () => new Date(), toMillis: () => Date.now() } as any,
};

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FirestoreUser | null>(USE_MOCK ? MOCK_USER : null);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK) return;

    const unsub = subscribeToAuthState(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signIn(email, password);
    } catch (e: any) {
      setError(e.message ?? 'Login failed');
      throw e;
    }
  };

  const signup = async (params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone: string;
    licenseId?: string;
  }) => {
    setError(null);
    try {
      await signUp(params);
    } catch (e: any) {
      setError(e.message ?? 'Sign up failed');
      throw e;
    }
  };

  const logout = async () => {
    if (USE_MOCK) {
      setProfile(null);
      return;
    }
    await signOutUser();
  };

  const isAuthenticated = USE_MOCK ? true : !!firebaseUser;

  return { firebaseUser, profile, loading, error, login, signup, logout, isAuthenticated };
}
