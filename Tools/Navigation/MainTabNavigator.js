import React,{Component, useCallback, useContext, useEffect, useState} from 'react';
import { Text,StyleSheet, Platform,Image,View, TouchableOpacity, Keyboard} from 'react-native';
import { createBottomTabNavigator,BottomTabBar,useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import CardDetailsStackNavigator from './Stack/CardDetailsStackNavigator.js';
import HomeStackNavigator from './Stack/HomeStackNavigator.js';



import Colors from '../constants/Colors';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';


import StoreStackNavigator from './Stack/StoreStackNavigator';
import AccountStackNavigator from '../../Tools/Navigation/Stack/AccountStackNavigator.js';
import { StateContext } from '../context/ContextState';
import BottomBarAnimate from './BottomBarAnimate';
import PartnerStackNavigator from './Stack/PartnerStackNavigator';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
import { useAppContext } from '../../src/js/reducers/AppReducer.js';
const i18n = new I18n(translations);
i18n.locale=global.locale;

selected=0;


const Tab = createBottomTabNavigator();



export default function MainTabNavigator(props,navigation) {
  
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { state, dispatch } = useAppContext();
  i18n.translations = state.i18ntranslation;
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  const {bottomBar, setBottomBar} = useContext(StateContext);
  const {pageContent, setPageContent} = useContext(StateContext);

  const tabs = [
    {
      name: 'Storescreen',
      label: [i18n.t('tickets'),i18n.t('packages'),],
      component: StoreStackNavigator,
    },
    {
      name: 'Walletscreen',
      label:[ i18n.t('playcards')],
      component: AccountStackNavigator,
    }, {
      name: 'Homescreen',
      label:[ i18n.t('home')],
      component: HomeStackNavigator,
    },
    
    {
      name: 'Cardscreen',
      label: [i18n.t('card')],
      component:CardDetailsStackNavigator ,
    },
    {
      name: 'Parkscreen',
      label:[ i18n.t('ourpark')],
      component: PartnerStackNavigator,
    },
  ];
  
  return (
   <Tab.Navigator
    screenOptions={{
      headerShown:false,
      tabBarAllowFontScaling:false,
      tabBarHideOnKeyboard:true,//Platform.OS!=='ios',
    }}
    tabBar={(props) =>  !keyboardVisible&&<BottomBarAnimate {...props} />}
    initialRouteName={'Homescreen'}
    >
    {tabs.map((_, index) => {
      return (
        <Tab.Screen
        key={index}
        name={_.name}
        component={_.component}
        options={{
          tabBarLabel: _.label,
        }}
        />
        );
      })}
      </Tab.Navigator>
      );
    }
    
    
    const styles=StyleSheet.create({
      tabIcon:{width:widthPercentageToDP('7.75%'),height:widthPercentageToDP('7.75%'),resizeMode:'contain',alignSelf:'center',tintColor:Colors.inputfontColor},
      imageView:{
        width:widthPercentageToDP('7.75%'),height:widthPercentageToDP('7.75%'),
        transform:[{translateY:heightPercentageToDP(1.5)}],
        alignSelf:'center',justifyContent:'center',borderRadius:heightPercentageToDP('4%'),backgroundColor:Colors.whiteColor
      },
      tabImage:{width:heightPercentageToDP('4%'),height:heightPercentageToDP('4%'),resizeMode:'contain',alignSelf:'center'},
      tabbarstyle:{
        backgroundColor: 'black',
        color:'black',
        height:heightPercentageToDP('7.2%'),// AdaptiveHeight(16),
        justifyContent:'center',
      },
      tabView:{
        flex:0.33,
        marginTop:'3%',
        marginBottom:'3%',
        alignSelf:'center',
      },
      tabtext:{
        marginTop:'5%',
        fontFamily:'Cairo-Bold',
        fontSize:widthPercentageToDP('3.5%'),
        lineHeight:widthPercentageToDP('4.5%'),
        alignSelf:'center',
        textAlign:'center',
        color:Colors.whiteColor
      },
      
    }
    )
    export {MainTabNavigator};
    