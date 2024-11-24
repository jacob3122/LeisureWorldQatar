import React, { Component } from 'react'
import {View,StyleSheet,Text,TextInput,ScrollView,TouchableOpacity,Image,ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import * as tools from '../../Tools/Components/Tools.js';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP} from 'react-native-responsive-screen';

import * as UIElements from '../../Tools/Components/UIElements'

import Colors from '../../Tools/constants/Colors';
import * as Tools from '../../Tools/Components/Tools'
import homebg from'../../assets/bg/bg-01.jpg'
import proceedB from '../../assets/Icons/back.png'
import HeaderLogo from '../../Tools/Components/HeaderLogo.js';
import BackButton from '../../Tools/Components/BackButton.js';
import {Dimensions } from "react-native";
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics.js';

export default class PasswordHandle extends Component {
    
    
    
    constructor(props){
        super(props);
        this.state={
            change:false,
            samepass:0,
            loading:true,
            showCurrent:false,
            showNew:false,showConfirmNew:false,
            currentPass:'',
            newPass:'',
            confirmnewPass:'',
            currentPassRight:0,
            validNewPass:0,
        }
    }
    
    componentDidMount(){
        logScreenViewEvent("PasswordHandle","Change Pass");
     }
    
    
    changeHappened(stateB){
        this.setState({samepass:stateB});
    }
    
    drawGap=(valueGap)=>{
        return(
            <View
            style={{paddingTop:valueGap}}/>
            );
        }
        
        
        drawLine=(colorstr)=>{
            return(
                <View
                style={{
                    borderBottomColor: colorstr,
                    borderBottomWidth: 0.5,
                }}/>
                );
            }
            
            setLoadingState(stateP){
                this.setState({loading:stateP});
            }
            
            performActionWithTime(callback,params,timeTaken){
                setTimeout(() => {callback(params)},timeTaken);
            }
            
            togglePassword(stateName){
                this.setState(stateName==='c'?({showCurrent:!this.state.showCurrent}):this.setState(stateName==='cn'?({showConfirmNew:!this.state.showConfirmNew}):({showNew:!this.state.showNew})));
            }
            
            checkCurrentPass(){
                if(this.state.currentPassRight==2){
                    return(<Text allowFontScaling={true} style={styles.warning} >Current Password is not same</Text>)
                }
            }
            
            checkNewPass(){
                if(this.state.validNewPass==1){
                    return(<Text allowFontScaling={true} style={styles.warning} >Password should be 8 characters</Text>)
                }
            }
            
            
            checkSamePass(){
                if(this.state.samepass==1){
                    return(<Text allowFontScaling={true} style={styles.warning} >{i18n.t('confirmpassnotsame')}</Text>)
                }
            }
            
            
            checkPasswords(textData){
                if(!tools.stringIsEmpty(this.state.newPass)&&this.state.newPass===this.state.confirmnewPass){
                    this.changeHappened(2);
                }else{
                    this.changeHappened(1);
                }
            }
            
            onChangeCurrentText(textData){
                this.setState({currentPass:textData});
            }
            onChangeNewText(textData){
                this.setState({newPass:textData});
            }
            onChangeConfirmNewText(textData){
                this.setState({confirmnewPass:textData});
            }
            updatePass(){
                this.changeHappened(false);
                this.setState({newPass:'',currentPass:''});
            }
            
