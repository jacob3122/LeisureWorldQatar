import React, { Component } from 'react'
import {View,ScrollView,StyleSheet,Text,RefreshControl,TouchableOpacity,Image,FlatList, PixelRatio,SafeAreaView, ActivityIndicator} from 'react-native';
// import Loader from 'react-native-easy-content-loader';
import * as UiElements from '../../Tools/Components/UIElements'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Gradient from 'react-native-css-gradient';
// import Colors from '../../Tools/constants/Colors';
// import Voucher from '../../Tools/Components/Voucher';
// import ButtonGroup from '../../Tools/Components/ButtonGroup';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import moment from'moment'
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import backButton from '../../assets/Icons/back.png'

import RedeemVenue from './RedeemVenue';

// import cardbgB from '../../assets/card/carddeb.png';

import StatusTracker from '../../Tools/Components/StatusTracker';
import HeaderLogo from '../../Tools/Components/HeaderLogo';
// import BackButton from '../../Tools/Components/BackButton';
import * as Tools from '../../Tools/Components/Tools.js'
import historyB from '../../assets/Icons/history.png'
import OverlayLoad from '../../Tools/Components/OverlayLoad.js';


import {Dimensions } from "react-native";
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
// import { NavigationEvents } from 'react-navigation';

export default function(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;

    return <RedeemHandle {...props} translations={i18n.translations} Colors={Colors}/>
}

class RedeemHandle extends Component {
    
    styles=undefined;
    loaded=false;
    _myScroll=ScrollView;
    
    constructor(props){
        super(props);
        this.state={
            loading:true,
            selectedPage:0,
            refreshing:true,
            showHistory:false,
            redeemVoc:{}
        }
        this.handler = this.handler.bind(this);
        this.onNavigatorEvent=this.onNavigatorEvent.bind(this);
        i18n.translations=props.translations;
    }
    
    onNavigatorEvent() {
        // console.info(this.props.profile.FirstName);
        if(this.props.profile===undefined||this.props.profile.FirstName===undefined){
            this.props.navigation.navigate('Home',{pagetodivert:undefined});
        }
    }
    
    
    componentDidMount(){
        this.willFocus=this.props.navigation.addListener('focus',()=>{
            this.onNavigatorEvent();
        })
        this.refreshListView();
        
        if(global.selectedRedeemPage===undefined)
        global.selectedRedeemPage=0;
        
        Tools.updateRatePoints(1);
        
        this.setState({selectedPage: global.selectedRedeemPage,showHistory:(global.selectedRedeemPage!=0?true:false)});
        // console.log(this.props.profile);
    }
    
    
    
    performActionWithTime(callback,params,timeTaken){
        setTimeout(() => {callback(params)},timeTaken);
    }
    
    
    handler(someValue) {
        this.setState({selectedPage: someValue});
        this.refs.scrollview.scrollTo({x: someValue*(width-20), y: 0, animated: true});
    }
    _contentViewScroll = (e) => {
        const scrolled =(e.nativeEvent.contentOffset.x);
        const position = (scrolled > 0) ? scrolled / width : 0;
        this.setState({selectedPage:Math.round(position)});
    }
    getTransfers(){
        if(this.props.profile==undefined||(this.props.profile!=undefined&&(this.props.redeem==undefined||this.props.redeem.RedeemHistory==undefined||this.props.redeem.RedeemHistory.length==0))){
            return(
                <View>
                {UiElements.drawGap(10)}
                <Text allowFontScaling={false} style={this.styles.simplelabel} >
                {i18n.t('noredeem')}
                </Text>
                {UiElements.drawGap(10)}
                
                <TouchableOpacity style={this.styles.tryagain} onPress={()=>{this.refreshListView()}}>
                <Text allowFontScaling={false}  style={this.styles.tryagaintext}>{i18n.t('tryagain')}</Text>
                </TouchableOpacity></View>);
            }else{
                
                return(
                    <View style={{borderWidth:0}}>
                    {this.getRedeems()}
                    </View>
                    );
                }
            }
            
