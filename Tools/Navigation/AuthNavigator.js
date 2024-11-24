import 'react-native-gesture-handler';

// import { createSwitchNavigator,createStackNavigator } from 'react-navigation';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Auth screens.
import {MainTabNavigator} from './MainTabNavigator';
import OpenFullScreen from '../Components/OpenFullScreen';

const Stack = createNativeStackNavigator();
// Create switch navigator.
function AuthNavigator()

{
  return(
    <Stack.Navigator 
    screenOptions={{
      headerShown:false
    }}>
    <Stack.Screen name="Main" component={MainTabNavigator}
     options={{ title: 'Home' }}
      />
    <Stack.Screen name="FullScreen" component={OpenFullScreen} />
    </Stack.Navigator> 
    );
  }
    export default AuthNavigator;