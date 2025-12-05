import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { user, logOut } = useAuth();
  const router = useRouter();

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
      <View className="py-10 flex flex-col gap-5 px-5">
        {/* User Avatar/Icon */}
        <View className="items-center mb-5">
          <Image
            source={icons.person}
            className="size-12 rounded-full bg-dark-200 p-4"
            tintColor="#fff"
          />
        </View>

        {/* User Info */}
        <View className="bg-dark-200 rounded-lg p-5 mb-5">
          <Text className="text-white text-lg mb-2">
            <Text className="font-bold">Name:</Text> {user?.name}
          </Text>
          <Text className="text-white text-lg mb-2">
            <Text className="font-bold">Email:</Text> {user?.email}
          </Text>
        </View>

        {/* Favorite Movies Button */}
        <TouchableOpacity
          className="bg-accent rounded-lg p-4 items-center"
          onPress={() => router.push('/(tabs)/saved')}
        >
          <Text className="text-white text-lg font-bold">View Favorite Movies</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-600 rounded-lg p-4 items-center mt-5"
          onPress={logOut}
        >
          <Text className="text-white text-lg font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
