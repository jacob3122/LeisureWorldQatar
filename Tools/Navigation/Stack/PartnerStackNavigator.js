import 'react-native-gesture-handler';
import HomeScreen from '../../../Pages/HomeScreen';
import AdContent from '../../Components/AdContent';
import RulesPage from '../../Components/RulesPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Password from '../../../Pages/StackPage/Password';
import OrdersPage from '../../../Pages/StackPage/OrdersPage';
import  ProfileData  from '../../Components/ProfileData'
import AccountEdit from '../../../Pages/StackPage/ProfileEditor';
import Settings from '../../../Pages/StackPage/Settings';
import MyOrdersPage from '../../../Pages/StackPage/MyOrdersPage';
import MyEventsPage from '../../../Pages/StackPage/MyEventsPage';
import { useRoute,useFocusEffect } from '@react-navigation/native';
import React, { useEffect } from 'react';
import EventPage from '../../../Pages/StackPage/EventPage';
import Recipts from '../../../Pages/StackPage/Recipts';
import Points from '../../../Pages/StackPage/Points';
import Contact from '../../../Pages/StackPage/Contact';
import CouponScreen from '../../../Pages/CouponScreen';
import Help from '../../Components/Help';
import PartnerPage from '../../../Pages/StackPage/PartnerPage';
const Stack = createNativeStackNavigator();



function PartnerStackNavigator({props,navigation}){  
  const route=useRoute();
 
  return(
    <Stack.Navigator 
    initialRouteName='Home'
    screenOptions={{
      headerShown:false
    }}>
    <Stack.Screen name="Home" component={PartnerPage}/>
    <Stack.Screen name="Adpage" component={AdContent}/>

    
    </Stack.Navigator>
    )
  }
  
  export default PartnerStackNavigator;
