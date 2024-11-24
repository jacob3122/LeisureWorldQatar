import React, { Component, useEffect, useState } from 'react'
import {StyleSheet,View,Text,Image,TouchableOpacity,PixelRatio,Dimensions,SafeAreaView, StatusBar} from 'react-native'
import * as UiElements from './UIElements'
import QuestionAnswer from './QuestionAnswer';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../constants/Colors';
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import WebServices from '../../Tools/constants/WebServices'

import backButton from '../../assets/Icons/back.png'


// import backIcon from'../../assets/Icons/back.png'
import HeaderLogo from './HeaderLogo';
import OverlayLoad from './OverlayLoad';
// import BackButton from './BackButton';
import * as Tools from './Tools'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { StackActions, useNavigation, useNavigationState } from '@react-navigation/native';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import CardTopBar from './CardTopBar';
import WebView from 'react-native-webview';
import { logScreenViewEvent } from '../Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
export default function RulesPage(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const routeName=useNavigationState((state)=>state.routes);
    //     return <RulesPage {...props} routeName={routeName} Colors={Colors}/>
    // }
    
    // class RulesPage extends Component {
    
    // static navigationOptions = ({navigation}) => {
    //     return{
    //         header:null,
    //         headerVisible:false,
    
    //     };
    // };
    // constructor(props){
    //     super(props);
    //     state={
    //         data:{},
    //         loading:true
    //     }
    // }
    
    const [data,setData]=useState({});
    const [loading,setLoading]=useState(true);
    
    
    useEffect(()=>{
        logScreenViewEvent("RulesPage","Rules");
        Tools.updateRatePoints(1);
    },[])
    
    
    
    const getRulesData=()=>{
        return fetch(WebServices.MainURL+WebServices.faq.replace('{Localize}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en'))//+"?rand="+ Math.floor(Math.random() * 100000) + 1 )
        .then((response) => response.text())
        .then((findresponse)=>{
            // if (Platform.OS === 'android') {
            //     findresponse = findresponse.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            // }
            var json = JSON.parse(findresponse);
            setData(json.faqs);
            setLoading(false);
            // setState({
            //     data:json.faqs,loading:false
            // })
        }).catch(function(error) {
            console.warn('Request Failed: ', error);
        });
    }
    
    const checkLoading=()=>{
        if(!state.loading){
            return(
                <QuestionAnswer data={state.data}/>
                )
            }else{
                // {state.loading&&<OverlayLoad size='large' color='gray'/>}
            }
        }
        const styles = StyleSheet.create({
            totalView:{
                overflow:'hidden',
                alignSelf:'center',
                justifyContent:'center',
                height:'89%',
                width:widthPercentageToDP(93),
                borderRadius:widthPercentageToDP(4),
                backgroundColor:Colors.whiteColor,
                marginTop:heightPercentageToDP(1)
            },
            backIcon:{
                alignSelf:'center',
                marginTop:20,
                width:40,
                height:40
            },
            
            bgImage:{
                position:'absolute',
                alignSelf:'center',
                width:'100%',
                height:height,
            },
            homeView:{
                margin:15,
                height:'95%',
                alignSelf:'center'
                // height:height
            },
            heading: {
                fontSize: 40,
                paddingBottom:5,
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Bold'
                
            },
            subheading: {
                fontSize: 22,
                paddingBottom:5,
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Bold'
            },
            answers: {
                fontSize: 20,
                fontWeight: '700',
                paddingBottom:5,
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Regular'
            },detailstitle:{
                textAlign:'center',
                alignSelf:'center',
                // marginTop:15,
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Bold',
                fontSize:14,
                lineHeight:14*1.5,
                textTransform:'uppercase',
                // lineHeight: AdaptiveWidth(18) * 1.6,
                // height: AdaptiveWidth(18)* 1.3,
            },
            bottomBar:
            {
                width:widthPercentageToDP(20),
                backgroundColor:Colors.blueColor,
                alignItems:'center',
                alignSelf:'center',
                justifyContent:'center',
                height:widthPercentageToDP(12),
                borderRadius:widthPercentageToDP(4)
            },
            claimBut:{
                borderRadius:6,
                alignSelf:'center',
                width:12,
                height:12,
                backgroundColor:Colors.blueColor
            },
            
        });
        
        return (
            <View style={{flex:1,backgroundColor:Colors.bgColor}}>
            <BackgroundWall/>
            <SafeAreaView style={{flex:1,marginTop:StatusBar.currentHeight}}>
            <TouchableOpacity style={{ marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{
                if(routeName.length==1)
                props.navigation.reset({routes:[{name:'CardsHome'}]})
                else{
                    props.navigation.goBack()
                }
            }}>
            <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
            </TouchableOpacity>
            <View style={{flex:1,alignSelf:'center',width:widthPercentageToDP(100),marginTop:heightPercentageToDP(1)}}>
            <CardTopBar selected={2} navigation={props.navigation} assignProfile={props.assignProfile} isLoading={props.isLoading} profile={props.profile} redeem={props.redeem} redeemPoint={props.redeemPoint} redeemProfile={props.redeemProfile}/>
            <WebView
            source={{uri:WebServices.MainURL+(Tools.stringIsContains(i18n.locale,'en')?WebServices.rulesPageEn:WebServices.rulesPageAr)}}
            />
            </View>
            </SafeAreaView>
            </View>
            )
        }
        