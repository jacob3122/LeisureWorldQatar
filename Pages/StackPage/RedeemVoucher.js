import React, { Component } from 'react'
import {View,ScrollView,StyleSheet,Text,Image,SafeAreaView,TouchableOpacity,PixelRatio} from 'react-native';
import * as UiElements from '../../Tools/Components/UIElements'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Gradient from 'react-native-css-gradient';
// import Colors from '../../Tools/constants/Colors';
import Voucher from '../../Tools/Components/Voucher';
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import * as Tools from '../../Tools/Components/Tools.js'
import backButton from '../../assets/Icons/back.png'

// import vouchers from '../../Tools/constants/vouchers';
// import ButtonGroup from '../../Tools/Components/ButtonGroup';
import {AdaptiveWidth,AdaptiveHeight} from '../../Tools/Components/AdaptiveSize'
// import cardbgB from '../../assets/card/carddeb.png';

import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';

// import RedeemVenue from './RedeemVenue';
// import homebg from'../../assets/bg/bg-02.jpg'

// import appLogo from '../../assets/Icons/leisure_white.png'
import backIcon from'../../assets/Icons/back.png'
import StatusTracker from '../../Tools/Components/StatusTracker';
import HeaderLogo from '../../Tools/Components/HeaderLogo';
import BackButton from '../../Tools/Components/BackButton';
// import { NavigationEvents } from 'react-navigation';

import {Dimensions } from "react-native";
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

export default function(props){
    const route=useRoute();
    const color=useTheme();
    return <RedeemVoucher {...props} Colors={color} route={route}/>
}
class RedeemVoucher extends Component {
    
    styles=undefined
    _myScroll=ScrollView;
    
    constructor(props){
        super(props);
        this.state={
            loading:true,
            selectedPage:0,
        }
        this.handler = this.handler.bind(this);
        this.onNavigatorEvent=this.onNavigatorEvent.bind(this);
        
    }
    
    onNavigatorEvent() {
        // console.info(this.props.profile.FirstName);
        if(Tools.IsNull(this.props.profile)){
            this.props.navigation.navigate('Home',{pagetodivert:undefined});
        }
    }
    
    componentDidMount(){
        this.willFocus=this.props.navigation.addListener('focus',()=>{
            this.onNavigatorEvent();
        })
    }
    
    
    
    setLoadingState(stateP){
        this.setState({loading:stateP});
    }
    
    performActionWithTime(callback,params,timeTaken){
        setTimeout(() => {callback(params)},timeTaken);
    }
    
    
    getLoading(){
        return(
            <View>
            {UiElements.drawGap(10)}
            </View>
            )
        }
        handler(someValue) {
            this.setState({selectedPage: someValue});
            this.refs.scrollview.scrollTo({x: someValue*(width-20), y: 0, animated: true});
        }
        _contentViewScroll = (e) => {
            const scrolled =(e.nativeEvent.contentOffset.x);
            const position = (scrolled > 0) ? scrolled / width : 0;
            this.setState({selectedPage:Math.round(position)});
        }
        
        getVouchers(){
            const {route}=this.props;
            const {Colors}=this.props;
            
            inCount=3;
            // colorsIn=[Colors.bluelightShadeColor,Colors.blueColor,Colors.bluedarkShadeColor,Colors.blueColor];
            var allines=[];
            var allvoucher=route.params.voucherInfo;
            for(let t=0;t<allvoucher.ActiveVouchers.length;t++){
                // inCount-=1;
                // inCount=inCount<0?3:inCount;
                allines.push(
                    <Voucher key={t} profile={this.props.profile} voucherColor={allvoucher.ActiveVouchers[t].MemberCanRedeem?Colors.blueColor:Colors.bgColor} voucherInfo={allvoucher.ActiveVouchers[t]} navigation={this.props.navigation} redeemPoint={this.props.redeemPoint} assignProfile={this.props.assignProfile}/>
                    )
                }
                return(allines);
            }
            
