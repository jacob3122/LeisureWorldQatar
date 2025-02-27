import { Text,Image, Alert, SafeAreaView, FlatList } from 'react-native';
import { RefreshControl,ScrollView,Switch,TouchableOpacity,PixelRatio} from 'react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
// import { NavigationEvents } from 'react-navigation';
import PropTypes from 'prop-types';
import GetStarted from './GetStarted'
import SecureStore from '../../Tools/Components/SecureStore';
import itemsButton from '../../assets/Icons/event.png'
import moment from'moment'
import locationIcon from '../../assets/Icons/loca.png'

import {Dimensions } from "react-native";
const window = Dimensions.get('window');
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import * as UIElements from './UIElements'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { NativeModules } from "react-native";
// import Colors from '../constants/Colors';
import appLogo from '../../assets/Icons/leisure_white.png'
import myinfoIcon from '../../assets/Icons/profileone.png'
import signoutIcon from '../../assets/Icons/signout.png'
import couponIcon from '../../assets/Icons/couponlogoun.png'
import claimIcon from '../../assets/Icons/claim.png' 
import redeemIcon from '../../assets/Icons/rewardpoint.png' 
import settingsIcon from '../../assets/Icons/settings.png' 
import orderIcon from '../../assets/Icons/order.png' 
import eventIcon from '../../assets/Icons/event.png' 

import pcardIcon from '../../assets/Icons/pcard.png' 


import deleteUserIcon from '../../assets/Icons/block-user.png' 

