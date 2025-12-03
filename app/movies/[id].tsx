import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Details(){

    const {id} = useLocalSearchParams()

    const {data:movie, loading} = useFetch(()=>fetchMovieDetails({movieId: id as string}))
    console.log("pelicula que me llega", movie);

    const MovieInfo = ({label, value}:{
        label: string;
        value: string | null | undefined
    }) => {
        return (
            <View className="flex-col items-start justify-center mt-5">
                <Text className="text-light-200 text-sm">{label}</Text>
                <Text className="text-light-100 font-bold mt-2 text-sm">{value || "N/A"}</Text>
            </View>
        )
    }

    if (loading){
        return <Text>Loading...</Text>
    }
    
    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{paddingBottom:100}}>
        <View>
            <Image
            source={{uri:`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
            className="w-full h-[550px] "
            resizeMode="stretch"
            />
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
        <Text className="text-white font-bold text-xl">{movie?.title} </Text>
        <View className="flex-row items-center gap-x-1 mt-2">
        <Text className="text-light-200 text-sm">{movie?.release_date?.split("-")[0]}</Text>
        <Text className="text-light-200 text-sm">{movie?.runtime} minutes</Text>
        </View>
        <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
        <Image
        source={icons.star}
        className="size-4"
        />
        <Text className="text-white font-bold text-sm">{movie?.vote_average?.toFixed(1)}/10</Text>
        <Text className="text-light-200">({movie?.vote_count} votes) </Text>
        </View>
        <MovieInfo
        label="Overview"
        value={movie?.overview}
        />
        <MovieInfo
        label="Genres"
        value={movie?.genres?.map((genre)=>genre.name).join(", ") || "N/A"}
        />
        <View className="flex flex-row justify-between w-1/2">
        <MovieInfo
        label="Budget"
        value={String(`$${movie?.budget.toLocaleString()}`)}
        />
        <MovieInfo
        label="Revenue"
        value={String(`$${movie?.revenue.toLocaleString()}`)}
        />
        
        </View>
        <MovieInfo
        label="Production Companies"
        value={movie?.production_companies?.map((company)=>company.name).join(", ") || "N/A"}
        /> 
        </View>
            </ScrollView>
        <TouchableOpacity className="absolute bottom-10 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
        >
        <Image
        source={icons.arrow}
        className="size-5 mr-1 mt-0.5 rotate-180"
        tintColor={"#fff"}
        />
        <Text className="text-white font-bold">Back to Home</Text>
        </TouchableOpacity>
        </View>
    )
}