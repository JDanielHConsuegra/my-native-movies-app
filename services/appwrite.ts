import { Client, Databases, ID, Query } from "react-native-appwrite";

// IDs desde las variables de entorno
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

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
