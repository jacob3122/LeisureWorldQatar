import React, { Component, useEffect, useState } from 'react';
import {Image, View,Modal,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity} from 'react-native';
// import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
import TabBarIcon from './TabBarIcon';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import {AdaptiveWidth,AdaptiveHeight} from './AdaptiveSize';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import MarqueeLine from './MarqueeLine';
// import Barcode from 'react-native-barcode-builder';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import Barcode from './Barcode';
export default function(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [voucherValue,setVoucherValue]=useState('AB-123-1234');
    const [visible,setVisible]=useState(true);
    useEffect(()=>{
        Tools.updateRatePoints(1);
    })

    OnSubmit=()=>{
        setVisible(false);
        OnDone(true);
    }
    OnDone=(donestate)=>{
        var isdone=props.onDone;
        isdone(donestate);
    }
        const styles = StyleSheet.create({
            inputValue: {
                fontSize: widthPercentageToDP(6),
                lineHeight: widthPercentageToDP(6)*1.25,
                textTransform:'uppercase',
                textAlign:'left',
                color: Colors.inputfontColor,
                padding:10,
                fontFamily:'Cairo-Bold',
                alignSelf:'center'
            },shadow:{
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 3,
                shadowOpacity: 0.12,
            },
            inputView:{
                width:200,
                height:heightPercentageToDP(4.75),
                backgroundColor:Colors.whiteColor,
                borderRadius:heightPercentageToDP(4.75),
                // borderWidth:2,
                // borderColor:Colors.whiteColor,
                justifyContent:'center',
                alignSelf:'center'
            },
            warning:{
                color:'#ed4f3b',
                paddingTop:15,
                // paddingBottom:15,
                fontWeight:'500',
                
                fontFamily:'Cairo-Regular',
                fontSize:13,
            },
            modalView:{
                alignContent:'center',
                justifyContent:'center',
                alignItems:'center',
            },
            Button:{
                // flex:1,
                height:heightPercentageToDP(4.75),
                borderRadius:heightPercentageToDP(4.75),
                // width:200,
                alignSelf:'center',
                alignItems:'center',
                backgroundColor:Colors.blueColor,
                justifyContent:'center'
            },
            buttontext:{
                fontSize:20,
                paddingHorizontal:widthPercentageToDP(6),
                color:Colors.whiteColor,
                fontFamily:'Cairo-Regular',
                alignSelf:'center'
                // lineHeight: AdaptiveWidth(18) * 1.6,
                // height: AdaptiveWidth(18)* 1.3, 
            },
            inputNo:{
                alignSelf:'center',
                backgroundColor:Colors.inputboxColor,
                color:Colors.darkfontColor,
                width:200,
                height:35,
                fontSize:22,
                fontFamily:'Cairo-Bold',
                justifyContent:'center',
                alignItems:'center',textAlign:'center'
            },
            image:{
                flex:1,
                width: 350,
                height: height/4,
                resizeMode:'contain',
                borderRadius: 10,
                // position:'absolute'
                // transform:[{translateY:-width/4.8}]
            },
            title:{
                padding:15,
                textAlign:'center',
                fontWeight:'100',
                color:Colors.inputfontColor,
                
                fontFamily:'Cairo-Regular',
                fontSize: AdaptiveWidth(12),
                // lineHeight: AdaptiveWidth(15) * 1.6,
                // height: AdaptiveWidth(15)* 1.3*3, 
            },
            duration:{
                marginLeft: 10,
                fontSize:20,
                textAlign:'center',
                color:Colors.inputfontColor,
                fontWeight:'100',
                
                fontFamily:'Cairo-Regular',
            },
        });
        
        return (
            <Modal  statusBarTranslucent={true} animationType = {"slide"} transparent = {true} visible={visible}>
            <BackgroundWall blur opacity={0.8}/>
            <View style={{height:'100%',width:'100%',justifyContent:'center'}}>
            <View style={styles.modalView}>
            <View style={{backgroundColor:Colors.bgColor,borderRadius:20,width:widthPercentageToDP('90%')}} >
            {/* <Image source= ></Image> */}
            <Text style ={styles.title} allowFontScaling={false}>{props.content.Title}</Text>
            <Text style ={styles.duration} allowFontScaling={false}>{props.content.SubHeading}</Text>
            {UIElements.drawGap(20)}
            <View style={{}}> 
            <Text  allowFontScaling ={false}
            style={styles.inputValue}>{props.content.ContentCode}</Text>
            {/* <Text  allowFontScaling ={false}
        style={styles.inputValue}>{this.state.voucherValue}</Text> */}
        {!Tools.stringIsEmpty(props.content.ContentCode)&&<Barcode value={props.content.ContentCode} 
        viewStyle={{marginTop:heightPercentageToDP(1),marginBottom:heightPercentageToDP(1)}} width={widthPercentageToDP('.32%')} height={heightPercentageToDP('5%')}
        format="CODE128" />}
        <MarqueeLine bgColor={Colors.black} style={{width:widthPercentageToDP(70),marginTop:heightPercentageToDP(0)}}/>
        </View>
        {UIElements.drawGap(20)}
        <TouchableOpacity style={styles.Button} onPress={()=>{OnSubmit()}}>
        <Text allowFontScaling={false} style={styles.buttontext} >{i18n.t('done')}</Text>
        </TouchableOpacity>
        {UIElements.drawGap(20)}
        </View>
        </View></View></Modal>
        )
    }
  


