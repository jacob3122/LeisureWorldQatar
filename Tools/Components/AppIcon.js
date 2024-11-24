import homeIcon from '../../assets/Icons/home.png'
import couponIcon from '../../assets/Icons/couponlogo.png'
import cardUnIcon from '../../assets/Icons/tejory.png'
import accountUnIcon from '../../assets/Icons/profile.png'
import eventIcon from '../../assets/Icons/event.png'

import homeUnIcon from '../../assets/Icons/homeun.png'
import walletUnIcon from '../../assets/Icons/wallet.png'

import couponUnIcon from '../../assets/Icons/couponlogoun.png'

import storeUnIcon from '../../assets/Icons/store.png'
import parkUnIcon from '../../assets/Icons/parks.png'

import storeIcon from '../../assets/Icons/storeun.png'


import cardIcon from '../../assets/Icons/tejoryun.png'
import accountIcon from '../../assets/Icons/profileun.png'
import { Image, StyleSheet } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import Colors from '../constants/Colors'

const AppIcon = (props) => {
    const getIcon=(nameIn)=>{
        switch (nameIn) {
            case 'Storescreen':
            return storeUnIcon;
            break;
            case 'Homescreen':
            return homeUnIcon;
            break;
            case 'Cardscreen':
            return cardUnIcon;
            break;
            case 'Accountscreen':
            return accountUnIcon;
            case 'Walletscreen':
            return walletUnIcon;
            break;
            case 'Parkscreen':
            return parkUnIcon;
            break;
            case 'event':
            return eventIcon;
            break;
            default:
            break;
        } 
    }
    return (
        <Image style={[styles.tabIcon,{tintColor:props.color},props.style]} source={getIcon(props.name)}/> 
        );
    }
    
    export default AppIcon;
    
    const styles=StyleSheet.create({
        tabIcon:{width:widthPercentageToDP('7.75%'),height:widthPercentageToDP('7.75%'),resizeMode:'contain'
        ,alignSelf:'center',}
    });