import CheckBox from "@react-native-community/checkbox";
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { Modal, View,StyleSheet,Text,Image, SafeAreaView, TouchableOpacity} from "react-native";
import { BiometryTypes } from "react-native-biometrics";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import ReactNativeBiometrics from 'react-native-biometrics';
import { useEffect, useState } from "react";
import faceidIcon from'../../assets/Icons/faceid.png'
import touchidIcon from'../../assets/Icons/touchid.png'
// import Colors from "../constants/Colors";
import SecureStore from "./SecureStore";
import { useTheme } from "../context/ThemeProvider";
import { useAppContext } from "../../src/js/reducers/AppReducer";

function BiometricRequest({onSetBio,visible}) {
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const Colors=useTheme();
    const[biometryType,setBioType]=useState({});

    const[bioAvailable,setBioAvail]=useState(false);

    const[dontShowBioAgainIn,setDontShow]=useState(false);
    
    const[isVisible,setVisible]=useState(true);
    const[rnBiometrics,setrnBiometrics]=useState(undefined);

    var biometry;

    const styles = StyleSheet.create({
        descriptionTxt:{
            textAlign:'center',
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(4),
            alignSelf:'center',
            color:Colors.inputfontColor,
            marginStart:widthPercentageToDP(2)
        },
        dontText:{
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(4),
            alignSelf:'center',
            color:Colors.inputfontColor,
            marginStart:widthPercentageToDP(2)
        },titleTxt:{
            fontFamily:'Cairo-SemiBold',
            fontSize:widthPercentageToDP(6),
            alignSelf:'center',
            color:Colors.blueColor,
        },
        buttonTxt:{
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(4),
            alignSelf:'center',
            marginHorizontal:widthPercentageToDP(5),
            marginVertical:widthPercentageToDP(1),
            // marginStart:widthPercentageToDP(2)
        },button:{
            backgroundColor:Colors.blueColor,
            marginBottom:heightPercentageToDP(2),
            // height:heightPercentageToDP(4.75),
            borderRadius:heightPercentageToDP(4.75)
        }
    })
    useEffect(() => {
        SecureStore.getItemAsync('dontshowAgain').then(valIn=>{
            // console.log("setDontShowBio"+valIn)
            setDontShow((valIn=="Y")?true:false);
          });
        // console.log("BiometricRequest");
        async function biometricInit(){
            setrnBiometrics(new ReactNativeBiometrics({ allowDeviceCredentials: true }));
            
        }
        biometricInit();
    }, [""]);
    useEffect(() => {
        async function biometricInit(){
            let biometry = await rnBiometrics.isSensorAvailable();
            // console.log(JSON.stringify(biometry));
            setBioAvail(biometry.available);
            setBioType(biometry.biometryType);
            if(!biometry.available){
                setVisible(false);
            }
        }
        if(rnBiometrics!=undefined){
            biometricInit();
        }
    },[rnBiometrics]);
    return(
        <Modal visible={isVisible}>
            <SafeAreaView style={{width:'100%',height:'100%',backgroundColor:Colors.bgColor}}>
           {(biometryType!=null&&bioAvailable)&&<>
            <View style={{marginTop:heightPercentageToDP(3)}}>
            <Image
            resizeMode='contain'
            source={Platform.OS=='android'?touchidIcon:((biometryType==BiometryTypes.FaceID)?faceidIcon:touchidIcon)}
            style={{width:widthPercentageToDP(18),height:widthPercentageToDP(18),alignSelf:'center'}}
            />
            <Text numberOfLines={1} allowFontScaling={false} style={styles.titleTxt}>{i18n.t('enable')} {i18n.t((biometryType==BiometryTypes.FaceID)?'face':'touch')}</Text>
            <View style={{marginTop:heightPercentageToDP(4),width:'70%',alignSelf:'center'}}>
                <Text style={styles.descriptionTxt}>{i18n.t('wouldliketouseforfuture')}</Text>
            </View>
            <View style={{flex:1,alignSelf:'center',justifyContent:'center',position:'absolute',top:heightPercentageToDP(60)}}>
                <TouchableOpacity onPress={()=>{
                    // console.log('onSetBio'+dontShowBioAgainIn);
                    onSetBio(true,dontShowBioAgainIn);
                    setVisible(false)
                }}style={styles.button}>
                <Text allowFontScaling={false} style={styles.buttonTxt}>{i18n.t('yesenablebiometric')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    // console.log('onSetBio'+dontShowBioAgainIn);

                    onSetBio(false,dontShowBioAgainIn);
                    global.checkBio=false;
                }} style={[styles.button,{backgroundColor:Colors.bgColor}]}>
                <Text allowFontScaling={false} style={[styles.buttonTxt,{color:Colors.blueColor}]}>{i18n.t('nothankyou')}</Text>
                </TouchableOpacity>
            </View>
            </View>
            <View style={{flexDirection:'row',alignSelf:'center',position:'absolute',bottom:heightPercentageToDP(5)}}>
            <CheckBox
            onFillColor={Colors.blueColor}
            onCheckColor={Colors.whiteColor}
            onTintColor={Colors.whiteColor}
            boxType='square'
            disabled={false}
            value={dontShowBioAgainIn}
            onValueChange={(newValue) =>{
                // console.log(newValue);
                setDontShow(newValue);
            }}
            />
            <Text allowFontScaling={false} style={styles.dontText}>{i18n.t('dontshowagain')}</Text>
            </View></>}
            </SafeAreaView>
            </Modal>
            )
        }
        
        export default BiometricRequest;
        
       