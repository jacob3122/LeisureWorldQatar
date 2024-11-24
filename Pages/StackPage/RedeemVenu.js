import React, { Component } from 'react'
import {View,ScrollView,StyleSheet,Text,Image,SafeAreaView,TextInput,TouchableOpacity,PixelRatio} from 'react-native';
import * as UiElements from '../../Tools/Components/UIElements'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import Colors from '../../Tools/constants/Colors';
// import Voucher from '../../Tools/Components/Voucher';
// import vouchers from '../../Tools/constants/vouchers';
// import ButtonGroup from '../../Tools/Components/ButtonGroup';
// import RedeemVenue from './RedeemVenue';
// import { NavigationEvents } from 'react-navigation';
import backButton from '../../assets/Icons/back.png'

import StatusTracker from '../../Tools/Components/StatusTracker';
import HeaderLogo from '../../Tools/Components/HeaderLogo';

import {Dimensions } from "react-native";
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
// import cardbgB from '../../assets/card/carddeb.png';

import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
// import BackButton from '../../Tools/Components/BackButton';

import * as Tools from '../../Tools/Components/Tools.js'
// import I18n from 'i18n-js';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import OTP from '../../Tools/Components/OTP';

export default function(props){
    const color=useTheme();
    return <RedeemVenu {...props} Colors={color}/>
}
class RedeemVenu extends Component {
    styles=undefined;
    _myScroll=ScrollView;
    
    constructor(props){
        super(props);
        this.state={
            loading:true,
            passcode:'',
            otpModal:false
        }
        this.OnVerifyDone=this.OnVerifyDone.bind(this);
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
        Tools.updateRatePoints(1);
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
                    width:widthPercentageToDP(20),
                    backgroundColor:Colors.blueColor,
                    alignItems:'center',
                    alignSelf:'center',
                    justifyContent:'center',
                    height:widthPercentageToDP(12),
                    borderRadius:widthPercentageToDP(4)
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
                    // height:hp('60'),
                    height:'95%',
                    width:'93%',
                },
        
                inputValueView:{
                    height:heightPercentageToDP(4.75),
                    alignSelf:'center',
                    width:widthPercentageToDP(70),
                    backgroundColor:Colors.whiteColor,
                    borderRadius:heightPercentageToDP(4.75),
                    alignContent:'center',justifyContent:'center'
                },shadow:{
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 3,
                    shadowOpacity: 0.12,
                },
                inputValue: {
                    fontSize: 18,
                    height:50,
                    color: Colors.inputfontColor,
                    alignSelf:'center',
                    width:widthPercentageToDP("50%"),
                    textAlign:'center',
                    fontFamily:'Cairo-Regular',
                },
                Button:{
                    // flex:1,
                    // width:widthPercentageToDP("50%"),
                    paddingHorizontal:widthPercentageToDP(5),
                    height:heightPercentageToDP(4.75),
                    alignSelf:'center',
                    alignItems:'center',
                    backgroundColor:Colors.blueColor,
                    borderRadius:heightPercentageToDP(4.75),
                    justifyContent:'center'
                },
                buttontext:{
                    fontSize:15,
                    color:'white',
                    // textTransform:'uppercase',
                    fontFamily:'Cairo-Regular',
                    alignSelf:'center'
                },
                RedeemTitle:{
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
                    fontWeight:'100',
                    fontSize:18,
                    fontFamily:'Cairo-Regular',
                    color:Colors.whiteColor,
                    textAlign:'center',
                },
                
       
                
