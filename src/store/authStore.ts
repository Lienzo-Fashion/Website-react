import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  updateProfile,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { signInWithGooglePopup } from '../services/authService';

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  photoURL?: string;
  phone?: string;
}

interface AuthStore {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  handleRedirectResult: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (data: UserData) => Promise<void>;
  loadUserFromLocalStorage: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  userData: null,
  isLoading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await retrieveUserData(result.user);
      set({ user: result.user, userData, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.code === 'auth/invalid-credential' 
          ? 'Invalid email or password' 
          : error.message,
        isLoading: false 
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(result.user, { displayName: name });

      const userData: UserData = {
        uid: result.user.uid,
        email,
        name,
        role: 'user',
      };

      set({ user: result.user, userData, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.code === 'auth/email-already-in-use'
          ? 'Email already in use'
          : error.message,
        isLoading: false 
      });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await signInWithGooglePopup();
      
      if (result) {
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email || '',
          name: result.user.displayName || 'Google User',
          role: 'user',
          photoURL: result.user.photoURL || undefined,
        };

        set({ user: result.user, userData, isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.code === 'auth/popup-closed-by-user'
          ? 'Sign in was cancelled'
          : error.message,
        isLoading: false 
      });
      throw error;
    }
  },

  handleRedirectResult: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await getRedirectResult(auth);
      
      if (result) {
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email || '',
          name: result.user.displayName || 'Google User',
          role: 'user',
          photoURL: result.user.photoURL || undefined,
        };

        set({ user: result.user, userData });
      }
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, userData: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateUserData: async (data: UserData) => {
    try {
      set({ userData: data });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  loadUserFromLocalStorage: () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      retrieveUserData(currentUser).then((userData) => {
        if (userData) {
          set({ user: currentUser, userData });
        }
      });
    }
  },

  setError: (error: string | null) => set({ error }),
}));

async function retrieveUserData(user: User): Promise<UserData> {
  return {
    uid: user.uid,
    email: user.email || '',
    name: user.displayName || 'User',
    role: 'user',
    photoURL: user.photoURL || undefined,
  };
}
