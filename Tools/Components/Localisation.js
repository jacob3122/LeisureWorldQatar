import React, { useEffect, useReducer, useState } from 'react';
import {connect} from 'react-redux';
import {getLocale} from '../../src/js/actions/profileActions';
import {I18n} from 'i18n-js';
// import {en,ar} from '../../assets/Localization/Localize'
import translations from '../../assets/Localization/Localize.json'
import {en,ar} from '../../assets/Localization/Localize.json'

import RNRestart from 'react-native-restart';
import { Platform,StyleSheet} from "react-native";
import SecureStore from '../../Tools/Components/SecureStore';

import { I18nManager } from 'react-native';

import { Provider } from 'react-redux';
import { store } from '../../src/ProfileStore';

import AppNavigation from '../Navigation/AppNavigation';
import * as tools from '../../Tools/Components/Tools.js';
import WebServices from '../constants/WebServices';
import { NativeModules } from 'react-native';
import AppReducer, { initialState, useAppContext } from '../../src/js/reducers/AppReducer';
// i18n.translations = { en,ar };
// i18n.fallbacks = true;
const i18n = new I18n(translations);
export default function Localisation (props) {
    const { state, dispatch } = useAppContext();
    const [locale,setLocale]=useState('');
    const [deflocale,setDefLocale]=useState('');
    const [check,setCheck]=useState(false);
    useEffect(()=>{
        dispatch({
            type: 'update_Translation',
            payload: {en,ar}
        });

        var localeIn =
        Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale
        : 'en';
        localeIn=tools.stringIsEmpty(localeIn)?'en':localeIn.substring(0, 2);
        // console.log("T:"+localeIn);
        global.locale=localeIn;
        setLocale(localeIn);
        setDefLocale(localeIn);
    },[])

    useEffect(()=>{
        localizeApp();
    },[locale])
    
    
    const getLocalizeData= async()=>{
        if(tools.stringIsEmpty(locale)){
            return;
        }
        var urlIn=WebServices.MainURL+WebServices.localizeData.replace('{Localize}',tools.stringIsContains(i18n.locale,'ar')?'ar':'en');
        return fetch(urlIn+"&rand="+ Math.floor(Math.random() * 100000) + 1)
        .then(response  => response.text())
        .then((findresponse)=>{
            var json = JSON.parse(findresponse);
            var en=json.localization;
            var ar=json.localization;
            dispatch({
                type: 'update_Translation',
                payload: {en,ar}
            });
            i18n.translations = {en,ar};
        }).catch(function(error) {
        });
        
    }
    
    const localizeApp=()=>{
        if(tools.stringIsEmpty(locale)){
            return;
        }
        SecureStore.getItemAsync('languageENAR').then(languagecheck=>{
            // console.log(locale+'languageENAR'+languagecheck);
            reload=false;

            if(tools.stringIsEmpty(languagecheck)){
                i18n.locale=locale
            }else{
                i18n.locale=languagecheck;
            }
            getLocalizeData();
            
            CheckRTL=(i18n.locale.indexOf("ar") > -1)?true:false;
            I18nManager.allowRTL(CheckRTL);
            I18nManager.forceRTL(CheckRTL);
            
            global.locale=i18n.locale;
            // SecureStore.setItemAsync('languageENAR',i18n.locale);
            dispatch({
                type: 'get_Locale',
                locale: i18n.locale
            });
            if(!check){
                setLocale(i18n.locale);
                setCheck(true);
            }
            reloadApp();
            // this.forceUpdate();
        });
    }
    
    const reloadApp=()=>{
        // Updates.reload();
    }
    
    const getApp=()=>{
        if(check)
        return (
    // <View></View>
        <AppNavigation reload={reloadApp}/>
        );
    }
    
    return(
        // <Provider store={store}>
        // {
        getApp()
        // }
        // </Provider>
        );
    }
    const styles = StyleSheet.create({
        title:{
            fontSize:20,
            fontWeight:'300',
        }
        
    })
    
    
    
    
    
    
    