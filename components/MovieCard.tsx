import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Extract common styles for readability and maintainability
const styles = {
  movieCard: "w-[30%] rounded-lg shadow-lg",
  favoriteMovieCard:
    "w-[300px] flex flex-col gap-5 rounded shadow shadow-gray-400 border border-gray-800 p-5 rounded-lg shadow-lg",
  movieImage: "w-full h-52 rounded-lg",
  movieTitle: "font-bold text-light-100 mt-2",
  ratingContainer: "flex-row items-center justify-start gap-x-1",
  ratingText: " text-light-200 font-bold uppercase",
  metaContainer: "flex-row items-center justify-between mt-1",
  metaText: "text-light-300 font-medium",
  trendingCard: "w-32 relative pl-5",
  trendingImage: "w-32 h-48 rounded-lg",
  rankingBadge: "absolute bottom-9 -left-3.5 px-2 py-1 rounded-full",
  rankingText: "font-bold text-white text-6xl",
  rankingImage: "size-14",
  trendingTitle: "font-bold mt-2 text-light-200",
};

// Utility function for safe year extraction (error handling)
const getReleaseYear = (date?: string): string => {
  if (!date || !date.includes("-")) return "N/A";
  return date.split("-")[0];
};

interface MovieCardProps {
  movie?: Movie;
  trendingMovie?: TrendingMovie;
  index?: number;
  favorite?: boolean;
}

export const MovieCard = ({
  movie,
  trendingMovie,
  index,
  favorite = false,
}: MovieCardProps) => {
  if (movie && !favorite) {
    return (
      <Link href={`/movies/${movie?.id}`} asChild>
        <TouchableOpacity className={styles.movieCard}>
          <Image
            source={{
              uri: movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : `https://placehold.co/600x400/1a1a1a/ffffff.png`,
            }}
            className={styles.movieImage}
            resizeMode="cover"
            onError={() => {
              // Fallback handled in source URI, but log or handle further if needed
              console.warn(`failed to reload movie poster of ${movie.title}`);
            }}
          />
          <Text numberOfLines={1} className={styles.movieTitle}>
            {movie?.title}
          </Text>
          <View className={styles.ratingContainer}>
            <Image source={icons.star} className="size-4" />
            <Text className={styles.ratingText}>
              {movie?.vote_average?.toFixed(1)}/10
            </Text>
          </View>
          <View className={styles.metaContainer}>
            <Text className={styles.metaText}>
              {getReleaseYear(movie?.release_date)}
            </Text>
            <Text className={styles.metaText}>Movie</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  if (favorite && movie) {
    return (
      <Link href={`/movies/${movie?.id}`} asChild>
        <TouchableOpacity className={styles.favoriteMovieCard}>
          <Image
            source={{
              uri: movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : `https://placehold.co/600x400/1a1a1a/ffffff.png`,
            }}
            className={`w-full h-[380px] rounded-lg`}
            resizeMode="cover"
            onError={() => {
              // Fallback handled in source URI, but log or handle further if needed
              console.warn(
                `failed to reload favorite movie poster of ${movie.title}`
              );
            }}
          />
          <Text
            numberOfLines={1}
            className={
              "text-light-100 text-center font-bold border-b border-light-200 text-lg"
            }
          >
            {movie?.title}
          </Text>
          <View className="flex flex-row justify-between items-center">
            <View className={styles.ratingContainer}>
              <Image source={icons.star} className="size-6" />
              <Text className={"text-light-200 text-center text-lg"}>
                {movie?.vote_average?.toFixed(1)}/10
              </Text>
            </View>
            <Image
              source={icons.save}
              className="size-6"
              tintColor={"#ff0000"}
            />
          </View>
          <View className={styles.metaContainer}>
            <Text className={"text-light-200 text-center text-lg"}>
              {getReleaseYear(movie?.release_date)}
            </Text>
            <Text className={"text-light-200 text-center text-lg"}>Movie</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  if (trendingMovie) {
    return (
      <Link asChild href={`/movies/${trendingMovie.movie_id}`}>
        <TouchableOpacity className={styles.trendingCard}>
          <Image
            source={{
              uri: trendingMovie.poster_url || icons.logo,
            }}
            className={styles.trendingImage}
            resizeMode="cover"
            onError={() => {
              console.warn("Failed to load trending movie poster");
            }}
          />
          <View className={styles.rankingBadge}>
            <MaskedView
              maskElement={
                <Text className={styles.rankingText}>
                  {index === 0 ? "1" : index ? (index + 1).toString() : ""}
                </Text>
              }
            >
              <Image
                source={images.rankingGradient}
                className={styles.rankingImage}
                resizeMode="cover"
              />
            </MaskedView>
          </View>
          <Text className={styles.trendingTitle} numberOfLines={2}>
            {trendingMovie.title}
          </Text>
        </TouchableOpacity>
      </Link>
    );
  }

  return null;
};
