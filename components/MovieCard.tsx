import { icons } from "@/constants/icons"
import { Link } from "expo-router"
import { Image, Text, TouchableOpacity, View } from "react-native"

interface MovieCardProps{
    movie: Movie
}


export const MovieCard =({movie}: MovieCardProps)=>{
    return (
        <Link
        href={`/movies/${movie.id}`}
        asChild
        >
        <TouchableOpacity className="w-[30%] ">
        <Image
        source={{
            uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : `https://placehold.co/600x400/1a1a1a/ffffff.png`
        }}
        className="w-full h-52 rounded-lg"
        resizeMode="cover"
        />
        <Text numberOfLines={1} className="text-sm font-bold text-white mt-2">{movie.title} </Text>
        <View className="flex-row items-center justify-start gap-x-1">
            <Image
            source={icons.star}
            className="size-4"
            />
            <Text className="text-xs text-white font-bold uppercase">{Math.round(movie.vote_average/2)} </Text>
        </View>
        <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-300 medium mt-1">{movie.release_date?.split("-")[0]} </Text>
            <Text className="text-xs font-medium text-light-300 uppercase">Movie</Text>
        </View>
        </TouchableOpacity>
        </Link>
    )
}