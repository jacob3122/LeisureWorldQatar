import React, { Component } from 'react'
import {View,ScrollView,StyleSheet,Text,Platform,TextInput,TouchableOpacity,RefreshControl,Image,ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import * as UiElements from '../../Tools/Components/UIElements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import Colors from '../../Tools/constants/Colors';
import * as Tools  from '../../Tools/Components/Tools';
// import cardbg1 from '../../assets/bg/bg-02.jpg'
// import cardbg2 from '../../assets/bg/bg-03.jpg'
import proceedB from '../../assets/Icons/back.png'
import historyB from '../../assets/Icons/history.png'
import HeaderLogo from '../../Tools/Components/HeaderLogo';
import BackButton from '../../Tools/Components/BackButton';

import {Dimensions } from "react-native";
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');


export default class RedeemTitles extends Component {
    
    
    _myScroll=ScrollView;
    
    constructor(props){
        super(props);
        this.ScrollRefs=React.createRef();
        
        this.state={
            loading:true,
            selectedPage:0,
            chosenDate:new Date(),
            cameraView:false,
            claimNo:'',
            showDate:false,
            refreshing:false,
            showHistory:false,
        }
        
        this.handler = this.handler.bind(this);
        this.updateInvoice = this.updateInvoice.bind(this);
    }

    

    handler(someValue) {
        this.setState({selectedPage: someValue});
        global.selectedPage=someValue;
        this.ScrollRefs.current.scrollTo({x: someValue*(width-20), y: 0, animated: true});
    }
    
    _contentViewScroll = (e) => {
        const scrolled =(e.nativeEvent.contentOffset.x);
        const position = (scrolled > 0) ? scrolled / width : 0;
        this.setState({selectedPage:Math.round(position)});
        global.selectedPage=Math.round(position);
        
    }
    
    setLoadingState(stateP){
        this.setState({loading:stateP});
    }
    
    performActionWithTime(callback,params,timeTaken){
        setTimeout(() => {callback(params)},timeTaken);
    }
    
    refreshControl(){
        return (
            <RefreshControl
            tintColor={Colors.bluedarkShadeColor}
            refreshing={this.state.refreshing}
            onRefresh={()=>this.refreshListView()} />
            )
        }
        
        refreshListView () {
            var claimUpdate=this.props.claimprofile;
            claimUpdate();
            
            setTimeout(()=>{
                this.setState({refreshing: false});
                this.setState({selectedPage:1})
            },500);
        }
        
        getTransfers(){
            if(this.props.profile==undefined||(this.props.profile!=undefined&&(this.props.claims.length==0||this.props.claims==undefined))){
                return(
                    <View>
                    {UiElements.drawGap(10)}
                    <Text allowFontScaling={false} style={styles.simplelabel} >
                    {i18n.t('noclaim')}
                    </Text>
                    <TouchableOpacity style={styles.tryagain}>
                    {/* <Gradient gradient={Colors.gradientBut} style={styles.tryagain}> */}
                    <Text allowFontScaling={false} style={styles.tryagaintext}>{i18n.t('tryagain')}</Text>
                    {/* </Gradient> */}
                    </TouchableOpacity></View>);
                }else
                {
                    return(
                        <View >
                        <View style={styles.rowTView}>
                        <Text allowFontScaling={false} style={[styles.subheading,
                            {flex:.3,}]}>
                            {i18n.t('date')}
                            </Text>
                            <Text allowFontScaling={false} style={[styles.subheading,
                                {flex:0.4,}]}>
                                {i18n.t('voucherno')}
                                </Text>
                                <Text allowFontScaling={false} style={[styles.subheading,
                                    {flex:0.4}]}>
                                    {i18n.t('vouchervalue')}
                                    </Text>
                                    </View>
                                    {UiElements.drawGap(10)}
                                    {UiElements.drawLine(Colors.darkfontColor,width/1.2,.85)}
                                    {this.getRedeems()}
                                    </View>
                                    );
                                }
                            }
                            
                            
                            render() {
                                return (
                                    <View style={{flex:1}}>
                                    {/* <ImageBackground source={this.props.pagefrom==='card'?cardbg1:cardbg2} style={styles.bgImage}/> */}
                                    <HeaderLogo headerTitle={i18n.t('redeem')} border={true}/>
                                    
                                    <TouchableOpacity onPress={()=>{this.setState({showHistory:true})
                                    global.selectedPage=1}}>
                                    <Image source ={historyB} style={styles.history}></Image>
                                    <Text  allowFontScaling={false} style={styles.historytxt}>{i18n.t('redeemhistory')}</Text>
                                    </TouchableOpacity>
                                    
                                    {(!this.state.showHistory)&&(
                                        <BackButton onpress={()=>{this.props.navigation.goBack();}}></BackButton>)}
                                        </View>
                                        )
                                    }
                                }
                                
                                
                                const styles = StyleSheet.create({
                                    backbut:{
                                        position:'absolute',
                                        alignSelf:'flex-end',
                                        alignSelf:'center',
                                        width:50,
                                        height:50,
                                        bottom:hp('25%'),zIndex:-10,
                                    },
                                    
                                    history:{
                                        alignSelf:'center',
                                        width:60,
                                        height:60,
                                    },
                                    historytxt:{
                                        includeFontPadding:false,
                                        alignSelf:'center',
                                        color:Colors.whiteColor,
                                        fontFamily:'Cairo-Regular',
                                        fontSize: 20,
                                    },
                                    
                                    inputView:{
                                        flex:1,
                                        // borderWidth:1,
                                        flexDirection:'column',
                                        alignItems:'flex-start',
                                        alignContent:'flex-start',
                                    },
                                    gradStyle:{
                                        position:'absolute',
                                        width:width,
                                        height:height,
                                        zIndex:-1,
                                        // borderRadius:15,
                                    },
                                    tabItem:{
                                        flex:1,
                                        height:45,zIndex:3
                                    },
                                    rowView:{
                                        flexDirection: 'row',zIndex:2,elevation:5
                                    },   
                                    rowTView:{
                                        flex: 1, flexDirection: 'row',
                                    },
                                    pointtxt:{
                                        includeFontPadding:false,
                                        flex:0.5,
                                        textAlign:'center',
                                        fontSize: 15,
                                        fontWeight: '600',
                                        color:Colors.whiteColor,
                                        fontFamily:'Cairo-Regular'
                                    },
                                    inputValue: {
                                        includeFontPadding:false,
                                        alignSelf:'flex-start',
                                        textAlign:'left',
                                        fontWeight:'200',
                                        // height:AdaptiveWidth(7.5),
                                        color: Colors.inputfontColor,
                                        width:'100%',
                                        padding:10,
                                        fontFamily:'Cairo-Regular',
                                        fontSize:20
                                        // fontSize: AdaptiveWidth(15),
                                    },
                                    homeView: {
                                        // borderWidth:2
                                    }, detailstitle:{
                                        includeFontPadding:false,
                                        width:100,
                                        fontSize: 20,
                                        paddingTop:15,
                                        paddingBottom:15,
                                        textAlign:'left',
                                        fontFamily:'Cairo-Bold',
                                    },
                                    heading: {
                                        textAlign:'left',
                                        fontSize: 40,
                                        fontFamily:'Cairo-Bold'
                                    },
                                    
                                    subheading: {
                                        includeFontPadding:false,
                                        flex:0.5,
                                        textAlign:'center',
                                        fontSize: 15,
                                        fontWeight: '200',
                                        color:Colors.violetColor,
                                        fontFamily:'Cairo-Regular'
                                    },
                                    simplelabel: {
                                        includeFontPadding:false,
                                        textAlign:'center',
                                        fontSize: 18,
                                        fontWeight: '100',
                                        color:Colors.whiteColor,
                                        fontFamily:'Cairo-Regular'
                                    }, buttontxt: {
                                        includeFontPadding:false,
                                        alignSelf:'center',
                                        textAlignVertical:'center',
                                        textAlign:'right',
                                        fontSize: wp('5%'),
                                        fontWeight: '500',
                                        color:Colors.whiteColor,
                                        fontFamily:'Cairo-Regular'
                                    },container: {
                                        // flex:1,
                                        // borderWidth:2
                                    },
                                    view1: {
                                        margin: 10,
                                        width: width - 40,
                                        height: height-250,
                                        borderRadius: 10,
                                        // borderWidth:1
                                    },
                                    tryagain:{
                                        margin:10,
                                        backgroundColor:Colors.backgroudColor,
                                        borderRadius:10,
                                        borderWidth:2,
                                        borderColor:Colors.whiteColor,
                                        height:60,
                                        justifyContent:'center',
                                        alignSelf:'center',
                                        alignContent:'center',
                                        width:width/1.15,
                                    },
                                    tryagaintext:{
                                        includeFontPadding:false,
                                        alignSelf:'center',
                                        color:'white',
                                        fontSize:20,
                                        fontWeight:'400',
                                        fontFamily:'Cairo-Regular'
                                    },claimButton:{
                                        margin:10,
                                        backgroundColor:'#1d78cb',
                                        borderRadius:10,
                                        height:60,
                                        justifyContent:'center',
                                        alignSelf:'center',
                                        alignContent:'center',
                                        width:width/1.15,
                                    },
                                    claimButtontext:{
                                        alignSelf:'center',
                                        color:'white',
                                        fontSize:20,
                                        fontWeight:'400',
                                        fontFamily:'Cairo-Regular'
                                    },bgImage:{
                                        position:'absolute',
                                        alignSelf:'center',
                                        width:'100%',
                                        height:height,
                                        resizeMode:'contain'
                                    },
                                    
                                });
                                ClaimsHandle.propTypes = {
                                    profile: PropTypes.object.isRequired,
                                }