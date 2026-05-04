import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { FirestoreUser, UserRole } from '@/types/firestore';

export async function signUp(params: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone: string;
  licenseId?: string;
}) {
  const { user } = await createUserWithEmailAndPassword(auth, params.email, params.password);
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: params.name,
    role: params.role,
    phone: params.phone,
    ...(params.licenseId ? { licenseId: params.licenseId } : {}),
    createdAt: serverTimestamp(),
  });
  return user;
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as unknown as FirestoreUser;
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
