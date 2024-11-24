import { ImageBackground, SafeAreaView, Text,PixelRatio, TouchableOpacity, Platform, FlatList } from 'react-native';
import { RefreshControl,ScrollView,Image} from 'react-native';
import React from 'react';
import {CardInfo} from './CardInfo';
import { StyleSheet, View,Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import GetStarted from './GetStarted';
import ScrollContent from './ScrollContent';
import SecureStore from '../../Tools/Components/SecureStore';
import {connect} from 'react-redux';
import {AdaptiveWidth,AdaptiveHeight,AdaptiveOffsetHeight,AdaptiveOffsetWidth} from '../Components/AdaptiveSize'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
import notify from '../../assets/Icons/notify.png';

import bgred from '../../assets/card/red.png';
import SVGbg from'../../assets/bg/Back_app-04.svg'
import rightside from '../../assets/card/rightcard.png';


import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);

import AdBlock from "./AdBlock"
import parkDetails from '../constants/parkDetails';
import Colors from '../constants/Colors';

import * as UIElements from "../Components/UIElements";
import * as tools from '../Components/Tools';
import OurPark from './OurPark';
import HeaderLogo from './HeaderLogo';
import NotificationPage from './NotificationPage';
import { I18nManager } from 'react-native';

// import Carousel from 'react-native-snap-carousel';
// import {en,ar} from '../../assets/Localization/Localize';
// import { NativeModules } from "react-native";


