import { useState, useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';

import auth ,{ FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AppRoutes } from "./app.routes";
import { Loadiang } from "../components/Loading";
import { SingRoutes } from "./sing.routes";

export function Routes(){
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

    useEffect(()=>{
        const subscriber = auth()
        .onAuthStateChanged(response => {
            setUser(response);
            setLoading(false)
        });

        return subscriber
    },[])

    

    if(loading){
        return <Loadiang />
    }
    return(
        <View className="flex-1 bg-background">
            <NavigationContainer>
                {user ? <AppRoutes /> : <SingRoutes />}
            </NavigationContainer>

        </View>
    )
}
