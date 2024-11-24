import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import React, { Component, useEffect, useState } from 'react'
import { PureComponent } from 'react';
import { StyleSheet,Modal, View,Text,Dimensions,Image} from 'react-native';
import Colors from '../constants/Colors';

import * as tools from '../../Tools/Components/Tools.js';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

// const loadImages = [
//     require('../../assets/load/1.png'),
//     require('../../assets/load/2.png'),
//     require('../../assets/load/3.png'),
//     require('../../assets/load/4.png'),
//     require('../../assets/load/5.png'),
//     require('../../assets/load/5.png'),
//     require('../../assets/load/5.png'),
//     require('../../assets/load/4.png'),
//     require('../../assets/load/3.png'),
//     require('../../assets/load/2.png'),
//     require('../../assets/load/1.png'),

// ];
const loadGif = 
require('../../assets/load/load.gif');

export default function (props){
    const Colors =useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    let myinterval=undefined;    
    let _isMounted=false;
    const [loading, setLoading] = useState('loading');
    const [index, setIndex] = useState(0);
    const [closed, setClosed] = useState(0);
    const [canEnd, setCanEnd] = useState(false);
    const [visible, setVisible] = useState(false);
    const [canclose, setCanClose] = useState(0);
    const [loadNo, setLoadNo] = useState(2);
    const [isVisible, setIsVisible] = useState(props.isopen);
    
    
    useEffect(()=>{
        _isMounted=true;
        myinterval= setInterval(() => {
            setLoading('loading'+loadNo);
            setLoadNo(loadNo==3?2:(loadNo+1));
        }, 5000);
        return(()=>{
            _isMounted=false;
            clearInterval(myinterval)
        })
    },[]);

    useEffect(()=>{
        setIsVisible(props.isopen);
    },[props.isopen]);
    
    const styles = StyleSheet.create({
            
        loading: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:Colors.transparentBlack,
            
            zIndex:10,
        }
    });
    return(
        <Modal  statusBarTranslucent={true} animationType='none' transparent={true} visible={isVisible} onRequestClose={()=>{
            setIsVisible(false);
        }}>
                <View style={styles.loading} >
                <BackgroundWall opacity={0.5}/>
                
                <View style={{borderRadius:75,width:'100%',height:200,justifyContent:'center',alignSelf:'center'}}
                >
                <Text allowFontScaling={false} style={{width:'100%',color:Colors.black,includeFontPadding:false,
                fontFamily:'Cairo-Bold',fontSize:18,textAlign:'center'}}>{i18n.t(loading)}</Text>
                <Image source={loadGif} style={[{resizeMode:'contain',alignSelf:'center', width:150,height:61}]}/>
                </View>
                </View>
                </Modal>
                )
    }
    