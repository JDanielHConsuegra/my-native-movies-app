import { icons } from "@/constants/icons"
import { images } from "@/constants/images"
import MaskedView from "@react-native-masked-view/masked-view"
import { Link } from "expo-router"
import { Image, Text, TouchableOpacity, View } from "react-native"

interface MovieCardProps{
    movie?: Movie
    trendingMovie?: TrendingMovie
    index?: number
}


export const MovieCard =({movie, trendingMovie, index}: MovieCardProps)=>{
    
    if(movie){
        return (
            <Link
            href={`/movies/${movie?.id}`}
            asChild
            >
            <TouchableOpacity className="w-[30%] ">
            <Image
            source={{
                uri: movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : `https://placehold.co/600x400/1a1a1a/ffffff.png`
            }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
            />
            <Text numberOfLines={1} className="text-sm font-bold text-white mt-2">{movie?.title} </Text>
            <View className="flex-row items-center justify-start gap-x-1">
                <Image
                source={icons.star}
                className="size-4"
                />
                <Text className="text-xs text-white font-bold uppercase">{movie?.vote_average?.toFixed(1)}/10 </Text>
            </View>
            <View className="flex-row items-center justify-between">
                <Text className="text-xs text-light-300 medium mt-1">{movie?.release_date?.split("-")[0]} </Text>
                <Text className="text-xs font-medium text-light-300 uppercase">Movie</Text>
            </View>
            </TouchableOpacity>
            </Link>
        )
    }
    if (trendingMovie) {
       return (
        <Link asChild
        href={`/movies/${trendingMovie.movie_id}`}
        >
        <TouchableOpacity className="w-32 relative pl-5">
        <Image
        source={{uri:trendingMovie.poster_url || `https://placehold.co/600x400/1a1a1a/ffffff.png`}}
        className="w-32 h-48 rounded-lg"
        resizeMode="cover"
        />
        <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
        <MaskedView
        maskElement={
            <Text className="font-bold text-white text-6xl">{index === 0 ? '1' : index ? (index + 1).toString() : ''}</Text>
        }
        >
        <Image
        source={images.rankingGradient}
        className="size-14"
        resizeMode="cover"
        />
        </MaskedView>
        </View>
        <Text className="text-sm font-bold mt-2 text-light-200" numberOfLines={2}>{trendingMovie.title} </Text>
        </TouchableOpacity>
        </Link>
        )
        
    }
    else return null
}