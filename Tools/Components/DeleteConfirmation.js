import React, { Component } from 'react';
import  { DatePickerIOS,View,Modal,Text,StyleSheet,Dimensions,TextInput,Image, TouchableOpacity,Alert,Keyboard,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Platform,ImageBackground  } from 'react-native';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UIElements from './UIElements'
import * as Tools from './Tools'
import homebg from'../../assets/bg/bg-01.jpg'
import regLogo from'../../assets/Icons/register0.png'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

import Colors from '../constants/Colors';
import Verfication from './Verification';
import backButton from '../../assets/Icons/back.png'
import WebServices from '../../Tools/constants/WebServices'
import OverlayLoad from './OverlayLoad'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import {AdaptiveWidth,AdaptiveHeight,AdaptiveOffsetHeight} from '../Components/AdaptiveSize';
import HeaderLogo from './HeaderLogo';
import { useTheme } from '../context/ThemeProvider';
import { style } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';
import BackgroundWall from './BackgroundWall';
export default function(props){
    const Colors=useTheme();
    return <DeleteConfirmation {...props} Colors={Colors}/>
}
class DeleteConfirmation extends Component {
    
    static navigationOptions = ({navigation}) => {
        return{
            header:null,
            headerVisible:false,
            visible:false
        }
    };
    
    constructor(props){
        super(props);
        this.state={
            password:'',
            confirmpassword:'',
            showPass:false,
            showConfirmPass:false,
            passwordCreate:false,passfilled:false,
            isLoading:false
        }
        this.OnVerifyDone=this.OnVerifyDone.bind(this);
    }
    
    CreatePassword(){
        this.setState({isLoading:true});
        
        verifyurl=WebServices.CreatePass.replace('{MemberID}',this.props.dataGot.MemberID).replace('{Password}',this.state.password)
        return fetch (WebServices.MainURL+verifyurl,{
            method: 'POST',
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            // console.log(responseJson);
            dateGot=responseJson.replace('"','').replace('"','');
            // console.log("J R :"+dateGot);
            
            if(!Tools.stringIsContains(dateGot,'error')){
                if(dateGot=="Success"){
                    var loginProfile=this.props.assignProfile;
                    loginProfile(JSON.stringify(this.props.dataGot),'','');
                    this.closeStack();
                }else{
                    Alert.alert('Failed','');
                }
                this.setState({isLoading:false})
            }else{
                Alert.alert('Error Sign Up',dateGot);
                this.setState({isLoading:false})
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    onloadEnd(){
    }
    
    checkLoading(elements){
        const{Colors}=this.props;

        return(<Modal  statusBarTranslucent={true} animationType={'fade'}transparent = {true} visible={this.state.visible}>
        <View style={{flex:1}} >
        {elements}
        {this.state.isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={this.state.isLoading} onDismiss={this.onloadEnd} />}
        </View></Modal>);
        
    }
    
    togglePassword(){
        this.setState({showPass:!this.state.showPass});
    }
    styles=undefined;
    render() {
        const{Colors}=this.props;
        const styles = StyleSheet.create({
            button:{
             backgroundColor:Colors.blueColor,
             justifyContent:'center',
             width:widthPercentageToDP(30),
             height:heightPercentageToDP(4.75),
             borderRadius:heightPercentageToDP(4.75)
         },
         buttontext:{
             textAlign:'center',
             fontFamily:'Cairo-Regular',
             fontSize:18,
             color:Colors.whiteColor
         },
         contentText:{
             textAlign:'center',
             fontFamily:'Cairo-Regular',
             fontSize:widthPercentageToDP(5),
             lineHeight:widthPercentageToDP(5)*1.5,

             color:Colors.inputfontColor
         }
         });
         this.styles=styles;
        return (this.checkLoading(
            <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
            <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
            <View style={{width:'100%',height:'100%',justifyContent:'center'}} >
                <BackgroundWall blur/>
            <View style={{padding:20,backgroundColor:Colors.whiteColor,borderRadius:15,width:widthPercentageToDP(90),alignSelf:'center',justifyContent:'center'}} >
            <Text allowFontScaling={false} style={styles.contentText}>
            {i18n.t('deleteConfirm')}
            </Text>
            <View style={{flexDirection:'row',justifyContent:'space-around',paddingTop:heightPercentageToDP(3)}}>
            <TouchableOpacity style={styles.button} onPress={()=>{
                this.closeStack(true);
            }} >
                <Text allowFontScaling={false} style={styles.buttontext}>{i18n.t('proceed')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>{
                this.closeStack(false);
            }} >
                <Text allowFontScaling={false} style={styles.buttontext}>{i18n.t('cancel')}</Text>
            </TouchableOpacity>
            </View>
            {UIElements.drawGap(heightPercentageToDP(1))}
            </View>
            </View>
            
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>)
            )
        }
       
        closeStack = (onclose) =>{
            {
                var dismiss=this.props.onDismiss;
                dismiss(onclose);
                // this.setState({visible:false})
            }
        }
        
        checkPassword(text){
            this.setState({password:text});
        }
        checkConfirmPassword(text){
            this.setState({confirmpassword:text},()=>{
                if(!Tools.stringIsEmpty(this.state.password)&&this.state.password===this.state.confirmpassword)
                this.setState({passfilled:true});
                else
                this.setState({passfilled:false});
            });
            
        }
        setPassword(){
            this.CreatePassword();
        }
        
        OnVerifyDone(otpvalue,Vstate){
            this.VerifyOtpWS(otpvalue);
            this.setState({otpModal:false})
        }
        
        checkPassFilled(){
            if(this.state.passfilled){
                return(
                    <Text allowFontScaling={false} style={styles.buttontext}>{i18n.t('setpass')}</Text>
                    );
                }else{
                    return(
                        <Text allowFontScaling={false} style={styles.buttontext}>{i18n.t('setpass')}</Text>
                        );
                    }
                }
            }
            
         