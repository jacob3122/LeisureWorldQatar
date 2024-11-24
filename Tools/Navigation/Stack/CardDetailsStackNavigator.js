import 'react-native-gesture-handler';

import Recipts from '../../../Pages/StackPage/Recipts';
import CardScreen from '../../../Pages/CardScreen';
import Claims from '../../../Pages/StackPage/Claims';
import Redeems from '../../../Pages/StackPage/Redeems';
import Rules from '../../../Pages/StackPage/Rules';
import VoucherComponent from '../../../Pages/StackPage/VoucherComponent';

import AdContent from '../../Components/AdContent';
import RedeemVoucherPage from '../../../Pages/StackPage/RedeemVoucherPage';
import RedeemVenuPage from '../../../Pages/StackPage/RedeemVenuPage';
import RulesPage from '../../Components/RulesPage';
import VoucherPage from '../../Components/VoucherPage';
import Benefits from '../../Components/Benefits'
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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import PointsSystem from '../../../Pages/StackPage/PointsSystem';
const Stack = createNativeStackNavigator();

function CardDetailsStackNavigator({navigation})
  {

    return(
      <Stack.Navigator 
      initialRouteName='CardsHome'
      screenOptions={{
        headerShown:false
      }}>
      <Stack.Screen name="CardsHome" children={()=><CardScreen navigation={navigation}/>} />
      <Stack.Screen name="Receipts" component={Recipts} />
      <Stack.Screen name="rules" component={Rules} />
      <Stack.Screen name="voucherPage" component={VoucherComponent} />
      {/* <Stack.Screen name="claims" component={Claims} /> */}
      <Stack.Screen name="benefits" component={Benefits} />
      <Stack.Screen name="redeem" component={Redeems} />
      <Stack.Screen name="claims" component={PointsSystem} />
      <Stack.Screen name="venue" component={AdContent} />
      <Stack.Screen name="voucher" component={RedeemVoucherPage} />
      <Stack.Screen name="cashier" component={RedeemVenuPage} />
    </Stack.Navigator>
    );
}
export default CardDetailsStackNavigator;