                backbut:{
                    position:'absolute',
                    alignSelf:'center',
                    width:50,
                    height:50,
                    // bottom:hp('36%'),
                    bottom:hp('3%'),
                    zIndex:2,
                },
                
           
       
             
                heading: {
                    textAlign:'left',
                    paddingLeft:20,
                    fontFamily:'Cairo-Regular',color:Colors.blueColor
                },
            });
            this.styles=styles;
            return (
                <View style={{flex:1,flexDirection:'column',backgroundColor:Colors.bgColor}}>
               <BackgroundWall/>
                <SafeAreaView style={{flex:1,marginTop:heightPercentageToDP(3)}}>
                <TouchableOpacity style={{marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{this.props.navigation.goBack()}}>
                <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                </TouchableOpacity>
                {/* <HeaderLogo logo='tejory' headerTitle={i18n.t('redeem')} border={true}/> */}
                <View style={{flex:1,width:width,marginTop:heightPercentageToDP(1)}}>
                <View  style={styles.totalView}>
                <View style={ { flex:1,
                    flexDirection:'column',
                    height:height}}>
                    {/* <View style={{flexDirection:'row',alignSelf:'center',}}>
                    <Text allowFontScaling={false} style ={[styles.heading,{textTransform:'uppercase',fontSize:widthPercentageToDP(5),alignSelf:'flex-start',textAlign:'left'}]} numberOfLines={2} lineBreakMode='head'  allowFontScaling ={false}>{i18n.t('yourbalance')}</Text>
                    
                    <Text allowFontScaling={false} style ={[styles.points,{alignSelf:'flex-start'}]} allowFontScaling ={false}>{this.props.profile.Points} </Text>
                    <Text allowFontScaling={false} style ={[styles.heading,{paddingLeft:5,textTransform:'uppercase',fontSize:widthPercentageToDP(5),alignSelf:'flex-start',textAlign:'left'}]} numberOfLines={2} lineBreakMode='head'  allowFontScaling ={false}>{i18n.t('points')}</Text>
                    </View> */}
                    {UiElements.drawGap(25)}
                    <StatusTracker selected={2}/>
                    {UiElements.drawGap(15)}
                    <Text allowFontScaling={false} style={[styles.RedeemTitle]}>{i18n.t('venuepasscode')}</Text>
                    {/* <Image source={cardbgB}  style={[styles.bgcard,{transform: [
                        { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 },
                    ],}]}/> */}
                    
                    {/* <View style={{ width:'85%',height:hp('13%'),alignSelf:'center'}}>
                    {UiElements.drawGap(25)}
                    <Text allowFontScaling={false} style ={[styles.heading,{textTransform:'uppercase',fontSize:15,lineHeight:15*1.35,width:100,textAlign:'left'}]} numberOfLines={5} allowFontScaling ={false}>{i18n.t('yourbalance')}</Text>
                <Text allowFontScaling={false} style ={[styles.points,{}]} allowFontScaling ={false}>{this.props.profile.Points}</Text></View> */}
                {/* {UiElements.drawGap(hp('2.5%'))} */}
                <View style={{alignSelf:'center',justifyContent:'center'}}>
                <OTP title={false} onChangeText={(text)=>{this.setState({passcode:text})}}/>

                {/* <View style={[styles.inputValueView,styles.shadow]}>
                <TextInput  allowFontScaling ={false}
                onChangeText={(text)=>{this.setState({passcode:text})}}
                placeholderTextColor='#676667'
                style={styles.inputValue}
                placeholder="Enter Passcode here"
                keyboardType='number-pad'
                secureTextEntry={true}
                returnKeyType='done'/>
                </View> */}
                {UiElements.drawGap(heightPercentageToDP(4))}
                <TouchableOpacity style={styles.Button} onPress={()=>{this.onSubmitPass()}}>
                <Text allowFontScaling={false} style={styles.buttontext} >{i18n.t('submit')}</Text>
                </TouchableOpacity>
                {/* {this.state.otpModal&&(<er onDone={this.OnVerifyDone}/>)} */}
                </View></View>
                </View>
                {/* <View style={{width:wp('70'),height:heightPercentageToDP(10),alignSelf:'center'}}> */}
                {/* <View style={{position:'absolute',bottom:10,flex:1,flexDirection:'row',alignSelf:'center',justifyContent:'space-around',width:'80%'}}> */}
                {/* <View style={{borderRadius:20,overflow:'hidden' ,flex:1,flexDirection:'row',alignSelf:'center',justifyContent:'space-around',width:'100%'}}>
                <TouchableOpacity 
                style={[styles.bottomBar,{backgroundColor:'#00DDDE'}]}
                onPress={() =>
                    this.props.navigation.navigate('Claims',{
                        otherParam: i18n.t('claimpoints'),backParam: i18n.t('myaccount'), pagefrom:'account',redeem:this.props.redeem,redeemPoint:this.props.redeemPoint,redeemProfile:this.props.redeemProfile
                    })}>
                    <Text allowFontScaling={false} style={styles.detailstitle} >{i18n.t('claim')}</Text></TouchableOpacity>
                    <TouchableOpacity  
                    style={[styles.bottomBar]}onPress={() =>
                        this.props.navigation.navigate('Redeem',{
                            otherParam: 'Redeem Points',backParam: i18n.t('myaccount') ,pagefrom:'account',profile:this.props.profile,redeem:this.props.redeem,redeemPoint:this.props.redeemPoint,redeemProfile:this.props.redeemProfile
                        })}>
                        <Text numberOfLines={2} style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('redeem')}</Text></TouchableOpacity>
                        
                        
                        
                        <TouchableOpacity  style={[styles.bottomBar,{backgroundColor:'#1BACFD'}]}
                        onPress={()=>this.props.navigation.navigate('rules',{
                            navigation:this.props.navigation,pagefrom:this.props.pagefrom
                        })}>
                        
                        <Text style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('rules')}</Text>
                        </TouchableOpacity>
                    </View> */}
                    {/* </View> */}
                    </View>
                    </SafeAreaView>
                    </View>
                    )
                }
                
                onSubmitPass(){
                    var redeemPoint= this.props.redeemPoint;
                    redeemPoint(this.props.selectedVoucher.Id,this.state.passcode);
                    // this.setState({otpModal:true});
                }
                
                OnVerifyDone(Vstate){
                    this.setState({otpModal:false});
                    if(Vstate){
                        // console.info(this.props.navigation.state.params.assignProfile);
                        assignProfile=this.props.assignProfile;
                        updateprofile("user","","");
                        this.props.navigation.navigate('Home',{pagetodivert:undefined});
                    }
                }
                
            }
            