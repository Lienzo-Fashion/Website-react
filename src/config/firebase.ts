// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';

// Define the Firebase configuration object with proper typing
const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
} = {
  apiKey: 'AIzaSyCD4zD6FQxvu3OJpImGqLZQr2znTNKfJ4Q',
  authDomain: 'lienzo-rs5809.firebaseapp.com',
  projectId: 'lienzo-rs5809',
  storageBucket: 'lienzo-rs5809.firebaseapp.com',
  messagingSenderId: '517002277434',
  appId: '1:517002277434:web:f5dacebd336df27b25fb03',
  measurementId: 'G-05JKMDHQTJ',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics with proper typing
const analytics: Analytics | null = firebaseConfig.measurementId
  ? getAnalytics(app)
  : null;

// Initialize Firebase Authentication with proper typing
const auth: Auth = getAuth(app);

// Export the auth and analytics objects
export { auth, analytics };
