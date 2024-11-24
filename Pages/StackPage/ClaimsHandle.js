import React, { Component } from 'react'
import {View,ScrollView,StyleSheet,Text,Platform,TextInput,TouchableOpacity,RefreshControl,Image,PixelRatio, SafeAreaView, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import moment from'moment'
import * as UiElements from '../../Tools/Components/UIElements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import cameraIcon from '../../assets/Icons/camera.png'
import camerabarIcon from '../../assets/Icons/camerabar.png'

import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../../Tools/constants/Colors';
import BarcodeScan from '../../Tools/Components/BarcodeScan';

import * as Tools  from '../../Tools/Components/Tools';
// import cardbg1 from '../../assets/bg/bg-02.jpg'
// import cardbg2 from '../../assets/bg/bg-03.jpg'

// import scanbarB from '../../assets/Icons/barcode.png'
import proceedB from '../../assets/Icons/next.png'
import historyB from '../../assets/Icons/history.png'
import HeaderLogo from '../../Tools/Components/HeaderLogo';
// import BackButton from '../../Tools/Components/BackButton';
import backButton from '../../assets/Icons/back.png'

import {Dimensions } from "react-native";
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
// import { NavigationEvents } from 'react-navigation';
import LoadingLine from '../../Tools/Components/LoadingLine';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import CardTopBar from '../../Tools/Components/CardTopBar';

export default function ClaimsHandle(props){
    const Colors=useTheme();
    return <ClaimsHandleC {...props} Colors={Colors}/>
}

class ClaimsHandleC extends Component {
    
    
    _myScroll=ScrollView;
    styles=undefined;
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
            refreshing:true,
            showHistory:false,
        }
        
        this.handler = this.handler.bind(this);
        this.updateInvoice = this.updateInvoice.bind(this);
        // this.onNavigatorEvent=this.onNavigatorEvent.bind(this);
        
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
        if(global.selectedPage===undefined)
        global.selectedPage=0;
        this.setState({selectedPage: global.selectedPage,showHistory:(global.selectedPage!=0?true:false)});
        Tools.updateRatePoints(1);
        var claimUpdate=this.props.claimprofile;
        claimUpdate();
        // setTimeout(()=>{this.refs.scrollview.scrollTo({x: selectedPage*(width-20), y: 0, animated: false})},1000);
    }
    
    
    
    handler(someValue) {
        // console.log(this.ScrollRefs);
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
    
    getDate(){
        return(
            <View>
            <View style={[this.styles.inputView,{flexDirection:'column',justifyContent:'center'}]}>
            <Text allowFontScaling={false} style={[this.styles.dateValue,{color:(this.state.showDate?'grey':'black')}]} onPress={()=>{this.setState({showDate:true})}}>{this.state.chosenDate.getDate()}/{this.state.chosenDate.getMonth()+1}/{this.state.chosenDate.getFullYear()}</Text></View>
            </View>
            )
        }
        
        updateInvoice(value){
            if(!Tools.stringIsEmpty(value))
            this.setState({claimNo:value});
            
            this.setState({cameraView:false});
            
        }
        
        
        checkCamera(){
            if(this.state.cameraView){
                return(
                    // <View></View>
                    <BarcodeScan navigation={this.props.navigation} onScanDone={this.updateInvoice}/>
                    );
                }else{
                    return(
                        <View style={{flex:1}}>
                        {/* {UiElements.drawGap(2)}  */}
                        {this.updateClaimPage()}
                        </View>
                        )
                    }
                }
                
                updateClaimPage(){
                    const{Colors}=this.props;
                    return(<View style={{height:'100%',width:'100%'}}>
                    <CardTopBar selected={1} navigation={this.props.navigation} assignProfile={this.props.assignProfile} isLoading={this.props.isLoading} profile={this.props.profile} redeem={this.props.redeem} redeemPoint={this.props.redeemPoint} redeemProfile={this.props.redeemProfile}/>
                    <View style={this.styles.fullPart}>
                    <View style={[this.styles.bottompart,{justifyContent:'center'}]}>
                    <View style={{alignSelf:'center'}}>
                    <Text style={[this.styles.historytxt,{color:Colors.inputfontColor,alignSelf:'center'}]}>{i18n.t('claimpoints')}</Text>
                    <View style={{backgroundColor:Colors.bgColor,borderRadius:widthPercentageToDP(4),width:widthPercentageToDP(82),justifyContent:'center',padding:widthPercentageToDP(5)}}>
                    <View style={[this.styles.shadow,{ height:heightPercentageToDP(4.75), flexDirection:'row'
                    ,borderColor:Colors.whiteColor,backgroundColor:Colors.whiteColor,alignContent:'center',
                    borderRadius:heightPercentageToDP(4.75),alignSelf:'center',width:widthPercentageToDP(70),justifyContent:'center'}]}>
                    <TextInput allowFontScaling={false} style ={[this.styles.inputValue,{textAlign:'center',alignSelf:'flex-end',textAlignVertical:'center',
                }]}
                placeholderTextColor={Colors.placeholdertext}
                editable={true}
                // onEndEditing={(text)=>{this.ClaimPoints()}}
                value={this.state.claimNo}
                onChangeText={(text) => {this.setState({claimNo:text})}}
                keyboardType='default'
                returnKeyType='done'
                placeholder={i18n.t('typeinvoiceno')}>
                </TextInput>
                {/* <TouchableOpacity style={{position:'absolute',alignSelf:'center',end:'5%'}} onPress={()=>{
                    this.setState({cameraView:!this.state.cameraView})
                }}><Image style={{tintColor:Colors.blueColor}} source={cameraIcon}/></TouchableOpacity> */}
                {/* {this.state.claimNo.length>5&&<TouchableOpacity 
                    style={{width:25,height:40,justifyContent:'center',position:'absolute',end:widthPercentageToDP(1)}} 
                onPress={()=>this.ClaimPoints()}><Image resizeMode='contain' source={proceedB} style={styles.backbut} ></Image></TouchableOpacity> } */}
                </View>
                <Text style={{color:Colors.blueColor,alignSelf:'center',fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(4)}}>{i18n.t('or')}</Text>
                
                <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{
                    this.setState({cameraView:!this.state.cameraView})
                }}><Image style={{tintColor:Colors.black,width:widthPercentageToDP(11),height:widthPercentageToDP(11)}} resizeMode='contain' source={camerabarIcon}/></TouchableOpacity>
                <View style={{position:'absolute',alignSelf:'center',bottom:heightPercentageToDP(4.45),height:heightPercentageToDP(2),width:'100%'}}>{this.props.claimCheck&&<LoadingLine visibleText={false} loadBar={{backgroundColor:Colors.bluedarkShadeColor}} />}</View>
                <Text style={{color:Colors.black,alignSelf:'center',fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5),lineHeight:widthPercentageToDP(3.5)*1.25}}>{i18n.t('scaninvoicebarcode').toUpperCase()}</Text>
                {/* {!this.props.claimCheck&&UiElements.drawGap(hp(4.75))} */}
                <TouchableOpacity disabled={this.state.claimNo.length<5} style={{opacity:this.state.claimNo.length<5?0.5:1, flexDirection:'row',justifyContent:'center',
                // position:'absolute',bottom:'15%',
                marginTop:heightPercentageToDP(1),
                backgroundColor:Colors.blueColor,height:heightPercentageToDP(4.5),borderRadius:heightPercentageToDP(4.5)
                ,alignSelf:'center'}} onPress={()=>{this.ClaimPoints()}} >
                <Text allowFontScaling={false} numberOfLines={1} style={this.styles.buttontxt}>{i18n.t('submit')}</Text>
                </TouchableOpacity>
                </View></View>
                </View>
                <View style={{height:heightPercentageToDP(36)}}>
                    {UiElements.drawGap(heightPercentageToDP(3))}
                {/* <View style={{flexDirection:'row'}} >  */}
                {/* <Image source ={historyB} style={styles.history}></Image> */}
                {/* <Text  allowFontScaling={false} numberOfLines={1} style={this.styles.historytxt}>{i18n.t('claimshistory')}</Text></View> */}
                {/* <TouchableOpacity onPressIn={()=>{this.props.navigation.goBack();}}>
                <Image source={proceedB} style={styles.backbut} ></Image>
            </TouchableOpacity> */}
            
            
            <ScrollView style={this.styles.viewTransfer}
            showsVerticalScrollIndicator={false}
            refreshControl={this.refreshControl()}
            >
            {this.getTransfers()}
            
            </ScrollView>
            </View>
            </View>
            {/* <TouchableOpacity onPressIn={()=>{this.setState({showHistory:false})
            global.selectedPage=0}}>
            <Image source={proceedB} style={styles.backbut} ></Image>
        </TouchableOpacity> */}
        </View>
        );
    }
    
    ClaimPoints(){
        var claimReq=this.props.claimpoint;
        claimReq(this.state.claimNo);
    }
    
    refreshControl(){
        const{Colors}=this.props;
        
        return (
            <RefreshControl
            tintColor={Colors.bluedarkShadeColor}
            refreshing={this.state.refreshing&&this.props.claims==undefined}
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
            const{Colors}=this.props;
            
            // console.log(this.props.claims);
            if(this.props.profile==undefined||(this.props.profile!=undefined&&(this.props.claims.length==0||(this.props.claims!==undefined&&this.props.claims.length<=0)||this.props.claims==undefined))){
                return(
                    <View>
                    {UiElements.drawGap(10)}
                    <Text allowFontScaling={false} style={this.styles.simplelabel} >
                    {i18n.t('noclaim')}
                    </Text>
                    <TouchableOpacity style={styles.tryagain} onPress={()=>{this.refreshListView()}}>
                    <Text allowFontScaling={false} style={this.styles.tryagaintext}>{i18n.t('tryagain')}</Text>
                    </TouchableOpacity></View>);
                }else{
                    return(
                        <View style={{}}>
                        
                        {this.getRedeems()}
                        </View>
                        );
                    }
                }
                getRedeems(){
                    const{Colors}=this.props;
                    
                    transactionsArray=[];
                    if(this.props.claims!==undefined&&this.props.claims.length>0){
                        claimTransaction=(this.props.claims.length>1)?(this.props.claims.sort((a,b)=>((new Date(b.InvoiceDate)-new Date(a.InvoiceDate))))):this.props.claims;
                        // console.log(claimTransaction)
                        for(let t=0;t<claimTransaction.length;t++){
                            transactionsArray.push(
                                <View key ={t} style={{}}>
                                <View style={this.styles.rowTView}>
                                <View style={{justifyContent:'center',paddingHorizontal:widthPercentageToDP(2)}}>
                                <Text allowFontScaling={false} style={[this.styles.pointtxt,{alignSelf:'center',fontSize:widthPercentageToDP(5),lineHeight:widthPercentageToDP(5)*1.25,fontFamily:'Cairo-Bold',}]}>{claimTransaction[t].Points}</Text>
                                <Text allowFontScaling={false} style={[this.styles.pointtxt,{alignSelf:'center',marginTop:-5}]}>{i18n.t('points')}</Text>
                                </View>
                                <View>
                                <View style={{flexDirection:'row'}}>
                                <Text allowFontScaling={false} style={[this.styles.pointtxt,{fontFamily:'Cairo-Bold',}]}>{i18n.t('date')+" : "}</Text>
                                <Text allowFontScaling={false} style={[this.styles.pointtxt,{}]}>{moment(claimTransaction[t].InvoiceDate).format('DD/MM/YYYY hh:mm A') }</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                <Text allowFontScaling={false} style={[this.styles.pointtxt,{fontFamily:'Cairo-Bold',}]}>{i18n.t('invoiceno')+" : "}</Text>
                                <Text allowFontScaling={false} style={[this.styles.pointtxt]}>{claimTransaction[t].InvoiceNumber}</Text>
                                </View>
                                {/* <Text allowFontScaling={false} style={[styles.pointtxt,
                                {flex:1}]}>{"Paid : "+claimTransaction[t].PaidAmount+" QAR "}</Text> */}
                                
                                <View style={{flexDirection:'row'}}>
                                <Text allowFontScaling={false} style={[this.styles.pointtxt,{fontFamily:'Cairo-Bold',}]}>{i18n.t('expires')+" : " }</Text>
                                <Text allowFontScaling={false} style={[this.styles.pointtxt]}>{moment(claimTransaction[t].ExpiryDate).format('DD/MM/YYYY hh:mm A') }</Text>
                                </View></View>
                                </View>
                                {UiElements.drawLine(Colors.blueColor,'90%',heightPercentageToDP(.2))}
                                {UiElements.drawGap(5)}
                                </View>
                                );
                            }
                            
                            
                            return(transactionsArray);
                        }else{
                            return(
                                <ActivityIndicator
                                size='large'
                                color={Colors.bluelightShadeColor}/>
                                )
                            }
                        }
                        
                        getLoading(){
                            return(
                                <View>
                                {/* <Loader active pRows={3} pWidth={["100%", 200, "25%", 45]} /> */}
                                {UiElements.drawGap(10)}
                                {/* <Loader active pRows={2} pWidth={["100%", 200, "25%", 45]} /> */}
                                </View>
                                )
                            }
                            
                            render() {
                                const {Colors}=this.props;
                                
                                
                                const styles = StyleSheet.create({
                                    viewTransfer:{
                                        alignSelf:'center',
                                        width:'90%',
                                        // height:'84%',
                                    },
                                    fullPart:{
                                        borderRadius:widthPercentageToDP(4),
                                        backgroundColor:Colors.whiteColor,
                                        width:('100%'),
                                        alignSelf:'center',
                                        marginTop:heightPercentageToDP(2)
                                    },
                                    bottompart:{
                                        width:('100%'),
                                        height:hp(30),
                                        alignSelf:'center',
                                    },
                                    totalView:{
                                        alignSelf:'center',
                                        justifyContent:'center',
                                        height:heightPercentageToDP(73),
                                        width:wp(93),
                                        // borderRadius:widthPercentageToDP(3),
                                        // backgroundColor:Colors.bluelightShadeColor
                                    },
                                    proceedTouch:{
                                        position:'absolute',
                                        right:0,
                                        top:0,
                                        // borderWidth:2,
                                        // marginLeft:'85%',
                                        // alignSelf:'flex-end',
                                        // borderWidth:1,
                                        justifyContent:'center',
                                        height:60,
                                        width:60,
                                        flexDirection:'column'
                                    },shadow:{
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowRadius: 3,
                                        shadowOpacity: 0.12,
                                    },
                                    backbut:{
                                        tintColor:Colors.blueColor,
                                        position:'absolute',
                                        alignSelf:'center',
                                        width:20,
                                        height:20,
                                        zIndex:10,
                                    },
                                    proceed:{
                                        alignSelf:'center',
                                        width:30,
                                        height:30,
                                    },
                                    scanbarB:{
                                        alignSelf:'flex-start',
                                        // marginLeft:40,
                                        marginRight:10,
                                        width:60,
                                        height:60,
                                    },
                                    history:{
                                        marginStart:10,
                                        alignSelf:'center',
                                        width:40,
                                        height:40,
                                    },
                                    historytxt:{
                                        textAlign:'left',
                                        paddingHorizontal:widthPercentageToDP(4),
                                        paddingTop:10,
                                        // alignSelf:'left',
                                        color:Colors.whiteColor,
                                        fontFamily:'Cairo-Regular',
                                        fontSize: 22,
                                        // textTransform:'uppercase',
                                        lineHeight:22*1.3
                                    },
                                    dateValue:{
                                        fontSize: 16,
                                        fontFamily:'Cairo-Bold',
                                        width:'100%',
                                        
                                        // borderWidth:2,
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
                                    
                                    rowTView:{
                                        flex: 1, 
                                        padding:10,
                                        justifyContent:'flex-start',
                                        flexDirection: 'row',
                                        zIndex:2,
                                        // backgroundColor:Colors.whiteColor,
                                        borderBottomWidth:1,
                                        borderColor:Colors.whiteColor,
                                        borderRadius:15,
                                    },
                                    pointtxt:{
                                        zIndex:2,
                                        fontSize: 14,
                                        lineHeight:14*1.35,
                                        // fontWeight: '600',
                                        color:Colors.black,
                                        fontFamily:'Cairo-Regular',
                                        textAlign:Tools.stringIsContains(i18n.locale,'ar')?'right':'left'
                                    },
                                    inputValue: {
                                        height:heightPercentageToDP(4.75),
                                        borderRadius:heightPercentageToDP(4.75),
                                        // height:AdaptiveWidth(7.5),
                                        color: Colors.inputfontColor,
                                        fontFamily:'Cairo-Regular',
                                        fontSize:17,
                                        alignSelf:'center',
                                        padding:5,
                                        // fontSize: AdaptiveWidth(15),
                                    },
                                    homeView: {
                                        // borderWidth:2
                                    },detailstitle:{
                                        flexWrap:'wrap',
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
                                        width:widthPercentageToDP(20),
                                        backgroundColor:Colors.tealGreen,
                                        alignItems:'center',
                                        alignSelf:'center',
                                        justifyContent:'center',
                                        
                                        height:widthPercentageToDP(12),
                                        borderRadius:widthPercentageToDP(4)
                                    },
                                    claimBut:{
                                        borderRadius:6,
                                        alignSelf:'center',
                                        width:12,
                                        height:12,
                                        backgroundColor:Colors.blueColor
                                    },
                                    heading: {
                                        textAlign:'left',
                                        fontSize: 40,
                                        fontFamily:'Cairo-Bold'
                                    },
                                    
                                    subheading: {
                                        flex:0.5,
                                        textAlign:'center',
                                        fontSize: 15,
                                        fontWeight: '200',
                                        color:Colors.violetColor,
                                        fontFamily:'Cairo-Regular'
                                    },
                                    simplelabel: {
                                        textAlign:'center',
                                        fontSize: 15,
                                        fontWeight: '100',
                                        color:Colors.whiteColor,
                                        fontFamily:'Cairo-Regular'
                                    }, buttontxt: {
                                        marginHorizontal:widthPercentageToDP(5),
                                        alignSelf:'center',
                                        textAlignVertical:'center',
                                        textAlign:'right',
                                        fontSize: 16,
                                        fontWeight: '100',
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
                                        height:35,
                                        borderRadius:15,
                                        backgroundColor:Colors.whiteColor,
                                        justifyContent:'center',
                                        alignSelf:'center',
                                        alignContent:'center',
                                        width:150,
                                    },
                                    tryagaintext:{
                                        alignSelf:'center',
                                        color:Colors.blueColor,
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
                                        fontFamily:'Cairo-Regular'
                                    },bgImage:{
                                        position:'absolute',
                                        alignSelf:'center',
                                        width:'100%',
                                        height:height,
                                        resizeMode:'contain'
                                    },
                                    
                                });
                                this.styles=styles;
                                buttonsInit = [i18n.t('submitclaim'),i18n.t('claimshistory')];
                                return (
                                    <View style={{flex:1,width:width,backgroundColor:Colors.bgColor}}>
                                    <BackgroundWall/>
                                    <SafeAreaView style={{flex:1,marginTop:heightPercentageToDP(3)}}>
                                    <TouchableOpacity style={{marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{this.props.navigation.goBack()}}>
                                    <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                                    </TouchableOpacity>
                                    <View style={{flex:1,marginTop:heightPercentageToDP(1),width:widthPercentageToDP(100)}}>
                                    <View style={[styles.totalView,{}]}>
                                    
                                    
                                    
                                    {/* {UiElements.drawGap((5))} */}
                                    {this.checkCamera()}
                                    
                                    </View>
                                    {UiElements.drawGap(hp('2%'))}
                                    
                                    </View>
                                    
                                    </SafeAreaView>
                                    </View>
                                    )
                                }
                                
                                
                                
                            }
                            
                            ClaimsHandle.propTypes = {
                                profile: PropTypes.object.isRequired,
                            }