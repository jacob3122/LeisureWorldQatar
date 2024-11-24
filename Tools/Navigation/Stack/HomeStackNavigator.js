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
import Notify from '../../Components/Notify';
import ReferAFriend from '../../../Pages/StackPage/ReferAFriend';
const Stack = createNativeStackNavigator();



function HomeStackNavigator({navigation}){  
  const route=useRoute();

  // if(route.params!=undefined)
  // console.log(" H "+ JSON.stringify(route.params));
  // if(props!=undefined)
  // console.log("HP "+ props.openEvent);
  return(
    <Stack.Navigator 
    initialRouteName='Home'
    screenOptions={{
      headerShown:false
    }}>
    <Stack.Screen name="Home" component={HomeScreen}/>
    <Stack.Screen name="notify" component={Notify}/>
    <Stack.Screen name="profile" component={AccountEdit}/>
    <Stack.Screen name="Adpage" component={AdContent}/>
    <Stack.Screen name="settings" component={Settings} />
    <Stack.Screen name="myorders" component={MyOrdersPage} />
    {/* <Stack.Screen name="events" component={MyEventsPage} /> */}
    <Stack.Screen name="events" children={()=><MyEventsPage navigation={navigation} OpenEvent={route.params!=undefined?route.params.openEvent:''}/>}/>
    <Stack.Screen name="event" component={EventPage}/>
    
    <Stack.Screen name="Receipts" component={Recipts} />
    <Stack.Screen name="Points" component={Points} />
    <Stack.Screen name="password" component={Password} />
    <Stack.Screen name="contact" component={Contact} />
    <Stack.Screen name="coupons" component={CouponScreen} />
    <Stack.Screen name="help" component={Help} />
    
    <Stack.Screen name="referafriend" component={ReferAFriend} />
    
    </Stack.Navigator>
    )
  }
  
  export default HomeStackNavigator;
  
  
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