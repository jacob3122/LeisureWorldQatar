
import React, { Component, useState } from 'react'
import { PureComponent } from 'react';
import { StyleSheet,Modal, View,Text,Dimensions,Image, TouchableOpacity,TextInput,SafeAreaView} from 'react-native';
// import Colors from '../constants/Colors';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import cameraIcon from '../../assets/Icons/camera.png'
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import backButton from '../../assets/Icons/back.png'

import * as tools from '../../Tools/Components/Tools.js';
import GestureFlipView from 'react-native-gesture-flip-card';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import proceedB from '../../assets/Icons/back.png'
// import Barcode from 'react-native-barcode-builder';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import OverlayLoad from './OverlayLoad';
import WebServices from '../constants/WebServices';
import FastImage from 'react-native-fast-image'
import BarcodeInput from './BarcodeInput';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import Barcode from './Barcode.js';

export default function AddPlayCard(props){
    const Colors =useTheme();
    cardsViewRef=React.createRef();
    textRef=React.createRef();
    
    const[cameraView,setCameraView]=useState(0);
    const[valueText,setValueText]=useState("");
    const[isLoading,setIsLoading]=useState(false);
    const[canclose,setCanclose]=useState(0);
    const[isVisible,setIsVisible]=useState(props.isopen);
    const [card,setCard]=useState({
        verify:false,
        CardNo:"0000000000*000"
    });
    
    const getColor=(_parkType)=>{
        
        if(_parkType=="AB"){
            return Colors.abColor
        }
        else if(_parkType=="VC"){
            return Colors.vcColor
        }
        else if(_parkType=="SD"){
            return Colors.sdColor
        }else{
            return Colors.inactiveTab
        }
    }
    
    
    const getCardNo=(_card)=>{
        var _cardNo=(_card.CardNo)
        return _cardNo;
        
    }
    const openCamera=()=>{
        setCameraView(1);
    }
    const renderBack=(card)=>{
        return(
            <View style={{justifyContent:'center',borderRadius:20,overflow:'hidden'
            ,alignSelf:'center',width:widthPercentageToDP(79),height:heightPercentageToDP(25), backgroundColor:getColor(card.ParkName)}}>
            {!card.verify&&<View style={{width:'100%',height:'100%',justifyContent:'center'}}>
            
            <TouchableOpacity style={{width:'35%',alignSelf:'center',justifyContent:'center',backgroundColor:Colors.blueColor,borderRadius:10,borderRadius:20,height:'20%'}}
            onPress={()=>{
                cardsViewRef.current.flipRight();  // counterclockwise
            }}>
            
            <Text allowFontScaling={false} style={styles.buttonTxt}>{i18n.t('add')}</Text>
            </TouchableOpacity>
            <View style={{ position:'absolute',
            bottom:'2%',width:'100%'}}>
            </View>
            </View>}
            {
                card.verify&&
                <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
                <View style={{position:'absolute',top:'5%',right:'5%',backgroundColor:Colors.whiteColor,borderRadius:15,overflow:'hidden'}}>
                <Barcode value={card.CardNo} 
               viewStyle={{marginTop:heightPercentageToDP(1),marginBottom:heightPercentageToDP(1)}} width={widthPercentageToDP('.32%')}height={heightPercentageToDP('4%')}
                format="CODE128" />
                <Text allowFontScaling={false} style={[styles.cardno,{fontSize:14,marginTop:-12,color:Colors.black}]}>{card.CardNo}</Text>
                </View>
                </View>
                
            }
            
            
            </View>
            );
        }
        
        
        const renderFront=(card)=>{
            return(
                <View style={{justifyContent:'center',borderRadius:20,alignContent:'center',alignItems:'center'
                ,alignSelf:'center',width:widthPercentageToDP(79),height:heightPercentageToDP(25), backgroundColor:getColor(card.ParkName)}}>
                {card.verify&&<View style={{width:'100%',height:'100%'}}>
                <View style={{flexDirection:'row',flex:1, alignSelf:'center'}}>
                <TouchableOpacity  style={{width:'35%',alignSelf:'center',justifyContent:'center',backgroundColor:Colors.whiteColor,borderRadius:10,height:'20%'}}
                onPress={()=>{
                    
                }}>
                <Text allowFontScaling={false} style={styles.buttonTxt}>{i18n.t('topup')}</Text>
                </TouchableOpacity>
                </View>
                <View style={{position:'absolute',flexDirection:'row',justifyContent:'center',right:'5%',bottom:'2%',alignItems:'center'}}><Text style={styles.balanceTxt}>{i18n.t("yourbalance")}</Text>
                <Text allowFontScaling={false} style={styles.balanceVal}>{card.Balance}</Text>
                </View> 
                </View>
            }
            {!card.verify&&
                <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
                {/* <Text style={[styles.balanceVal,{fontSize:20,textAlign:'center',textTransform:'uppercase'}]}>{i18n.t('confirmcard')}</Text> */}
                {/* <View style={{flexDirection:'row',width:'60%',height:'20%',alignSelf:'center'}}> */}
                <View style={{flexDirection:'row',width:'70%',height:'20%',alignSelf:'center'}}>
                <TextInput 
                ref={ref=>{
                    textRef.current=ref;
                }}
                value={valueText}
                allowFontScaling={false} maxLength={14} placeholder={getCardNo(card)} 
                onChangeText={(textIn)=>{
                    setValueText(textIn);
                }}
                onEndEditing={(textIn)=>{
                    setValueText(textIn.nativeEvent.text);
                }}
                style={[{fontFamily:'Cairo-Regular',backgroundColor:Colors.whiteColor,includeFontPadding:false,
                width:'100%',alignSelf:'center',height:heightPercentageToDP(4.75),borderRadius:heightPercentageToDP(4.75),padding:5,fontSize:widthPercentageToDP(4.5),
                textAlign:'center'},styles.shadow]}/>
                <TouchableOpacity style={{position:'absolute',alignSelf:'center',end:'5%'}} onPress={()=>{
                    openCamera();
                }}><Image style={{tintColor:Colors.blueColor}} source={cameraIcon}/></TouchableOpacity></View>
                <TouchableOpacity 
                style={{marginTop:'5%',backgroundColor:Colors.blueColor,justifyContent:'center',alignSelf:'center',borderRadius:heightPercentageToDP(4.75)
                ,height:heightPercentageToDP(4.75),paddingLeft:'5%',paddingRight:'2%'}} 
                onPress={()=>{
                    var textVal=valueText;
                    if(textVal.length==0){
                        return;
                    }
                    // console.log("T :"+textVal);
                    if(tools.stringIsContains(valueText,"*"))
                    textVal=valueText.substring(0,valueText.indexOf('*'));
                    // console.log("T :"+textVal);
                    var search=props.searchMedia;
                    search(textVal,props.accessToken);
                }}>
                <View style={{flexDirection:'row'}}>
                <Text allowFontScaling={false} style={[styles.buttonTxt]}>{i18n.t('confirmcard')}</Text>
                {/* <Image source={proceedB} style={styles.backbut} ></Image> */}
                </View>
                </TouchableOpacity> 
                {/* </View> */}
                
                {/* <View style={{position:'absolute',flexDirection:'row',justifyContent:'center',right:'5%',bottom:'2%',alignItems:'center'}}>
                <Text style={styles.balanceTxt}>{i18n.t("yourbalance")}</Text>
                <Text style={styles.balanceVal}>{card.Balance}</Text>
            </View>  */}
            {cameraView==1&&<BarcodeInput visible={cameraView==1} onDone={updateInput}/>}
            </View>
        }
        </View>
        );
    }
    const updateInput=(_output)=>{
        // textRef.current.setNativeProps({ text: _output })
        setValueText(_output);
        setCameraView(0);
    }
    
    const getEmptyCard=()=>{
        {
            
            return (
                <View style={{alignSelf:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>{
                    if(cardsViewRef!=undefined){
                        cardsViewRef.current.flipLeft();  // counterclockwise
                    }
                }} style={styles.container}>
                
                <GestureFlipView
                ref={ref=>{
                    cardsViewRef.current=ref;
                }}
                width={widthPercentageToDP(79)}
                height={heightPercentageToDP(25)}
                renderFront={() => renderFront(card)}
                renderBack={() => renderBack(card)}
                />
                </TouchableOpacity></View>
                )
                ;
            }
        }
        
            const styles = StyleSheet.create({
                container:{
                    width:'90%',
                    alignSelf:'center'
                },
                buttonText:{
                    fontFamily:'Cairo-Regular',
                    textAlign:'center',
                    color:Colors.whiteColor,
                    fontSize: widthPercentageToDP(4.2),
                    paddingHorizontal:widthPercentageToDP(4)
                    // lineHeight:15*1.5,
                    // textTransform:'uppercase'
                },buttonView:{
                    position:'absolute',
                    bottom:'6%',
                    backgroundColor:Colors.blueColor,height:heightPercentageToDP(4.75),
                    borderRadius:heightPercentageToDP(4.75),alignSelf:'center',
                    justifyContent:'center',paddingLeft:'2%',paddingRight:'2%'
                },
                
                backbut:{
                    tintColor:Colors.orangeShadeColor,
                    alignSelf:'center',
                    width:25,
                    height:25,
                    transform:[{translateX:0}, {rotateZ:'180deg'}],
                    zIndex:10,
                },
                buttonTxt:{
                    includeFontPadding:false,
                    paddingHorizontal:widthPercentageToDP(4),
                    alignSelf:'center',
                    // textTransform:'uppercase',
                    fontFamily:'Cairo-Regular',
                    textAlign:'center',
                    fontSize: widthPercentageToDP(4.2),
                    color:Colors.whiteColor
                },
                cardno:{
                    includeFontPadding:false,
                    alignSelf:'center',
                    // textTransform:'uppercase',
                    fontFamily:'Cairo-Regular',
                    fontSize: 30,
                    textAlign:'center',
                    color:Colors.whiteColor,
                },
                balanceTxt:{
                    color:Colors.inputfontColor,
                    // paddingTop:15,
                    fontFamily:'Cairo-Bold',
                    // textTransform:'uppercase',
                    fontFamily:'Cairo-Regular',
                    fontSize: 25,
                    textAlignVertical:'center',
                },
                balanceVal:{
                    includeFontPadding:false,
                    textAlignVertical:'center',
                    color:Colors.whiteColor,
                    // paddingTop:15,
                    fontWeight:'100',
                    fontFamily:'Cairo-Regular',
                    fontSize: 30,
                    paddingStart:10,
                },
                loading: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    zIndex:10,
                }, tagline:{
                    includeFontPadding:false,
                    fontFamily:'Cairo-Bold',
                    // fontFamily:'Cairo-Bold',
                    fontSize:widthPercentageToDP(7),
                    alignSelf:'flex-start',color:Colors.inputfontColor
                    
                }, shadow:{
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 3,
                    shadowOpacity: 0.12,
                },
            });
            return (
                <View style={{}}>
                <View style={styles.loading} >
                <SafeAreaView style={{width:widthPercentageToDP(93),alignSelf:'center'}}>
              
                <Text allowFontScaling={false} style={[styles.tagline,{}]}>
                {i18n.t('manualaddcards')}
                </Text>
                {getEmptyCard()}
              
                </SafeAreaView></View>
                </View>
                )
            }
        
        