// i18n.fallbacks = true;
// i18n.translations = { en,ar };
// i18n.locale = Localization.locale;
// i18n.locale=global.locale;

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
class HomeData extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            widthsv:0,
            refreshing: false,
            loginRequested:false,
            pageNo:0,
            totalPage:0,
            showNofication:false
        };
        this.setNotificationVisible=this.setNotificationVisible.bind(this);
    }
    homeScroll = React.createRef();
    
    componentDidMount(){
        //console.log("Test"+PixelRatio.get())
        tools.updateRatePoints(1);
        this.willFocus=this.props.navigation.addListener('focus',()=>{
            this.onFocus();
        })
        
        if(!tools.IsNull(this.props.profile)){
            
        }else{
            var handleToUpdate  =  this.props.lookStored;
            handleToUpdate();
            // this.signinwithSavedPass();
            setTimeout(() => {
                this.signinwithSavedPass();
            }, 10);  
        }
       
    }
    onFocus(){
        setTimeout(() => {
            this.resetScroll();
        }, 500); 
       
        
    }
    //   handleAppStateChange = (nextAppState) => {
    //       console.log(""+nextAppState);
    
    //     if (nextAppState === 'inactive') {
    //       console.log('the app is closed');
    //       SecureStore.setItemAsync('initLogin','');
    //     }    
    //   }
    
    
    resetScroll(){
        if(this.homeScroll!=null&&this.homeScroll!=null)
        {
            this.homeScroll.scrollTo({x:Platform.OS=='ios'? 0:(tools.stringIsContains(i18n.locale,'ar')? this.state.widthsv:0),y:0, animated: false});
        }
    }
    
    
    componentWillUnmount(){
        // this.mounted=false;
        // AppState.removeEventListener('change', this.handleAppStateChange);
    }
    
    _renderItem({item,index}){
        return (
            <View style={{
                backgroundColor:Colors.bgColor,
                borderRadius: 5,
                height: 250,
                padding: 50,
                marginLeft: 25,
                marginRight: 25, }}>
                <Text allowFontScaling={false} style={{fontSize: 30}}>{item.title}</Text>
                <Text>{item.text}</Text>
                </View>
                
                )
            }
            
            
            signinwithSavedPass(){
                // SecureStore.setItemAsync('accessToken',dateGot.access_token);
                // SecureStore.setItemAsync('refreshToken',dateGot.refresh_token);
                // SecureStore.setItemAsync('userID',dateGot.MemberID);
                
                if(global.initProfile===undefined){
                    // console.log("signinwithSavedPass");
                    // var updateLoad=this.props.updateLoading;
                    // updateLoad(true);
                    global.initProfile="Y";
                    SecureStore.getItemAsync('accessToken').then(savedPass=>{
                        // Call the backend API to authenticate using the stored username+password
                        // this.signinProfilewithBio(savedCredential,savedPass);
                        if(savedPass!=undefined&&savedPass!=null&&savedPass.length>0){
                            var handleToUpdate  =  this.props.assignProfile;
                            handleToUpdate(savedPass,"","");
                        }else{
                            var updateLoad=this.props.updateLoading;
                            updateLoad(false);
                        }
                    }).catch(error => {
                        // console.log(error);
                        var updateLoad=this.props.updateLoading;
                        updateLoad(false);
                    });
                } else {
                    var updateLoad=this.props.updateLoading;
                    updateLoad(false);
                }
            }
            
            
            
            checkLogin(){
                // console.log(this.state.loginRequested+"PP");
                
                if(this.state.loginRequested)
                return;
                
                SecureStore.setItemAsync('loginRequested','Y');
                this.props.navigation.navigate('FullScreen',{assignProfile:this.props.assignProfile,sendOTP:this.props.sendOTP,verifyOTP:this.props.verifyOTP});
            }
            
            refreshListView () {
                updateprofile= this.props.assignProfile;
                updateprofile("user","","",()=>{
                    this.setState({refreshing: false});
                },()=>{
                    this.setState({refreshing: false});
                });
                // this.setState({refreshing: false});
                this.forceUpdate();
            }
            
            getProfileDetails(){
                if(this.props.profile!=null&&this.props.profile.FirstName!=null){
                    return(
                        // <View style={{padding:5}}>
                        // {/* <Text style={styles.heading} allowFontScaling ={false}>{i18n.t('hi')}, {this.props.profile.FirstName}!</Text> */}
                        this.addCardDetails()
                        // </View>
                        );
                    }return(
                        <View>
                        <GetStarted navigation={this.props.navigation} assignProfile={this.props.assignProfile} sendOTP={this.props.sendOTP} verifyOTP={this.props.verifyOTP} pagefrom='home'/>
                        </View>)
                    }
                    refreshControl(){
                        return (
                            <RefreshControl
                            tintColor={Colors.orangeShadeColor}
                            refreshing={this.state.refreshing}
                            onRefresh={()=>this.refreshListView()} />
                            )
                        }
                        addCardDetails(){
                            if(this.props.profile!=null&&this.props.profile.CardNo!=null){
                                return(
                                    
                                    <View style={{height:'96%'}}>
                                    {/* {UIElements.drawGap(AdaptiveWidth(20))} */}
                                    <CardInfo submitChangePassRequest={this.props.submitChangePassRequest} colorIn='red' cardData={this.props.profile} pagefrom='home' 
                                    navigation={this.props.navigation} assignProfile={this.props.assignProfile} sendOTP={this.props.sendOTP} verifyOTP={this.props.verifyOTP}
                                    isLoading={this.props.isLoading} redeem={this.props.redeem} redeemProfile={this.props.redeemProfile} redeemPoint={this.props.redeemPoint}/>
                                    
                                    {/* <View style={{paddingBottom:AdaptiveHeight(30)}}/> */}
                                    {/* <Benifits cardData={this.props.profile.cardData} navigation={this.props.navigation}/> */}
                                    {/* <View style={{paddingBottom:25}}/> */}
                                    </View>
                                    );
                                }
                            }
                            
                            getNotifications(){
                                // if(this.props.profile!=null&&this.props.profile.FirstName!=null)
                                {
                                    return(
                                        <TouchableOpacity
                                        disabled={this.props.profile.FirstName==null}
                                        style={{position:'absolute',right:'4%',top:'4%',opacity:(this.props.profile.FirstName==null?0.5:1)}} onPress={()=>{
                                            this.setState({showNofication:true})
                                        }}>
                                        <Image style={{width:30,height:30,tintColor:Colors.blueColor}} source={notify} />
                                        {this.props.profile.FirstName!=null&&this.props.profile.UnreadNotifications>0&&<View style={{width:10,height:10,borderRadius:10,backgroundColor:Colors.warningColor,position:'absolute',top:0,right:0}}>
                                        </View>}
                                        </TouchableOpacity>
                                        )
                                    }
                                }
                                setNotificationVisible(_visible){
                                    this.setState({showNofication:_visible})
                                }
                                scrollListToStart(contentWidth, contentHeight) {
                                    if (I18nManager.isRTL) {
                                        this.homeScroll.scrollTo({x: Platform.OS=="ios"?0: contentWidth});
                                    }
                                }
                                render() {
                                    viewoffset=0;
                                    viewSize=0;
                                    aspectRatio=height/width;
                                    return (
                                        <View
                                        style={{ backgroundColor:Colors.bgColor, flex:1}}>
                                        {/* <SVGbg style={{position:'absolute'}} viewBox="0 0 1284 2778" preserveAspectRatio="xMaxYMin slice"/> */}
                                        {this.getNotifications()}
                                        {/* {this.state.showNofication&&<NotificationPage isopen={this.state.showNofication} onDone={this.setNotificationVisible}/>} */}
                                        {UIElements.drawGap(10)} 
                                        <HeaderLogo logo={1} headerTitle={i18n.t('welcome')+' '+(this.props.profile!=null&&this.props.profile.FirstName!=null?this.props.profile.FirstName+" "+this.props.profile.LastName:(i18n.t('toleisure')))+''} />
                                        {/* <Image source={bgred} style={{transform: [
                                            { scaleX: tools.stringIsContains(i18n.locale,'ar')? -1:1 }
                                        ],position:'absolute',top:hp('50%'),opacity:1}}/> */}
                                        <ScrollView 
                                        ref={ref => this.homeScroll = ref}
                                      
                                        onContentSizeChange={(width,height)=>{
                                            this.setState({widthsv:width});
                                            this.setState({totalPage:Math.ceil(width/wp(100))});
                                            this.scrollListToStart(width,height);
                                        }}
                                        onScroll={eventIn=>{
                                            this.viewoffset=eventIn.nativeEvent.contentOffset;
                                            this.viewSize=eventIn.nativeEvent.layoutMeasurement;
                                            this.setState({pageNo:Math.ceil(this.viewoffset.x/this.viewSize.width)});
                                            this.setState({totalPage:Math.ceil(this.state.widthsv/this.viewSize.width)});
                                        }}
                                        disableIntervalMomentum={false}
                                        decelerationRate={0.9}
                                        snapToInterval={(width-(wp('17.5%')))}
                                        pagingEnabled
                                        horizontal={true}
                                        contentContainerStyle={styles.homeScrollView}
                                        style={styles.homeView}
                                        showsHorizontalScrollIndicator={false}
                                        >
                                     
                                        <View style={{flexDirection:'row',flex:1}}>
                                        {this.getProfileDetails()}
                                        <OurPark pagefrom='home'/>
                                        </View>
                                        {/* {UIElements.drawGap(10)} */}
                                        </ScrollView>
                                        
                                        
                                        <View style={{flexDirection:'row',alignSelf:'center',width:wp('60%'),justifyContent:'space-around'}}>
                                        
                                        {this.getallDots(this.state.pageNo,this.state.totalPage)}
                                        
                                        </View>
                                        <Image source={rightside} style={{
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 2,
                                                height: 4,
                                            },
                                            shadowOpacity: .2,
                                            shadowRadius: 5,
                                            // borderWidth:1,
                                            //  elevation: 10,
                                            width:hp(5.85),
                                            transform: [
                                                { scaleX: (tools.stringIsContains(i18n.locale,'ar')? -1:1) }
                                            ],right:-5,height:hp('80%'),resizeMode:'contain',position:'absolute',top:hp('12%'),alignSelf:'center'}}/>
                                            
                                            </View>
                                            );
                                        }
                                        
                                        getallDots(pageIn,totalPageIn){
                                            if(tools.stringIsContains(i18n.locale,'ar')&&Platform.OS!='ios')
                                            pageIn=(totalPageIn-1)-pageIn;
                                            alllines =[];
                                            for(let t=0;t<totalPageIn;t++){
                                                alllines.push(<View style={t==pageIn?styles.highlightDot:[styles.unhighlight,t==(pageIn-1)||t==(pageIn+1)?{backgroundColor:'#f96309'}:{}]}/>)
                                            }
                                            return alllines;
                                        }
                                        
                                        pagetoGo(){
                                            
                                        }
                                        
                                        getBanners(){
                                            return(<View style={{flex:1,justifyContent:'center',width:width}}>
                                            <AdBlock parkInfo={parkDetails.AB} navigation={this.props.navigation}/>
                                            <AdBlock parkInfo={parkDetails.VC} navigation={this.props.navigation}/>
                                            <AdBlock parkInfo={parkDetails.SD} navigation={this.props.navigation}/>
                                            </View>);
                                        }
                                        
                                        getOffers(){
                                            lines=[];
                                            if(this.props.profile!=null&&this.props.profile.FirstName!=null){
                                                lines.push( <ScrollContent navigation={this.props.navigation} key='rco' title={i18n.t('recommendedoffer')}  noofViews ={4} />);
                                            }else{
                                                lines.push( <ScrollContent navigation={this.props.navigation} key='lo' title={i18n.t('latestoffer')} noofViews ={5} />);
                                            }
                                            lines.push( <ScrollContent navigation={this.props.navigation}
                                                key='po' 
                                                color='rgba(0,0,0,.01)'
                                                title={i18n.t('partneroffer')} 
                                                noofViews ={4} />);
                                                lines.push( <ScrollContent navigation={this.props.navigation} key='wn' title={i18n.t('whatsnew')} noofViews ={6} />);
                                                return lines;
                                            }
                                        }
                                        
                                        const styles = StyleSheet.create({
                                            highlightDot:
                                            {
                                                alignSelf:'center',
                                                borderWidth:2,borderColor:Colors.whiteColor,
                                                backgroundColor:Colors.orangeColor,
                                                borderRadius:16,width:16,height:16,
                                                shadowColor: "#000",
                                                shadowOffset: {
                                                    width: .1,
                                                    height: .1,
                                                },
                                                shadowOpacity: .6,
                                                // elevation: 2,
                                                shadowRadius:1,
                                                
                                            },
                                            unhighlight:
                                            {
                                                alignSelf:'center',
                                                backgroundColor:Colors.yellowColor,
                                                borderRadius:10,width:10,height:10
                                                
                                            },
                                            bgImg:{
                                                position:'absolute',
                                                width:width,
                                                height:height,
                                            },
                                            heading: {
                                                fontFamily: 'Cairo-Bold',
                                                fontSize: AdaptiveWidth(13),
                                                paddingBottom:15,
                                                textAlign:'left',
                                                color:Colors.darkfontColor
                                            },
                                            homeView: {
                                                maxHeight:'75%',
                                                height:'75%',
                                                paddingTop:15,
                                                alignSelf:'flex-start',
                                            },
                                            homeScrollView: {
                                                alignSelf:'flex-start',
                                                alignContent:'flex-start',
                                                alignItems:'flex-start',
                                                height:'100%',
                                                paddingLeft:(wp('12.5%')),
                                                paddingRight:(wp('12.5%')),
                                                // marginLeft:(wp('12.5%')),
                                                // marginRight:(wp('12.5%')),
                                            }
                                        });
                                        
                                        // PropTypes
                                        HomeData.propTypes = {
                                            profile: PropTypes.object
                                        }
                                        
                                        const mapStateToProps = state=>{
                                            return {
                                                locale: state.profileReducer.locale,
                                            }                
                                        };
                                        
                                        export default connect(
                                            mapStateToProps,
                                            null
                                            )(HomeData)