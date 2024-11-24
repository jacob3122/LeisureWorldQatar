import 'react-native-gesture-handler';
import AdContent from '../../Components/AdContent';
import OfferScreen from '../../../Pages/OfferScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

/*
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
*/

function  OfferStackNavigator ()
{

  return (
    <Stack.Navigator 
    screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name="OfferHome" component={OfferScreen} />
      <Stack.Screen name="Adpage" component={AdContent} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};
export default OfferStackNavigator;
