import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, Text, Alert } from "react-native";

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import auth, { firebase } from '@react-native-firebase/auth'

import colors from "tailwindcss/colors";

import Logo from '../assets/logo.svg'

export function SingIn(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    function handleSingIn(){
        
        if(!email.trim() || !password.trim() ){
            return Alert.alert("Entrar","Informe E-mail e Senha")
        }

        auth()
        .signInWithEmailAndPassword(email,password,)
        .catch((error) => {
            console.log(error)

            if(error.code === 'auth/invalid-email'){
                return Alert.alert('Entrar', 'E-mail ou senha inválido')
            }

            if(error.code === 'auth/user-not-found'){
                return Alert.alert('Entrar', 'Usuário não cadastrado')
            }

            if(error.code === 'auth/wrong-password'){
                return Alert.alert('Entrar', 'E-mail ou senha inválido')
            }

            return Alert.alert('Entrar', 'Não foi possivel acessar')
        })
    }
    function handleSingUp(){
        navigation.navigate('singUp')
    }
    function handleResetPassword(){
        if(!email.trim()){
            return Alert.alert('Nova senha', 'Informe seu E-mail')
        }

        auth()
        .sendPasswordResetEmail(email)
        
        return Alert.alert("Nova senha", 'Verifique seu E-mail')

    }
    return(
        <View className=" h-full items-center justify-center bg-background">
            <Logo />
            
            <TextInput 
                className=" w-full h-12 p-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                placeholder="Email"
                placeholderTextColor={colors.zinc[400]}
                onChangeText={setEmail}
                value={email}
            />
            
            <TextInput 
                className=" w-full h-12 p-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                placeholder="Senha"
                placeholderTextColor={colors.zinc[400]}
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />

            <TouchableOpacity activeOpacity={0.7} className=" w-full h-14 items-center justify-center bg-green-600 rounded-md mt-6 flex-row" onPress={handleSingIn}  >
                <Feather name="send" size={20} color={colors.white} />

                <Text className="font-semibold text-base text-white ml-2">
                    Entrar
                </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-12" onPress={handleSingUp}>
                <Text>
                    Não possui uma conta Cadastre-se
                </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-12" onPress={handleResetPassword}>
                <Text>
                    Esqueci minha senha
                </Text>
            </TouchableOpacity>
        </View>  
    )
}