            render() {
                return (
                    <View style={{flex:1}}>
                    {/* <ImageBackground source={homebg} style={styles.bgImage}/> */}
                    {/* {this.drawGap(40)} */}
                    {/* <HeaderLogo headerTitle={i18n.t('changepass')} border={true}/> */}
                    <ScrollView 
                    showsVerticalScrollIndicator = {false}
                    ref='_scrollView'
                    contentContainerStyle={styles.homeScrollView}
                    style={styles.homeView}>
                    {/* <Text  allowFontScaling={false} style={styles.heading} >
                    {i18n.t('changeyourpass')}
                </Text> */}
                {UIElements.drawGap(10)}
                <View style={styles.rowView}>
                {/* <Text allowFontScaling={false} style={styles.subheading}>{i18n.t('current')}</Text> */}
                <View style ={styles.inputView}>
                <TextInput allowFontScaling={false} style={styles.password}
                placeholderTextColor={Colors.placeholdertext}
                placeholder={i18n.t('currentpass')}
                onChangeText={(txt)=>this.onChangeCurrentText(txt)}
                onEndEditing={(txt)=>{}}
                returnKeyType='done'
                value={this.state.currentPass}
                maxLength={16}
                secureTextEntry={!this.state.showCurrent}></TextInput></View>
                <View style={[styles.passwordButView,Tools.stringIsContains(global.locale,'en')?{transform:[{translateX:width*0.75}]}:{transform:[{translateX:-15}]}]}>

                <Text allowFontScaling={false} style={styles.passwordBut}
                onPress={()=>
                    this.togglePassword('c')
                }>{(!this.state.showCurrent)?i18n.t('show'): i18n.t('hide')}</Text></View>
                </View>
                {this.checkCurrentPass()}
                
                {UIElements.drawGap(20)}
                
                <View style={styles.rowView}>
                {/* <Text allowFontScaling={false} style={styles.subheading}>{i18n.t('new')}</Text> */}
                <View style ={styles.inputView}>
                <TextInput allowFontScaling={false} style={styles.password}
                placeholderTextColor='#676667'
                placeholder={i18n.t('newpass')}
                maxLength={16}
                
                onChangeText={(txt)=>this.onChangeNewText(txt)}
                onEndEditing={(txt)=>{this.checkPasswords(txt)}}
                returnKeyType='done'
                value={this.state.newPass}
                secureTextEntry={!this.state.showNew}></TextInput></View>
                <View style={[styles.passwordButView,Tools.stringIsContains(global.locale,'en')?{transform:[{translateX:width*0.75}]}:{transform:[{translateX:-15}]}]}>

                <Text allowFontScaling={false} style={styles.passwordBut}
                onPress={()=>
                    this.togglePassword('n')
                }>{(!this.state.showNew)? i18n.t('show'): i18n.t('hide')}</Text>
                </View>
                </View>
                {this.checkNewPass()}
                
                {UIElements.drawGap(20)}
                
                <View style={styles.rowView}>
                {/* <Text allowFontScaling={false} style={styles.subheading}>Confirm New</Text> */}
                
                <View style ={styles.inputView}>
                <TextInput allowFontScaling={false} style={styles.password}
                placeholderTextColor='#676667'
                placeholder={i18n.t('confirmnewpass')}
                maxLength={16}
                onChangeText={(txt)=>this.onChangeConfirmNewText(txt)}
                onEndEditing={(txt)=>{this.checkPasswords(txt)}}
                returnKeyType='done'
                value={this.state.confirmnewPass}
                secureTextEntry={!this.state.showConfirmNew}></TextInput></View>
                <View style={[styles.passwordButView,Tools.stringIsContains(global.locale,'en')?{transform:[{translateX:width*0.75}]}:{transform:[{translateX:-15}]}]}>
                <Text allowFontScaling={false} style={styles.passwordBut}
                onPress={()=>
                    this.togglePassword('cn')
                }>{(!this.state.showConfirmNew)? i18n.t('show'): i18n.t('hide')}</Text></View>
                </View>
                {this.checkSamePass()}
                {UIElements.drawGap(20)}
                <TouchableOpacity
                onPress={()=>this.updatePass()}
                style={styles.buttonSign}
                disabled={this.state.samepass===2?false:true}>
                {this.state.samepass===2&&(
                // <Gradient gradient={Colors.gradientBut} style={styles.buttonSign}> 
                    <Text allowFontScaling={false} style={styles.buttontext}> {i18n.t('changepass')}</Text>
                    // </Gradient>
                    )}
                    {this.state.samepass!==2&&(<Text style={styles.buttontext}> {i18n.t('changepass')}</Text>)}
                    </TouchableOpacity>
                                  
                    </ScrollView>
                    <BackButton onpress={()=>this.props.navigation.goBack()}/>

                    {/* <TouchableOpacity onPressIn={()=>{this.props.navigation.goBack();}}>
                                    <Image source={proceedB} style={styles.backbut} ></Image>
                                    </TouchableOpacity> */}
                                    </View>
                    )
                }
                
            }
            
            
            const styles = StyleSheet.create({
                backbut:{
                    position:'absolute',
                    bottom:heightPercentageToDP('5%'),
                    alignSelf:'center',
                    width:50,
                    height:50,
                },
                logoImg:{
                    alignSelf:'flex-start',
                    marginLeft:15,
                    width:70.2*(width/280),
                    height:65.3*(width/280),
                    // maxWidth:220,
                }, titleView:{
                    position:'absolute',
                    borderWidth:2,
                    borderRadius:10,
                    alignSelf:'flex-end',
                    transform:[{translateX:width/4.5},{translateY:50}],
                    borderColor:Colors.whiteColor,
                },
                titleTxt:{
                    color:Colors.whiteColor,
                    fontFamily:'Cairo-Regular',
                    fontSize: (width/15),
                    paddingLeft:10,
                    paddingRight:100,
                },
                bgImage:{
                    position:'absolute',
                    alignSelf:'center',
                    width:'100%',
                    height:height,
                    resizeMode:'contain'
                },
                warning:{
                    color:Colors.warningColor,
                    marginTop:15,
                    // paddingBottom:15,
                    marginStart:width/9,
                    fontFamily:'Cairo-Bold',
                    fontSize: 18
                },
                gradStyle:{
                    position:'absolute',
                    width:width,
                    height:height,
                    zIndex:-1,
                    // borderRadius:15,
                },
                buttonSign:{
                    width:width/2,
                    height:50,
                    alignSelf:'center',
                    alignItems:'center',
                    borderRadius:15,
                    borderWidth:2,
                    borderColor:Colors.whiteColor,
                    justifyContent:'center'
                },
                buttontext:{
                    fontSize:20,
                    color:'white',fontFamily:'Cairo-Regular'
                },
                rowView:{
                    flex: 1, flexDirection: 'row'
                },   
                homeView: {
                    flex: 1,
                    // backgroundColor:'#fff',
                },
                homeScrollView: {
                    // backgroundColor:'#fff',
                    padding:15,
                    
                },heading: {
                    textAlign:'left',
                    fontSize: 35,
                    color:Colors.darkfontColor,fontFamily:'Cairo-Bold'
                },
                subheading: {
                    flex:0.45,
                    textAlign:'left',
                    paddingTop:10,
                    fontSize: 18,
                    // height:40,
                    textAlignVertical:'center',
                    color:Colors.darkfontColor,
                    fontFamily:'Cairo-Bold',
                    // borderWidth:1
                },inputView:{
                    flex:1,
                    height:40,
                    // borderWidth:2,
                    flexDirection:'column',
                    alignItems:'flex-start',
                    alignContent:'flex-start',
                    borderWidth:2,
                    borderColor:Colors.whiteColor,
                    backgroundColor:Colors.inputboxColor,
                    borderRadius:15,
                    marginBottom:20,
                },
                password:{
                    fontSize: 18,
                    flex:1,
                    textAlign:'left',
                    fontWeight: '200',
                    color:Colors.inputfontColor,
                    width:'90%',
                    fontFamily:'Cairo-Regular',
                    paddingStart:10,
                    borderRadius:5,
                    margin:10,
                },
                passwordBut:{
                    textAlign:'left',
                    alignSelf:'center',
                    textAlign:'center',
                    fontWeight: '100',
                    zIndex:1,
                    fontFamily:'Cairo-Regular',
                    color:Colors.whiteColor,
                    fontSize: 18,
                },passwordButView:{
                    position:'absolute',
                    flex:1,
                    flexDirection:'row',
                    fontSize: 15,
                    height:60,
                    // height:45,
                    fontWeight: '400',
                    width:50,
                    // borderWidth:1,
                }
                
            });
            PasswordHandle.propTypes = {
                profile: PropTypes.object.isRequired,
            }