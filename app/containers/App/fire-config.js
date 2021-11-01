import firebase from 'firebase/app';
import 'firebase/auth';
import { FIREBASE_CONFIG } from '../../config/constants';

//firebase.initializeApp(FIREBASE_CONFIG);
!firebase.apps.length ? firebase.initializeApp(FIREBASE_CONFIG) : firebase.app()

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
