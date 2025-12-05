import { icons } from "@/constants/icons"
import { Image, TextInput, TouchableOpacity, View } from "react-native"

interface SearchBarProps{
    onPress?: ()=> void,
    onChangeText?: (text: string)=> void,
    onSubmit?: ()=> void,
    placeholder?: string
    value?: string
}

export const SearchBar = ({onPress, placeholder, value, onChangeText, onSubmit}: SearchBarProps)=>{
    return (
        <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
            <Image
            source={icons.search}
            className="size-5"
            resizeMode="contain"
            tintColor={"#4A4A4A"}
            />
            <TextInput
            onPress={onPress}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholderTextColor={"#a8b5db"}
            className="flex-1 ml-2 text-white"
            />
            {onSubmit && (
                <TouchableOpacity onPress={onSubmit} className="ml-2">
                    {/* <Image
                    source={icons.search}
                    className="size-5"
                    resizeMode="contain"
                    tintColor={"#ab8bff"}
                    /> */}
                </TouchableOpacity>
            )}
        </View>
    )
}