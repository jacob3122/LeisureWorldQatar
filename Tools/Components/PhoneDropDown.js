import React, { Component, useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet,View,Text,Image, Modal ,ScrollView, TouchableWithoutFeedback, Button} from 'react-native';
// import Colors from '../constants/Colors';
import dropIcon from '../../assets/Icons/caret-down.png'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import FastImage from '@d11/react-native-fast-image';
import WebServices from '../constants/WebServices';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function PhoneDropDown({updateData,textStyle,ItemSelectedStyle,defaultValue,data,editable = true }){
    const Colors =useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    //     return <PhoneDropDownC {...props} Colors={Colors}/>
    // }
    
    // class PhoneDropDownC extends Component {
    const [open,setOpen]=useState(0);

const drawLine=(colorstr,width)=>{
    return(
        <View
        style={{
            borderBottomColor: colorstr,
            borderBottomWidth: width,
        }}/>
        );
    }

    // useEffect(()=>{

    //     // console.log("P I :"+JSON.stringify(data))
    // },[data])
    
    
    const setView=(_state)=>{
        setOpen(_state);
    }
    const getallItems=()=>{
        if(data.length>0)
        {
            allLines=[];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const inValue=index;
                allLines.push(
                    <View key={"vk"+index}>
                    <TouchableOpacity key={"index"+inValue} onPress={()=>{
                        setOpen(0);
                        var dataUpdate=updateData;
                        dataUpdate(inValue);
                    }} style={[styles.ItemStyle,defaultValue==inValue?{backgroundColor:Colors.bgColor}:{}]}>
                    <FastImage 
                    resizeMode='stretch'
                    style={{width:widthPercentageToDP(9),height:widthPercentageToDP(6.5),alignSelf:'center'}}
                    source={{
                        uri:WebServices.flagUrl.replace('{Code}',data[inValue].code.toLowerCase())}}/>
                        <Text allowFontScaling={false} key={"index1"+inValue} style={[styles.textStyle,defaultValue==inValue?{}:{}]}>{data[inValue].dial_code}</Text>
                        <Text  allowFontScaling={false} key={"index2"+inValue}style={[styles.textStyle,defaultValue==inValue?{}:{}]}>{data[inValue].name}</Text>
                        </TouchableOpacity>
                        {/* {drawLine(Colors.inputfontColor,0.75)} */}
                        </View>
                        )
                    }
                    return allLines;
                }
                return (
                    <View></View>
                    )
                }
                    const styles = StyleSheet.create({
                        textStyle:{
                            includeFontPadding:false,
                            color:Colors.black,
                            alignSelf:'center',
                            marginLeft:10,fontSize:17,fontFamily:'Cairo-Regular',fontWeight:'200'},
                            titleStyle:{padding:10,fontSize:18,fontFamily:'Cairo-Bold',color:Colors.whiteColor,alignSelf:'center',textAlign:'center',includeFontPadding:false},
                            ItemStyle:{
                                marginLeft:-10,marginRight:-10,paddingLeft:10,paddingRight:10,
                                flexDirection:'row',
                                height:50,
                            }
                        });
                        return(
                            <View 
                            style={[{zIndex:2,justifyContent:'center'}]}>
                            <TouchableOpacity disabled={!editable} style={[ItemSelectedStyle]} onPress={()=>{
                                setOpen((open==1?0:1));
                                }}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'center',width:widthPercentageToDP(15),justifyContent:'center'}}>
                            <Text allowFontScaling={false} style={[textStyle,{includeFontPadding:false,color:editable?Colors.inputfontColor:Colors.inactiveTab,height:'100%'}]}>
                            {data.length>0?data[defaultValue].dial_code:"+974"}
                            </Text>
                            <Image style={{width:12,height:12,alignSelf:'center',tintColor:editable?Colors.blueColor:Colors.inactiveTab}} source={dropIcon}/></View>
                            </TouchableOpacity>
                            <Modal  statusBarTranslucent={true} transparent={true} visible={open==1}>
                            <View style={{justifyContent:'center',height:'100%'}}> 
                            <TouchableOpacity onPress={()=>{
                                setOpen(0);
                            }} style={{width:widthPercentageToDP(100),height:heightPercentageToDP(100),justifyContent:'center',backgroundColor:Colors.tabBarbg}}>
                            </TouchableOpacity>
                            {/* <View style={{position:'absolute',width:widthPercentageToDP(100),height:heightPercentageToDP(100),justifyContent:'center',backgroundColor:Colors.tabBarbg}}> */}
                            <View style={[{position:'absolute',borderRadius:15,overflow:'hidden',backgroundColor:Colors.blueColor
                            ,width:widthPercentageToDP(80),height:heightPercentageToDP(80),alignSelf:'center'}]}>
                            <View style={{flexDirection:'row',justifyContent:'center',width:'100%',backgroundColor:Colors.blueColor}}>
                            <Text allowFontScaling={false} style={styles.titleStyle}>{i18n.t('choosecountrycode')}</Text>
                            {/* <TouchableOpacity onPress={()=>{
                                setState({open:0})
                            }}>
                            <Text allowFontScaling={false} style={[styles.titleStyle,{marginEnd:10,transform:[{scaleX:1.5}]}]}>X</Text>
                        </TouchableOpacity> */}
                        </View>
                        {/* {drawLine(Colors.orangeShadeColor,2)} */}
                        <ScrollView style={{backgroundColor:Colors.whiteColor, paddingLeft:10,paddingRight:10}}>
                        {getallItems()}
                        </ScrollView>
                        </View></View>
                        </Modal>
                        </View>
                        )
                    }
                
                