            render() {
                const {Colors}=this.props;
                
        const styles = StyleSheet.create({
            detailstitle:{
                textAlign:'center',
                alignSelf:'center',
                // marginTop:15,
                color:Colors.whiteColor,
                fontFamily:'Cairo-Bold',
                fontSize:14,
                lineHeight:14*1.5,
                textTransform:'uppercase',
                // lineHeight: AdaptiveWidth(18) * 1.6,
                // height: AdaptiveWidth(18)* 1.3,
            },
            bottomBar:
            {
                width:wp(20),
                backgroundColor:Colors.blueColor,
                alignItems:'center',
                alignSelf:'center',
                justifyContent:'center',
                height:wp(12),
                borderRadius:wp(4)
            },
            claimBut:{
                borderRadius:6,
                alignSelf:'center',
                width:12,
                height:12,
                backgroundColor:Colors.blueColor
            },
            
            bgcard:{
                position:'absolute',
                resizeMode:'contain',
                alignSelf:'center',
                // aspectRatio:1417/895,
                // width:wp('99%'),
                width:'100%',
                // left:0,
                top:hp('4'),
            },
            points: {
                // position:'absolute',
                alignSelf:'flex-start',
                paddingLeft:10,
                textAlign:'left',
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Bold',
                fontSize: 35,
                lineHeight:35*1.4
            },
            totalView:{
                // marginBottom:10,
                // flex:1,
                // aspectRatio:1417/895,
                alignSelf:'center',
                justifyContent:'center',
                // shadowColor: "#000",
                // shadowOffset: {
                //     width: 2,
                //     height: 4,
                // },
                // shadowOpacity: .6,
                // shadowRadius: 10,
                // borderWidth:1,
                // elevation: 20,
                // height:hp('65'),
                height:'90%',
                
                width:'93%',
                // borderRadius:widthPercentageToDP(3),
                // backgroundColor:'white'
            },
            redeemView:{
                // transform:[{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
            },
            backbut:{
                position:'absolute',
                alignSelf:'center',
                width:50,
                height:50,
                // bottom:hp('36%'),
                bottom:hp('30%'),
                zIndex:2,
            },
            RedeemTitle:{
                includeFontPadding:false,
                fontSize:20,
                lineHeight:20*1.4,
                fontFamily:'Cairo-Regular',
                color:Colors.inputfontColor,
                textAlign:'center',
                alignSelf:'center',
                // width:100,
                // lineHeight:26,
                // height:widthPercentageToDP(6),
                textAlignVertical:'center'
            },
            RedeemPoint:{
                includeFontPadding:false,
                fontWeight:'100',
                fontSize:18,
                fontFamily:'Cairo-Regular',
                color:Colors.whiteColor,
                textAlign:'center',
            },
            
            backIcon:{
                alignSelf:'center',
                marginTop:20,
                width:50,
                height:50,
            },
            
            bgImage:{
                position:'absolute',
                alignSelf:'center',
                width:'100%',
                height:height,
                resizeMode:'contain'
            },
            homeScrollView: {
                // padding:15,
                width:'100%'
                
            },homeView: {
                // flex:1,
                justifyContent:'center'
            },
            view1: {
                // margin: 10,
                // width: width - 40,
                borderRadius: 10,
                paddingTop:10,
                paddingBottom:20,
                width:'93%',
                alignSelf:'center'
            },
            
            gradStyle:{
                position:'absolute',
                width:width,
                height:height,
                zIndex:-1,
                // borderRadius:15,
            },
            heading: {
                includeFontPadding:false,
                textAlign:'left',
                paddingLeft:20,
                fontFamily:'Cairo-Regular',color:Colors.blueColor
            },
            
        });
        this.styles=styles;
                return (
                    <View style={{ flex:1,
                        flexDirection:'column',backgroundColor:Colors.bgColor
                    }}>
                    <BackgroundWall/>
                    <SafeAreaView style={{flex:1,marginTop:heightPercentageToDP(3)}}>
                    <TouchableOpacity style={{marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{this.props.navigation.goBack()}}>
                    <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                    </TouchableOpacity>
                    {/* <HeaderLogo logo='tejory' headerTitle={i18n.t('redeem')} border={true}/> */}
                    {/* <NavigationEvents
                    onDidFocus={this.onNavigatorEvent}
                /> */}
                {/* <Image source={bgred} style={{position:'absolute',top:hp('40%'),opacity:0.9}}/> */}
                
                <View style={{height:'98%',width:width,marginTop:heightPercentageToDP(1)}}>
                <View style={styles.totalView}>
                <View style={ { flex:1,
                    flexDirection:'column',
                    height:height}}>
                    {/* <View style={{flexDirection:'row',alignSelf:'center',}}>
                    <Text allowFontScaling={false} style ={[styles.heading,{textTransform:'uppercase',fontSize:widthPercentageToDP(5),alignSelf:'flex-start',textAlign:'left'}]} numberOfLines={2} lineBreakMode='head'  allowFontScaling ={false}>{i18n.t('yourbalance')}</Text>
                    
                    <Text allowFontScaling={false} style ={[styles.points,{alignSelf:'flex-start'}]} allowFontScaling ={false}>{this.props.profile.Points}</Text>
                    <Text allowFontScaling={false} style ={[styles.heading,{paddingLeft:8,textTransform:'uppercase',fontSize:widthPercentageToDP(5),alignSelf:'flex-start',textAlign:'left'}]} numberOfLines={2} lineBreakMode='head'  allowFontScaling ={false}>{i18n.t('points')}</Text>
                    </View> */}
                    {/* {UiElements.drawGap(25)} */}
                    <View style={{backgroundColor:Colors.whiteColor,height:'100%',borderRadius:widthPercentageToDP(3)}}>
                    {UiElements.drawGap(15)}
                    <StatusTracker selected={1}/>
                    {UiElements.drawGap(15)}
                    <Text allowFontScaling={false} style={[styles.RedeemTitle]}>{i18n.t('choosevoucher')}</Text>
                    {/* <Image source={cardbgB}  style={[styles.bgcard,{transform: [
                        { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 },
                    ],}]}/> */}
                    
                    {/* <View style={{ width:'93%',height:hp('13%'),alignSelf:'center'}}> */}
                    {/* <Text style ={[styles.heading,{textTransform:'uppercase',fontSize:15,lineHeight:15*1.35,width:100,textAlign:'left'}]} numberOfLines={5} allowFontScaling ={false}>{i18n.t('yourbalance')}</Text>
                    
                <Text style ={[styles.points,{}]} allowFontScaling ={false}>{this.props.profile.Points}</Text></View> */}
                <View style={{height:'87%',width:'100%'}}>
                <ScrollView 
                showsVerticalScrollIndicator = {false}
                ref='_scrollView'
                contentContainerStyle={styles.homeScrollView}
                style={styles.view1}>
                {this.getVouchers()}
                </ScrollView>
                </View></View>
                </View></View>
                
                {/* <View style={{width:wp('70'),height:heightPercentageToDP(10),alignSelf:'center'}}>
                <View style={{borderRadius:20,overflow:'hidden' ,flex:1,flexDirection:'row',alignSelf:'center',justifyContent:'space-around',width:'100%'}}>
                
                <TouchableOpacity  
                style={[styles.bottomBar,{backgroundColor:'#00DDDE'}]}onPress={() =>
                    this.props.navigation.navigate('Claims',{
                        otherParam: i18n.t('claimpoints'),backParam: i18n.t('myaccount'), pagefrom:'account',redeem:this.props.redeem,redeemPoint:this.props.redeemPoint,redeemProfile:this.props.redeemProfile
                    })}>
                    <Text style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('claim')}</Text></TouchableOpacity>
                    <TouchableOpacity 
                    style={[styles.bottomBar]} onPress={() =>
                        this.props.navigation.navigate('Redeem',{
                            otherParam: 'Redeem Points',backParam: i18n.t('myaccount') ,pagefrom:'account',profile:this.props.profile,redeem:this.props.redeem,redeemPoint:this.props.redeemPoint,redeemProfile:this.props.redeemProfile
                        })}>
                        <Text numberOfLines={2} style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('redeem')}</Text></TouchableOpacity>
                        
                        
                        
                        <TouchableOpacity 
                        style={[styles.bottomBar,{backgroundColor:'#1BACFD'}]}
                        onPress={()=>this.props.navigation.navigate('rules',{
                            navigation:this.props.navigation,pagefrom:this.props.pagefrom
                        })}>
                        
                        <Text style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('rules')}</Text>
                        </TouchableOpacity>
                    </View></View> */}
                    </View>
                    
                    {/* <TouchableOpacity onPressIn={()=>{this.props.navigation.goBack();}}>
                    <Image source={backIcon} style={styles.backbut} ></Image>
                </TouchableOpacity> */}
                {/* <BackButton  onpress={()=>{this.props.navigation.goBack();}}/> */}
                </SafeAreaView>
                </View>
                )
            }
            
        }
        
        