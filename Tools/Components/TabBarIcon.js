import React from 'react';
import {Image} from 'react-native';

import homeIcon from '../../assets/Icons/home.png'
import couponIcon from '../../assets/Icons/home.png'
import cardIcon from '../../assets/Icons/close.png'
import accountIcon from '../../assets/Icons/profile.png'
import closeIcon from '../../assets/Icons/close.png'



import Colors from '../../Tools/constants/Colors'

export default function TabBarIcon(props) {
  return (
    <Image
      source={props.name==='home'?homeIcon:props.name==='card'?cardIcon:props.name==='profile'?accountIcon:props.name==='close'?closeIcon:props.name==='close'?couponIcon:closeIcon}
      style={[props.style,{ resizeMode:'contain',width:props.width,height:props.height,tintColor:(props.focused ? props.selectedColor : Colors.tabIconDefault)}]}
    />
  );
}
