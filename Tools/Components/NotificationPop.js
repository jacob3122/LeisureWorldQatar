import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import React, { Component, useEffect, useState } from 'react'
import { PureComponent } from 'react';
import { StyleSheet,Modal, View,Text,Dimensions,TouchableOpacity} from 'react-native';
// import Colors from '../constants/Colors';

import * as tools from '../../Tools/Components/Tools.js';
import BackgroundWall from './BackgroundWall';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';

import { logScreenViewEvent } from '../Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
    
export default function NotificationPop(props){
    const Colors =useTheme();
        
    const[notification,setNotification]=useState(props.notification);
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    
    useEffect(()=>{
        logScreenViewEvent('Notification','NotificationPop');
    },[]);
   
    const onDone=(stateIn)=>{
        let ondone=props.onDone;
        ondone();
    }
    
        const styles = StyleSheet.create({
            button:{
                alignSelf:'center',
                backgroundColor:Colors.blueColor,
                justifyContent:'center',
                width:widthPercentageToDP(30),
                height:heightPercentageToDP(4.75),
                borderRadius:heightPercentageToDP(4.75)
            },
            buttontext:{
                includeFontPadding:false,
                textAlign:'center',
                fontFamily:'Cairo-Regular',
                fontSize:18,
                color:Colors.whiteColor
            },
            title:{
                includeFontPadding:false,

                fontFamily:'Cairo-Bold',
                fontSize:widthPercentageToDP(5),
                alignSelf:'center',
                textAlign:'center',
                color:Colors.black
    
            },
            body:{
                includeFontPadding:false,

                fontFamily:'Cairo-Regular',
                fontSize:widthPercentageToDP(4),
                alignSelf:'center',
                textAlign:'center',
                color:Colors.black

            },
            loading: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor:Colors.bgColor,
                zIndex:10,
                height:'100%'
            }
        });
            return (
                <View style={styles.loading} >
                <BackgroundWall blur={true} opacity={notification.backgroundWallOpacity}/>
                <View style={{width:'80%',backgroundColor:Colors.whiteColor,padding:widthPercentageToDP(3),alignSelf:'center',borderRadius:widthPercentageToDP(3)}}>
                <Text style={styles.title}>{notification.data.Title}</Text>
                <Text style={styles.body}>{tools.stringIsContains(i18n.locale,'en')?notification.data.BodyEn:notification.data.BodyAr}</Text>
                <View style={{flexDirection:'row',width:'90%',alignSelf:'center',justifyContent:'center',marginTop:heightPercentageToDP(2)}}>
                    <TouchableOpacity
                    onPress={()=>{
                        onDone(true);
                    }} style={styles.button}>
                        <Text style={styles.buttontext}>{i18n.t('proceed')}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity 
                    onPress={()=>{
                        this.onDone(false);
                    }}
                    style={styles.button}>
                        <Text style={styles.buttontext}>{I18n.t('cancel')}</Text>
                    </TouchableOpacity> */}
                  
                </View>
                </View>
                </View>
                )
        }