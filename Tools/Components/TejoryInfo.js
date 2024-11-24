import React, { Component } from 'react'
import  { View,Text,StyleSheet,TouchableOpacity,Dimensions,Image,PixelRatio } from 'react-native'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import Colors from '../constants/Colors';
import {AdaptiveWidth,AdaptiveHeight} from '../Components/AdaptiveSize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP} from 'react-native-responsive-screen';
import cardbg from '../../assets/card/cardde.png';
import appI from '../../assets/card/app.png';
import cardbgb from '../../assets/card/carddeb.png';

import * as Tools from '../Components/Tools'

import loginIcon from '../../assets/Icons/login.png'
import registerIcon from '../../assets/Icons/register0.png'
import rulesIcon from '../../assets/Icons/rules.png'
import ProfileData from './ProfileData';
import * as UIElements from './UIElements'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class TejoryInfo extends Component {
    
    constructor(props){
        super(props);
        this.state={
            locale:'',showLogin:false
        }
    }
    
    
    // drawGap=(valueGap)=>{
    //     return(
    //         <View
    //         style={{paddingTop:valueGap}}/>
    //         );
    //     }
        
        render() {
            return (
                <View style={styles.totalView}>
                <View style={[styles.bottompart,{backgroundColor:Colors.whiteColor}]}>
                <Image source={this.props.pagefrom=='card'? cardbgb:cardbg} style={[styles.bgcard,{transform: [
                        { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 },
                    ],}]}></Image>
                <Image source={appI} style={styles.appcard}/>
                </View>
               <View style={{
                  position:'absolute',
                  width:wp('60'),
                  height:hp(35),
                  alignSelf:'center',
                    bottom:-1*hp(0),
                    // borderWidth:1,
                    backgroundColor:Colors.whiteColorTrans,
                    borderRadius:20,
                    padding:15,

               }}>
                 <Text allowFontScaling={false} style={{color:Colors.inputfontColor,
                    width:wp('60'),
                    textAlign:'center',
                    alignSelf:'center',
                    fontSize:heightPercentageToDP(1.9),
                    lineHeight:heightPercentageToDP(1.9)*1.5,
                    fontFamily:'Cairo-Regular',
                    }}>{i18n.t('tejporyInfo')}</Text>
                    </View>

                {/* <View style={{position:'absolute',width:wp('70%'),height:hp('33%'),flex:1, bottom:0,padding:30}}> */}
                
                {/* {this.getLocale()} */}
                {/* {this.drawGap(10)} */}
                {/* <View style={styles.rowView}> */}
                {/* <TouchableOpacity style={[styles.buttonB,{backgroundColor:this.props.pagefrom=='card'? Colors.blueColor:Colors.orangeColor}]}
                onPress={()=>this.props.navigation.navigate('rules',{
                    navigation:this.props.navigation,pagefrom:this.props.pagefrom
                })}>
                <Image source={rulesIcon} style={styles.ImgIcon} ></Image>
                
                <Text style={styles.buttontxt} allowFontScaling ={false}>{i18n.t('rules')}</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={[styles.buttonB,{backgroundColor:this.props.pagefrom=='card'? Colors.blueColor:Colors.orangeColor}]}
                onPress={()=>
                    this.setState({showRegister:true})
                }>
                
                <Image source={registerIcon} style={styles.ImgIcon} ></Image>
                <Text style={styles.buttontxt} allowFontScaling ={false}>{i18n.t('register')}</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={[styles.buttonB,{backgroundColor:this.props.pagefrom=='card'? Colors.blueColor:Colors.orangeColor}]}
                onPress={()=>{ this.setState({showLogin:true});
                // this.props.navigation.navigate('FullScreen',{
                //     navigation:this.props.navigation,
                //     assignProfile:this.props.assignProfile,
                //     sendOTP:this.props.sendOTP,
                //     verifyOTP:this.props.verifyOTP})
            }}>
            <Image source={loginIcon} style={styles.ImgIcon} ></Image>
            <Text style={styles.buttontxt} allowFontScaling ={false}>{i18n.t('login')}</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
            onPress={()=>
                this.setState({showRegister:true})
            } style={{
            position:'absolute',bottom:(-35/2),
            backgroundColor:Colors.orangeColor,borderRadius:15,height:35,width:wp('40%'),alignSelf:'center',justifyContent:'center'}}>
                <Text style={styles.txtbutton}>{i18n.t('register')}</Text>
            </TouchableOpacity>
            {/* </View> */}
            {/* </View> */}
            {/* {UIElements.drawGap((50))} */}
            {this.state.showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={this.props.navigation} onDismiss={()=>this.setState({showLogin:false})} />)}
            {this.state.showRegister&&(<ProfileData pagetogo='register' pagefrom='getstart' navigation={this.props.navigation} onDismiss={()=>this.setState({showRegister:false})} />)}
            </View>
            )
        }
        
    }
    
    const styles = StyleSheet.create({
        totalView:{
            marginTop:heightPercentageToDP(2.85),
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
            height:'85%',
            width:wp('70%'),
            borderRadius:30,
            backgroundColor:'white',
        },
        bottompart:{
            position:'absolute',backgroundColor:Colors.orangeColor,flex:1,
            width:wp('70%'),
            height:wp('60%'),
            top:0,
            left:0,
            padding: 15,
            borderRadius:30,
        },
        ImgIcon:{
            // width:AdaptiveWidth(5),height:AdaptiveWidth(5)
            width:40,height:40,resizeMode:'contain',
            alignSelf:'center'
        },
        rowView:{
            position:'absolute',
            bottom:20,
            flexDirection: 'row',
            width:wp('60%'),
            alignSelf:'center',
            justifyContent:'space-between',
        },
        txtbutton:{
            
            fontFamily:'Cairo-Regular',
            textAlign:'center',
            textTransform:'uppercase',
            color:Colors.whiteColor,
            // fontSize:AdaptiveWidth(25),
            // lineHeight: AdaptiveWidth(25) * 1.6,
            // height: AdaptiveWidth(25)* 1.2,
            fontSize: 15,
        },
        bgcard:{
            position:'absolute',
            resizeMode:'contain',
            alignSelf:'center',
            // aspectRatio:1417/895,
            // width:wp('99%'),
            width:wp('70%'),
            // left:0,
            top:50,
            opacity:0.8,
        },
        appcard:{
            position:'absolute',
            resizeMode:'contain',
            alignSelf:'center',
            // aspectRatio:1417/895,
            // width:wp('99%'),
            width:wp('70%'),
            overflow:'visible',
            // left:0,
            top:-20,
        },
        // totalView:{
        //     marginTop:10,
        //     marginBottom:10,
        //     // flex:1,
        //     alignSelf:'center',
        //     alignItems:'center',
        //     shadowColor: "#000",
        //     shadowOffset: {
        //         width: 0,
        //         height: 2,
        //     },
        //     shadowOpacity: 0.25,
        //     shadowRadius: 3.84,
        //     // borderWidth:1,
        //     elevation: 5,
        //     height:hp('28%'),
        //     width:wp('95%'),
        // },
        heading:{
            fontSize:hp('4%'),
            fontWeight:'300',
            // paddingBottom:AdaptiveWidth(40),
            color:Colors.darkfontColor,
            fontFamily:'Cairo-Regular',
        },
        subheading:{
            fontSize:20,
            fontWeight:'400',
            paddingBottom:20,
            color:Colors.whiteColor,
            
            fontFamily:'Cairo-Regular',
            fontSize: AdaptiveWidth(20),
            // lineHeight: AdaptiveWidth(20) * 1.4,
            // height: AdaptiveWidth(20)* 1.2,
            
        },buttonB:{
            bottom:0,
            // flex:.25,
            // borderWidth:1,
            width: wp('60%')/3.2,
            height: wp('60%')/3.2,
            alignItems:'center',
            backgroundColor:Colors.orangeColor,
            borderRadius:20,
            justifyContent:'center'
        },buttontxt:{
            alignSelf:'center',
            textAlign:'center',
            color:'white',
            fontSize:12,
            fontWeight:'100',
            
            fontFamily:'Cairo-Regular',
            // fontSize: AdaptiveWidth(28),
            lineHeight: 18,
            textTransform:'uppercase'
            // height: AdaptiveWidth(18)* 1.5,
        }
    });
    