import { TouchableOpacity, View, Text, Alert } from "react-native";
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors'

import { useNavigation } from '@react-navigation/native'

import Logo from "../assets/logo.svg";

import auth from '@react-native-firebase/auth'

export function Header(){
    const { navigate } = useNavigation();

    function handleLogOut(){
        auth()
        .signOut()
        .catch(error => {
            console.log(error);
        return Alert.alert('Sair', 'Não foi possivel sair')
    });
    }

    return(
        <View className="w-full flex-row items-center justify-between">
            <Logo />

            <TouchableOpacity 
                activeOpacity={0.7} 
                className=" flex-row h-11 px-4 border border-violet-500 rounded-lg items-center " 
                onPressIn={() => navigate('new')}
            >
                <Feather name="plus" color={colors.violet[500]} size={20} />

                <Text className="text-white ml-3 font-semibold text-base">
                    Novo
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                activeOpacity={0.7} 
                onPressIn={handleLogOut}
            >
                <Feather name="log-out" color={colors.violet[500]} size={20} />
            </TouchableOpacity>


        </View>
    )
}