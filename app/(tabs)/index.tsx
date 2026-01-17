import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useLogged } from "@/hooks/logged";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  useLogged(); // Check if user is logged in

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    }),
  );

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        tintColor={"1C1C1C"}
      />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <Image
          source={icons.logo}
          className="h-[100px] w-[160px] rounded mt-[70px] mb-5 mx-auto"
        />

        {moviesLoading || trendingMoviesLoading ? (
          <ActivityIndicator
            size={"large"}
            color={"#0000ff"}
            className="mt-10 self-center"
          />
        ) : moviesError || trendingMoviesError ? (
          <Text className="text-white">
            Error {moviesError?.message || trendingMoviesError?.message}{" "}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a Movie"
            />
            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-xl text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <MovieCard trendingMovie={item} index={index} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 20,
                    paddingRight: 5,
                  }}
                  className="mt-3 mb-4"
                />
              </View>
            )}
            <>
              <Text className="text-xl text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard movie={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 15,
                  paddingRight: 5,
                  marginBottom: 20,
                }}
                className="mt-2 w-full pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
