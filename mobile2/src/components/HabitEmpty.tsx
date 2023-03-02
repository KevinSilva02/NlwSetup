import { Text } from "react-native"

import { useNavigation } from "@react-navigation/native"

export function HabitEmpty(){
    const { navigate } = useNavigation()
    return(
        <Text className="text-zinc-400 text-base active:text-violet-500 " >
            Você ainda não está monitorando nenhum hábito {' '}
            <Text className="text-violet-400 text-base underline" onPress={() => navigate('new')}>
                comece cadastrando um 
            </Text>
        </Text>
    )
}