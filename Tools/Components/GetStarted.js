import React, { Component } from 'react'
import  { View,Text,StyleSheet,TouchableOpacity,Dimensions,Image, PixelRatio } from 'react-native'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import Colors from '../constants/Colors';
import {AdaptiveWidth,AdaptiveHeight} from '../Components/AdaptiveSize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import * as UIElements from './UIElements'
import cardbg from '../../assets/card/cardde.png';
import cardbgb from '../../assets/card/carddeb.png';


import loginIcon from '../../assets/Icons/login.png'
import registerIcon from '../../assets/Icons/register0.png'
import rulesIcon from '../../assets/Icons/rules.png'
import ProfileData from './ProfileData';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class GetStarted extends Component {
    
    constructor(props){
        super(props);
        this.state={
            locale:'',showLogin:false
        }
    }
    
    
    drawGap=(valueGap)=>{
        return(
            <View
            style={{paddingTop:valueGap}}/>
            );
        }
        
        render() {
            return (
                <View style={styles.totalView}>
                
                <View style={[styles.bottompart,{backgroundColor:this.props.pagefrom!='card'? Colors.orangeColor:Colors.blueColor}]}>
                {UIElements.drawGap(hp('1.5%'))}
                <Text style ={styles.heading} allowFontScaling ={false}>{i18n.t('welcome')}</Text>
                <Text style ={styles.heading} allowFontScaling ={false}>{i18n.t('toleisure')}</Text>
                
                
                
                {UIElements.drawGap(hp('5%'))}
                {UIElements.drawGap(hp('0.5%'))}
                {/* <Text style ={styles.value} allowFontScaling ={false}>{i18n.t('value')} {this.props.cardData.Amount} {i18n.t('qar')}</Text> */}
                </View>
                <Image source={this.props.pagefrom=='card'? cardbgb:cardbg} style={styles.bgcard}/>
                <View style={{position:'absolute',width:wp('70%'),height:hp('33%'),flex:1, bottom:0,padding:30}}>
                {UIElements.drawGap(hp('2.5%'))}
                
                {/* {this.getLocale()} */}
                {/* {this.drawGap(10)} */}
                <View style={styles.rowView}>
           
                <TouchableOpacity style={[styles.buttonB,{backgroundColor:this.props.pagefrom=='card'? Colors.blueColor:Colors.orangeColor}]}
                onPress={()=>{ this.setState({showLogin:true});
                // this.props.navigation.navigate('FullScreen',{
                //     navigation:this.props.navigation,
                //     assignProfile:this.props.assignProfile,
                //     sendOTP:this.props.sendOTP,
                //     verifyOTP:this.props.verifyOTP})
            }}>
            <Image source={loginIcon} style={styles.ImgIcon} ></Image>
            <Text style={styles.buttontxt} allowFontScaling ={false}>{i18n.t('login')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonB,{backgroundColor:this.props.pagefrom=='card'? Colors.blueColor:Colors.orangeShadeColor}]}
                onPress={()=>
                    this.setState({showRegister:true})
                    // this.props.navigation.navigate('Register',{
                    // pagefrom:'getstart',
                    // navigation:this.props.navigation,
                    // assignProfile:this.props.assignProfile,
                    // sendOTP:this.props.sendOTP,
                    // verifyOTP:this.props.verifyOTP})
                    
                }>
                
                <Image source={registerIcon} style={styles.ImgIcon} ></Image>
                <Text style={styles.buttontxt} allowFontScaling ={false}>{i18n.t('register')}</Text>
                </TouchableOpacity>
             
                <TouchableOpacity style={[styles.buttonB,{backgroundColor:this.props.pagefrom=='card'? Colors.blueColor:Colors.yellowColor}]}
                onPress={()=>{
                      this.props.navigation.navigate('Cardscreen',{screen:'rules'},{
                    navigation:this.props.navigation,pagefrom:this.props.pagefrom
                })}}>
                <Image source={rulesIcon} style={styles.ImgIcon} ></Image>
                
                <Text style={styles.buttontxt} allowFontScaling ={false}>{i18n.t('rules')}</Text>
                </TouchableOpacity>
            
            </View></View>
            {this.drawGap(AdaptiveWidth(50))}
            {this.state.showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={this.props.navigation} onDismiss={()=>this.setState({showLogin:false})} />)}
            {this.state.showRegister&&(<ProfileData pagetogo='register' pagefrom='getstart' navigation={this.props.navigation} onDismiss={()=>this.setState({showRegister:false})} />)}
            </View>
            )
        }
        
    }
    
    const styles = StyleSheet.create({
        totalView:{
            alignSelf:'center',
            justifyContent:'center',
            height:'98.5%',
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
            textAlign:'left',
            color:Colors.inputfontColor,
            // fontSize:AdaptiveWidth(25),
            // lineHeight: AdaptiveWidth(25) * 1.6,
            // height: AdaptiveWidth(25)* 1.2,
            fontSize: 12,
        },
        bgcard:{
            position:'absolute',
            resizeMode:'contain',
            alignSelf:'center',
            // aspectRatio:1417/895,
            // width:wp('99%'),
            width:wp('70%'),
            // left:0,
            top:(wp('60%')/2)-20,
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
            textAlign:'left',
            fontSize:hp('4%'),
            // height:hp('4%')*2,
            fontWeight:'300',
            paddingStart:10,
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
            backgroundColor:Colors.yellowColor,
            borderRadius:widthPercentageToDP((3.5)),
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
    