import React, { Component } from 'react'
import  { View,Text,StyleSheet,ImageBackground,Dimensions,Image,SafeAreaView, Platform, StatusBar  } from 'react-native'
import Colors from '../constants/Colors';
import {AdaptiveWidth,AdaptiveHeight} from './AdaptiveSize';
import appLogo from '../../assets/Icons/whitelogo.png'
import appLogoG from '../../assets/Icons/greylogo.png'
import TejoryLogo from '../../assets/Icons/tejoryleisure.png'
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

import * as Tools from './Tools';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as UIelements from './UIElements'
import i18n from 'i18n-js';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class HeaderLogo extends Component {
    
    constructor(props){
        super(props);
        this.state={
            // language:'',
            notch:false,
        }
    }
 
    componentDidMount(){
        // SecureStore.getItemAsync('languageENAR').then(languagecheck=>{
        //     this.setState({language:languagecheck})
        // });
    }
    
    render() {
        return (
            <SafeAreaView  style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 ,flexDirection:'row',alignSelf:'center',justifyContent:'center'}}>
            {/* {this.props.backgroundImage!=null&&(<ImageBackground source={this.props.backgroundImage} style={styles.bgImage}/>)} */}
            <Image source={this.props.logo==undefined?appLogo:this.props.logo=='tejory'?TejoryLogo:appLogoG} style={[styles.logoImg,this.props.logoStyle]}/>
            {/* {(this.props.border===true)&&(<View style={{flexDirection:'row-reverse',alignSelf:'center',width:wp('79%')}}>
                 <View style={[styles.titleBView,
            {
                // transform:[{translateX:(Tools.stringIsContains(this.state.language,'en')?1:-1)*30},{translateY:20},{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
            }]}><Text allowFontScaling={false} style={styles.titleBTxt}>{this.props.headerTitle}</Text></View></View>)}

            {(this.props.border===undefined)&&( <View style={styles.titleView}><Text allowFontScaling={false} style={styles.titleTxt}>{this.props.headerTitle}</Text></View>)} */}
            </SafeAreaView >
            );
        }
    }
    
    const styles = StyleSheet.create({
        logoImg:{
            // marginTop:15,
            alignSelf:'flex-start',
            // marginLeft:15,
            // width:70.2*(width/280),
            // height:65.3*(width/280),
            width:hp('12%'),
            height:hp('10%'),
            alignSelf:'center',
            resizeMode:'contain',
            // paddingStart:wp('1%'),
            // transform:[{scaleX:1*AdaptiveHeight(600)},{scaleY:1*AdaptiveHeight(600)}]
            // transform:[{scaleX:1*AdaptiveWidth(300)},{scaleY:1*AdaptiveWidth(300)}]
            
            // maxWidth:220,
        }, titleView:{
            // position:'absolute',
            flex:1,
            alignSelf:'center',
            paddingEnd:wp('1%'),
            // transform:[{translateY:AdaptiveHeight(50)},{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
            // transform:[{translateY:AdaptiveHeight(50)},{scaleX:1*AdaptiveWidth(375)},{scaleY:1*AdaptiveWidth(375)}]
        },titleTxt:{
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            fontSize:hp('2.85%'),
            alignSelf:'flex-end',
            textAlign:"right",paddingStart:10,
            maxWidth:200*wp('.35%'),
            
            // paddingLeft:10,
            // paddingRight:100,
        }, titleBView:{
            // position:'absolute',
            // top:hp('1%'),
            // marginStart:hp('30%'),
            // width:wp('60%'),
            // alignSelf:'flex-end',
            paddingEnd:wp('10%'),
            // marginLeft:wp('35%'),
            borderRadius:10,
            borderWidth:2,
            borderColor:Colors.whiteColor,
            // transform:[{translateX:(Tools.stringIsContains(this.state.language,'en')?1:-1)*30},{translateY:20},{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
        },titleBTxt:{
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            fontSize:hp('2.5%'),
            textAlign:"right",
            marginStart:10
            // maxWidth:300*AdaptiveHeight(810),
            // marginRight:40*AdaptiveHeight(810),
            // maxWidth:300*wp('.35%'),
            // marginRight:40*wp('.2%'),
            // borderWidth:2,
            // paddingLeft:10,
            // paddingRight:100,
        },
        bgImage:{
            position:'absolute',
            alignSelf:'center',
            width:'100%',
            height:height,
            resizeMode:'contain'
        },
        
    });
    