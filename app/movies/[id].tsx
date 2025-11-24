import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Details(){

    const {id} = useLocalSearchParams()
    return (
        <View className="flex h-screen justify-center items-center">
            <Text className="font-bold text-xl">Detalles de la pelicula: {id} </Text>
        </View>
    )
}