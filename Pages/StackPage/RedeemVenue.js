import React, { Component } from 'react';
import {Image, View,ScrollView,StyleSheet,Dimensions,Text,Platform,Alert,TouchableOpacity} from 'react-native';

import Colors from '../../Tools/constants/Colors';
import * as UIElements from '../../Tools/Components/UIElements'
import Verfication from '../../Tools/Components/Verification';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import * as Tools from '../../Tools/Components/Tools.js'
import OtpVerify from '../../Tools/Components/OtpVerify';
import FastImage from 'react-native-fast-image'
export default class RedeemVenue extends Component {
    
    constructor(props){
        super(props);
        this.state={
            otpModal:false
        }
        this.OnPressAd = this.OnPressAd.bind(this);
        this.OnVerifyDone=this.OnVerifyDone.bind(this);
    }

    componentDidMount(){
        Tools.updateRatePoints(1);
    }
    
    
    render() {
        return (
            <TouchableOpacity style={[styles.view,{alignSelf:'center', backgroundColor:this.props.venueColor}]} onPress={()=>{this.OnPressAd()}}>
            {/* <CacheImage
            style={styles.image}
            uri={this.props.venueInfo.Image}
            /> */}
             <FastImage
             style={styles.image}
            source={{
                uri: this.props.venueInfo.Image,
                // headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
            />
            {/* <Gradient gradient={Colors.gradientVoucher} style={styles.view}> */}
            {/* <Text style={styles.title} >{this.props.venueInfo.title}</Text> */}
            {/* </Gradient> */}
            {/* <Text style={styles.title} >{this.props.venueInfo.title}</Text> */}
            {/* <Text style={styles.duration}>{i18n.t('adduration')}</Text> */}
            {this.state.otpModal&&(<OtpVerify title='OTP Verify' details={'Redeem the '+this.props.venueInfo.Title} onDone={this.OnVerifyDone}/>)}
            </TouchableOpacity>
            )
        }
        OnVerifyDone(otpvalue,Vstate){
            // console.log("V :"+Vstate);
            this.setState({otpModal:false});
            if(Vstate){
                setTimeout(()=>{
                Alert.alert('Successfully Redeemed '+this.props.venueInfo.Title,
                "",
                [
                    {text: 'Ok',onPress: () => {}},
                    // {text: 'No', onPress: () => console.log('No Pressed')},
                ],
                {cancelable: false},
                );
            },1000);
            }
        }
        OnPressAd(){
            selectedVenue=this.props.selectedVenue;
            selectedVenue(this.props.venueInfo);
            // this.props.navigation.navigate('voucher',{ voucherInfo: this.props.venueInfo,redeemPoint:this.props.redeemPoint, assignProfile:this.props.assignProfile});
             
        }
        OnRedeemYes(){
            // console.log('Yes Pressed');
            this.setState({otpModal:true});
        }
    }
    
    const styles = StyleSheet.create({
        image:{
            alignSelf:'center',
            width: widthPercentageToDP(28),
            height: widthPercentageToDP(30),
            resizeMode:'contain',
            // borderWidth:1
            // borderRadius: 10,
            // position:'absolute'
            // transform:[{translateY:-width/4.8}]
        },
        title:{
            padding:15,
            fontSize:25,
            textAlign:'left',
            fontFamily:'Cairo-Bold',color:Colors.whiteColor
        },
        duration:{
            marginLeft: 10,
            fontSize:15,
            textAlign:'left',
            fontWeight:'400'
        },
        view: {
            // margin: 5,
            // marginTop: 10,
            // backgroundColor: 'lightblue',
            width: '100%',
            height: '100%',
            justifyContent:'center',
            borderRadius:20,
            // borderWidth:1,
        }
    });
    