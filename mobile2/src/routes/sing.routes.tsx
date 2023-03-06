import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SingIn } from "../screens/SingIn";
import { SingUp } from "../screens/SingUp";

const { Navigator, Screen } = createNativeStackNavigator();

export function SingRoutes(){
    return(
        <Navigator screenOptions={{headerShown: false}} >
            <Screen name="singIn" component={SingIn} />
            <Screen name="singUp" component={SingUp} />
        </Navigator>
    )
}