import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
// @ts-ignore
import { createUserWithEmailAndPassword, getReactNativePersistence, initializeAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { fetchMovieDetails } from './api';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);

// Nombres de colecciones
const SEARCHES_COLLECTION = 'searches';
const FAVORITES_COLLECTION = 'favorites';
const USERS_COLLECTION = 'users';

// --- AUTENTICACIÓN ---

export const registerUser = async (name: string, email: string, password: string) => {
    try {
        // 1. Firebase Auth maneja la creación segura
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Guardamos datos extra en Firestore
        await setDoc(doc(db, USERS_COLLECTION, user.uid), {
            name,
            email,
            isActive: true,
            createdAt: new Date().toISOString()
        });

        return { id: user.uid, name, email };
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener datos extra del usuario desde Firestore
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));

        if (userDoc.exists() && userDoc.data().isActive) {
            return { id: user.uid, email: user.email, name: userDoc.data().name };
        } else {
            throw new Error("Account is inactive or data missing");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// --- BASE DE DATOS: BÚSQUEDAS (TRENDING) ---

export const updateSearchCount = async (searchQuery: string, movie: any) => {
    try {
        const q = query(collection(db, SEARCHES_COLLECTION), where("searchTerm", "==", searchQuery));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, SEARCHES_COLLECTION, existingDoc.id), {
                count: existingDoc.data().count + 1
            });
        } else {
            await addDoc(collection(db, SEARCHES_COLLECTION), {
                searchTerm: searchQuery,
                count: 1,
                title: movie.title,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
    }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
    try {
        const q = query(collection(db, SEARCHES_COLLECTION), orderBy("count", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as TrendingMovie }));
    } catch (error) {
        console.error("Error getting trending movies:", error);
        return [];
    }
};

// --- BASE DE DATOS: FAVORITOS ---

export const saveMovie = async (movieId: string): Promise<boolean> => {
    try {
        let userUuid = await AsyncStorage.getItem('userUuid');
        if (!userUuid) {
            userUuid = auth.currentUser?.uid || Date.now().toString(); // Mejor usar el ID de Auth si existe
            await AsyncStorage.setItem('userUuid', userUuid);
        }

        const q = query(
            collection(db, FAVORITES_COLLECTION),
            where("userUuid", "==", userUuid),
            where("movieId", "==", movieId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            await deleteDoc(doc(db, FAVORITES_COLLECTION, querySnapshot.docs[0].id));
            return false; // Se eliminó
        } else {
            await addDoc(collection(db, FAVORITES_COLLECTION), {
                userUuid,
                movieId
            });
            return true; // Se guardó
        }
    } catch (error) {
        console.error("Error saving movie:", error);
        throw error;
    }
};

export const isMovieSaved = async (movieId: string): Promise<boolean> => {
    try {
        const userUuid = await AsyncStorage.getItem('userUuid');
        if (!userUuid) return false;

        const q = query(
            collection(db, FAVORITES_COLLECTION),
            where("userUuid", "==", userUuid),
            where("movieId", "==", movieId)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        return false;
    }
};

export const getFavoriteMovies = async (): Promise<any[]> => {
    try {
        const userUuid = await AsyncStorage.getItem('userUuid');
        if (!userUuid) return [];

        const q = query(collection(db, FAVORITES_COLLECTION), where("userUuid", "==", userUuid));
        const querySnapshot = await getDocs(q);
        const movieIds = querySnapshot.docs.map(doc => doc.data().movieId);

        const movies = [];
        for (const id of movieIds) {
            const details = await fetchMovieDetails({ movieId: id });
            // Aquí mapeas los detalles como lo tenías...
            movies.push(details);
        }
        return movies;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};