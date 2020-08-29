import firebase from 'firebase/app';
import 'firebase/auth';
import { FIREBASE_CONFIG } from '../../config/constants';

firebase.initializeApp(FIREBASE_CONFIG);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
