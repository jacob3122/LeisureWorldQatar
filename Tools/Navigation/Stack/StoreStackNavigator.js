import 'react-native-gesture-handler';
import StoreScreen from '../../../Pages/StoreScreen';
import ProductPage from '../../Components/ProductPage';
import CartPage from '../../Components/CartPage';
import CheckOutPage from '../../Components/CheckOutPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';

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
function StoreStackNavigator ({navigation})
{
  const route=useRoute();


  return (
    <Stack.Navigator 
    initialRouteName='Home'
    screenOptions={{
      headerShown:false,
    }}>
      <Stack.Screen name="Home" children={()=><StoreScreen navigation={navigation} OpenProduct={route.params!=undefined?route.params.openProduct:''}/>}/>
      <Stack.Screen name="ProductPage" 
      navigation={navigation} 
      component={ProductPage}/>
      <Stack.Screen name="CartPage" 
      navigation={navigation} component={CartPage} options={{
       
      }} />
      <Stack.Screen name="CheckOutPage" 
      component={CheckOutPage} />
    </Stack.Navigator>
  );
}
        export default StoreStackNavigator;
        
        