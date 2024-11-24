import { useState } from "react";
import { TextInput,Text, View,StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
// import Colors from "../constants/Colors";
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UIElements from './UIElements'
import { useTheme } from "../context/ThemeProvider";
import BlinkingText from "./BlinkingText";
import { useAppContext } from "../../src/js/reducers/AppReducer";
function OTP({onChangeText,onEndText,title=undefined,boxStyle=undefined}) {
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [otp,setOtp]=useState('')
    const [blinkIt,setBlink]=useState(false)
    const checkValue=(valuIn,charNo=-1)=>{
        return ((valuIn==''||valuIn==undefined)?'':(charNo==-1?valuIn:valuIn[charNo]));
    }
    const checkValueIn=(charNo=-1)=>{
        return (otp.length==charNo&&blinkIt);
    }
    const styles = StyleSheet.create({
        shadow:{
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 3,
            shadowOpacity: 0.12,elevation:3,
        },
        boxInput:{width:heightPercentageToDP(4.75),backgroundColor:Colors.whiteColor,
            height:heightPercentageToDP(4.75),justifyContent:'center'
        },
        boxText:{
            includeFontPadding:false,
            fontSize:widthPercentageToDP(6),alignSelf:'center',
            fontFamily:'Cairo-Bold',color:Colors.inputfontColor
        },
        titleText:{
            includeFontPadding:false,
            fontSize:widthPercentageToDP(4.75),alignSelf:'center',
            fontFamily:'Cairo-Regular',color:Colors.black
        }
    })
    
    return(
        <View style={{width:'100%'}}>
        {title==undefined&&
        <Text allowFontScaling={false} numberOfLines={1} style={styles.titleText}>{i18n.t('pleaseenterotp')}</Text>}
        {UIElements.drawGap(heightPercentageToDP(1))}
        <View>
        <View style={{width:'70%',alignSelf:'center',flexDirection:'row',justifyContent:'space-around'}}>
        <View style={[styles.boxInput,styles.shadow,boxStyle]}>
        {checkValueIn(0)&&<BlinkingText style={{position:'absolute',width:'100%',height:'100%'}}/>}
        <Text allowFontScaling={false} style={styles.boxText}>{checkValue(otp,0)}</Text>
        </View>
        <View style={[styles.boxInput,styles.shadow,boxStyle]}>
        {checkValueIn(1)&&<BlinkingText style={{position:'absolute',width:'100%',height:'100%'}}/>}

        <Text allowFontScaling={false} style={styles.boxText}>{checkValue(otp,1)}</Text>
        </View>
        <View style={[styles.boxInput,styles.shadow,boxStyle]}>
        {checkValueIn(2)&&<BlinkingText style={{position:'absolute',width:'100%',height:'100%'}}/>}

        <Text style={styles.boxText}>{checkValue(otp,2)}</Text>
        </View>
        <View style={[styles.boxInput,styles.shadow,boxStyle]}>
        {checkValueIn(3)&&<BlinkingText style={{position:'absolute',width:'100%',height:'100%'}}/>}

        <Text allowFontScaling={false} style={styles.boxText}>{checkValue(otp,3)}</Text>
        </View>
        
        </View>
        <TextInput
        maxLength={4}
        editable={true}
        textContentType='oneTimeCode'
        keyboardType='numeric'
        returnKeyType='done'
        onPressIn={()=>{
            setBlink(true)
        }}
        value={checkValue(otp)}
        onEndEditing={(text)=>{
            if(onEndText!=null)
            onEndText(text);
            setBlink(false)
        }}
        onChangeText={(text)=>{
            onChangeText(text);
            setOtp(text)}}
            style={{opacity:0,fontSize:widthPercentageToDP(30),alignSelf:'center',position:'absolute',width:'70%',backgroundColor:Colors.whiteColor,height:heightPercentageToDP(4.75)}}
            ></TextInput></View>
            </View>
            )
            
        }
        
        
        export default OTP;
      