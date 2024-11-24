// import I18n from 'i18n-js';
import React, { Component, useEffect, useRef } from 'react'
import { PureComponent } from 'react';
import { StyleSheet,Modal, View,Text,Dimensions,Image, Animated, Easing} from 'react-native';

import * as tools from '../../Tools/Components/Tools.js';
import { useTheme } from '../context/ThemeProvider';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


export default function InfoBar(props) {
    const {state,dispatch}=useAppContext();
    const Colors=useTheme();
    const translateY = useRef(new Animated.Value(-100)).current;
    const topValueInPixels = (9 / 100) * height; 
    const topValueInPixelstoGoBack = (-9 / 100) * height; 
    useEffect(()=>{
        Animated.timing(translateY, {
            toValue: topValueInPixels, // Move to the top (0%)
            duration: 300, // 1 second
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
        
        setTimeout(() => {
            Animated.timing(translateY, {
                toValue: topValueInPixelstoGoBack, // Move back to the top (100%)
                duration: 200, // 1 second
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }, 3000); // Stay for 5 seconds
        
        setTimeout(() => {
            if(!tools.IsNull(props.onDone)){
                var isdone=props.onDone;
                isdone();
            }
            dispatch({
                type:'update_ShowInfo',
                payload:undefined
            })
        }, 3200);
    });
    const styles = StyleSheet.create({
        
        loading: {
            width:'100%',height:'5%',
            position: 'absolute',
            alignItems: 'center',
            top:-'5%',
            justifyContent: 'center',
            zIndex:10,
        }
    });
    console.log(translateY);
    return (
        
        <Animated.View style={[styles.loading,{top: ((translateY)),}]}  pointerEvents={'box-none'}>
        <View style={{backgroundColor:Colors.whiteColor,borderRadius:20,width:'100%',height:'100%',justifyContent:'center',alignSelf:'center',shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,}}>
        <Text allowFontScaling={false} style={{width:'100%',color:Colors.inputfontColor,fontFamily:'Cairo-Bold',fontSize:18,textAlign:'center'}}>{props.textToDisplay}</Text>
        </View>
        </Animated.View>
        )
    }
    