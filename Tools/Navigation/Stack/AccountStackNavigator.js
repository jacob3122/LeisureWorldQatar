import 'react-native-gesture-handler';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import AccountHome from '../../../Pages/AccountScreen';
import AccountEdit from '../../../Pages/StackPage/ProfileEditor';
import Recipts from '../../../Pages/StackPage/Recipts';
import Claims from '../../../Pages/StackPage/Claims';
import Redeems from '../../../Pages/StackPage/Redeems';

import Password from '../../../Pages/StackPage/Password';
import Contact from '../../../Pages/StackPage/Contact';
import Help from '../../Components/Help';
import Points from '../../../Pages/StackPage/Points';
// import RedeemHandle from '../../../Pages/StackPage/RedeemHandle';
// import Colors from '../../constants/Colors';
import AdContent from '../../Components/AdContent';
import RedeemVoucherPage from '../../../Pages/StackPage/RedeemVoucherPage';
import RedeemVenuPage from '../../../Pages/StackPage/RedeemVenuPage';
import Settings from '../../../Pages/StackPage/Settings';
import CouponScreen from '../../../Pages/CouponScreen';
import RulesPage from '../../Components/RulesPage';
import MyCardsPage from '../../../Pages/StackPage/MyCardsPage';
import MyOrdersPage from '../../../Pages/StackPage/MyOrdersPage';
import MyEventsPage from '../../../Pages/StackPage/MyEventsPage';
import EventPage from '../../../Pages/StackPage/EventPage';
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import ReferAFriend from '../../../Pages/StackPage/ReferAFriend';
import AddCardScreen from '../../../Pages/AddCardScreen';

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
const Stack = createNativeStackNavigator();

function AccountStackNavigator({navigation}){


  return (
    <Stack.Navigator 
    initialRouteName="MyCardsHome"
    screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name="AddCards" component={AddCardScreen} />
      <Stack.Screen name="Home" component={AccountHome} />
      {/* <Stack.Screen name="RulesAccount" component={RulesPage} /> */}
      <Stack.Screen name="AccountEdit" component={AccountEdit} />
      <Stack.Screen name="Receipts" component={Recipts} />
      <Stack.Screen name="MyCardsHome" component={MyCardsPage} />
      {/* <Stack.Screen name="MyOrders" component={MyOrdersPage} /> */}
      {/* <Stack.Screen name="MyEvents" component={MyEventsPage} /> */}
      {/* <Stack.Screen name="Claims" component={Claims} /> */}
      <Stack.Screen name="Points" component={Points} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Contact" component={Contact} />
      <Stack.Screen name="Coupon" component={CouponScreen} />
      <Stack.Screen name="Help" component={Help} />
      {/* <Stack.Screen name="Redeem" component={Redeems} /> */}
      <Stack.Screen name="venue" component={AdContent} />
      <Stack.Screen name="voucher" component={RedeemVoucherPage} />
      <Stack.Screen name="cashier" component={RedeemVenuPage} />
      <Stack.Screen name="referafriend" component={ReferAFriend} />

      {/* <Stack.Screen name="event" component={EventPage}/> */}
      
    </Stack.Navigator>
  );
  // Home: { 
  //   screen: AccountHome,
  //   navigationOptions: {
  //     header: null,
  //   }},
  //   RulesAccount:{
  //     screen:RulesPage
  //   },
  //   AccountEdit: { 
  //     screen: AccountEdit,
  //   },
  //   Receipts: { 
  //     screen: Recipts,
  //   },
   
  //   MyCards: { 
  //     screen: MyCardsPage,
  //   },MyOrders: { 
  //     screen: MyOrdersPage,
  //   },
  //   Claims: { 
  //     screen: Claims,
  //   },
  //   Points: { 
  //     screen: Points,
  //   },
  //   Password: { 
  //     screen: Password,
  //   },Settings: { 
  //     screen: Settings,
  //   },
  //   Contact: { 
  //     screen: Contact,
  //   },Help:{
  //     screen:Help,
  //   },Coupon:{
  //     screen:CouponScreen,
  //     navigationOptions: {
  //       header: null,
  //     }
  //   },
  //   Redeem: { 
  //     screen: Redeems,
  //     // navigationOptions:()=> {
  //     //   return{
  //     //     header:null,
  //     //     headerVisible:false
  //     //   }
  //     // }
  //   },venue:{
  //     screen:AdContent,
  //     navigationOptions: {
  //       header:null,
  //       headerVisible: false,
  //     }
  //   },
  //   voucher:{
  //     screen:RedeemVoucherPage,
  //   },
  //   cashier:{
  //     screen:RedeemVenuPage,
  //     // navigationOptions: {
  //     //   header:null,
  //     //   headerVisible: false,
  //     // }
  //   }
  };
  export default AccountStackNavigator;
  
  