import passIcon from '../../assets/Icons/changePass.png' 
import HeaderLogo from './HeaderLogo';
import WebServices from '../constants/WebServices';
import ProfileData from './ProfileData';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import * as Tools from '../Components/Tools'
import cardbg from '../../assets/card/cardde.png';
import notify from '../../assets/Icons/notify.png';
import bgred from '../../assets/card/red.png';
import SVGbg from'../../assets/bg/Back_app-04.svg'
import rulesIcon from '../../assets/Icons/rules.png'
import Verfication from './Verification';
import DeleteConfirmation from './DeleteConfirmation';
import NotificationPage from './NotificationPage';
import { getInstallerPackageNameSync } from 'react-native-device-info';
import LoadingLine from './LoadingLine';
import { useTheme } from '../context/ThemeProvider';
export default function (props){
    const Colors=useTheme();
    useEffect(()=>{
            i18n.locale=global.locale;
        },[global.locale])
    return <AccountHandle {...props}locale={i18n.locale} Colors={Colors}/>
}
class AccountHandle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            pushNotify:false,
            emailNotify:false,
            allowFaceID:false,
            smsNotify:false,
            languageENAR:'',
            showLogin:false,
            otpModal:false,
            deleteModal:false,
            scrollPage:0,
            eventUpcoming:0,
            eventObjs:undefined,
            eventObj:{}
        };
        this.onNavigatorEvent=this.onNavigatorEvent.bind(this);
        this.onDeleteConfirm=this.onDeleteConfirm.bind(this);
        this.setNotificationVisible=this.setNotificationVisible.bind(this)
    }
    
    
    static getDerivedStateFromProps(props, cstate) {
        if(props.profile!==undefined&&props.profile.FirstName!==undefined){
            return {
                showLogin: false
            };
        }
        return null;
    }
    
    componentDidMount(){
        Tools.updateRatePoints(1);
        SecureStore.getItemAsync('useBiometric').then(useBiometric=>{
            this.setState({allowFaceID:((useBiometric==='Y')?true:false)});
        });
        SecureStore.getItemAsync('languageENAR').then(languagecheck=>{this.setState({languageENAR:languagecheck})});
        this.willFocus=this.props.navigation.addListener('focus',()=>{
            this.onNavigatorEvent();
        })
        if((this.props.profile===undefined||this.props.profile.FirstName===undefined)){
        }else{
            this.fetchEvents();
        }
    }
    
    onNavigatorEvent() {
        if((this.props.profile===undefined||this.props.profile.FirstName===undefined)){
            this.setState({showLogin:true});
            // this.props.navigation.navigate('FullScreen',{
            //     navigation:this.props.navigation,
            //     assignProfile:this.props.assignProfile,
            //     sendOTP:this.props.sendOTP,
            //     verifyOTP:this.props.verifyOTP});
        }
        else{
            if(this.props.profile.ActiveEvents!=undefined&&this.props.profile.ActiveEvents>0&&(this.state.eventObjs==undefined||this.state.eventObjs.length==0))
            {
                this.fetchEvents();
            }
        }
    }
    
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
    refreshListView () {
        // this.setState({refreshing: false});
        updateprofile= this.props.assignProfile;
        updateprofile("user","","",()=>{
            this.setState({refreshing: false});
        },()=>{
            this.setState({refreshing: false});
        });
        this.fetchEvents();
        // fetchData().then(() => {
        //   this.setState({refreshing: false});
        // });
    }
    refreshControl(){
        const {Colors}=this.props;
        return (
            <RefreshControl
            tintColor={Colors.orangeShadeColor}
            refreshing={this.state.refreshing}
            onRefresh={()=>this.refreshListView()} />
            )
        }
        fetchEvents(){
            this.setState({isLoading:true})
            var orders=WebServices.getEvents.replace("{MemberID}",this.props.accessToken.MemberID)
            // console.log(WebServices.MainURL+orders);
            fetch (WebServices.MainURL+orders,{
                method: 'GET',
                headers: {
                    'Authorization':'Bearer '+this.props.accessToken.access_token,
                    'Content-Type': 'application/json',
                },
            },5000)
            .then((response) => response.text())
            .then((responseJson) => {
            this.setState({isLoading:false})
            // console.log(responseJson);

                var responseObj=JSON.parse(responseJson);
                if(Tools.stringIsEmpty(responseObj.Error)){
                    for (let index = 0; index < responseObj.length; index++) {
                        const element = responseObj[index];
                        if(element.Active){
                            this.setState({eventUpcoming:index});
                            index=10000;
                        }
                    }
                    this.setState({eventObjs:responseObj})
                }
                
            }).catch((error) =>{
            this.setState({isLoading:true})
                // console.log(error)
            });
        }
        
      
        loadLogin=false;
        addProfileDetails(){
            
            const {Colors}=this.props;
            if(this.props.profile.FirstName!=null){
                if(this.props.profile.CardNo!=null){
                    return(
                        <View style={{
                            width:widthPercentageToDP('70%'),}}>
                            
                           
                        <View style={[this.styles.bottompart,{backgroundColor:Colors.orangeColor}]}>
                        {UIElements.drawGap(15)}
                        <Text numberOfLines={1} allowFontScaling={false} style={this.styles.heading}>{this.props.profile.FirstName+" "+this.props.profile.LastName}</Text>
                        <View style={{flexDirection:'row'}}>
                        <Text allowFontScaling={false} style={this.styles.balance}>{i18n.t('yourbalance')}</Text>
                        <View style={{justifyContent:'center'}}> 
                        <Text allowFontScaling={false} style={[this.styles.balance,{paddingStart:10,fontFamily:'Cairo-Bold'}]}>{this.props.profile.Points}</Text>
                        </View>
                        </View>
                        {UIElements.drawGap(25)}
                        <Text allowFontScaling={false} style={[this.styles.pId,{textAlign:'center'}]}>{i18n.t('membership')}</Text>
                        <Text allowFontScaling={false} style={[this.styles.pId,{paddingStart:10,fontSize:heightPercentageToDP(2.5),fontFamily:'Cairo-Bold',textAlign:'center'}]}>{this.cardFormatting(this.props.profile.CardNo)}</Text>
                        </View>
                        
                        
                        <View style={{paddingTop:'2%'}}>
                        {UIElements.drawGap(20)}
                        <ScrollView 
                        onMomentumScrollEnd={
                            (event) => {this.setState({scrollPage:Math.ceil(parseFloat(event.nativeEvent.contentOffset.x/Dimensions.get('window').width))})
                        }}
                        horizontal
                        pagingEnabled
                        disableIntervalMomentum={ true } 
                        showsHorizontalScrollIndicator={false}
                        // style={styles.scrollStyle}
                        >
                        {(this.props.profile!=undefined&&this.props.profile.ActiveEvents!=undefined&&this.props.profile.ActiveEvents>0)&&
                            <View style={[this.styles.Buttonparent,{padding:widthPercentageToDP(3)}]}>
                            <Text allowFontScaling={false} style={this.styles.upcomingTxt}>{i18n.t('upcomingevents')}</Text>
                            {UIElements.drawGap(5)}
                            {this.state.isLoading&&<LoadingLine loadBar={{backgroundColor:Colors.orangeShadeColor}} />}
                            {(this.state.eventObjs!=undefined&&this.state.eventObjs.length>0)&&<TouchableOpacity style={{
                                backgroundColor:Colors.whiteColor,borderColor:Colors.orangeShadeColor,borderRadius:15,width:'100%',borderWidth:1,
                            padding:widthPercentageToDP(2.2)}}
                            onPress={()=>{
                                const _dataIn=this.state.eventObjs[this.state.eventUpcoming];
                            this.props.navigation.navigate('event',{event:_dataIn,accessToken:this.props.accessToken});
                            }}>
                        <View style={{flexDirection:'row'}}>
                        <Image style={{width:heightPercentageToDP(6),height:heightPercentageToDP(6),alignSelf:'center',tintColor:Colors.orangeShadeColor,marginEnd:10}} source={itemsButton}/>
                        <View style={{flex:1,alignSelf:'center'}}>
                        <Text numberOfLines={2} allowFontScaling={false} style={[this.styles.title]}>{this.props.locale=='ar'?this.state.eventObjs[this.state.eventUpcoming].EventNameAr:
                        this.state.eventObjs[this.state.eventUpcoming].EventNameEn}</Text>
                        
                        {/* {this.getItems(this.state.orderObjs[t])} */}
                        </View>
                        </View>
                        {/* <View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('date')}:</Text>
                        <Text allowFontScaling={false} style={styles.subtitle}>{moment(this.state.eventObjs[this.state.eventUpcoming].StartDate).format('DD-MM-YYYY hh:mm a')}</Text></View>
                        <View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('totalInvites')}:</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{this.state.eventObjs[this.state.eventUpcoming].TotalInvitations}</Text></View>
                        <View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('remainInvites')}:</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{this.state.eventObjs[this.state.eventUpcoming].TotalInvitations-this.state.eventObjs[this.state.eventUpcoming].Invitation.length}</Text>
                        </View>*/}
                        <View style={{flexDirection:'row',justifyContent:'center',alignSelf:'center'}}>
                        <Image resizeMode='contain' style={{width:widthPercentageToDP(5),height:widthPercentageToDP(5),tintColor:Colors.orangeShadeColor}} source={locationIcon}/>
                        <Text style={this.styles.subtitle} allowFontScaling={false}>{this.props.locale=='ar'?this.state.eventObjs[this.state.eventUpcoming].LocationNameAr:this.state.eventObjs[this.state.eventUpcoming].LocationName}</Text>
                        </View>
                        </TouchableOpacity>}
                        {this.getFirstthreebuttons()}
                            </View>}
                            <View style={this.styles.Buttonparent}>

                            {(this.props.profile==undefined||this.props.profile.ActiveEvents==undefined||this.props.profile.ActiveEvents==0)&&<>
                            {/* <View style={styles.rowViewButton}> */}
                            {this.getFirstthreebuttons()}</>}
                            <TouchableOpacity style={[this.styles.buttonBg,{backgroundColor:Colors.orangeShadeColor}]}  onPress={()=>
                                this.props.navigation.navigate('MyEvents',{accessToken:this.props.accessToken,eventObjs:this.state.eventObjs})
                                
                            }>
                            <Image source={eventIcon} style={[this.styles.profileIcon,{tintColor:Colors.whiteColor, width:30,height:30}]}/>
                            <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('myevents')}</Text>
                            
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={this.styles.buttonBg} onPress={() =>
                                this.props.navigation.navigate('claims',{
                                    otherParam: i18n.t('claimpoints'),backParam: i18n.t('myaccount'), pagefrom:'account'
                                })}>
                                <Image source={claimIcon} style={this.styles.profileIcon}/>
                                <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('claim')}</Text>
                                
                                </TouchableOpacity>
                                
                                {/* </View> */}
                                
                                {/* <View style={styles.rowViewButton}> */}
                                <TouchableOpacity style={[this.styles.buttonBg,{backgroundColor:Colors.orangeShadeColor}]}   onPress={() =>
                                    this.props.navigation.navigate('redeem',{
                                        otherParam: 'Redeem Points',backParam: i18n.t('myaccount') ,pagefrom:'account',profile:this.props.profile,redeem:this.props.redeem,redeemPoint:this.props.redeemPoint,redeemProfile:this.props.redeemProfile
                                    })}>
                                    <Image source={redeemIcon} style={this.styles.profileIcon}/>
                                    <Text numberOfLines={2} allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('redeem')}</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={[this.styles.buttonBg,{backgroundColor:Colors.orangeShadeColor}]}   onPress={() =>
                                        this.props.navigation.navigate('Coupon',{
                                            
                                        })}>
                                        <Image source={couponIcon} style={this.styles.profileIcon}/>
                                        <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('coupon')}</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={this.styles.buttonBg}  onPress={()=>
                                            this.props.navigation.navigate('RulesAccount')
                                            // this.props.navigation.navigate('MyCards',{})
                                            // this.props.navigation.navigate('MyOrders')
                                            
                                        }>
                                        <Image source={rulesIcon} style={[this.styles.profileIcon,{width:30,height:30}]}/>
                                        <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('rules')}</Text>
                                        
                                        </TouchableOpacity>
                                        <TouchableOpacity style={this.styles.buttonBg} onPress={() =>
                                            this.props.navigation.navigate('Settings',{
                                                otherParam: (i18n.t('changepass')),backParam:i18n.t('myaccount') 
                                            })
                                        }>
                                        <Image source={settingsIcon} style={this.styles.profileIcon}/>
                                        <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('settings')}</Text>
                                        
                                        </TouchableOpacity>
                                        
                                        {(this.props.profile!=undefined&&this.props.profile.ActiveEvents!=undefined&&this.props.profile.ActiveEvents>0)&&
                                        this.getLastthreebutton()}
                                        </View>
                                        {(this.props.profile==undefined||this.props.profile.ActiveEvents==undefined||this.props.profile.ActiveEvents==0)&&
                                        <View style={this.styles.Buttonparent}>
                                        {this.getLastthreebutton()}
                                            
                                            
                                            {/* </View> */}
                                            </View>}
                                            </ScrollView>
                                            <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'space-around',width:'20%',borderWidth:0,marginTop:'3%'}}>
                                            {
                                                this.getPagesIndicator()
                                            }
                                            {/* <View style={{backgroundColor:this.state.scrollPage==0?Colors.yellowColor:Colors.orangeShadeColor, width:this.state.scrollPage==0?15:10,height:this.state.scrollPage==0?15:10,marginTop:this.state.scrollPage==0?0:2.5,alignSelf:'center',borderRadius:this.state.scrollPage==0?15:10}}></View>
                                            <View style={{backgroundColor:this.state.scrollPage==1?Colors.yellowColor:Colors.orangeShadeColor, width:this.state.scrollPage==1?15:10,height:this.state.scrollPage==1?15:10,marginTop:this.state.scrollPage==0?0:2.5,alignSelf:'center',borderRadius:this.state.scrollPage==0?15:10}}></View>
                                            <View style={{backgroundColor:this.state.scrollPage==2?Colors.yellowColor:Colors.orangeShadeColor, width:this.state.scrollPage==2?15:10,height:this.state.scrollPage==2?15:10,marginTop:this.state.scrollPage==1?0:2.5,borderRadius:this.state.scrollPage==1?15:10}}></View> */}
                                            </View>
                                            </View>
                                            
                                            
                                            
                                            {/* {this.getAccountEditor()} */}
                                            {/* {this.getCommunicationPref()} */}
                                            {/* {this.checkProfileCommunicationPref()} */}
                                            {/* {this.getAppPref()} */}
                                            {/* {this.getHelp()} */}
                                            </View>
                                            );
                                        }
                                    }else{
                                        return(
                                            <View>
                                            {/* <Text allowFontScaling={false} style={styles.headingIn}>{i18n.t('myaccount')}</Text>
                                        <Text allowFontScaling={false} style={styles.subheading}>{i18n.t('managesetting')}</Text> */}
                                        {UIElements.drawGap(0)}
                                        {/* <GetStarted navigation={this.props.navigation} assignProfile={this.props.assignProfile}/> */}
                                        {/* {this.getCommunicationPref()} */}
                                        {this.checkProfileCommunicationPref()}
                                        {/* {this.getAppPref()} */}
                                        {this.getHelp()}
                                        </View>
                                        );
                                    }
                                }
                                getFirstthreebuttons(){
                                    const {Colors}=this.props;
                                    return(<><TouchableOpacity style={[this.styles.buttonBg,{backgroundColor:Colors.yellowColor/*,width:widthPercentageToDP(18),height:widthPercentageToDP(18)*/}]} onPress={()=>{this.props.navigation.navigate('AccountEdit')}} >
                                    <Image source={myinfoIcon} style={[this.styles.profileIcon]}/>
                                    <Text numberOfLines={2}  allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('myinfo')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.styles.buttonBg}  onPress={()=>
                                        this.props.navigation.navigate('MyCards',{})
                                        // this.props.navigation.navigate('MyOrders')
                                        
                                    }>
                                    <Image source={pcardIcon} style={[this.styles.profileIcon,{width:30,height:30}]}/>
                                    <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('mycards')}</Text>
                                    
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.styles.buttonBg}  onPress={()=>
                                        this.props.navigation.navigate('MyOrders')
                                        
                                    }>
                                    <Image source={orderIcon} style={[this.styles.profileIcon,{tintColor:Colors.whiteColor, width:30,height:30}]}/>
                                    <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('myorders')}</Text>
                                    
                                    </TouchableOpacity></>);
                                }
                                getLastthreebutton(){
                                    const {Colors}=this.props;
                                    return(
                                        <View style={{flexDirection:'row',alignItems:'flex-start',alignSelf:'center',justifyContent:'space-evenly',width:'100%'}}>
                                            <TouchableOpacity style={this.styles.buttonBg}  onPress={() =>
                                            {
                                                // Linking.openURL(WebServices.resetPass);
                                                Alert.alert(i18n.t('changepasssure'),"",[
                                                    {
                                                        text:i18n.t('yes'),
                                                        onPress:()=>{
                                                            var submitRequest=this.props.submitChangePassRequest;
                                                            submitRequest();
                                                        }
                                                    },
                                                    {
                                                        text:i18n.t('no'),
                                                        onPress:()=>{
                                                        }
                                                    }
                                                ])
                                                
                                            }}>
                                            <Image source={passIcon} style={this.styles.profileIcon}/>
                                            <Text numberOfLines={2} allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('changepass')}</Text>
                                            </TouchableOpacity>
                                            
                                            
                                            <TouchableOpacity style={[this.styles.buttonBg,{backgroundColor:Colors.orangeShadeColor}]}   onPress={() =>{
                                                this.setState({deleteModal:true})
                                                
                                            }}>
                                            <Image source={deleteUserIcon} style={this.styles.profileDIcon}/>
                                            <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('deleteAccount')}</Text>
                                            
                                            </TouchableOpacity>
                                            
                                            
                                            
                                            <TouchableOpacity style={[this.styles.buttonBg,{backgroundColor:Colors.yellowShadeColor}]}  onPress={()=>{this.SignOut()}}>
                                            <Image source={signoutIcon} style={this.styles.profileIcon}/>
                                            <Text allowFontScaling={false} style={this.styles.profileTxt}>{i18n.t('signout')}</Text>
                                            
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                                drawGap=(valueGap)=>{
                                    return(
                                        <View
                                        style={{paddingTop:valueGap}}/>
                                        );
                                    }
                                    getPagesIndicator(){
                                        const {Colors}=this.props;
                                        allPages=[];
                                        let countIn=0;
                                        let Total=2;//(!Tools.stringIsEmpty(this.props.profile.ActiveEvents)&&this.props.profile.ActiveEvents>0)?3:2;
                                        for (let index = 0; index < Total; index++) {
                                            allPages.push(
                                                <View style={{backgroundColor:this.state.scrollPage==index?Colors.yellowColor:Colors.orangeShadeColor, width:this.state.scrollPage==index?15:10,height:this.state.scrollPage==index?15:10,marginTop:this.state.scrollPage==index?0:2.5,alignSelf:'center',borderRadius:this.state.scrollPage==index?15:10}}></View>
                                            )
                                            
                                        }
                                        return allPages;
                                    }
                                    getAccountEditor(){
                                        const {Colors}=this.props;
                                        return(
                                            <View style={this.styles.accountView}>
                                            <Text allowFontScaling={false} style={this.styles.detailshead}>{i18n.t('accountdetails')}</Text>
                                            {this.drawLine('black')}
                                            <Text  allowFontScaling={false} style={this.styles.detailstitle} onPress={() =>
                                                this.props.navigation.navigate('AccountEdit',{navigation:this.props.navigation})
                                            }>{i18n.t('yourprofile')}</Text>
                                            {this.drawLine('grey')}
                                            {/* <Text style={styles.detailstitle}
                                            onPress={() =>
                                                this.props.navigation.navigate('Receipts',{
                                                    otherParam: i18n.t('receiptsandtransactions'),backParam:i18n.t('myaccount') 
                                                })}>{i18n.t('receiptsandtransactions')}</Text>
                                            {this.drawLine('grey')} */}
                                            <Text allowFontScaling={false}  style={this.styles.detailstitle}onPress={() =>
                                                this.props.navigation.navigate('claims',{
                                                    otherParam: i18n.t('claimpoints'),backParam: i18n.t('myaccount'), color:Colors.yellowColor 
                                                })}>{i18n.t('claimpoints')}</Text>
                                                {this.drawLine('grey')}
                                                {/* <Text style={styles.detailstitle}
                                                onPress={() =>
                                                    this.props.navigation.navigate('Benifits',{
                                                        otherParam:i18n.t('leisuregold'),backParam: i18n.t('myaccount') 
                                                    })}>{i18n.t('leisuregold')}</Text>
                                                {this.drawLine('grey')} */}
                                                {/* <Text style={styles.detailstitle}
                                                onPress={() =>
                                                    this.props.navigation.navigate('Points',{
                                                        otherParam: i18n.t('pointscalculator'),backParam:i18n.t('myaccount') 
                                                    })}>{i18n.t('pointscalculator')}</Text>
                                                {this.drawLine('grey')} */}
                                                <Text allowFontScaling={false}  style={this.styles.detailstitle}
                                                onPress={() =>
                                                    this.props.navigation.navigate('Password',{
                                                        otherParam: (i18n.t('changepass')),backParam:i18n.t('myaccount') 
                                                    })
                                                }>{i18n.t('changeyourpass')}</Text>
                                                </View>
                                                );
                                            }
                                            toggleSwitch(stateName){
                                                switch(stateName){
                                                    case 'p':{
                                                        this.setState({pushNotify:!this.state.pushNotify});
                                                        return;
                                                    }case 'e':{
                                                        this.setState({emailNotify:!this.state.emailNotify});
                                                        return;
                                                    }case 's':{
                                                        this.setState({smsNotify:!this.state.smsNotify});
                                                        return;
                                                    }case 'f':{
                                                        this.setState({allowFaceID:!this.state.allowFaceID},()=>{SecureStore.setItemAsync('useBiometric',this.state.allowFaceID?'Y':'N')});
                                                        return;
                                                    }
                                                }
                                                // this.setState(stateName==='p'?({pushNotify:!this.state.pushNotify}):stateName==="e"?({emailNotify:!this.state.emailNotify}):({smsNotify:!this.state.smsNotify}))
                                            }
                                            
                                            checkProfileCommunicationPref(){
                                                const {Colors}=this.props;
                                                if(this.props.profile.FirstName!=null){
                                                    return(
                                                        <View style={this.styles.accountView}>
                                                        <Text allowFontScaling={false}  style={this.styles.detailshead}>{i18n.t('communicationpreferences')}</Text>
                                                        {this.drawLine('black')}
                                                        {this.drawLine('grey')}
                                                        <View style={this.styles.rowView}>
                                                        <Text allowFontScaling={false}  style={this.styles.detailstitle}>{i18n.t('emailnotification')}</Text>
                                                        <View style={this.styles.switchview}>
                                                        <Switch style={this.styles.switch}
                                                        // thumbColor={Colors.orangeColor}
                                                        onValueChange={()=>this.toggleSwitch('e')}
                                                        value={this.state.emailNotify}></Switch></View>
                                                        </View>
                                                        
                                                        {this.drawLine('grey')}
                                                        <View style={this.styles.rowView}>
                                                        <Text allowFontScaling={false}  style={this.styles.detailstitle}>{i18n.t('smsnotification')}</Text>
                                                        <View style={this.tyles.switchview}>
                                                        <Switch style={this.styles.switch}
                                                        // thumbColor={Colors.orangeColor}
                                                        onValueChange={()=>this.toggleSwitch('s')}
                                                        value={this.state.smsNotify}></Switch></View>
                                                        </View></View>
                                                        )
                                                    }
                                                }
                                                
                                                getCommunicationPref(){
                                                    return(
                                                        // <View style={styles.accountView}>
                                                        // <Text style={styles.detailshead}>{i18n.t('communicationpreferences')}</Text>
                                                        // {this.drawLine('black')}
                                                        {/* <View style={styles.rowView}>
                                                        <Text style={styles.detailstitle}>{i18n.t('pushnotification')}</Text>
                                                        <View style={styles.switchview}>
                                                        <Switch style={styles.switch}
                                                        onValueChange={()=>this.toggleSwitch('p')}
                                                        value={this.state.pushNotify}></Switch></View>
                                                    </View> */}
                                                    // {this.checkProfileCommunicationPref()}
                                                    // </View>
                                                    );
                                                }
                                                
                                                checkProfileAppPref(){
                                                    if(this.props.profile.profileId!=null){
                                                        return(
                                                            <View>    
                                                            <View style={this.styles.rowView}>
                                                            <Text allowFontScaling={false}  style={this.styles.detailstitle}>{i18n.t('allowfaceid')}</Text>
                                                            <View style={this.styles.switchview}>
                                                            <Switch style={this.styles.switch}
                                                            onValueChange={()=>this.toggleSwitch('f')}
                                                            value={this.state.allowFaceID}></Switch>
                                                            </View>
                                                            </View>
                                                            {this.drawLine('grey')}</View>
                                                            )
                                                        }
                                                    }
                                                    
                                                    getAppPref(){
                                                        return(
                                                            <View style={this.styles.accountView}>
                                                            <Text  allowFontScaling={false} style={this.styles.detailshead}>{i18n.t('apppreferences')}</Text>
                                                            {this.drawLine('black')}
                                                            {this.checkProfileAppPref()}
                                                            <Text  allowFontScaling={false} style={this.styles.detailstitle}>{i18n.t('country')}</Text>
                                                            {this.drawLine('grey')}
                                                            <View style={this.styles.rowView}>
                                                            <Text allowFontScaling={false}  style={this.styles.detailstitle} >{i18n.t('language')}</Text>
                                                            <View style={this.styles.switchview}>
                                                            <Text allowFontScaling={false}  style={this.styles.detailsdata} onPress={()=>{this.changeLanguage(this.state.languageENAR)}}>{i18n.t('switchto')}</Text></View>
                                                            </View>
                                                            </View>
                                                            );
                                                        }
                                                        
                                                        checkProfileHelp(){
                                                            if(this.props.profile.FirstName!=null){
                                                                return(
                                                                    <View>    
                                                                    <Text allowFontScaling={false}  style={this.styles.detailstitle}
                                                                    onPress={() =>this.SignOut()}>{i18n.t("signout")}</Text>
                                                                    {this.drawLine('grey')}
                                                                    </View>
                                                                    )
                                                                }
                                                            }
                                                            
                                                            SignOut(){
                                                                Alert.alert(i18n.t('signoutConfirm'),"",[
                                                                    {
                                                                        text:i18n.t('yes'),
                                                                        onPress:()=>{
                                                                            SecureStore.setItemAsync('loginRequested','N');
                                                                            var assignSignout  =   this.props.assignProfile;
                                                                            assignSignout('','','');
                                                                            this.props.navigation.navigate('Homescreen',{
                                                                                navigation:this.props.navigation,
                                                                            })
                                                                        }
                                                                    },
                                                                    {
                                                                        text:i18n.t('no'),
                                                                        onPress:()=>{
                                                                        }
                                                                    }
                                                                ])
                                                                
                                                            }
                                                            
                                                            changeLanguage(langToggle){
                                                                langToggle=(langToggle.indexOf("ar") > -1)?'en':'ar';
                                                                // console.log("lang :"+langToggle);
                                                                this.setState({languageENAR:langToggle});
                                                                SecureStore.setItemAsync('languageENAR',langToggle);
                                                                NativeModules.DevSettings.reload();
                                                            }
                                                            
                                                            getHelp(){
                                                                return(
                                                                    <View style={this.styles.accountView}>
                                                                    {/* <Text allowFontScaling={false}  style={styles.detailshead}>{i18n.t('help')}</Text>
                                                                    {this.drawLine('black')}
                                                                    <Text allowFontScaling={false}  style={styles.detailstitle} 
                                                                    onPress={() =>
                                                                        this.props.navigation.navigate('Help',{
                                                                            otherParam: 'Help & Support',backParam:i18n.t('myaccount') 
                                                                        })}
                                                                        >{i18n.t('helpnsupport')}</Text>
                                                                        {this.drawLine('grey')}
                                                                        <Text allowFontScaling={false}  style={styles.detailstitle}
                                                                        onPress={() =>
                                                                            this.props.navigation.navigate('Contact',{
                                                                                otherParam: i18n.t('contactus'),backParam: i18n.t('close')
                                                                            })}
                                                                            >{i18n.t('contactus')}</Text>
                                                                        {this.drawLine('grey')} */}
                                                                        {this.checkProfileHelp()}
                                                                        {/* <Text allowFontScaling={false}  style={styles.detailstitle}>{i18n.t('appversion')} 1</Text> */}
                                                                        </View>
                                                                        );
                                                                    }
                                                                    
                                                                    drawLine=(colorstr)=>{
                                                                        return(
                                                                            <View
                                                                            style={{
                                                                                borderBottomColor: colorstr,
                                                                                borderBottomWidth: 1,
                                                                            }}
                                                                            />
                                                                            );
                                                                        }
                                                                        getNotifications(){
                                                                            const {Colors}=this.props;
                                                                            if(!this.state.showLogin){
                                                                                return(
                                                                                    <TouchableOpacity style={{position:'absolute',right:'8%',top:'8%'}} onPress={()=>{
                                                                                        this.setNotificationVisible(true)
                                                                                    }}>
                                                                                    <Image style={{width:30,height:30,tintColor:Colors.yellowColor}} source={notify} />
                                                                                    <View style={{width:10,height:10,borderRadius:10,backgroundColor:Colors.warningColor,position:'absolute',top:0,right:0}}>
                                                                                    </View>
                                                                                    </TouchableOpacity>
                                                                                    )
                                                                                }
                                                                            }
                                                                            setNotificationVisible(_visible){
                                                                                this.setState({showNofication:_visible})
                                                                            }
                                                                            styles=undefined;
                                                                            render() {
                                                                                const {Colors}=this.props;
                                                                                const styles = StyleSheet.create({
                                                                                    subtitle:{
                                                                                        color:Colors.black,
                                                                                        fontFamily:'Cairo-Regular',
                                                                                        fontSize:widthPercentageToDP(3.75),
                                                                                    },
                                                                                    title:{
                                                                                        textAlign:'left',
                                                                                        color:Colors.black,
                                                                                        marginTop:'2%',
                                                                                        fontFamily:'Cairo-Bold',
                                                                                        fontSize:widthPercentageToDP(5),
                                                                                        lineHeight:widthPercentageToDP(7.5)
                                                                                    },
                
                                                                                    upcomingTxt:{
                                                                                        textAlign:'left',
                                                                                        width:'95%',
                                                                                        fontFamily:'Cairo-Bold',
                                                                                        color:Colors.black,
                                                                                        fontSize:widthPercentageToDP(5),
                                                                                        alignSelf:'flex-start',
                                                                                    },
                                                                                    scrollStyle:{
                                                                                        position:'absolute',bottom:0,alignSelf:'flex-start',
                                                                                        flexDirection:'row',height:'40%'
                                                                                    },
                                                                                    Buttonparent: {
                                                                                        // position:'absolute',bottom:0,
                                                                                        alignContent:'flex-start',borderWidth:0,
                                                                                        flexDirection:'row',flexWrap:'wrap',height:'100%',width:widthPercentageToDP(70),
                                                                                        alignItems:'flex-start',alignSelf:'center',justifyContent:'space-evenly'
                                                                                    },
                                                                                    buttonBg:{
                                                                                        marginTop:heightPercentageToDP(1.5),
                                                                                        width: widthPercentageToDP(19),
                                                                                        height: widthPercentageToDP(19),
                                                                                        alignSelf:'flex-start',
                                                                                        justifyContent:'center',
                                                                                        backgroundColor:Colors.orangeColor,
                                                                                        borderRadius:widthPercentageToDP(3.5),
                                                                                    },
                                                                                    bgcard:{
                                                                                        position:'absolute',
                                                                                        resizeMode:'contain',
                                                                                        alignSelf:'center',
                                                                                        top:widthPercentageToDP('35%')/2,
                                                                                        width:widthPercentageToDP('70%'),
                                                                                    },
                                                                                    bottompart:{
                                                                                        backgroundColor:Colors.orangeColor,
                                                                                        width:'100%',
                                                                                        left:0,
                                                                                        padding: 20,
                                                                                        borderRadius:30,
                                                                                    },
                                                                                    totalView:{
                                                                                        // marginBottom:10,
                                                                                        // flex:1,
                                                                                        // aspectRatio:1417/895,
                                                                                        overflow:'hidden',
                                                                                        alignSelf:'center',
                                                                                        // justifyContent:'center',
                                                                                        // shadowColor: "#000",
                                                                                        // shadowOffset: {
                                                                                        //     width: 2,
                                                                                        //     height: 4,
                                                                                        // },
                                                                                        // shadowOpacity: .6,
                                                                                        // shadowRadius: 10,
                                                                                        // // borderWidth:1,
                                                                                        // elevation: 20,
                                                                                        // height:heightPercentageToDP('65%'),
                                                                                        paddingBottom:'6%',
                                                                                        width:widthPercentageToDP('70%'),
                                                                                        borderRadius:30,
                                                                                        backgroundColor:'white'
                                                                                    },
                                                                                    rowViewButton:{
                                                                                        alignSelf:'center',
                                                                                        flexDirection:'row',
                                                                                        width:widthPercentageToDP('70%'),
                                                                                        justifyContent:'space-evenly'
                                                                                    },
                                                                                    profileTxt:{
                                                                                        // marginTop:5,
                                                                                        marginBottom:10,
                                                                                        textTransform:'uppercase',
                                                                                        fontFamily:'Cairo-Regular',
                                                                                        fontWeight:'100',
                                                                                        color:Colors.whiteColor,
                                                                                        fontSize:12,
                                                                                        lineHeight:16.2,
                                                                                        textAlign:'center',
                                                                                        width:70,
                                                                                        alignSelf:'center'
                                                                                    },
                                                                                 
                                                                                    logoImg:{
                                                                                        alignSelf:'flex-start',
                                                                                        marginLeft:0,
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
                                                                                    dpView:{
                                                                                        alignItems:'center',
                                                                                    },
                                                                                    dp:{
                                                                                        width: 200,
                                                                                        height: 200,
                                                                                        borderRadius: 200/ 2,
                                                                                    },
                                                                                    heading: {
                                                                                        lineHeight:heightPercentageToDP(4),
                                                                                        textAlign:'left',
                                                                                        fontSize: heightPercentageToDP(3),
                                                                                        color:Colors.whiteColor,
                                                                                        fontFamily:'Cairo-Bold'
                                                                                    },
                                                                                    headingIn: {
                                                                                        textAlign:'left',
                                                                                        fontSize: 30,
                                                                                        fontWeight: '200',
                                                                                        paddingBottom:5,
                                                                                        color:Colors.inputfontColor,
                                                                                        fontFamily:'Cairo-Regular'
                                                                                    },
                                                                                    subheading: {
                                                                                        textAlign:'left',
                                                                                        fontSize: 20,
                                                                                        fontWeight: '100', 
                                                                                        color:Colors.whiteColor,
                                                                                        fontFamily:'Cairo-Regular'
                                                                                    },balance: {
                                                                                        zIndex:10,
                                                                                        textAlign:"left",
                                                                                        fontSize: heightPercentageToDP(2.5),
                                                                                        fontWeight: '100',
                                                                                        color:Colors.whiteColor,
                                                                                        fontFamily:'Cairo-Regular'
                                                                                    },
                                                                                    pId: {
                                                                                        zIndex:10,
                                                                                        textAlign:"left",
                                                                                        fontSize: heightPercentageToDP(2.2),
                                                                                        fontWeight: '100',
                                                                                        color:Colors.whiteColor,
                                                                                        fontFamily:'Cairo-Regular'
                                                                                    },detailshead:{
                                                                                        fontSize: 25,
                                                                                        fontWeight: '200',
                                                                                        paddingBottom:15,
                                                                                        textAlign:'left',
                                                                                        color:Colors.darkfontColor,
                                                                                        fontFamily:'Cairo-Regular'
                                                                                    },detailstitle:{
                                                                                        fontSize: 20,
                                                                                        fontWeight: '200',
                                                                                        paddingTop:20,
                                                                                        paddingBottom:20,
                                                                                        width:220,
                                                                                        textAlign:'left',
                                                                                        color:Colors.whiteColor,
                                                                                        fontFamily:'Cairo-Regular',
                                                                                        // borderWidth:1,
                                                                                        flex:0.5
                                                                                    },detailsdata:{
                                                                                        fontSize: 18,
                                                                                        fontWeight: '200',
                                                                                        // paddingTop:20,
                                                                                        // paddingBottom:20,
                                                                                        // width:120,
                                                                                        textAlign:'right',
                                                                                        color:Colors.whiteColor,
                                                                                        fontFamily:'Cairo-Regular'
                                                                                        
                                                                                    },
                                                                                    homeView: {
                                                                                        flex: 1,
                                                                                        // backgroundColor:'#fff',
                                                                                    },
                                                                                    homeScrollView: {
                                                                                        // marginTop:30,
                                                                                        // backgroundColor:'#fff',
                                                                                        // padding:15,
                                                                                        flex:1
                                                                                    },
                                                                                    accountView: {
                                                                                        paddingTop:25,
                                                                                    },
                                                                                    switchview:{
                                                                                        // flex:(Platform.OS==='ios'?(0.5):1),
                                                                                        flex:0.5,
                                                                                        // borderWidth:1,
                                                                                        justifyContent:'center',
                                                                                    },switch:{
                                                                                        // flex:(Platform.OS==='ios'?(0.5):1),
                                                                                        // flex:0.5,
                                                                                        // borderWidth:2,
                                                                                        alignSelf:'flex-end',
                                                                                        color:Colors.orangeColor
                                                                                        // justifyContent:'flex-end'
                                                                                        // left:(Platform.OS==='ios'?(window.width/7):0)
                                                                                    },rowView:{
                                                                                        flex: 1, 
                                                                                        flexDirection: 'row'
                                                                                    },
                                                                                });
                                                                                this.styles=styles;
                                                                                return (
                                                                                    <View
                                                                                    style={{flex:1,backgroundColor:Colors.bgColor}}>
                                                                                    
                                                                                    <ScrollView 
                                                                                    contentContainerStyle={styles.homeScrollView}
                                                                                    style={styles.homeView}
                                                                                    showsVerticalScrollIndicator = {false}
                                                                                    refreshControl={this.refreshControl()}>
                                                                                    {/* <Image source={appLogo} style={styles.logoImg}/>
                                                                                <View style={styles.titleView}><Text style={styles.titleTxt}> {i18n.t('myaccount')}</Text></View> */}
                                                                                <HeaderLogo logo='grey' headerTitle={i18n.t('myaccount')} border={true}/>
                                                                                {/* <Image source={bgred} style={{transform: [
                                                                                    { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 }
                                                                                ],position:'absolute',top:heightPercentageToDP('50%'),opacity:1}}/> */}
                                                                                {UIElements.drawGap(35)}
                                                                                <View style={styles.totalView}>
                                                                                {this.addProfileDetails()}
                                                                                </View>
                                                                                
                                                                                </ScrollView>
                                                                                
                                                                                {/* {this.getNotifications()} */}
                                                                                {this.state.showNofication&&<NotificationPage isopen={this.state.showNofication} onDone={this.setNotificationVisible}/>}
                                                                                {/* <NavigationEvents
                                                                                onDidFocus={this.onNavigatorEvent}
                                                                            /> */}
                                                                            {this.state.showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={this.props.navigation}  onDismiss={()=>{
                                                                                this.props.navigation.navigate('Homescreen');
                                                                                this.setState({showLogin:false})
                                                                            }
                                                                        } />)}
                                                                        {this.state.deleteModal&&(<DeleteConfirmation  onDismiss={this.onDeleteConfirm}/>)}
                                                                        </View>
                                                                        );
                                                                    }
                                                                    onDeleteConfirm(_state){
                                                                        if(_state){
                                                                            Alert.alert(i18n.t('deletesure'),"",[
                                                                                {
                                                                                    text:i18n.t('yes'),
                                                                                    onPress:()=>{
                                                                                        var submitDeleteRequest=this.props.submitDeleteRequest;
                                                                                        submitDeleteRequest();
                                                                                    }
                                                                                },
                                                                                {
                                                                                    text:i18n.t('no'),
                                                                                    onPress:()=>{
                                                                                    }
                                                                                }
                                                                            ])
                                                                        }
                                                                        this.setState({deleteModal:false})
                                                                    }
                                                                }
                                                                
                                                                // const styles = StyleSheet.create({
                                                                //     subtitle:{
                                                                //         color:Colors.black,
                                                                //         fontFamily:'Cairo-Regular',
                                                                //         fontSize:widthPercentageToDP(3.75),
                                                                //     },
                                                                //     title:{
                                                                //         textAlign:'left',
                                                                //         color:Colors.black,
                                                                //         marginTop:'2%',
                                                                //         fontFamily:'Cairo-Bold',
                                                                //         fontSize:widthPercentageToDP(5),
                                                                //         lineHeight:widthPercentageToDP(7.5)
                                                                //     },

                                                                //     upcomingTxt:{
                                                                //         textAlign:'left',
                                                                //         width:'95%',
                                                                //         fontFamily:'Cairo-Bold',
                                                                //         color:Colors.black,
                                                                //         fontSize:widthPercentageToDP(5),
                                                                //         alignSelf:'flex-start',
                                                                //     },
                                                                //     scrollStyle:{
                                                                //         position:'absolute',bottom:0,alignSelf:'flex-start',
                                                                //         flexDirection:'row',height:'40%'
                                                                //     },
                                                                //     Buttonparent: {
                                                                //         // position:'absolute',bottom:0,
                                                                //         alignContent:'flex-start',borderWidth:0,
                                                                //         flexDirection:'row',flexWrap:'wrap',height:'100%',width:widthPercentageToDP(70),
                                                                //         alignItems:'flex-start',alignSelf:'center',justifyContent:'space-evenly'
                                                                //     },
                                                                //     buttonBg:{
                                                                //         marginTop:heightPercentageToDP(1.5),
                                                                //         width: widthPercentageToDP(19),
                                                                //         height: widthPercentageToDP(19),
                                                                //         alignSelf:'flex-start',
                                                                //         justifyContent:'center',
                                                                //         backgroundColor:Colors.orangeColor,
                                                                //         borderRadius:widthPercentageToDP(3.5),
                                                                //     },
                                                                //     bgcard:{
                                                                //         position:'absolute',
                                                                //         resizeMode:'contain',
                                                                //         alignSelf:'center',
                                                                //         top:widthPercentageToDP('35%')/2,
                                                                //         width:widthPercentageToDP('70%'),
                                                                //     },
                                                                //     bottompart:{
                                                                //         backgroundColor:Colors.orangeColor,
                                                                //         width:'100%',
                                                                //         left:0,
                                                                //         padding: 20,
                                                                //         borderRadius:30,
                                                                //     },
                                                                //     totalView:{
                                                                //         // marginBottom:10,
                                                                //         // flex:1,
                                                                //         // aspectRatio:1417/895,
                                                                //         overflow:'hidden',
                                                                //         alignSelf:'center',
                                                                //         // justifyContent:'center',
                                                                //         // shadowColor: "#000",
                                                                //         // shadowOffset: {
                                                                //         //     width: 2,
                                                                //         //     height: 4,
                                                                //         // },
                                                                //         // shadowOpacity: .6,
                                                                //         // shadowRadius: 10,
                                                                //         // // borderWidth:1,
                                                                //         // elevation: 20,
                                                                //         // height:heightPercentageToDP('65%'),
                                                                //         paddingBottom:'6%',
                                                                //         width:widthPercentageToDP('70%'),
                                                                //         borderRadius:30,
                                                                //         backgroundColor:'white'
                                                                //     },
                                                                //     rowViewButton:{
                                                                //         alignSelf:'center',
                                                                //         flexDirection:'row',
                                                                //         width:widthPercentageToDP('70%'),
                                                                //         justifyContent:'space-evenly'
                                                                //     },
                                                                //     profileTxt:{
                                                                //         // marginTop:5,
                                                                //         marginBottom:10,
                                                                //         textTransform:'uppercase',
                                                                //         fontFamily:'Cairo-Regular',
                                                                //         fontWeight:'100',
                                                                //         color:Colors.whiteColor,
                                                                //         fontSize:12,
                                                                //         lineHeight:16.2,
                                                                //         textAlign:'center',
                                                                //         width:70,
                                                                //         alignSelf:'center'
                                                                //     },
                                                                //     profileIcon:{
                                                                //         margin:10,
                                                                //         tintColor:Colors.blueColor,
                                                                //         alignSelf:'center',
                                                                //         resizeMode:'center',
                                                                //         overflow:'visible',
                                                                //         resizeMode:'contain',
                                                                //         width:widthPercentageToDP(6.5),
                                                                //         height:widthPercentageToDP(6.5),
                                                                //     }, profileDIcon:{
                                                                //         margin:10,
                                                                //         tintColor:Colors.whiteColor,
                                                                //         alignSelf:'center',
                                                                //         resizeMode:'center',
                                                                //         overflow:'visible',
                                                                //         resizeMode:'contain',
                                                                //         width:widthPercentageToDP(6.5),
                                                                //         height:widthPercentageToDP(6.5),
                                                                //     },
                                                                //     logoImg:{
                                                                //         alignSelf:'flex-start',
                                                                //         marginLeft:0,
                                                                //         width:70.2*(width/280),
                                                                //         height:65.3*(width/280),
                                                                //         // maxWidth:220,
                                                                //     }, titleView:{
                                                                //         position:'absolute',
                                                                //         borderWidth:2,
                                                                //         borderRadius:10,
                                                                //         alignSelf:'flex-end',
                                                                //         transform:[{translateX:width/4.5},{translateY:50}],
                                                                //         borderColor:Colors.whiteColor,
                                                                //     },
                                                                //     titleTxt:{
                                                                //         color:Colors.whiteColor,
                                                                //         fontFamily:'Cairo-Regular',
                                                                //         fontSize: (width/15),
                                                                //         paddingLeft:10,
                                                                //         paddingRight:100,
                                                                //     },
                                                                //     dpView:{
                                                                //         alignItems:'center',
                                                                //     },
                                                                //     dp:{
                                                                //         width: 200,
                                                                //         height: 200,
                                                                //         borderRadius: 200/ 2,
                                                                //     },
                                                                //     heading: {
                                                                //         lineHeight:heightPercentageToDP(4),
                                                                //         textAlign:'left',
                                                                //         fontSize: heightPercentageToDP(3),
                                                                //         color:Colors.whiteColor,
                                                                //         fontFamily:'Cairo-Bold'
                                                                //     },
                                                                //     headingIn: {
                                                                //         textAlign:'left',
                                                                //         fontSize: 30,
                                                                //         fontWeight: '200',
                                                                //         paddingBottom:5,
                                                                //         color:Colors.inputfontColor,
                                                                //         fontFamily:'Cairo-Regular'
                                                                //     },
                                                                //     subheading: {
                                                                //         textAlign:'left',
                                                                //         fontSize: 20,
                                                                //         fontWeight: '100', 
                                                                //         color:Colors.whiteColor,
                                                                //         fontFamily:'Cairo-Regular'
                                                                //     },balance: {
                                                                //         zIndex:10,
                                                                //         textAlign:"left",
                                                                //         fontSize: heightPercentageToDP(2.5),
                                                                //         fontWeight: '100',
                                                                //         color:Colors.whiteColor,
                                                                //         fontFamily:'Cairo-Regular'
                                                                //     },
                                                                //     pId: {
                                                                //         zIndex:10,
                                                                //         textAlign:"left",
                                                                //         fontSize: heightPercentageToDP(2.2),
                                                                //         fontWeight: '100',
                                                                //         color:Colors.whiteColor,
                                                                //         fontFamily:'Cairo-Regular'
                                                                //     },detailshead:{
                                                                //         fontSize: 25,
                                                                //         fontWeight: '200',
                                                                //         paddingBottom:15,
                                                                //         textAlign:'left',
                                                                //         color:Colors.darkfontColor,
                                                                //         fontFamily:'Cairo-Regular'
                                                                //     },detailstitle:{
                                                                //         fontSize: 20,
                                                                //         fontWeight: '200',
                                                                //         paddingTop:20,
                                                                //         paddingBottom:20,
                                                                //         width:220,
                                                                //         textAlign:'left',
                                                                //         color:Colors.whiteColor,
                                                                //         fontFamily:'Cairo-Regular',
                                                                //         // borderWidth:1,
                                                                //         flex:0.5
                                                                //     },detailsdata:{
                                                                //         fontSize: 18,
                                                                //         fontWeight: '200',
                                                                //         // paddingTop:20,
                                                                //         // paddingBottom:20,
                                                                //         // width:120,
                                                                //         textAlign:'right',
                                                                //         color:Colors.whiteColor,
                                                                //         fontFamily:'Cairo-Regular'
                                                                        
                                                                //     },
                                                                //     homeView: {
                                                                //         flex: 1,
                                                                //         // backgroundColor:'#fff',
                                                                //     },
                                                                //     homeScrollView: {
                                                                //         // marginTop:30,
                                                                //         // backgroundColor:'#fff',
                                                                //         // padding:15,
                                                                //         flex:1
                                                                //     },
                                                                //     accountView: {
                                                                //         paddingTop:25,
                                                                //     },
                                                                //     switchview:{
                                                                //         // flex:(Platform.OS==='ios'?(0.5):1),
                                                                //         flex:0.5,
                                                                //         // borderWidth:1,
                                                                //         justifyContent:'center',
                                                                //     },switch:{
                                                                //         // flex:(Platform.OS==='ios'?(0.5):1),
                                                                //         // flex:0.5,
                                                                //         // borderWidth:2,
                                                                //         alignSelf:'flex-end',
                                                                //         color:Colors.orangeColor
                                                                //         // justifyContent:'flex-end'
                                                                //         // left:(Platform.OS==='ios'?(window.width/7):0)
                                                                //     },rowView:{
                                                                //         flex: 1, 
                                                                //         flexDirection: 'row'
                                                                //     },
                                                                // });
                                                                
                                                                
                                                                