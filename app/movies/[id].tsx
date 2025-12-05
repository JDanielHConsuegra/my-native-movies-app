import { icons } from "@/constants/icons";
import { useFavorites } from "@/contexts/FavoritesContext";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Details(){

    const {id} = useLocalSearchParams()
    const [alertMessage, setAlertMessage] = useState<string | null>(null)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const { isFavorite, toggleFavorite } = useFavorites();

    useEffect(() => {
      if (alertMessage) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, [alertMessage]);

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
        <>
        <Animated.View style={{position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 5, zIndex: 1000, opacity: fadeAnim}}>
          <Text style={{color: 'white', textAlign: 'center', fontSize: 14}}>{alertMessage || ''}</Text>
        </Animated.View>
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{paddingBottom:100}}>
        <View>
            <Image
            source={{uri:`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
            className="w-full h-[550px] "
            resizeMode="stretch"
            />
            {/* touchable que guarda peliculas */}
            <TouchableOpacity
            className=" absolute bottom-5 right-5 p-2 rounded-full bg-primary"
            onPress={async () => {
              try {
                await toggleFavorite(id as string);
                const nowFav = isFavorite(id as string);
                setAlertMessage(nowFav ? "Movie removed from saved" : "Movie saved");
                setTimeout(() => setAlertMessage(null), 2000);
              } catch (error: any) {
                console.log("Error saving movie:", error);
                if (error.message && error.message.includes("not authenticated")) {
                  setAlertMessage("Please log in to save movies");
                } else {
                  setAlertMessage("Error saving movie");
                }
                setTimeout(() => setAlertMessage(null), 2000);
              }
            }}
            >
            <Image
            source={icons.save}
            className="size-8"
            tintColor={isFavorite(id as string) ? "#ff0000" : "#808080"}
            />
            </TouchableOpacity>
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
        </>
    )
}