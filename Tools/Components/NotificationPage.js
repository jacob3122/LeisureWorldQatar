import {I18n} from 'i18n-js';
import React, { Component, useState } from 'react'
import { PureComponent } from 'react';
import { StyleSheet,Modal, View,TouchableOpacity,Dimensions,Image,Text, ScrollView, ActivityIndicator, SafeAreaView, StatusBar, RefreshControl,KeyboardAvoidingView, FlatList, Linking} from 'react-native';
// import Colors from '../constants/Colors';
import SVGbg from'../../assets/bg/Back_app-04.svg'
import backButton from '../../assets/Icons/back.png'
// import i18n from 'i18n-js';
import * as Tools from './Tools';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import WebServices from '../constants/WebServices';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import moment from 'moment';
import {  StateContext } from '../context/ContextState';
import { useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeProvider';
import { connect } from 'react-redux';
import { updateProfile } from '../../src/js/actions/profileActions';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { useEffect } from 'react';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function NotificationPage(props){
    
    const {pageContent, setPageContent} = useContext(StateContext);
    const route=useRoute();
    const Colors =useTheme();
    // return <NotificationPageC {...props} setPageContent={setPageContent} route={route} Colors={Colors}/>
    // }
    const { state, dispatch } = useAppContext();
    const i18n = new I18n(state.i18ntranslation);
    i18n.translations = state.i18ntranslation;
    
    const [index, setindex] = useState(0);
    const [closed, setclosed] = useState(0);
    const [canEnd, setcanEnd] = useState(false);
    const [visible, setvisible] = useState(false);
    const [canclose, setcanclose] = useState(0);
    const [pageNo, setpageNo] = useState(1);
    const [lastPage, setlastPage] = useState(0);
    const [totalNotifications, settotalNotifications] = useState(undefined);
    const [totalUnreadNotifications, settotalUnreadNotifications] = useState(state.profile.UnreadNotifications);
    const [notifications, setnotifications] = useState(undefined);
    const [madeRead, setmadeRead] = useState(0);
    const [refreshing, setrefreshing] = useState(false);
    const [currentNotification, setcurrentNotification] = useState(undefined);
    const [tryagain, settryagain] = useState(0);
    const[notificationObj,setnotificationObj]=useState(undefined)
    

    useEffect(()=>{
        i18n.locale=global.locale;
    },[global.locale])
    
    // class NotificationPageC extends Component {
    let _isMounted=false;
    // constructor (props)
    // {
    //     // super(props);
    
    //     this.state={
    //         index:0,
    //         closed:0,
    //         canEnd:false,
    //         visible:false,
    //         canclose:0,
    //         pageNo:1,
    //         lastPage:0,
    //         totalNotifications:undefined,
    //         totalUnreadNotifications:this.props.profile.UnreadNotifications,
    //         notifications:undefined,
    //         madeRead:0,
    //         refreshing:false,
    //         currentNotification:undefined,tryagain:0
    //     }
    //     this.getNotifications=this.getNotifications.bind(this);
    //     this.handleEndReached=this.handleEndReached.bind(this);
    //     this.updateNotification=this.updateNotification.bind(this);
    //     this.createPageContent=this.createPageContent.bind(this);
    // }
    useEffect(()=>{
        _isMounted=true;
        getNotifications(state.profile.Id);
        return()=>{
            _isMounted=false;
        }
    },[])
    
    const getNotifications=(_memberId=null)=>{
        setrefreshing(true);
        if(lastPage!=pageNo)
        {
            const verifyurl= WebServices.Notifications.replace('{MemberID}',_memberId).replace('{page}',pageNo);
            try{
                return fetch(WebServices.MainURL +verifyurl, {
                    method: 'GET',
                    headers: {
                        'Authorization':'Bearer '+props.accessToken.access_token,
                        'Content-Type': 'application/json',
                    },
                }, WebServices.timeout)
                .then((response) =>   {
                    if(response.ok)
                    return response.text();
                    else{
                        setrefreshing(false);
                        if(response.status==401){
                            if(props.assignProfile!=null){
                                var handleToUpdate  =  props.assignProfile;
                                var _member=_memberId;
                                handleToUpdate('user',"","",()=>{
                                    getNotifications(_member)
                                });
                            }
                        }else{
                            settryagain(1);
                            throw new Error('Request failed with status code ' + response.status);
                        }
                        return null;
                    }}).then((responseJson) => {
                        if(responseJson!=null){
                            settryagain(0);
                            {
                                dataGot = JSON.parse(responseJson);
                                settotalNotifications(dataGot.Total);
                                notificationsIn=[];
                                if(notifications!=undefined){
                                    notificationsIn=notifications;
                                }
                                for (let index = 0; index < dataGot.Items.length; index++) {
                                    const element = dataGot.Items[index];
                                    notificationsIn.push(element);
                                }
                                setnotificationObj(dataGot);
                                setnotifications(notificationsIn);
                                setlastPage(pageNo);
                            }
                            setrefreshing(false);
                        }
                    })
                    .catch((error) =>{
                        settryagain(1);
                        console.error("getNotifications-"+error);
                    });
                }
                catch(error){
                    settryagain(1);
                    console.error("getNotifications-"+error);
                }
            }
            setrefreshing(false);
        }
        const updateNotification=(_notifyId,_action)=>{
            {
                const verifyurl= WebServices.UpdateNotification.replace('{NotifyID}',_notifyId).replace('{action}',_action);
                // console.log("URL updateNotification : "+verifyurl);
                try{
                    return fetch(WebServices.MainURL +verifyurl, {
                        method: 'POST',
                        headers: {
                            'Authorization':'Bearer '+props.accessToken.access_token,
                            'Content-Type': 'application/json',
                        },
                    }, WebServices.timeout)
                    .then((response) =>   {
                        setrefreshing(false);
                        if(response.ok)
                        return response.text();
                        else{
                            if(response.status==401){
                                if(props.assignProfile!=null){
                                    var handleToUpdate  =  props.assignProfile;
                                    handleToUpdate('user',"","");
                                }
                            }
                            throw new Error('Request failed with status code ' + response.status);
                        }}).then((responseJson) => {
                            // console.log("updateNotification : "+(responseJson));
                            {
                                
                            }
                        })
                        .catch((error) =>{
                            console.error("updateNotification-"+error);
                        });
                    }
                    catch(error){
                        console.error("updateNotification-"+error);
                    }
                }
            }
            
            const getDateFormated=(_formattedDate)=>{
                if (moment(_formattedDate).isSame(new Date(), 'day')) {
                    formattedDateString = "Today"+moment(_formattedDate).format(", hh:mm A");
                } else {
                    formattedDateString = moment(_formattedDate).format("DD MMM YY, hh:mm A");
                }
                return formattedDateString;
            }
            // getAllNotifications(){
            //     allNotify=[];
            //     if(this.state.notifications==undefined){
            //         // allNotify.push( <ActivityIndicator/>);
            //     }else{
            //         for (let index = 0; index < this.state.notifications.length; index++) {
            //             const element = this.state.notifications[index];
            //             const read=!element.WasRead;
            //             const formattedDate = moment(element.DateDelivered, "DD/MM/YYYY hh:mm A").toDate();
            
            //             allNotify.push(
            //                 <TouchableOpacity onPress={()=>{
            //                     this.updateNotification(element.Id,"read");
            //                     this.setState({currentNotification:element},()=>{
            //                         this.props.navigation.navigate(this.getAppNames(element.Add.Navigation.NavURL),this.getScreen(menuTo.Navigation.NavParameter));
            //                     });
            //                 }} style={[styles.notifyRow,{backgroundColor:read?Colors.transparentColor:Colors.transparent,}]}>
            //                 <View style={{flex:1,alignSelf:'center'}}>
            //                 <Text allowFontScaling={false} style={[styles.notifytxt, {fontFamily:read?'Cairo-Bold':'Cairo-Regular'}]}>{I18n.locale=='ar'?element.BodyAr:element.BodyEn}</Text>
            //                 <Text allowFontScaling={false} style={[styles.notifytime,{fontFamily:read?'Cairo-Bold':'Cairo-Regular'}]}>{this.getDateFormated(formattedDate)}</Text>
            //                 </View>
            //                 {read&&<View style={styles.notify}></View>}
            //                 </TouchableOpacity>
            //                 )
            //             }
            //         }
            //         return allNotify;
            //     }
            
            const refreshControl=()=>{
                return (
                    <RefreshControl
                    tintColor={Colors.orangeColor}
                    refreshing={refreshing}
                    onRefresh={()=>{
                        setpageNo(1);
                        getNotifications(props.profile.Id);
                    }} 
                    />
                    )
                }
               const handleEndReached=()=>{
                    if(!refreshing&&notifications!=undefined&&notifications.length>8){
                        // console.log("EndReached");
                        pageIn=pageNo+1;
                        setpageNo(pageIn);
                        getNotifications(props.profile.Id);
                    }
                }
                const renderHeader =()=> {
                    return(<></>);
                }
                const renderFooter =()=> {
                    return(<></>);
                }
                const renderEmpty =()=> {
                    return(<>
                        {!refreshing&&<Text allowFontScaling={false} style={{color:Colors.black, fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5),alignSelf:'center'}}>{i18n.t("nonotification")}</Text>}
                        </>);
                    }
                    const createPageContent=(pageData)=>{
                        // console.log("createPageContent"+JSON.stringify(pageData));
                        if(Tools.IsNull(pageData.Additional)||Tools.IsNull(pageData.Additional.NavType)){
                            pageContentIn={
                                backgroundWallOpacity:0.8,
                                type:'notificationApp',
                                data:pageData,
                                onDone:()=>{
                                    onDone();
                                }
                            }
                            global.pageContent=pageContentIn;
                            setPageContent(pageContentIn);
                        }else if(!Tools.IsNull(pageData.Additional)&&pageData.Additional.NavType=='viewurl')
                        {
                            if(pageData.Additional.NavParameter.length>0){
                                props.navigation.navigate('Adpage',{
                                    url:pageData.Additional.NavParameter
                                })
                            }
                        }else if(!Tools.IsNull(pageData.Additional)&&pageData.Additional.NavType=='url')
                        {
                            if(pageData.Additional.NavURL.length>0){
                                Linking.openURL(pageData.Additional.NavURL);
                            }
                        }else{
                            props.navigation.navigate(Tools.getAppNames(pageData.Additional.NavURL),Tools.getScreen(pageData.Additional.NavParameter));
                        }
                    }
                    const onDone=()=>{
                        
                    }
                    
                    const checkUnreadNotifications=()=>{
                        _madeRead=madeRead
                        _madeRead+=1;
                        setmadeRead(_madeRead);
                        // console.log(_madeRead+"/"+totalUnreadNotifications);
                        return (totalUnreadNotifications-_madeRead);
                        // if(_madeRead>=this.state.totalUnreadNotifications){
                        //     return false;
                        // }
                        // for (let index = 0; index < this.state.notifications.length; index++) {
                        //     const element = this.state.notifications[index];
                        //     if(!element.WasRead){
                        //         return true;
                        //     }
                        //     if(this.state.totalNotifications!=undefined&&(index+1)==this.state.totalNotifications){
                        //         return false;
                        //     }
                        // }
                        // return true;
                    }
                    const getNofiy=(_itemIn)=>{
                        const element = _itemIn.item;
                        const read=!element.WasRead;
                        const formattedDate = moment(element.DateDelivered, "DD/MM/YYYY hh:mm A").toDate();
                        return(
                            <TouchableOpacity onPress={()=>{
                                createPageContent(element);
                                // this.updateNotification(element.Id,"unread");
                                if(!element.WasRead)
                                {
                                    updateNotification(element.Id,"read");
                                    element.WasRead=true;
                                    var isUnread= checkUnreadNotifications();
                                    // console.log("Reset Unread"+isUnread);
                                    // if(!isUnread){
                                    // let _updateProfile=props.updateProfile;
                                    _profile=props.profile;
                                    _profile.UnreadNotifications=isUnread>0?isUnread:0;
                                    dispatch({
                                        type: 'update_Profile',
                                        payload: _profile
                                      });
                                    // _updateProfile(_profile);
                                    // }
                                }
                            }} style={[styles.notifyRow,{backgroundColor:read?Colors.whiteColor:Colors.transparent,}]}>
                            <View style={{flex:1,alignSelf:'center'}}>
                            <Text numberOfLines={1} allowFontScaling={false} style={[styles.notifytxt, {fontFamily:read?'Cairo-Bold':'Cairo-Regular'}]}>{I18n.locale=='ar'?element.BodyAr:element.BodyEn}</Text>
                            <Text allowFontScaling={false} style={[styles.notifytime,{fontFamily:read?'Cairo-Bold':'Cairo-Regular'}]}>{getDateFormated(formattedDate)}</Text>
                            </View>
                            {read&&<View style={styles.notify}></View>}
                            </TouchableOpacity>
                            )
                        }
                        
                            const styles = StyleSheet.create({
                                
                                notifytxt:{
                                    fontFamily:'Cairo-Bold',
                                    color:Colors.black,
                                    fontSize:widthPercentageToDP(4),
                                    lineHeight:widthPercentageToDP(4)*1.5,
                                },notifytime:{
                                    color:Colors.inputfontColor,
                                    fontFamily:'Cairo-Bold',
                                    fontSize:widthPercentageToDP(3),
                                    lineHeight:widthPercentageToDP(3)*1.5,
                                },tagline:{
                                    fontFamily:'Cairo-Bold',
                                    marginStart:widthPercentageToDP(1),
                                    // fontWeight:'bold',
                                    fontSize:25,
                                    lineHeight:25*1.4,
                                    justifyContent:'center',
                                    alignSelf:'center',
                                    color:Colors.inputfontColor
                                },notifyRow:{
                                    height:heightPercentageToDP(9),
                                    flexDirection:'row',
                                    padding:widthPercentageToDP(3),
                                    paddingHorizontal:widthPercentageToDP(5),
                                    backgroundColor:Colors.transparentColor            
                                },notify:{
                                    alignSelf:'center',
                                    marginHorizontal:widthPercentageToDP(1.5),
                                    width:widthPercentageToDP(2.5),
                                    height:widthPercentageToDP(2.5),
                                    borderRadius:widthPercentageToDP(3),
                                    backgroundColor:Colors.orangeColor
                                },tryagain:{
                                    margin:10,
                                    height:35,
                                    borderRadius:15,
                                    backgroundColor:Colors.blueColor,
                                    justifyContent:'center',
                                    alignSelf:'center',
                                    alignContent:'center',
                                    width:widthPercentageToDP(30),
                                },
                                tryagaintext:{
                                    alignSelf:'center',
                                    color:Colors.whiteColor,
                                    fontSize:15,
                                    fontWeight:'100',
                                    fontFamily:'Cairo-Regular'
                                },
                            });
                            return (
                                <KeyboardAvoidingView style={{height:'100%',backgroundColor:Colors.bgColor}} behavior={(Platform.OS === 'ios' ? 'padding' : 'undefined')} enabled>
                                <SafeAreaView style={{maxHeight:heightPercentageToDP(100),width:'100%',height:'100%',alignSelf:'center',marginTop:'11%',backgroundColor:Colors.bgColor}}>
                                <View style={{marginLeft:widthPercentageToDP(4),marginRight:widthPercentageToDP(4),marginTop:heightPercentageToDP(1),width:widthPercentageToDP(90),alignSelf:'center',flexDirection:'row',justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={()=>{
                                    var updateUnread=props.updateUnread;
                                    updateUnread();
                                    props.navigation.goBack({onGoBack:()=>{
                                        // console.log("navigate")
                                    }});
                                }}>
                                <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                                </TouchableOpacity>
                                {/* <SVGbg style={{position:'absolute'}} viewBox="0 0 1284 2778" preserveAspectRatio="xMaxYMin slice"/> */}
                                <View style={{width:'90%',alignSelf:'center',flexDirection:'row'}}>
                                <Text numberOfLines={1} allowFontScaling={false} style={styles.tagline}>{i18n.t('notificationcenter')}</Text></View>
                                </View>
                                {tryagain==1&&<TouchableOpacity style={styles.tryagain} onPress={()=>{refreshControl()}}>
                                <Text allowFontScaling={false} style={styles.tryagaintext}>{i18n.t('tryagain')}</Text>
                                </TouchableOpacity>}
                                <FlatList
                                removeClippedSubviews={false}
                                style={{paddingTop:heightPercentageToDP(1)}}
                                refreshControl={refreshControl()}
                                contentContainerStyle={{paddingBottom:heightPercentageToDP(10)}}
                                // removeClippedSubviews
                                initialNumToRender={10}
                                maxToRenderPerBatch={1}
                                onEndReachedThreshold={0.25}
                                horizontal={false}
                                showsVerticalScrollIndicator={false}
                                data={notifications}
                                renderItem={(_item)=>{
                                    return getNofiy(_item);
                                }}
                                ListHeaderComponent={renderHeader}
                                ListFooterComponent={renderFooter}
                                ListEmptyComponent={renderEmpty}
                                onEndReached={handleEndReached}
                                />
                                {/* <ScrollView
                                onEndReachedThreshold={50}
                                // onEndReached={this.handleEndReached()}
                                refreshControl={this.refreshControl()}
                                style={{}}
                                contentContainerStyle={{}}
                                horizontal={false}
                                showsVerticalScrollIndicator={false}>
                            {this.getAllNotifications()} */}
                            {/* <View style={styles.notifyRow}>
                            <Text style={styles.notifytxt}>You have received 100 Points on purschase with PNR ABCDEF</Text>
                            <View style={styles.notify}></View>
                            </View>
                            <View style={[styles.notifyRow,{backgroundColor:Colors.transparentMildWhite}]}>
                            <Text style={styles.notifytxt}>You have received 100 Points on purschase with PNR ABCDEF</Text>
                            </View>
                            <View style={styles.notifyRow}>
                            <Text style={styles.notifytxt}>You have received 100 Points</Text>
                            <View style={styles.notify}></View>
                        </View> */}
                        {/* </ScrollView> */}
                        </SafeAreaView>
                        </KeyboardAvoidingView>
                        )
                    }
                
                // const mapStateToProps = state=>{
                //     return {
                //         profile: state.profileReducer.profile,
                //     }                
                // };
                
                // const mapDispatchToProps = (dispatch) => {
                //     return{
                //         updateProfile: (pData) => dispatch(updateProfile(pData)),
                
                //     };
                // }
                
                // export default connect(
                //     mapStateToProps,
                //     mapDispatchToProps
                //     )(NotificationPage)
                