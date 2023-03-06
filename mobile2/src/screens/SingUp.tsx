import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, Text, Alert } from "react-native";

import { Feather } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth'
import firetore from '@react-native-firebase/firestore'

import colors from "tailwindcss/colors";

import Logo from '../assets/logo.svg'

export function SingUp(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    function handleSingIn(){

        if(!email.trim() || !password.trim() || !name.trim()){
            return Alert.alert("Cadastre-se","Informe seu Nome, E-mail e Senha")
        }
        
        auth()
        .createUserWithEmailAndPassword(email,password)
        .catch((error) => {
          console.log(error)

          if(error.code === 'auth/invalid-email'){
            return Alert.alert('Cadastre-se', 'E-mail Inválido')
          }
          if(error.code === 'auth/email-already-in-use'){
            return Alert.alert('Cadastre-se', 'E-mail já cadastrado')
          }
          if(error.code === 'auth/weak-password'){
            return Alert.alert('Cadastre-se', 'Senha fraca digite uma senha com letras e numeros de no mínimo 6 digitos')
          }
        })
        .then(() => {
            auth().currentUser?.updateProfile({
                displayName: name
            })
        })
        
    }
    return(
        <View className=" h-full items-center justify-center bg-background">
            <Logo />
            
            <TextInput 
                className=" w-full h-12 p-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                placeholder="Nome"
                placeholderTextColor={colors.zinc[400]}
                onChangeText={setName}
                value={name}
            />

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
                    Cadastrar
                </Text>
            </TouchableOpacity>
        </View>  
    )
}