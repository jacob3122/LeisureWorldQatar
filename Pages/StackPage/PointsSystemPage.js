import { Image, SafeAreaView, TouchableOpacity, View,StyleSheet, Text, StatusBar } from "react-native";
import CardTopBar from "../../Tools/Components/CardTopBar";
import BackgroundWall from "../../Tools/Components/BackgroundWall";
import BackButton from "../../Tools/Components/BackButton";
import backButton from '../../assets/Icons/back.png'
import { useTheme } from "../../Tools/context/ThemeProvider";
import * as Tools from '../../Tools/Components/Tools';
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UiElements from '../../Tools/Components/UIElements'
import { useState } from "react";
import ClaimsHandlePop from "./ClaimsHandlePop";
import RedeemHandlePop from "./RedeemHandlePop";
import { useRoute } from "@react-navigation/native";
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useEffect } from "react";
import { useAppContext } from "../../src/js/reducers/AppReducer";

function PointsSystemPage({navigation,assignProfile,isLoading,profile,claims,redeem,redeemPoint,redeemProfile,redeemPoints,claimpoint,claimprofile,claimCheck}) {
    useEffect(() => {
        logScreenViewEvent("PointsSystemPage","PointsSystemPage");
    }, []);
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const route=useRoute();
    const [selectedTab,setSelectedTap]=useState(0);
    const styles = StyleSheet.create({
        tabButton:{
            width:'50%',
            height:'100%',
            justifyContent:'center'
        },
        tabText:{
            alignSelf:'center',
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(4),
        },
        innershadowC:{
            borderTopWidth:2,
            borderLeftWidth:2,
            borderColor:'rgba(0,0,0,0.16)',
            backgroundColor:Colors.blueColor
        },
        innershadowR:{
            borderTopWidth:2,
            borderRightWidth:2,
            borderColor:'rgba(0,0,0,0.16)',
            backgroundColor:Colors.blueColor
        }
        
    });
    const getClaimRedeem=()=>{
        return(
            <View style={{width:'90%',height:'75%',backgroundColor:Colors.whiteColor,alignSelf:'center',borderRadius:widthPercentageToDP(6),overflow:'visible'}}>
            <View style={{width:'100%',height:heightPercentageToDP(6),flexDirection:'row'}}>
            <TouchableOpacity 
            onPress={()=>{setSelectedTap(0)}} style={[styles.tabButton,{borderTopLeftRadius:widthPercentageToDP(6)},(selectedTab==0?styles.innershadowC:{}),]}>
            <Text style={[styles.tabText,selectedTab==0?{}:{color:Colors.black}]}>{i18n.t('claim').toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{setSelectedTap(1)}}  style={[styles.tabButton,{borderTopRightRadius:widthPercentageToDP(6),},(selectedTab==1?styles.innershadowR:{})]}>
            <Text style={[styles.tabText,selectedTab==1?{}:{color:Colors.black}]}>{i18n.t('redeem').toUpperCase()}</Text>
            </TouchableOpacity>
            </View>
            {getTab()}
            </View>
            )
        }
        
        const getTab=()=>{
            return(
                <View style={{width:'100%',height:'100%'}}>
                {selectedTab==0&&
                    <ClaimsHandlePop profile={profile} claimCheck={claimCheck} assignProfile={assignProfile} navigation={navigation} claims={claims} claimprofile={claimprofile} claimpoint={claimpoint} isLoading={isLoading}  redeem={redeem} redeemProfile={redeemProfile} redeemPoint={redeemPoint}/>}
                    {selectedTab==1&&
                        <RedeemHandlePop profile={profile} assignProfile={assignProfile} navigation={navigation} claims={claims} claimprofile={claimprofile} claimpoint={claimpoint} isLoading={isLoading}  redeem={redeem} redeemProfile={redeemProfile} redeemPoint={redeemPoint}/>}
                        </View>
                        )
                        
                    }
                    
                    return(
                        <View style={{flex:1,backgroundColor:Colors.bgColor}}>
                        <BackgroundWall/>
                        <SafeAreaView style={{marginTop:StatusBar.currentHeight}}>
                        <TouchableOpacity style={{marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{navigation.goBack()}}>
                        <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                        </TouchableOpacity>
                        {UiElements.drawGap(heightPercentageToDP(1))}
                        <CardTopBar selected={1} navigation={navigation} assignProfile={assignProfile} isLoading={isLoading} profile={profile} redeem={redeem} redeemPoint={redeemPoint} redeemProfile={redeemProfile}/>
                        </SafeAreaView>
                        {UiElements.drawGap(heightPercentageToDP(2))}
                        {getClaimRedeem()}
                        </View>
                        );
                    }
                    
                    export default PointsSystemPage;