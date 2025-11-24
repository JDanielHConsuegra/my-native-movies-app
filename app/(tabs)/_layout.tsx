import { icons } from "@/constants/icons"
import { images } from "@/constants/images"
import { Tabs } from "expo-router"
import { Image, ImageBackground, Text, View } from "react-native"

interface TabIconProps{
    focused: any,
    title: string,
    icon: any,

}

 const TabIcon = ({ icon, title, focused }: TabIconProps) =>{
    return (
        <View >
        {
        focused ? (
        <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-5 justify-center items-center rounded-full overflow-hidden"
        >
        <Image
        source={icon}
        tintColor= "#151312"
        className="size-5"
        />
        <Text className="text-secondary text-base font-semibold ml-2">{title} </Text>
        </ImageBackground>
        )
        :(
        <View className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden" >
            <Image source={icon}
                    tintColor={"#A8B5D8"}
                    className="size-5"
            />
        </View>
        )
        }
    </View>
    )
}

const _Layout = ()=>{
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            },
            tabBarStyle: {
                backgroundColor:"#0f0D23",
                borderRadius: 50,
                marginBottom: 50,
                marginHorizontal: 10,
                height:58,
                position: "absolute",
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "0f0d23",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

            }
         }}>
            <Tabs.Screen
            name="index"
            options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({focused})=>(
                   <TabIcon
                   title="Home"
                   focused={focused}
                   icon={icons.home}
                   />
                )
            }}
            />
            <Tabs.Screen
            name="search"
            options={{
                title: "Search",
                headerShown: false,
                tabBarIcon: ({focused})=>(
                   <TabIcon
                   title="Search"
                   focused={focused}
                   icon={icons.search}
                   />
                )
            }}
            />
            <Tabs.Screen
            name="saved"
            options={{
                title: "Saved",
                headerShown: false,
                tabBarIcon: ({focused})=>(
                   <TabIcon
                   title="Saved"
                   focused={focused}
                   icon={icons.save}
                   />
                )
            }}
            />
            <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({focused})=>(
                   <TabIcon
                   title="Profile"
                   focused={focused}
                   icon={icons.person}
                   />
                )
            }}
            />
        </Tabs>
    )
}

export default _Layout