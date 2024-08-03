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

    return null;

  } catch (error) {
    console.error("Error signing up: ", error);
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      return 'The password is too weak.';
    }
    if (errorCode == 'auth/email-already-in-use') {
      return 'The email is already in use. Please log in instead or use a different email.'
    }
    if (errorCode == 'auth/invalid-email') {
      return 'The email address is invalid.'
    }
    return errorMessage
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
    return null;
  } catch (error) {
    console.error("Error signing in: ", error);
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/invalid-email') {
      return 'The email address is invalid.'
    }
    if (errorCode == 'auth/user-not-found') {
      return 'User not found. Please sign up instead or use a different email.'
    }
    if (errorCode == 'auth/wrong-password' || errorCode == 'auth/invalid-credential') {
      return 'Incorrect password.';
    }
    return errorMessage
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
