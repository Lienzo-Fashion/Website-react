import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  updateProfile,
  getRedirectResult,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithGooglePopup } from '../services/authService';

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  photoURL?: string;
  phone?: string;
  addresses?: any[];
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
  initAuthListener: () => void;
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
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      let userData: UserData;
      if (userDoc.exists()) {
        userData = userDoc.data() as UserData;
      } else {
        // fallback if user data is missing in Firestore
        userData = await retrieveUserData(result.user);
      }
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
      // Default role is 'user', but you can manually set 'admin' in Firestore if needed
      const userData: UserData = {
        uid: result.user.uid,
        email,
        name,
        role: 'user',
      };
      // Store user data in Firestore
      await setDoc(doc(db, 'users', result.user.uid), userData);
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
        // Check if user exists in Firestore
        const userRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userRef);
        let userData: UserData;
        if (userDoc.exists()) {
          userData = userDoc.data() as UserData;
        } else {
          userData = {
          uid: result.user.uid,
          email: result.user.email || '',
          name: result.user.displayName || 'Google User',
          role: 'user',
          photoURL: result.user.photoURL || undefined,
        };
          await setDoc(userRef, userData);
        }
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
        // Check if user exists in Firestore
        const userRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userRef);
        let userData: UserData;
        if (userDoc.exists()) {
          userData = userDoc.data() as UserData;
        } else {
          userData = {
          uid: result.user.uid,
          email: result.user.email || '',
          name: result.user.displayName || 'Google User',
          role: 'user',
          photoURL: result.user.photoURL || undefined,
        };
          await setDoc(userRef, userData);
        }
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
      // Update user data in Firestore
      await setDoc(doc(db, 'users', data.uid), data, { merge: true });
      set({ userData: data });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  loadUserFromLocalStorage: () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Fetch user data from Firestore
      getDoc(doc(db, 'users', currentUser.uid)).then((userDoc) => {
        if (userDoc.exists()) {
          set({ user: currentUser, userData: userDoc.data() as UserData });
        }
      });
    }
  },

  setError: (error: string | null) => set({ error }),

  initAuthListener: () => {
    set({ isLoading: true });
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          set({ user: firebaseUser, userData: userDoc.data() as UserData, isLoading: false });
        } else {
          set({ user: firebaseUser, userData: null, isLoading: false });
        }
      } else {
        set({ user: null, userData: null, isLoading: false });
      }
    });
  },
}));

async function retrieveUserData(user: User): Promise<UserData> {
  // Try to fetch from Firestore first
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }
  return {
    uid: user.uid,
    email: user.email || '',
    name: user.displayName || 'User',
    role: 'user',
    photoURL: user.photoURL || undefined,
  };
}
