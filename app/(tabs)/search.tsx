import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Saved() {
   const [searchQuery, setSearchQuery] = useState<string>("")

   const handleSubmit = async () => {
     if (searchQuery.trim()) {
       await loadMovies()
       if (movies?.length > 0 && movies?.[0]) {
         await updateSearchCount(searchQuery, movies[0])
       }
     }
   }
        const {
            data: movies = [],
            loading: moviesLoading,
            error: moviesError,
            refetch: loadMovies,
            reset
        } = useFetch(()=> fetchMovies({
            query: searchQuery
        }), false )
        //false va arriba pero de daña al aplicarlo
        useEffect(()=>{
          const timeoutId = setTimeout( async() => {
            if(searchQuery.trim()){
              await loadMovies()
              if(movies?.length > 0 && movies?.[0])
                await updateSearchCount(searchQuery, movies[0])
            }
            else{
              reset()
            }
          }, 700);

          return()=> clearTimeout(timeoutId)

        }, [searchQuery])

  return (
    <View className="flex-1 bg-primary">
    <Image
    source={images.bg}
    className="flex-1 absolute w-full z-0"
    resizeMode="cover"
    />
    <FlatList
    data={movies}
    renderItem={({item})=><MovieCard movie={item}/> }
    keyExtractor={(item)=> item.id.toString()}
    ListEmptyComponent={
      !moviesLoading && !moviesError ? (
        <View className="mt-10 px-5">
        <Text className="text-center text-gray-500">{searchQuery.trim() ? "No movies were found" : "Introduce a search term"} </Text>  
        </View>
      ) : null
    }
    numColumns={3} 
    columnWrapperStyle={{
      justifyContent:"center",
      gap:16,
      marginVertical:16
    }}
    contentContainerStyle={{paddingBottom:100}}
    className="px-5"
    ListHeaderComponent={
      <>
      <View className="w-full flex-row justify-center mt-20">
      <Image
      source={icons.logo}
      className="size-12 "
      />
      </View>
      <View className="my-5">
        <SearchBar
        value={searchQuery}
        onChangeText={(text: string)=>setSearchQuery(text) }
        onSubmit={handleSubmit}
        placeholder="Search for Movies ..."
        />
      </View>
      {
        moviesLoading && (
          <ActivityIndicator
          size={"large"}
          color={"#0000ff"}
          className="my-3"
          />
        )
      }
      {
        moviesError && (
          <Text className="text-red-500 px-5 my-3">Error: {moviesError?.message} </Text>
        )
      }
      {
        !moviesError && !moviesLoading && searchQuery.trim() && movies && movies.length > 0 && (
          <Text className="text-white text-xl font-bold">Results for: <Text className="text-accent">{searchQuery}</Text>   </Text>
        )
      }
      </>
    }
    />
    </View>
  );
}
