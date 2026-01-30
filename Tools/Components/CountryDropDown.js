import React, { Component, useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet,View,Text,Image, Modal,ScrollView } from 'react-native';
// import Colors from '../constants/Colors';
import dropIcon from '../../assets/Icons/caret-down.png'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import WebServices from '../constants/WebServices';
import tools from '../Components/Tools'
import FastImage from '@d11/react-native-fast-image';
import { useTheme } from '../context/ThemeProvider';
import { invalid } from 'moment';
import { useAppContext } from '../../src/js/reducers/AppReducer';
export default function CountryDropDown({defaultValue,textStyle,updateData,ItemSelectedStyle, editable=true}){
    const Colors =useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [open,setOpen]=useState(0);
    const [selected,setSelected]=useState(0);
    const [countryCode,setCountryCode]=useState([]);
    const [datafromDropDown,setDatafromDropDown]=useState(-1);
    const [loading,setLoading]=useState(false);
    
    
    useEffect(()=>{
        getCountryInUseData();
    },[])
    const getCountryInUseData=()=>{
        if(global.countryCode!=undefined||global.countryCode!=null){
            var json = global.countryCode;
            setCountryCode(json);
            setLoading(false);
            for (let index = 0; index < json.length; index++) {
                const element = json[index];
                if(element.code==defaultValue){
                    setDatafromDropDown(index);
                    return;
                }
            }
            loaded=0;
            return;
        }
        // setState({countryCode:countryCodes})
        return fetch(WebServices.MainURL+WebServices.countryinUseData.replace('{Localize}',tools.stringIsContains(i18n.locale,'ar')?'ar':'en'))//+"?rand="+ Math.floor(Math.random() * 100000) + 1)
        .then(response  => response.text())
        .then((findresponse)=>{
            // console.log('country'+findresponse);
            
            var json = JSON.parse(findresponse);
            var countrycodes =json.countrycodes;
            
            // console.log('country'+JSON.stringify(countrycodes));
            setCountryCode(countrycodes);
            setLoading(false);
            global.countryCode=countrycodes;
            for (let index = 0; index < countrycodes.length; index++) {
                const element = countrycodes[index];
                if(element.code==defaultValue){
                    setDatafromDropDown(index);
                    return;
                }
            }
            loaded=0;
        }).catch(function(error) {
            loaded=2;
            // console.warn(loaded+' Request Failed: ', error);

            setCountryCode([
                    {
                        "name": "Qatar",
                        "dial_code": "+974",
                        "code": "QA"
                    }
                ]);
                setLoading(false);
            });
    }
    
    const drawLine=(colorstr,width)=>{
        return(
            <View
            style={{
                borderBottomColor: colorstr,
                borderBottomWidth: width,
            }}/>
            );
        }
        
        
        const setView=(_state)=>{
            setOpen(_state);
        }
        const getallItems=()=>{
            if(countryCode.length>0)
            {
                allLines=[];
                for (let index = 0; index < countryCode.length; index++) {
                    const element = countryCode[index];
                    const inValue=index;
                    allLines.push(
                        <View>
                        <TouchableOpacity key={"index"+inValue} onPress={()=>{
                            setOpen(0);
                            setDatafromDropDown(inValue);
                            var dataUpdate=updateData;
                            dataUpdate(countryCode[inValue].code);
                        }} style={[styles.ItemStyle,defaultValue==inValue?{backgroundColor:Colors.bgColor}:{}]}>
                        <FastImage 
                        resizeMode='stretch'
                        style={{width:widthPercentageToDP(9),height:widthPercentageToDP(6.5),alignSelf:'center'}}
                        source={{
                            uri:WebServices.flagUrl.replace('{Code}',countryCode[inValue].code.toLowerCase())}}/>
                            <Text allowFontScaling={false} key={"index1"+inValue} style={[styles.textStyle,defaultValue==inValue?{}:{}]}>
                                {countryCode[inValue].code}</Text>
                        <Text  allowFontScaling={false} key={"index2"+inValue}style={[styles.textStyle,defaultValue==inValue?{}:{}]}>{countryCode[inValue].name}</Text>
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
                        shadow:{
                            shadowOffset: { width: 0, height: 3 },
                            shadowRadius: 3,
                            shadowOpacity: 0.12,
                        },
                        textStyle:{
                            color:Colors.black,
                            alignSelf:'center',
                            marginStart:10,
                            fontSize:17,fontFamily:'Cairo-Regular',fontWeight:'200'},
                            titleStyle:{padding:10,fontSize:18,fontFamily:'Cairo-Bold',color:Colors.whiteColor,alignSelf:'center',textAlign:'center'},
                            ItemStyle:{
                                marginLeft:-10,marginRight:-10,paddingLeft:10,paddingRight:10,
                                flexDirection:'row',
                                height:50,
                            }
                        });
                    return(
                        <View 
                        style={[{zIndex:2}]}>
                        <TouchableOpacity disabled={!editable} style={[ItemSelectedStyle]} onPress={()=>{
                            setOpen(open==1?0:1)
                            }}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'center',width:'80%'}}>
                        <Text allowFontScaling={false} style={[{width:'100%',color:Colors.inputfontColor},textStyle,{opacity:(countryCode.length>0&&datafromDropDown!=-1)?1:0.6}]}>
                        {(countryCode.length>0&&datafromDropDown!=-1)?countryCode[datafromDropDown].name:("*"+i18n.t('country'))}
                        </Text>
                        <Image style={{width:12,height:12,alignSelf:'center',tintColor:Colors.blueColor}} source={dropIcon}/></View>
                        </TouchableOpacity>
                        <Modal  statusBarTranslucent={true} transparent={true} visible={open==1}> 
                        <View style={{justifyContent:'center',height:'100%'}}> 
                        <TouchableOpacity onPress={()=>{
                            setOpen(0);
                        }} style={{width:widthPercentageToDP(100),height:heightPercentageToDP(100),justifyContent:'center',backgroundColor:Colors.tabBarbg}}>
                        </TouchableOpacity>
                        <View style={[{position:'absolute', borderRadius:15,overflow:'hidden',backgroundColor:Colors.whiteColor
                        ,width:widthPercentageToDP(80),height:heightPercentageToDP(80),alignSelf:'center'}]}>
                        <View style={{flexDirection:'row',justifyContent:'center',backgroundColor:Colors.blueColor}}>
                        <Text allowFontScaling={false} style={styles.titleStyle}>{i18n.t('choosecountrycode')}</Text>
                        {/* <TouchableOpacity onPress={()=>{
                            setState({open:0})
                        }}>
                        <Text allowFontScaling={false} style={[styles.titleStyle,{marginEnd:10,transform:[{scaleX:1.5}]}]}>X</Text>
                        </TouchableOpacity> */}
                        </View>
                        {/* {drawLine(Colors.orangeShadeColor,2)} */}
                        <ScrollView style={{backgroundColor:Colors.bgColor, paddingLeft:10,paddingRight:10}}>
                        {getallItems()}
                        </ScrollView>
                        </View></View>
                        </Modal>
                        </View>
                        )
                    }
                
             
                    