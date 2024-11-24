import React, { Component, useEffect, useState } from 'react';
import {Image, View,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity, Animated, Easing} from 'react-native';
// import Colors from '../constants/Colors';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';
export default function LoadingLine(props){
    let myinterval=undefined;    
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [visibleText,setVisibleText]=useState(props.visibleText==undefined?true:false)
    const [loading,setloading]=useState('loading')
    const [loadNo,setloadNo]=useState(1)
    const [animation,setanimation]=useState(new Animated.Value(0))
    useEffect(()=>{
        Animated.loop(Animated.timing(animation,{
            toValue:1,
            duration:1000,
            useNativeDriver:false
        })).start();
        if(myinterval==undefined){
            myinterval= setInterval(() => {
                setloading('loading'+loadNo);
                setloadNo(loadNo==3?1:(loadNo+1))
            }, 5000);
        }
        return()=>{
            clearInterval(myinterval)
        }
    },[])
        const styles = StyleSheet.create({
            container:{
                justifyContent:'center',
                alignSelf:'center',
                alignItems:'center',
                width:'100%',
                overflow:'hidden',
                marginBottom:5,
            },
            LoadBar:{
                backgroundColor:Colors.blueColor,
                width:widthPercentageToDP(40),
                height:5,
                borderRadius:10,
            },
        });
        const tonfro =animation.interpolate({
            inputRange:[0,1],
            outputRange:[-250,250]
        });
        return(
            <View style={[styles.container,props.container]}>
            {visibleText&&<Text allowFontScaling={false} style={{width:'100%',color:Colors.black,fontFamily:'Cairo-Bold',fontSize:widthPercentageToDP(4.5),textAlign:'center'}}>{i18n.t(loading)}</Text>}
            <Animated.View style={[styles.LoadBar,{transform:[{translateX:tonfro}]},props.loadBar]}/>
            </View>
            );
        }
        