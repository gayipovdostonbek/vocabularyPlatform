import { auth } from '../firebaseConfig';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged,
    updatePassword,
    type User
} from 'firebase/auth';

export const authService = {
    async signUp(email: string, pass: string): Promise<User> {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        return cred.user;
    },

    async signIn(email: string, pass: string): Promise<User> {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        return cred.user;
    },

    async signOut(): Promise<void> {
        await firebaseSignOut(auth);
    },

    onAuthChange(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    },

    async changePassword(user: User, newPassword: string): Promise<void> {
        await updatePassword(user, newPassword);
    }
};
