import React from 'react';
import { StyleSheet, View,Text,Image,Platform,Animated} from 'react-native';
import PropTypes from 'prop-types';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import cardbg from '../../assets/card/cardde.png';
// import cardbg1 from '../../assets/card.png';

// import { NavigationEvents } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import * as UIElements from './UIElements'
import Colors from '../constants/Colors';
import glar from '../../assets/glar.png';


export class CardInfo extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
            glarx:new Animated.Value(-250),
            canuseGlar:false
            // accelerometerData: {},
        };
        // this.onNavigatorEvent=this.onNavigatorEvent.bind(this);
    };

    // onNavigatorEvent() {
    //     this.Accelero();
    // }

    // Accelero(){
    //     if(Accelerometer._listenerCount>0)
    //     Accelerometer.removeAllListeners();
    //     this._subscription = null;
    //     // if(this._subscription===null||this._subscription===undefined){
    //     // console.log('load');
    //     Accelerometer.setUpdateInterval(200);
    //     Accelerometer.isAvailableAsync().then(useglar=>this.setState({canuseGlar:useglar}));
    //     this._subscription = Accelerometer.addListener(accelerometerData => {
    //         // this.setState({glarx:(2500*accelerometerData.x.toFixed(1))-350})
    //         Animated.timing(this.state.glarx, {
    //             toValue: (2000*( accelerometerData.x.toFixed(2)))-350,
    //             duration: 200,
    //         }).start();
    //     });
    // }
    
    // componentDidMount() {
    //     this.Accelero();
    //     // }
    // }
    
    
    
    // componentWillUnmount() {
    //     console.log('unload');
    //     Accelerometer.removeAllListeners();
    //     this._subscription = null;
    //     // Animated.timing(this.state.glarx, {
    //     //     toValue: (2500*( accelerometerData.x)),
    //     //     duration: 250,
    //     // }).stop();
    // }
    
    cardFormatting(cardNo){
        cardFormatNo='';
        let n=0;
        for(let t=0;t<cardNo.length;t++){
            if(n==4){
                cardFormatNo+='  ';
                n=0;
            }
            cardFormatNo+=cardNo[t];
            n=n+1;
        }
        return cardFormatNo;
    }
    
    render(){
        return (
            <View style={styles.totalView}>
            {/* <NavigationEvents onDidFocus={this.onNavigatorEvent}/> */}
            
            {/* {this.state.canuseGlar&& */}
          
            {/* }  */}
            {/* {UIElements.drawGap(AdaptiveHeight(80))} */}
            <View style={styles.bottompart}>
            {UIElements.drawGap(hp('1.5%'))}
            <Text style ={styles.heading} allowFontScaling ={false}>{i18n.t('welcome')}</Text>
            <Text numberOfLines={1} style ={[styles.heading,{marginTop:-15,fontFamily:'Cairo-Bold'}]} allowFontScaling ={false}>{this.props.cardData.FirstName}</Text>
            {UIElements.drawGap(hp('5%'))}
            <Text style ={styles.value} allowFontScaling ={false}>{i18n.t('membership')} </Text>
            {UIElements.drawGap(hp('0.5%'))}
            {/* <Text style ={styles.value} allowFontScaling ={false}>{i18n.t('value')} {this.props.cardData.Amount} {i18n.t('qar')}</Text> */}
            <Text style ={styles.cardNo} allowFontScaling ={false}>{this.cardFormatting(this.props.cardData.CardNo)} </Text>
            </View>
            <Image source={cardbg} style={styles.bgcard}/>
            <View style={{position:'absolute',width:wp('75%'),height:hp('33%'),flex:1, bottom:0,padding:30}}>
            <Text style ={[styles.heading,{textTransform:'uppercase',marginTop:20,fontSize:15,lineHeight:9.65*2,width:100,textAlign:'left'}]} numberOfLines={5} allowFontScaling ={false}>{i18n.t('yourbalance')}</Text>
            {UIElements.drawGap(hp('2.5%'))}
            <Text style ={styles.points} allowFontScaling ={false}>{this.props.cardData.Points}</Text>
            <Text numberOfLines={2} style ={styles.txtbutton} allowFontScaling ={false}>{i18n.t('redeem')} </Text>
            <Text style ={styles.txtbutton} allowFontScaling ={false}>{i18n.t('claim')} </Text>
            <Text style ={styles.txtbutton} allowFontScaling ={false}>{i18n.t('rules')} </Text>
            {/* {UIElements.drawGap(AdaptiveHeight(30))} */}
            </View>
            {/* {UIElements.drawGap(AdaptiveHeight(45))} */}
            </View>
            );
            
        }
        
    }
    
    
    // PropTypes
    CardInfo.propTypes = {
        cardData: PropTypes.object.isRequired
    }
    
    const styles = StyleSheet.create({
        bottompart:{
            position:'absolute',backgroundColor:Colors.orangeColor,flex:1,
            width:wp('70%'),
            height:wp('60%'),
            top:0,
            left:0,
            padding: 15,
            borderRadius:30,
        },
        totalView:{
            // marginTop:10,
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
            // // borderWidth:1,
            // elevation: 20,
            height:hp('60'),
            width:wp('70%'),
            borderRadius:30,
            backgroundColor:'white'
        },
        bgglarcardview:{
            flex:1,
            aspectRatio:1417/895,
            borderRadius:15,
            resizeMode:'contain',
            position:'absolute',
            alignSelf:'center',
            justifyContent:'center',
            // width:wp('99%'),//1017*
            // left:0,
            // top:0,
            // width:wp('92%'),
            // left:0,
            // top:0,
            // height:hp('28%'),
            // marginTop:6,
            // height:hp('28.4%'),
            height:hp('27.6%'),
            overflow:'hidden',
            // transform:[{scaleY:hp('0.238%')}]
            // borderWidth:2,
            // zIndex:-10,
            
        },
        bgglarcard:{
            alignSelf:'center',
            aspectRatio:1417/895,
            // resizeMode:'cover',
            position:'absolute',
            // borderWidth:1,
            // margin:wp('5%'),
            // position:'absolute',
            // resizeMode:'contain',
            // width:wp('99%'),
            // height:hp('18%'),
        },
        bgcard:{
            position:'absolute',
            resizeMode:'contain',
            alignSelf:'center',
            // aspectRatio:1417/895,
            // width:wp('99%'),
            width:wp('70%'),
            // left:0,
            // top:0,
        },
        heading: {
            fontFamily:'Cairo-Regular',
            fontSize:hp('3.5%'),
            textAlign:'center',
            color:Colors.whiteColor,
        },
        points: {
            textAlign:'left',
            color:Colors.inputfontColor,
            fontFamily:'Cairo-Bold',
            // borderWidth:1,
            // textAlignVertical:'center',
            // fontSize: AdaptiveWidth(6),
            lineHeight: hp('6.5%'),
            // height: AdaptiveWidth(6)* 1.2,
            fontSize: hp('6.5%'),
        },
        value: {
            fontFamily:'Cairo-Regular',
            textAlign:'center',
            color:Colors.whiteColor,
            // fontSize:AdaptiveWidth(25),
            // lineHeight: AdaptiveWidth(25) * 1.6,
            // height: AdaptiveWidth(25)* 1.2,
            fontSize: hp('2.5%'),
            lineHeight:  hp('2.5%')*1.5,
            
        },
        txtbutton:{
            fontFamily:'Cairo-Regular',
            textAlign:'left',
            color:Colors.inputfontColor,
            // fontSize:AdaptiveWidth(25),
            // lineHeight: AdaptiveWidth(25) * 1.6,
            // height: AdaptiveWidth(25)* 1.2,
            fontSize: 15,
        },
        cardNo: {
            fontFamily:'Cairo-Regular',
            // fontSize:AdaptiveWidth(11.8),
            fontSize: hp('2.5%'),
            lineHeight:  hp('2.5%')*1.35,
            textAlign:'center',
            // borderWidth:1,
            color:Colors.whiteColor,
            // lineHeight: AdaptiveWidth(12) * 1.6,
            // height: AdaptiveWidth(12)* 1.2,
        }
    });
    
    