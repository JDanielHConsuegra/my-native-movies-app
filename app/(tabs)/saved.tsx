import { MovieCard } from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovieDetails } from "@/services/api";

import { useFavorites } from "@/contexts/FavoritesContext";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const {favoriteIds} = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState<MovieDetails[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favoriteIds.length > 0) {
        try {
          const movies = await Promise.all(
            favoriteIds.map(id => fetchMovieDetails({ movieId: id }))
          );
          setFavoriteMovies(movies);
        } catch (error) {
          console.log('Error fetching favorite movies:', error);
          setFavoriteMovies([]);
        }
      } else {
        setFavoriteMovies([]);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  return (
    <View className="flex-1 pb-10 bg-primary">
      <Image
      source={images.bg}
      className="absolute w-full z-0"
      />
        <Image
        source={icons.logo}
        className="size-12 mt-20 mb-5 mx-auto"
        />
        <View className="py-10 flex flex-col gap-5 px-2">
        <Text className="text-white ml-2 font-bold text-lg">Favorite Movies </Text>
        {
          favoriteMovies.length > 0 ? (
            <FlatList
              data={favoriteMovies}
              renderItem={({item})=>(<MovieCard favorite movie={item as unknown as Movie} />)}
              keyExtractor={(item)=> item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-3 mb-4"
              contentContainerStyle={{
                gap: 20,
                paddingRight: 5
              }}            />
          )
          : <Text className="text-light-300 mt-5 p-2 rounded  text-center">No favorites yet</Text>
        }
        </View>
        
    </View>
  );
}
