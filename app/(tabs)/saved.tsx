import { icons } from "@/constants/icons";
import { Image, Text, View } from "react-native";

export default function Saved() {
  return (
    <View className="flex-1 px-10 bg-primary">
          <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image
          source={icons.save}
          className="size-10"
          tintColor={"#Fff"}
          />
          <Text className="text-gray-500">Saved</Text>
          </View>
        </View>
  );
}
