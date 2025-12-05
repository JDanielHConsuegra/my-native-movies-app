import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client, Databases, ID, Query } from "react-native-appwrite";
import { fetchMovieDetails } from './api';

// IDs desde las variables de entorno
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const favoritesCollectionId = process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;
const usersCollectionId = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

// Configuración del cliente de Appwrite
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)       // https://<REGION>.cloud.appwrite.io/v1
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)      // ID del proyecto
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);      // Bundle ID / applicationId

// Instancia de Databases
const databases = new Databases(client);

// track searches by user
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await databases.listDocuments({
      databaseId,
      collectionId,
      queries: [
        // OJO: ahora Query.equal recibe un array de valores
        // y los queries se pasan en la propiedad `queries`
        Query.equal("searchTerm", [query]),
      ],
      // total: false, // opcional
      
    });
    if(result.documents.length > 0){
      const existingMovie = result.documents[0]

      await databases.updateDocument(
        databaseId,
        collectionId,
        existingMovie.$id,
        {
          count: existingMovie.count + 1
        }
      )
    } else{
      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          searchTerm: query,
          count: 1,
          title: movie.title,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }
      )
    }

    console.log("Documentos encontrados para la búsqueda:", result);
  
  } catch (error) {
    console.log(error);
    throw error
  }
    

};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> =>{
  try {
    const result = await databases.listDocuments({
      databaseId,
      collectionId,
      queries: [
        // OJO: ahora Query.equal recibe un array de valores
        // y los queries se pasan en la propiedad `queries`
        Query.limit(5),
        Query.orderDesc("count")
      ],
      // total: false, // opcional
      
    });
    return result.documents as unknown as TrendingMovie[]
  } catch (error) {
    console.log(error);
    return undefined
  }
}

// Save or remove movie from favorites
export const saveMovie = async (movieId: string): Promise<boolean> => {
  try {
    let userUuid = await AsyncStorage.getItem('userUuid');
    if (!userUuid) {
      userUuid = ID.unique();
      await AsyncStorage.setItem('userUuid', userUuid);
    }

    // Check if already saved
    const result = await databases.listDocuments({
      databaseId,
      collectionId: favoritesCollectionId,
      queries: [
        Query.equal("userUuid", userUuid),
        Query.equal("movieId", movieId),
      ],
    });

    if (result.documents.length > 0) {
      // Remove from favorites
      await databases.deleteDocument(databaseId, favoritesCollectionId, result.documents[0].$id);
      return false; // not saved
    } else {
      // Add to favorites
      await databases.createDocument(databaseId, favoritesCollectionId, ID.unique(), {
        userUuid,
        movieId,
      });
      return true; // saved
    }
  } catch (error) {
    console.log("Error saving movie:", error);
    throw error;
  }
};

export const isMovieSaved = async (movieId: string): Promise<boolean> => {
  try {
    let userUuid = await AsyncStorage.getItem('userUuid');
    if (!userUuid) {
      return false;
    }

    const result = await databases.listDocuments({
      databaseId,
      collectionId: favoritesCollectionId,
      queries: [
        Query.equal("userUuid", userUuid),
        Query.equal("movieId", movieId),
      ],
    });

    return result.documents.length > 0;
  } catch (error) {
    console.log("Error checking if movie is saved:", error);
    return false;
  }
};

export const getFavoriteMovies = async (): Promise<Movie[]> => {
  try {
    let userUuid = await AsyncStorage.getItem('userUuid');
    if (!userUuid) {
      userUuid = ID.unique();
      await AsyncStorage.setItem('userUuid', userUuid);
    }

    // Get favorites
    const result = await databases.listDocuments({
      databaseId,
      collectionId: favoritesCollectionId,
      queries: [
        Query.equal("userUuid", userUuid),
      ],
    });

    const movieIds = result.documents.map(doc => doc.movieId);

    // Fetch each movie from TMDB
    const movies: Movie[] = [];
    for (const id of movieIds) {
      const details: MovieDetails = await fetchMovieDetails({ movieId: id });
      const movie: Movie = {
        id: details.id,
        title: details.title,
        adult: details.adult,
        backdrop_path: details.backdrop_path || '',
        genre_ids: details.genres.map(g => g.id),
        original_language: details.original_language,
        original_title: details.original_title,
        overview: details.overview || '',
        popularity: details.popularity,
        poster_path: details.poster_path || '',
        release_date: details.release_date,
        video: details.video,
        vote_average: details.vote_average,
        vote_count: details.vote_count,
      };
      movies.push(movie);
    }

    return movies;
  } catch (error) {
    console.log("Error fetching favorite movies:", error);
    return [];
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await databases.listDocuments({
      databaseId,
      collectionId: usersCollectionId,
      queries: [
        Query.equal("email", email),
        Query.equal("password", password),
        Query.equal("isActive", true),
      ],
    });

    if (result.documents.length > 0) {
      return result.documents[0];
    } else {
      throw new Error("Invalid credentials or account inactive");
    }
  } catch (error) {
    console.log("Error logging in:", error);
    throw error;
  }
};