            refreshControl(){
                const {Colors}=this.props;
                return (
                    <RefreshControl
                    tintColor={Colors.bluedarkShadeColor}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>this.refreshListView()} 
                    />
                    )
                }
                
                refreshListView () {
                    this.setState({loading:true});
                    var redeemProfile=this.props.redeemProfile;
                    redeemProfile(()=>{
                        this.setState({refreshing: false});
                        this.setState({selectedPage:1})
                    });
                    // setTimeout(()=>{
                    //     this.setState({refreshing: false});
                    //     this.setState({selectedPage:1})
                    // },500);
                }
                
                getRedeems(){
                    transactionsArray=[];
                    redeemTransaction=[];
                    redeemTransaction=this.props.redeem.RedeemHistory;//.filter(redeemD=>((new Date(redeemD.RedeemDate)-new Date())>0));
                    // console.log("L :"+redeemTransaction.length);
                    redeemTransaction=redeemTransaction.sort((a,b)=>((new Date(b.RedeemDate)-new Date(a.RedeemDate))));
                    // console.log("L :"+redeemTransaction.length);
                    
                    // dates.filter(d => new Date(d) - new Date() > 0);
                    for(let t=0;t<redeemTransaction.length;t++){
                        // console.log(new Date(redeemTransaction[t].RedeemDate));
                        transactionsArray.push(
                            <View key ={t} >
                            {UiElements.drawGap(5)}
                            <View style={this.styles.rowTView}>
                            <View style={{flexDirection:'row'}}>
                            <Text allowFontScaling={false} style={[this.styles.pointtxt,{fontFamily:'Cairo-Bold'}]}>{i18n.t('date')+' : '}</Text>
                            <Text allowFontScaling={false} style={[this.styles.pointtxt]}>{moment(redeemTransaction[t].RedeemDate).format('DD/MM/YYYY hh:mm:ss A')}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                            
                            <Text allowFontScaling={false} style={[this.styles.pointtxt,{fontFamily:'Cairo-Bold'}
                        ]}>{i18n.t('voucherno')+' : '}</Text>
                        <Text allowFontScaling={false} style={[this.styles.pointtxt
                        ]}>{redeemTransaction[t].Code}</Text>
                        {/* </View>
                    <View style={styles.rowTView}> */}
                    </View>
                    <View style={{flexDirection:'row'}}>
                    
                    <Text allowFontScaling={false}  style={[this.styles.pointtxt,{fontFamily:'Cairo-Bold'}]}>{i18n.t('name')+' : '}</Text>
                    <Text allowFontScaling={false}  style={[this.styles.pointtxt]}>{(Tools.stringIsContains(i18n.locale,"en")?redeemTransaction[t].VoucherTitleEn:redeemTransaction[t].VoucherTitleAr)}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false}  style={[this.styles.pointtxt,{fontFamily:'Cairo-Bold'}
                ]}>{i18n.t('venue')+' : '}</Text>
                <Text allowFontScaling={false}  style={[this.styles.pointtxt
                ]}>{redeemTransaction[t].Venue}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                <Text allowFontScaling={false} style={[this.styles.pointtxt,{fontFamily:'Cairo-Bold'}]}>{i18n.t('points')+' : '}</Text>
                <Text allowFontScaling={false} style={[this.styles.pointtxt]}>{redeemTransaction[t].Points}</Text>
                </View>
                
                </View>
                </View>
                );
            }
            return(transactionsArray);
        }
        
        getRedeemVenues(){
            const {Colors}=this.props;
            alllines=[];
            inCount=3;
            colorsIn=[Colors.abColor,Colors.sdColor,Colors.vcColor];
            redeemDetails=this.props.redeem;
            if(redeemDetails!=null||redeemDetails!=undefined){
                if(this.state.redeemVoc!=redeemDetails.Venues_Vouchers)
                this.setState({redeemVoc:redeemDetails.Venues_Vouchers});
            }else{
                alllines.push(<ActivityIndicator
                    size='large'
                    color={Colors.bluedarkShadeColor}/>)
            }
            
            if(this.state.redeemVoc!=undefined){
                alllines.push(
                    <FlatList
                    removeClippedSubviews={false}
                     style={[this.styles.homeScrollView,{}]}
                    refreshControl={this.refreshControl()}
                    contentContainerStyle={{width:'100%',justifyContent:'center',alignContent:'center'}}
                    data={this.state.redeemVoc}
                    numColumns={1}
                    renderItem={({item,index}) => {
                        return(
                            <View style={{width:widthPercentageToDP(30),height:widthPercentageToDP(30),margin:widthPercentageToDP(2),alignSelf:'center',flexDirection: 'column'}} key={"v"+index}>    
                            <RedeemVenue venueColor={colorsIn[index]} key={"R"+index} venueInfo={redeemDetails.Venues_Vouchers[index]} navigation={this.props.navigation} assignProfile={this.props.assignProfile} 
                            pagefrom={''} redeemPoint={this.props.redeemPoint}/>
                            </View>
                            );
                        }}
                        keyExtractor={this._keyExtractor}
                        />)
                    }else{
                      
                    }
                    return alllines;
                }
                
                render() {
                    const {Colors}=this.props;

                    const styles = StyleSheet.create({
                        detailstitle:{
                            textAlign:'center',
                            alignSelf:'center',
                            // marginTop:15,
                            color:Colors.whiteColor,
                            fontFamily:'Cairo-Bold',
                            fontSize:14,
                            lineHeight:14*1.5,
                            textTransform:'uppercase',
                            // lineHeight: AdaptiveWidth(18) * 1.6,
                            // height: AdaptiveWidth(18)* 1.3,
                        },
                        bottomBar:
                        {
                            width:wp(20),
                            backgroundColor:Colors.blueColor,
                            alignItems:'center',
                            alignSelf:'center',
                            justifyContent:'center',
                            height:wp(12),
                            borderRadius:wp(4)
                        },
                        claimBut:{
                            borderRadius:6,
                            alignSelf:'center',
                            width:12,
                            height:12,
                            backgroundColor:Colors.blueColor
                        },
                        view2:{
                            width:'100%',
                            height:'100%',
                        },
                        totalView:{
                            // marginTop:-1*heightPercentageToDP(0.5),
                            // flex:1,
                            // aspectRatio:1417/895,
                            alignSelf:'center',
                            justifyContent:'center',
                            // shadowColor: "#000",
                            // shadowOffset: {
                            //     width: 0,
                            //     height: 2,
                            // },
                            // shadowOpacity: .45,
                            // shadowRadius: 3.84,
                            // elevation: 5,
                            // height:hp('65'),
                            height:'95%',
                            width:'93%',
                            // borderRadius:widthPercentageToDP(4),
                            // backgroundColor:'white'
                        },
                        history:{
                            tintColor:Colors.bluedarkShadeColor,
                            alignSelf:'center',
                            width:35,
                            height:35,
                            marginRight:10,
                        },
                        historytxt:{
                            textAlign:'left',
                            
                            textTransform:'uppercase',
                            alignSelf:'center',
                            color:Colors.inputfontColor,
                            fontFamily:'Cairo-Regular',
                            fontSize: 15,
                            lineHeight:15*1.35,
                            marginTop:8
                        },
                        homeView:{
                            backgroundColor:Colors.whiteColor,
                            flex:1,
                            flexDirection:'column',
                            height:height,width:width
                        },
                        redeemView:{
                            flexDirection:'column',
                            height:"100%",
                            width:'100%',
                            // transform:[{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
                        },
                        backbut:{
                            position:'absolute',
                            alignSelf:'center',
                            width:50,
                            height:50,
                            // bottom:hp('36%'),
                            bottom:hp('3%'),
                            zIndex:2,
                        },
                        bgcard:{
                            position:'absolute',
                            resizeMode:'contain',
                            alignSelf:'center',
                            // aspectRatio:1417/895,
                            // width:wp('99%'),
                            width:wp(93),
                            // left:0,
                            top:'4%',
                        },
                        bgImage:{
                            position:'absolute',
                            alignSelf:'center',
                            width:'100%',
                            height:height,
                            resizeMode:'contain'
                        },
                        scrollstyle:{
                            height:height/5,
                            // minHeight:height/3,
                        },
                        homeScrollView: {
                            width:'100%',height:'100%'
                        },
                        RedeemTitle:{
                            // marginLeft:25,
                            fontSize:20,
                            // lineHeight:20*1.4,
                            fontFamily:'Cairo-Regular',
                            color:Colors.inputfontColor,
                            textAlign:'center',
                            alignSelf:'center',
                            // width:100,
                            // lineHeight:26,
                            // height:widthPercentageToDP(6),
                            textAlignVertical:'center'
                        },
                        RedeemPoint:{
                            fontWeight:'100',
                            fontSize:18,
                            fontFamily:'Cairo-Regular',
                            color:Colors.whiteColor,
                            textAlign:'center',
                        },
                        view1: {
                            // width: width - 40,
                            // height:height-500
                            // borderRadius: 10,
                            // borderWidth:2,
                            flex:1,justifyContent:'center'
                        },
                        
                        rowTView:{
                            width:'100%', 
                            // flexDirection: 'row',
                            padding:10,
                            // backgroundColor:Colors.blueColor,
                            borderBottomWidth:1,
                            borderColor:Colors.blueColor,
                            alignSelf:'center',
                            // borderRadius:15,
                            overflow:'scroll',justifyContent:'center'
                        },  
                        inputValue: {
                            textAlign:'left',
                            alignItems:'center',
                            alignContent:'center',
                            fontSize: 20,
                            flex:1,
                            height:50,
                            fontFamily:'Cairo-Bold'
                            
                        }, 
                        heading: {
                            textAlign:'left',
                            paddingLeft:20,
                            fontFamily:'Cairo-Regular',color:Colors.blueColor
                        },
                        subheading: {
                            flex:0.5,
                            textAlign:'center',
                            fontSize: 15,
                            fontWeight: '200',
                            color:Colors.violetColor,
                            fontFamily:'Cairo-Regular'
                        },
                        redeemhis: {
                            textAlign:'center',
                            fontSize: widthPercentageToDP(4),
                            // lineHeight:19,
                            // paddingTop:5,
                            fontWeight: '100',
                            color:Colors.whiteColor,
                            paddingHorizontal:widthPercentageToDP(5),
                            fontFamily:'Cairo-Regular'
                        },
                        points: {
                            // position:'absolute',
                            alignSelf:'flex-start',
                            paddingLeft:10,
                            textAlign:'left',
                            color:Colors.inputfontColor,
                            fontFamily:'Cairo-Bold',
                            fontSize: 35,
                            lineHeight:35*1.4
                        },
                        pointtxt:{
                            fontSize: 15,
                            // fontFamily:'Cairo-Bold',
                            color:Colors.inputfontColor,
                            fontFamily:'Cairo-Regular',
                            textAlign:Tools.stringIsContains(i18n.locale,'ar')?'right':'left'
                        },
                        simplelabel: {
                            textAlign:'center',
                            fontSize: 15,
                            fontWeight: '100',
                            color:Colors.inputfontColor,
                            fontFamily:'Cairo-Regular'
                        },container: {},
                        tryagain:{
                            backgroundColor:Colors.whiteColor,
                            borderRadius:15,
                            borderWidth:2,
                            borderColor:Colors.bluedarkShadeColor,
                            height:35,
                            justifyContent:'center',
                            alignSelf:'center',
                            alignContent:'center',
                        },
                        tryagaintext:{
                            paddingLeft:10,
                            paddingRight:10,
                            alignSelf:'center',
                            color:Colors.bluedarkShadeColor,
                            fontSize:15,
                            fontWeight:'100',
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
                            fontFamily:'Cairo-Bold'
                        }
                        
                    });
                    
                    this.styles=styles;
                    // buttonsInit = ['Redeem','Redeem History'];
                    // profile=this.props.navigation.getParam('profile');
                    // themeColor=(this.props.navigation.getParam('color'))
                    return (
                        <View style={styles.homeView}>
                        <BackgroundWall/>
                        <SafeAreaView style={{flex:1,marginTop:heightPercentageToDP(3)}}>
                        <TouchableOpacity style={{marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{this.props.navigation.goBack()}}>
                        <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                        </TouchableOpacity>
                        {/* <ImageBackground source={this.props.navigation.state.params.pagefrom==='card'?homebg1:homebg2} style={styles.bgImage}/> */}
                        {/* <HeaderLogo logo='tejory' headerTitle={i18n.t('redeem')} border={true}/> */}
                        {/* <NavigationEvents
                        onDidFocus={this.onNavigatorEvent}
                    /> */}
                    {/* <Image source={bgred} style={{position:'absolute',top:hp('40%'),opacity:0.9}}/> */}
                    
                    <View style={{flex:1,width:widthPercentageToDP(100),marginTop:heightPercentageToDP(1)}}>
                    <View style={styles.totalView}>
                    
                    {this.updateRedeemPage()}
                    </View>
                    {/* <View style={{width:wp('70'),alignSelf:'center',height:heightPercentageToDP(10)}}>
                    <View style={{borderRadius:20,overflow:'hidden' ,flex:1,flexDirection:'row',alignSelf:'center',justifyContent:'space-around',width:'100%'}}>
                    <TouchableOpacity  
                    style={[styles.bottomBar,{backgroundColor:'#00DDDE'}]}
                    onPress={() =>
                        this.props.navigation.navigate('Claims',{
                            otherParam: i18n.t('claimpoints'),
                            backParam: i18n.t('myaccount'),
                            pagefrom:'account',
                            redeem:this.props.redeem,
                            redeemPoint:this.props.redeemPoint,
                            redeemProfile:this.props.redeemProfile
                        })}>
                        <Text style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('claim')}</Text></TouchableOpacity>
                        <TouchableOpacity 
                        style={[styles.bottomBar]}
                        onPress={()=>this.props.navigation.navigate('Home',{pagetodivert:'Redeem'})}>
                        <Text numberOfLines={2} style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('redeem')}</Text></TouchableOpacity>
                        
                        
                        <TouchableOpacity style={[styles.bottomBar,{backgroundColor:'#1BACFD'}]}
                        onPress={()=>this.props.navigation.navigate('rules',{
                            navigation:this.props.navigation,pagefrom:this.props.pagefrom
                        })}>
                        <Text style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('rules')}</Text>
                        </TouchableOpacity>
                        </View>
                    </View> */}
                    
                    {/* {(!this.state.showHistory)&&(
                        <BackButton onpress={()=>{this.props.navigation.goBack();}}></BackButton>)}
                        {(this.state.showHistory)&&(
                            <BackButton onpress={()=>{this.setState({showHistory:false})
                        global.selectedPage=0}}></BackButton>)} */}
                        </View>
                        </SafeAreaView>
                        </View>
                        )
                    }
                    updateRedeemPage(){
                        const {Colors}=this.props;
                        return(
                            <View style={this.styles.redeemView}>
                            {UiElements.drawGap(25)}
                            <View style={{flexDirection:'row',alignSelf:'center'}}>
                            <Text allowFontScaling={false} style ={[this.styles.heading,{textTransform:'uppercase',fontSize:widthPercentageToDP(5),alignSelf:'flex-start',textAlign:'left'}]} numberOfLines={2} lineBreakMode='head'  allowFontScaling ={false}>{i18n.t('yourbalance')}</Text>
                            
                            <Text allowFontScaling={false} style ={[this.styles.points,{alignSelf:'flex-start'}]} allowFontScaling ={false}>{this.props.profile.Points}</Text>
                            <Text allowFontScaling={false} style ={[this.styles.heading,{paddingLeft:8,textTransform:'uppercase',fontSize:widthPercentageToDP(5),alignSelf:'flex-start',textAlign:'left'}]} numberOfLines={2} lineBreakMode='head'  allowFontScaling ={false}>{i18n.t('points')}</Text>
                            </View>
                            <View style={{backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(3),height:'80%',
                            overflow:'hidden'}}>
                                {UiElements.drawGap(heightPercentageToDP(2))}
                            <StatusTracker selected={0}/>
                            {!this.state.showHistory&&<Text allowFontScaling={false} style={[this.styles.RedeemTitle]}>{i18n.t('choosevenue')}</Text>}
                            {/* <Image source={cardbgB}  style={[styles.bgcard,{transform: [
                                { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 },
                            ],}]}/> */}
                            {/* {UiElements.drawGap(20)} */}
                            <View
                            style={{padding:'3%',height:'85%'}}>
                            {/* {UiElements.drawGap(10)} */}
                            {!this.state.showHistory&&this.getRedeemVenues()}
                            {this.state.showHistory&&<>
                                <View style={{flexDirection:'row',marginLeft:10}} > 
                                {/* <Image source ={historyB} style={styles.history}></Image> */}
                                <Text  allowFontScaling={false} numberOfLines={2} style={this.styles.RedeemTitle}>{i18n.t('redeemhistory')}</Text></View>
                                
                                <ScrollView style={this.styles.view2}
                                showsVerticalScrollIndicator={false}
                                refreshControl={this.refreshControl()}
                                >
                                {this.getTransfers()}
                                </ScrollView>
                                </>
                            }
                            {/* <TouchableOpacity onPress={()=>{this.setState({showHistory:true})
                            global.selectedPage=1}}>
                            <Image source ={historyB} style={styles.history}></Image>
                            <Text  allowFontScaling={false} style={styles.historytxt}>{i18n.t('redeemhistory')}</Text>
                        </TouchableOpacity> */}
                        </View>
                        </View>
                        <View style={{marginTop:heightPercentageToDP(2)}}>
                        
                        <TouchableOpacity 
                        onPress={()=>{
                            if(!this.state.showHistory){
                                this.setState({showHistory:true})
                                global.selectedPage=1
                            }else{
                                this.setState({showHistory:false})
                                global.selectedPage=0
                            }
                        }
                    }
                    style={{padding:5,
                        width:widthPercentageToDP(40),alignSelf:'center',
                        backgroundColor:Colors.blueColor,borderRadius:heightPercentageToDP(4.75),
                        justifyContent:'center',height:heightPercentageToDP(4.75)}}>
                        <Text allowFontScaling={false} lineBreakMode='head' numberOfLines={2} style={this.styles.redeemhis}>{this.state.showHistory?i18n.t('venues'):i18n.t('redeemhistory')}</Text>
                        </TouchableOpacity>
                        </View>
                        
                        </View>
                        );
                    }
                    
                }
                
                