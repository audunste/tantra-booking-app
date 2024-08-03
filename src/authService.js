// src/authService.js
import { auth, googleProvider } from './firebaseConfig';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Sign in with Google
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

// Sign up with Email and Password
const signUpWithEmail = async (email, password, username, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "masseurs", user.uid), {
      username,
      name,
      email
    });
    await sendEmailVerification(user);
    console.log("Verification email sent!");

    return user;

  } catch (error) {
    console.error("Error signing up: ", error);
  }
};

// Sign in with Email and Password
const signInWithEmail = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      console.log("Verification email sent!");
    }   
  } catch (error) {
    console.error("Error signing in: ", error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
  

export { signInWithGoogle, signUpWithEmail, signInWithEmail, logout };
