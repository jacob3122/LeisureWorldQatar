import React from 'react'
import { StyleSheet,TouchableOpacity, Text, View, Image, FlatList, SafeAreaView } from 'react-native';
import backButton from '../../assets/Icons/back.png'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
// import Colors from '../constants/Colors';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as Tools from './Tools'
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';

const TopBackBar = ({navigation,onDone=undefined,children}) => {
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const styles = StyleSheet.create({
        container: {
            width:'90%',
            flexDirection:'row',
            alignSelf:'center',
            justifyContent:'space-between'
        },
        backImageTouch: {
            // marginTop:heightPercentageToDP(2),
            // marginBottom:heightPercentageToDP(1),
            width: 35,
            height: 35,justifyContent:'center',
            // marginStart:widthPercentageToDP(4)
        }, backImage: {
            width: 25,
            height: 25,
            tintColor:Colors.blueColor,
        },
    });
    return (
        <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backImageTouch}
        onPress={()=>{
            if(onDone!=undefined){
                onDone();
            }else{
                navigation.goBack()
            }}}>
            <Image style={[styles.backImage,{transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}]}
            source={backButton}/>
            </TouchableOpacity>
            {children}
            </SafeAreaView>
            )
        }
        
        export default TopBackBar
        