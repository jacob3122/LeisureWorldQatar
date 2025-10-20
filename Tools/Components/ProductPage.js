import React, { Component, useContext, useEffect, useState } from 'react';
import {Image, View,Modal,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, StatusBar,FlatList} from 'react-native';
import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import {AdaptiveWidth,AdaptiveHeight} from './AdaptiveSize';
// import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import addcartIcon from '../../assets/Icons/cart.png'
import shareIcon from '../../assets/Icons/share.png'
import gsbgIcon from '../../assets/Icons/iconbg.png'
import gamestoryIcon from '../../assets/Icons/gsicon.png'
import {SliderBox} from 'react-native-image-slider-box';
import WebServices from '../constants/WebServices';
import backButton from '../../assets/Icons/back.png'
import cartIcon from '../../assets/Icons/cart.png'
import diffLockIcon from '../../assets/Icons/blklock.png'
import infoTermsIcon from '../../assets/Icons/infoterms.png'
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import InfoBar from './InfoBar';
import WebView from 'react-native-webview';
import RenderHtml,{defaultSystemFonts}from 'react-native-render-html';
import { Linking } from 'react-native';
import dropIcon from '../../assets/Icons/caret-down.png'
import calIcon from '../../assets/Icons/cal.png'
import ProfileData from '../../Tools/Components/ProfileData';
import { useFocusEffect, useRoute } from '@react-navigation/native';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import moment from'moment'
import {connect} from 'react-redux';
import {updateMedia} from '../../src/js/actions/profileActions';
import DatePicker from 'react-native-date-picker'
const systemFonts = [...defaultSystemFonts, 'Cairo-Regular']
import { StateContext } from '../context/ContextState';
import {DeviceEventEmitter} from "react-native"
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import PopupCalender from './PopupCalender';

import { Calendar,CalendarUtils } from 'react-native-calendars';
import { firebase } from '@react-native-firebase/analytics';
import Share from 'react-native-share';
import CheckBox from "@react-native-community/checkbox";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function ProductPage(props){
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const {bottomBar, setBottomBar} = useContext(StateContext);
    const Colors=useTheme();
    const {params}=props.route;
    let cardNumberInputRef=React.createRef();
    
    
    const [showdropIcon, setShowdropIcon] = useState(false);
    const [isInformative,setIsInformative]=useState(false);
    const [isCalendar,setIsCalendar]=useState(false);
    const [calendarId,setCalendarId]=useState(null);
    const [shareURL,setShareURL]=useState('');
    // const [addonEvent,setAddonEvent]=useState([]);
    const [relatedProducts,setrelatedProducts]=useState([]);
    const [relatedProductsDetails,setrelatedProductDetails]=useState(undefined);
    const [eventId,setEventId]=useState(null);
    const [valueText, setValueText] = useState('');
    const [gotData, setGotData] = useState(false);
    const [appHide, setAppHide] = useState(false);
    const [val, setVal] = useState('');
    const [test, setTest] = useState(0);
    const [totalNo, setTotalNo] = useState(1);
    const [validation, setValidation] = useState(-1);
    const [showError, setShowError] = useState(false);
    const [showLogin, setshowLogin] = useState(false);
    const [visible, setVisible] = useState(true);
    const [priceIn, setPriceIn] = useState(0);
    const [product, setProduct] = useState(props.route.params.product);
    const [catalogProducts, setcatalogProducts] = useState(props.route.params.catalogProducts);
    const [variations, setVariations] = useState([]);
    const [mediaCode, setMediaCode] = useState('');
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [prevSelectedDate, setPrevSelectedDate] = useState(undefined)
    const [calendarIn,setCalendar]=useState(undefined);
    const [calendarEventsIn,setCalendarEventsIn]=useState(undefined);
    // const [addOnEventsIn,setAddonEventsIn]=useState(undefined);
    const [daysIn,setDays]=useState({});
    const [fdate,setFirstDate]=useState(undefined);
    const [callbackReg,setCallbackReg]=useState(undefined);
    const [tmpSelectedDate, setTmpSelectedDate] = useState(moment(props.route.params.product.EntityType === 5? new Date(moment(new Date()).add(2, "days")): new Date()));
    const [showCalendar, setShowCalendar] = useState(false);
    const [topupProduct, setTopupProduct] = useState(false);
    const [SelectedVariation, setSelectedVariation] = useState(null);
    const [SelectedVariations, setSelectedVariations] = useState([]);
    const [MediaDetails, setMediaDetails] = useState({});
    const [AdditionalInfo, setAdditionalInfo] = useState(null);
    const [SelectedOption, setSelectedOption] = useState(undefined);
    const [allproducts, setAllProducts] = useState(state.cartItems);
    const [ShowInfo, setShowInfo] = useState(undefined);
    const [showDrop, setShowDrop] = useState(false);
    const [performances, setPerformances] = useState([]);
    const [performancesforvisual, setPerformancesForVisual] = useState([]);
    const [selectedPerformance, setSelectedPerformance] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [sellableProducts, setSellableProducts] = useState(undefined);
    const [profile, setProfile] = useState(state.profile);
    const [MediaIds, setMediaIds] = useState([]);
    const [opened, setOpened] = useState(false);
    // const [addonPrice,setAddonPrice]=useState(0);
    const checkIsVariable=(_productIn)=>{
        if((!Tools.IsNull(_productIn.Entity)&&!Tools.IsNull(_productIn.Entity.AttributeItemList))||(_productIn.Nodes!=null&&_productIn.Nodes.length==1)){
            if((_productIn.Nodes!=null&&_productIn.Nodes.length==1))
                _productIn=_productIn.Nodes[0];
            for (let index = 0; index < _productIn.Entity.AttributeItemList.length; index++) {
                const element = _productIn.Entity.AttributeItemList[index];
                if(element.Active&&element.SelectionType==3){
                    // console.log("checkIsVariable : "+index)
                    return index;
                }
            }
        }
        return -1;
    }
    
    useEffect(()=>{
        console.log("Profile product");
        if(opened){
            props.navigation.goBack();
        }
    },[state.profile]);
    
    // useEffect(()=>{
        
    //     checkAddonEvents();
    // },[addonEvent,selectedDate,totalNo]);
    
    useEffect(()=>{
        console.log("Add info :"+JSON.stringify(AdditionalInfo))
    },[AdditionalInfo])
    
    useEffect(()=>{
        // console.log("SD :"+selectedDate);
        if(!Tools.IsNull(selectedDate)){
            var daysList=daysIn;
            
            if(!Tools.IsNull(daysIn[(selectedDate).format('YYYY-MM-DD')])){
                daysList[(selectedDate).format('YYYY-MM-DD')]={disabled:false,selected:true,inactive:false ,disableTouchEvent: false};
            }
            if(!Tools.IsNull(prevSelectedDate)&&!Tools.IsNull(daysIn[(prevSelectedDate).format('YYYY-MM-DD')])){
                daysList[(prevSelectedDate).format('YYYY-MM-DD')]={disabled:false,inactive:false ,disableTouchEvent: false};
            }
            
            setPrevSelectedDate(selectedDate);
            setDays(daysList);
            
            if((!Tools.IsNull(params.product.Nodes)&&Tools.stringIsContains(params.product.Nodes[0].Entity.TagNames,WebServices.mediaRequire)))
                return;
            
            if(!Tools.IsNull(selectedDate)){
                var _performance=null;
                if(calendarEventsIn!=null){
                    for (let index = 0; index < calendarEventsIn.length; index++) {
                        const element = calendarEventsIn[index];
                        dateIn=new Date(element.DateTimeFrom);
                        if(selectedDate!=undefined&& dateIn.toISOString().split('T')[0]==selectedDate.toISOString().split('T')[0]){
                            // console.log(element);
                            // setSelectedOption(product);
                            setSelectedPerformance(element);
                            break;
                        }
                    }
                }
                
                // console.log("F :"+selectedDate.toISOString().split('T')[0]);
                
                if(!Tools.IsNull(params.product)&&!Tools.IsNull(params.product.Entity)&&(params.product.Entity.ParentEntityType==WebServices.EntityNo)){
                }else{
                    if(selectedDate!=undefined)
                        setAdditionalInfo({
                        displayname:'date',
                        data:selectedDate.toISOString().split('T')[0]
                    })
                }
            }
            onFocus();
        }
    },[selectedDate])
    
    // useEffect(()=>{
        //         console.log("All Produ :"+props.route.params.allproducts.length);
    //     setAllProducts(props.route.params.allproducts);   
    // },[props.route.params.allproducts])
    useEffect(()=>{
        if(!Tools.IsNull(fdate))
            {
            console.log("F"+fdate);
            var dateIn=moment(fdate).add(4,'hours')//+3gmt
            console.log("F"+dateIn);
            
            setSelectedDate(dateIn);
        }
    },[daysIn]);
    useEffect(()=>{
        i18n.locale=global.locale;
    },[global.locale])
    
    useEffect(()=>{
        if(!Tools.IsNull(fdate))
            {
            console.log("F"+fdate);
            var dateIn=moment(fdate).add(4,'hours')//+3gmt
            console.log("F"+dateIn);
            
            setSelectedDate(dateIn);
        }
    },[fdate])
    useEffect(()=>{
        // console.log("All Produ :"+state.cartItems.length);
        setAllProducts(state.cartItems);
    },[state.cartItems])
    
    useEffect(()=>{
        if(isCalendar){
            // console.log("setIsCalendar"+gotData);
            setGotData(true);
        }
    },[isCalendar])
    useEffect(()=>{
        console.log(isCalendar+"G "+gotData);
    },[gotData])
    useEffect(()=>{
        setOpened(true);
        checkProduct(params.product);
        
        // console.log("catalogProducts :"+props.route.params.catalogProducts.length);
        setcatalogProducts(props.route.params.catalogProducts);
        DeviceEventEmitter.addListener("callbackProductPage", ({p1}) => 
            callbackProductPage(p1));
        
        setPriceIn((!Tools.IsNull(params.product.Entity)?(!Tools.IsNull(params.product.Entity.PriceDateList)?params.product.Entity.PriceDateList[0].PriceList[0].Value:''):''));
        getAppHide(params.product);
        _variableIndex=checkIsVariable(params.product);
        if(_variableIndex!=-1){ //if(params.product.type==WebServices.variableCommand){
            if((!Tools.IsNull(params.product.Entity)&&!Tools.IsNull(params.product.Entity.ParentEntityType)&&params.product.Entity.ParentEntityType==WebServices.EntityNo)&&!checkCalenderProduct()){
                setGotData(false);
                fetchVarationsWp(params.product,_variableIndex,false)
                fetchPerformanceDates(params.product);
            }else{
                // fetchPerformanceDates(params.product);
                fetchVarationsWp(params.product,_variableIndex)
            }
        }else if(!Tools.IsNull(params.product.CatalogType)&&params.product.CatalogType==WebServices.FolderCatalog){
            // console.log("Folder");
            if((params.product.Nodes!=null))
                {
                setSelectedOption(params.product.Nodes[0]);
                setPriceIn(params.product.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value)
            }
            if(params.product.TemplateCode==WebServices.mediaCatalog)
                fetchMedias();
        }else {
            if((!Tools.IsNull(params.product.Entity)&&!Tools.IsNull(params.product.Entity.ParentEntityType)&&params.product.Entity.ParentEntityType==WebServices.EntityNo)&&!isCalendar){
                console.log("Calender");
                fetchPerformanceDates(params.product);
            }else{
                console.log("setTimeout");
                setTimeout(() => {
                    setGotData(true);
                }, 200);
            }
        }
        Tools.updateRatePoints(1);
        setTimeout(() => {
            setTest(1);
            // console.log("Set");
            // render()
        }, 1000);
        // willFocus=props.navigation.addListener('focus',()=>{
            //     onFocus();
        // })
        // setIsInformative(checkInformativeProduct(params.product));
        return()=>{
            DeviceEventEmitter.removeAllListeners("callbackProductPage", ({p1}) => 
                callbackProductPage(p1));
        }
    },[])
    useFocusEffect(
        React.useCallback(()=>{
            onFocus();
        },[])
    )
    const onFocus=()=>{
        const{params}=props.route;
        
        if((!Tools.IsNull(params.product.Entity)&&!Tools.IsNull(params.product.Entity.ParentEntityType)&&params.product.Entity.ParentEntityType==WebServices.EntityNo)){
            console.log(Tools.IsNull(tmpSelectedDate)?"":tmpSelectedDate.format('YYYY-MM-DD')+" D:"+Tools.IsNull(selectedDate)?"":selectedDate.format('YYYY-MM-DD'));
            
            getallTimingsofPerformances(params.product.Entity.ProductId,params.product.Entity.ParentEntityId,Tools.IsNull(selectedDate)?"":selectedDate.format('YYYY-MM-DD'),checkIsVariable(params.product)!=-1?0:5);
            setSelectedPerformance(null);
            setGotData(false);
        }
        if((!Tools.IsNull(params.product.EntityType)&&params.product.EntityType==WebServices.EntityNo)){
            getallTimingsofPerformances(params.product.Nodes[0].Entity.ProductId,params.product.Nodes[0].Entity.ParentEntityId,Tools.IsNull(selectedDate)?"":selectedDate.format('YYYY-MM-DD'),params.product.EntityType,5);
            setGotData(false);
            console.log("onFocus")
            
        }
        setTimeout(() => {
            setBottomBar(0);
        },600);
    }
    
    
    useEffect(()=>{
        if(!Tools.IsNull(eventId)){
            checkCalendarEvents();
        }
    },[eventId])
    
    useEffect(()=>{
        if(!Tools.IsNull(calendarEventsIn)){
            console.log(JSON.stringify(calendarEventsIn));
            getValidEventDays();
        }
    },[calendarEventsIn]);
    
    
    const getValidPerformanceDays=(_DateList)=>{
        // console.log(selectedDate+"getValidPerformanceDays"+JSON.stringify(_DateList));
        currentYear=null;
        daysList={};
        var firstdate=null;
        currentDateAvail=false;
        if(!Tools.IsNull(_DateList)){
            for (let index = 0; index < _DateList.length; index++) {
                const element = _DateList[index];
                _dateIn= moment(new Date(element.Date));
                if(firstdate==null){
                    firstdate=CalendarUtils.getCalendarDateString(new Date(_dateIn));
                    var dateInFDate=moment(firstdate);//.add(4,'hours')//+3gmt
                    if(_dateIn.format('YYYY-MM-DD')==(Tools.IsNull(dateInFDate)?"":dateInFDate.format('YYYY-MM-DD'))){
                        daysList[CalendarUtils.getCalendarDateString(new Date(_dateIn))]={disabled:false,selected:true,inactive:false ,disableTouchEvent: false};
                    }
                }
                
                if(!Tools.IsNull(selectedDate)&&_dateIn.format('YYYY-MM-DD')==(selectedDate).format('YYYY-MM-DD')){
                    daysList[CalendarUtils.getCalendarDateString(new Date(_dateIn))]={disabled:false,selected:true,inactive:false ,disableTouchEvent: false};
                }else{
                    daysList[CalendarUtils.getCalendarDateString(new Date(_dateIn))]={disabled:false,inactive:false ,disableTouchEvent: false};
                }
            }
        }
        setDays(daysList);
        setFirstDate(firstdate);
        
    }
    
    const getValidEventDays=()=>{
        console.log("getValidEventDays");
        
        currentYear=null;
        daysList={};
        var firstdate=null;
        currentDateAvail=false;
        if(!Tools.IsNull(calendarEventsIn)){
            for (let index = 0; index < calendarEventsIn.length; index++) {
                const element = calendarEventsIn[index];
                _dateIn= moment(new Date(element.DateTimeFrom)).add(4,'hours');
                if(firstdate==null){
                    firstdate=CalendarUtils.getCalendarDateString(new Date(_dateIn));
                    var dateInFDate=moment(firstdate).add(4,'hours')//+3gmt
                    if(_dateIn.format('YYYY-MM-DD')==(Tools.IsNull(dateInFDate)?"":dateInFDate.format('YYYY-MM-DD'))){
                        daysList[CalendarUtils.getCalendarDateString(new Date(_dateIn))]={disabled:false,selected:true,inactive:false ,disableTouchEvent: false};
                    }
                    setFirstDate(firstdate);
                }
                // console.log("F D "+firstdate);
                
                if(_dateIn.format('YYYY-MM-DD')==(Tools.IsNull(selectedDate)?"":selectedDate.format('YYYY-MM-DD'))){
                    daysList[CalendarUtils.getCalendarDateString(new Date(_dateIn))]={disabled:false,selected:true,inactive:false ,disableTouchEvent: false};
                }else{
                    daysList[CalendarUtils.getCalendarDateString(new Date(_dateIn))]={disabled:false,inactive:false ,disableTouchEvent: false};
                }
            }
        }
        setDays(daysList);
    }
    const checkCalendarEvents=()=>{
        currentDate=moment(new Date())
        
        JsonData={
            "Command": "Search",
            "Search": {
                "SearchRecap": {
                    "PagePos": 1,
                    "RecordPerPage": 50
                },
                "EventId": eventId,
                "SellableDateTimeFrom": currentDate.format("YYYY-MM-DD\THH:mm:ss"),
                "PerformanceStatus":2,
                "SellableOnly": true,
            }
        }
        console.log("Req :"+JSON.stringify(JsonData));
        
        fetch (WebServices.MainURL+WebServices.checkPerformances,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(JsonData)
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            // console.log("R :"+responseJson);
            var responseObj=JSON.parse(responseJson);
            // console.log("ALL : "+allItems.length);
            if(!Tools.IsNull(responseObj.Answer.Search.TotalRecordCount)&&responseObj.Answer.Search.TotalRecordCount>0){
                setCalendarEventsIn(responseObj.Answer.Search.PerformanceList);
            }else{
            }
        }).catch((error) =>{
            // console.log("checkCalendarEvents "+ error);
        });
        
    }
    
    
    useEffect(()=>{
        if(calendarId!=null){
            checkCalendar();
        }
    },[calendarId])
    
    useEffect(()=>{
        if(!Tools.IsNull(calendarIn)&&!Tools.IsNull(calendarIn.CalendarName)){
            // console.log(calendarIn.CalendarName);
            getValidDays();
        }
    },[calendarIn]);
    
    
    
    const getValidDays=()=>{
        currentYear=null;
        daysList={};
        var firstdate=null;
        currentDateAvail=false;
        if(!Tools.IsNull(calendarIn.YearList)){
            for (let index = 0; index < calendarIn.YearList.length; index++) {
                const element = calendarIn.YearList[index];
                if(element.Year>=new Date().getFullYear())
                    {
                    currentYear=element;
                    // console.log(new Date().getFullYear()+"Year :"+currentYear.Year);
                    if(!Tools.IsNull(currentYear)){
                        for (let index1 = 0; index1 < currentYear.MonthList.length; index1++) {
                            const elementMonth = currentYear.MonthList[index1];
                            if(elementMonth.Month>new Date().getMonth()){
                                // console.log(elementMonth.DayList.length+" Month :"+elementMonth.Month);
                                for (let index2 = 0; index2 < elementMonth.DayList.length; index2++) {
                                    // const elementDay = elementMonth.DayList[index2];
                                    indexDay=elementMonth.DayList[index2].Day;
                                    if(new Date(currentYear.Year,elementMonth.Month-1,indexDay+1)>=new Date())
                                        {
                                        if(firstdate==null){
                                            firstdate=CalendarUtils.getCalendarDateString(new Date(currentYear.Year,elementMonth.Month-1,indexDay));
                                        }
                                        if(new Date(currentYear.Year,elementMonth.Month-1,indexDay+1).toISOString().split('T')[0]==new Date().toISOString().split('T')[0]){
                                            firstdate=CalendarUtils.getCalendarDateString(new Date(currentYear.Year,elementMonth.Month-1,indexDay));
                                            currentDateAvail=true;
                                        }
                                        var dateS=CalendarUtils.getCalendarDateString(new Date(currentYear.Year, elementMonth.Month-1,indexDay));
                                        if(!Tools.IsNull(selectedDate)){
                                            // console.log(dateS+"=="+selectedDate.format('YYYY-MM-DD'));
                                            daysList[dateS]={disabled:false,selected:((dateS==(selectedDate.format('YYYY-MM-DD')))?true:false),inactive:false ,disableTouchEvent: false};
                                        }else{
                                            daysList[dateS]={disabled:false,inactive:false ,disableTouchEvent: false};
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        setFirstDate(firstdate);
        setDays(daysList);
        // if(!currentDateAvail){
        //     daysList[new Date().toISOString().split('T')[0]]= {
        //         disabled: true,
        //         disableTouchEvent: true,
        //     };
        // }
        // setCallbackReg(
        //   ()=>{
            //     console.log("firstdate : "+fdate);
        //     dateIn=moment(fdate).add(4,'hours')//+3gmt
        //     if(fdate!=null)
        //         setSelectedDate(dateIn);
        // });
        
    }
    
    const checkCalendar=()=>{
        if(calendarId==null){
            return;
        }
        // console.log(moment(new Date(), 'YYYY-MM-DD\THH:mm:ss', true).format("YYYY-MM-DD")+'getallTimingsofcheckCalendar'+calendarId);
        
        
        JsonData={
            "Command": "LoadEntCalendar",
            "LoadEntCalendar": {
                "CalendarId": calendarId
            }
        }
        
        fetch (WebServices.MainURL+WebServices.loadCalendar,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(JsonData)
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            // console.log("LoadEntCalendar"+responseJson);
            var responseObj=JSON.parse(responseJson);
            if(!Tools.IsNull(responseObj.Answer.LoadEntCalendar)&&!Tools.IsNull(responseObj.Answer.LoadEntCalendar.Calendar)){
                setCalendar(responseObj.Answer.LoadEntCalendar.Calendar);
            }else{
                
            }
        }).catch((error) =>{
            // console.log("Media "+ error);
        });
        
    }
    const getAppHide=(_product)=>{
        if(Tools.IsNull(_product.Entity)){
            return;
        }
        alltags=_product.Entity.TagNames.split(',');
        // console.log(_product.Entity.ProductName+""+alltags);
        
        for (let index = 0; index < alltags.length; index++) {
            const element = alltags[index];
            if(Tools.stringIsContains(element,WebServices.AppHide)){
                // console.log(_product.Entity.ProductName+""+element);
                setAppHide(true);
                return
            }
        }
    }
    const getAllBadges=(_product,corner=false)=>{
        var localCheck=Tools.stringIsContains(i18n.locale,"ar")?false:true;
        allImages=[];
        if(Tools.IsNull(_product.Entity)){
            return;
        }
        alltags=_product.Entity.TagNames.split(',');
        for (let index = 0; index < alltags.length; index++) {
            const element = alltags[index];
            
            if(Tools.stringIsContains(element,WebServices.AppIcon)){
                // console.log(_product.Entity.ProductName+""+element);
                allImages.push(<View>
                    <FastImage
                    style={[styles.productImage,Tools.stringIsContains(global.locale,'ar')?{
                        left:-1*widthPercentageToDP(77),
                    }:{
                        right:0,
                    },{
                        width:widthPercentageToDP(25),
                        height:widthPercentageToDP(9),
                    }]}
                    source={{
                        uri: WebServices.MainURL+WebServices.AppIconUrl.replace("{file}",element.replace(WebServices.AppIcon,"")+"_"+(Tools.stringIsContains(i18n.locale,'ar')?'ar':'en')),
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    />
                    </View>)
                }
            }
            return <View style={[{position:'absolute',top:heightPercentageToDP(1)},localCheck?{end:corner?widthPercentageToDP(-1):widthPercentageToDP(0.5)}:{start:corner?widthPercentageToDP(-1):widthPercentageToDP(-0.1)}]}>{allImages}</View>;
        }
        
        const getInfo=()=>{
            const{params}=props.route;
            // if(!Tools.IsNull(SelectedOption))
            // console.log("HTML : "+JSON.stringify(SelectedOption))
            
            return(
                <Modal transparent={true} visible={infoModal}>
                <View style={{position:'absolute',
                    backgroundColor:Colors.transparentBlack,justifyContent:'center',
                    width:widthPercentageToDP(100),height:heightPercentageToDP(100)
                }}>
                <BlurView
                style={{position:'absolute',width:'100%',height:'100%'}}
                blurType="light"
                blurAmount={5}
                reducedTransparencyFallbackColor={Colors.transparentBlack}/>
                <View style={{
                    backgroundColor:Colors.bgColor,
                    justifyContent:'center',alignSelf:'center', borderRadius:widthPercentageToDP(4),
                    width:widthPercentageToDP(90),height:heightPercentageToDP(75),overflow:'hidden'
                }}>
                
                <ScrollView 
                showsVerticalScrollIndicator={false}
                style={{ margin:widthPercentageToDP(3),backgroundColor:Colors.bgColor,width:'93%',
                    height:'100%',alignSelf:'center'}}>
                    {!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog &&!Tools.IsNull(SelectedOption)&&!Tools.IsNull(SelectedOption.Entity.RichDescList)&&<>
                        <RenderHtml
                        // emSize={10}  
                        defaultTextProps={{allowFontScaling:false}}
                        enableExperimentalMarginCollapsing={true}
                        // fallbackFonts='Cairo-Regular'
                        systemFonts={systemFonts} 
                        baseStyle={{
                            includeFontPadding:false,
                            textAlign:'left',fontFamily:'Cairo-Regular',
                            fontSize:widthPercentageToDP(3.5),
                            // lineHeight:widthPercentageToDP(3.5)*1.4,
                            // marginTop:-heightPercentageToDP(0.02),
                            marginBottom:-heightPercentageToDP(0.15),
                            color:Colors.black,
                        }}
                        GenericPressable={ (evt, href) => {
                            if(Tools.stringIsContains(href,WebServices.appurl)){
                            }else{
                                Linking.openURL(href); 
                            }}}
                            tagsStyles={{
                                p: {
                                    fontSize:widthPercentageToDP(3.5),
                                    lineHeight:widthPercentageToDP(6),
                                    marginTop:-heightPercentageToDP(0.02),
                                    marginBottom:-heightPercentageToDP(0.15),
                                    color:Colors.black,
                                    width:'100%',
                                },
                            }}
                            
                            contentWidth={width}
                            source={{ html: (gettranslatedVersion(SelectedOption.Entity.RichDescList).Description.replace(/\\n/g,"<br />"))}}
                            />
                            </>}
                            {!Tools.IsNull(params.product.Entity)&& params.product.Entity.RichDescList!=null&&params.product.Entity.RichDescList.length>0&&
                                <RenderHtml
                                // emSize={10}  
                                defaultTextProps={{allowFontScaling:false}}
                                enableExperimentalMarginCollapsing={true}
                                // fallbackFonts='Cairo-Regular'
                                systemFonts={systemFonts} 
                                baseStyle={{
                                    textAlign:'left',fontFamily:'Cairo-Regular',
                                    fontSize:widthPercentageToDP(3.5),
                                    // lineHeight:widthPercentageToDP(3.5)*1.4,
                                    // marginTop:-heightPercentageToDP(0.02),
                                    marginBottom:-heightPercentageToDP(0.15),
                                    color:Colors.black,
                                }}
                                GenericPressable={ (evt, href) => {
                                    if(Tools.stringIsContains(href,WebServices.appurl)){
                                    }else{
                                        Linking.openURL(href); 
                                    }}}
                                    tagsStyles={{
                                        p: {
                                            fontSize:widthPercentageToDP(3.5)
                                            ,lineHeight:widthPercentageToDP(5.5),
                                            marginTop:-heightPercentageToDP(0.02),
                                            marginBottom:-heightPercentageToDP(0.15),
                                            color:Colors.black,
                                            width:'100%',
                                        },
                                    }}
                                    
                                    contentWidth={width}
                                    source={{ html: (gettranslatedVersion(params.product.Entity.RichDescList).Description.replace(/\\n/g,"<br />"))}}
                                    
                                    />}
                                    <RenderHtml
                                    defaultTextProps={{allowFontScaling:false}}
                                    baseStyle={{
                                        textAlign:'left',fontFamily:'Cairo-Regular',
                                        fontSize:widthPercentageToDP(3.5),
                                        lineHeight:widthPercentageToDP(5.5),
                                        marginTop:-heightPercentageToDP(0.02),
                                        marginBottom:-heightPercentageToDP(0.15),
                                        color:Colors.black,
                                    }}
                                    GenericPressable={ (evt, href) => {
                                        if(Tools.stringIsContains(href,WebServices.appurl)){
                                        }else{
                                            Linking.openURL(href); 
                                        }}}
                                        tagsStyles={{
                                            p: {
                                                fontSize:widthPercentageToDP(3.5)
                                                ,lineHeight:widthPercentageToDP(5.5),
                                                marginTop:-heightPercentageToDP(0.02),
                                                marginBottom:-heightPercentageToDP(0.15),
                                                color:Colors.black,
                                                width:'100%',
                                            },
                                        }}
                                        // fallbackFonts='Cairo-Regular'
                                        systemFonts={systemFonts} 
                                        // onLinkPress={ (evt, href) => { Linking.openURL(href); }}
                                        contentWidth={width}
                                        source={{ html: params.product.description}}
                                        
                                        /></ScrollView>
                                        
                                        <TouchableOpacity onPress={()=>{
                                            setInfoModal(false);
                                        }} style={{backgroundColor:Colors.bluelightShadeColor, position:'absolute',
                                            width:widthPercentageToDP(8),justifyContent:'center',alignSelf:'flex-end',
                                            end:widthPercentageToDP(3), top:widthPercentageToDP(3),
                                            height:widthPercentageToDP(8),borderRadius:widthPercentageToDP(8)}}>
                                            <Text style={{alignSelf:'center',includeFontPadding:false,textAlignVertical:'center',color:Colors.whiteColor,fontWeight:'500',fontSize:widthPercentageToDP(5),transform:[{scaleX:1.25}]}}>X</Text></TouchableOpacity>
                                            </View></View>
                                            </Modal>
                                        )
                                        
                                    }
                                    const fetchMedias=()=>{
                                        const{params}=props.route;
                                        // console.log(params.accessToken.MemberID+"-params-"+JSON.stringify(params.accessToken))
                                        if(Tools.IsNull(profile)||Tools.IsNull(params.accessToken)||Tools.IsNull(params.accessToken.MemberID)){
                                            // console.log("GD : "+gotData);
                                            setGotData(true);
                                            return;
                                        }
                                        // else{
                                        //     setMediaIds(profile.Medias);
                                        
                                        // //     console.log("media ids :"+JSON.stringify(profile.Medias));
                                        // //    console.log(product.parkType);
                                        // //    console.log("media ids :"+JSON.stringify(profile.Medias));
                                        
                                        //     _mediaIds=profile.Medias.filter((_media)=>Tools.stringIsContains(_media.Location.toLowerCase(),product.parkType.toLowerCase()))
                                        //     setShowdropIcon(_mediaIds.length>0)
                                        //     setGotData(true);
                                        //     return;
                                        // }
                                        var orders=WebServices.getMedias.replace("{MemberID}",params.accessToken.MemberID)
                                        fetch (WebServices.MainURL+orders,{
                                            method: 'GET',
                                            headers: {
                                                'Authorization':'Bearer '+params.accessToken.access_token,
                                                'Content-Type': 'application/json',
                                            },
                                        },5000)
                                        .then((response) => response.text())
                                        .then((responseJson) => {
                                            // console.log("R : "+responseJson);
                                            if(Tools.stringIsContains(responseJson,'denied')){
                                                if(props.assignProfile!=null){
                                                    props.assignProfile("user",'','',(_memberID,_access) =>{fetchMedias()})
                                                }
                                                return;
                                            }
                                            var responseObj=JSON.parse(responseJson);
                                            if(Tools.stringIsEmpty(responseObj.Error)){
                                                setMediaIds(responseObj.Medias);
                                                // console.log(params.catalogName.CatalogName+":"+_mediaIds.length);
                                                _mediaIds=responseObj.Medias.filter((_media)=>Tools.stringIsContains(_media.Location.toLowerCase(),product.parkType.toLowerCase()));
                                                // .replace(" ",''),params.catalogName.CatalogName.toLowerCase()))
                                                setShowdropIcon(_mediaIds.length>0);
                                                setGotData(true);
                                                
                                            }else if(Tools.stringIsContains(responseObj.Error,"no media")){
                                                setGotData(true);
                                            }
                                        }).catch((error) =>{
                                            // console.log("Media "+ error);
                                        });
                                    }
                                    
                                    const fetchVarationsWp=(_productIn,_variableIndex,updatedata=true)=>{
                                        setTimeout(() => {
                                            setVariations(_productIn.Entity.AttributeItemList[_variableIndex]);
                                            setGotData(updatedata);
                                            // console.log("fetchVarationsWp"+JSON.stringify(_productIn.Entity.AttributeItemList[_variableIndex].OptionList[0]));
                                            // console.log("fetchVarationsWp Price"+(_productIn.Entity.PriceDateList[0].PriceList[0].Value+_productIn.Entity.AttributeItemList[_variableIndex].OptionList[0].OptionalPrice));
                                            setSelectedVariation(_productIn.Entity.AttributeItemList[_variableIndex].OptionList[0]);
                                            setPriceIn(_productIn.Entity.PriceDateList[0].PriceList[0].Value+_productIn.Entity.AttributeItemList[_variableIndex].OptionList[0].OptionalPrice);
                                            setAdditionalInfo({
                                                "displayname":_productIn.Entity.AttributeItemList[_variableIndex].OptionList[0].AttributeItemName,
                                                "type":WebServices.variableCommand,"data":_productIn.Entity.AttributeItemList[_variableIndex].OptionList[0]})
                                            }, 100);
                                            
                                        }
                                        const getallCards=(_parkType)=>{
                                            if(Tools.IsNull(_parkType)){
                                                return [];
                                            }
                                            allCards=[];
                                            console.log(_parkType+'Loc '+MediaIds[0].Location.toLowerCase());
                                            _mediaIds=MediaIds.filter((_media)=>Tools.stringIsContains(_media.Location.toLowerCase(),_parkType.toLowerCase()))
                                            
                                            for (let index = 0; index < _mediaIds.length; index++) {
                                                const element = _mediaIds[index];
                                                console.log(JSON.stringify(element));
                                                const _mediacode=element.MediaCodes.length>0?element.MediaCodes[0].Code:'' ;
                                                const _mediabalance=element.WalletSlots.length>0?element.WalletSlots[0].Balance:''+0 ;
                                                // console.log(_mediabalance+' * '+_mediacode);
                                                
                                                allCards.push(<TouchableOpacity onPress={()=>{
                                                    _element=element;
                                                    setShowError(false);
                                                    setValueText(_mediacode);
                                                    // cardNumberInputRef.current.setNativeProps({ text: _mediacode});
                                                    checkMediaCard('',_element.MediaCodes[0].Code);
                                                    setShowDrop(false);
                                                }} style={{flexDirection:'row',alignSelf:'center',justifyContent:'center',padding:10}}>
                                                <Text allowFontScaling={false} style={styles.cardNumberDrop}>{_mediacode}*XXX - {_mediabalance} QAR</Text>
                                                </TouchableOpacity>)
                                            }
                                            return allCards;
                                        }
                                        const setShowInfoIn=(DataIn)=>{
                                            dispatch({
                                                type:'update_ShowInfo',
                                                payload:DataIn
                                            })
                                        }
                                        const checkMediaCard=(_cardNumber,_value='')=>{
                                            setValidation(0);
                                            setGotData(false);
                                            // console.log("checkMediaCard")
                                            _cardNumber=Tools.stringIsEmpty(_value)?_cardNumber.nativeEvent.text:_value;
                                            _cardNumber=_cardNumber.substring(0, 10);
                                            if(_cardNumber.length<10||Tools.stringIsContains(_cardNumber,'*')){
                                                setGotData(true);
                                                setShowInfoIn({"textToDisplay":i18n.t("invalidplaycard")});
                                                return;
                                            }
                                            var bodyData={
                                                "ShopcartId":"",
                                                "MediaCode":_cardNumber
                                            }
                                            
                                            // console.log(JSON.stringify(bodyData));
                                            fetch (WebServices.MainURL+WebServices.searchMedia,{
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body:JSON.stringify(bodyData)
                                            },5000)
                                            .then((response) => response.text())
                                            .then((responseJson) => {
                                                setGotData(true);
                                                // console.log("checkMediaCard"+ responseJson);
                                                dataIn=JSON.parse(responseJson);
                                                if(Tools.stringIsEmpty(dataIn.Error)){
                                                    var _info={"displayname":_cardNumber,"type":WebServices.topupCommand,"data": dataIn};
                                                    setMediaCode(_cardNumber);
                                                    setValidation(1);
                                                    setMediaDetails(_info);
                                                    setAdditionalInfo(_info);
                                                }else{
                                                    setMediaCode('');
                                                    setValidation(-1);
                                                    setShowError(true);
                                                    setShowInfoIn({"textToDisplay":i18n.t("invalidplaycard")})
                                                }
                                            })
                                        }
                                        const getcategory=(_catergories)=>{
                                            for (let index = 0; index < _catergories.length; index++) {
                                                if(Tools.stringIsContains(_catergories[index].name,'theme')){
                                                    return _catergories[index].name;
                                                }
                                            }
                                            return '';
                                        }
                                        const getOthercategory=(_catergories)=>{
                                            for (let index = 0; index < _catergories.length; index++) {
                                                if(Tools.stringIsContains(_catergories[index].name,'theme')){
                                                    if(_catergories.length>1)
                                                        return _catergories[index==0?1:0];
                                                    else
                                                    return _catergories[0];
                                                }
                                            }
                                            return null;
                                        }
                                        
                                        const removeHtml=(_textIn)=>{
                                            const regex=/<[^>]*>/ig;
                                            _textIn= _textIn.replace(regex,'');
                                            const regex2=/((&nbsp;))*/gmi;
                                            return _textIn.replace(regex2,'').replaceAll('&amp;','&').trim();
                                        }
                                        const getEventProducts=(_product)=>{
                                            let allAttributes=[];
                                            let allItems=[];
                                            if(!Tools.IsNull(sellableProducts)){
                                                for (let index = 0; index < sellableProducts.length; index++) {
                                                    const element = sellableProducts[index];
                                                    const words = element.ProductName.split(' ');
                                                    {
                                                        // const elementOption = element.PriceDateList[0].PriceList[0];
                                                        allItems.push(<TouchableOpacity onPress={()=>{
                                                            // console.log("I : "+index);
                                                            setSelectedOption(_product.Nodes[index]);
                                                            var _currentNode=_product.Nodes[index];
                                                            // setState({AdditionalInfo:{"displayname":elementOption.Value,
                                                            // "type":WebServices.topupCommand,"data":_product.Nodes[index]}})
                                                            if(!Tools.IsNull(sellableProducts)){
                                                                for (let index = 0; index < sellableProducts.length; index++) {
                                                                    const element = sellableProducts[index];
                                                                    if(_currentNode.Entity.ProductId==sellableProducts[index].ProductId){
                                                                        console.log("I : "+index);
                                                                        
                                                                        setPriceIn(sellableProducts[index].Price);
                                                                        index=1000;
                                                                    }
                                                                }
                                                            }else{
                                                                // setState({priceIn:elementOption.Value});
                                                            }
                                                        }} style={[{borderRadius:widthPercentageToDP(3),margin:4,padding:heightPercentageToDP(0.5),justifyContent:'center',
                                                        },SelectedOption!=null&&
                                                        SelectedOption.Entity.ProductId==element.ProductId?
                                                        {
                                                            backgroundColor:Colors.tealDark,
                                                        }:
                                                        {
                                                            backgroundColor:Colors.bgColor,
                                                        }]}>
                                                        <Text allowFontScaling={false} style={[styles.attributes,SelectedOption!=null&&
                                                            SelectedOption.Entity.ProductId==element.ProductId?
                                                            {
                                                                color:Colors.whiteColor
                                                            }:{
                                                                color:Colors.inputfontColor
                                                            }]}>{words[2]}</Text>
                                                            </TouchableOpacity>)
                                                        }
                                                    }
                                                }
                                                
                                                allAttributes.push(
                                                    <View>
                                                    <Text allowFontScaling={false} style={styles.eachTitle}>
                                                    {i18n.t("guests")}
                                                    </Text>
                                                    <View horizontal showsHorizontalScrollIndicator={false} style={{flexDirection:'row',flexWrap: "wrap",
                                                        width:widthPercentageToDP(72),}}>
                                                        {allItems}
                                                        </View>
                                                        </View>
                                                    )
                                                    return allAttributes;
                                                }
                                                const getFolderProducts=(_product)=>{
                                                    allAttributes=[];
                                                    allItems=[];
                                                    
                                                    for (let index = 0; index < _product.Nodes.length; index++) {
                                                        const element = _product.Nodes[index].Entity;
                                                        {
                                                            const elementOption = element.PriceDateList[0].PriceList[0];
                                                            allItems.push(<TouchableOpacity onPress={()=>{
                                                                // console.log("AT :"+JSON.stringify(_product.Nodes[index]));
                                                                setSelectedOption(_product.Nodes[index]);
                                                                setPriceIn(elementOption.Value);
                                                            }} style={[{borderRadius:widthPercentageToDP(3),margin:4,padding:heightPercentageToDP(0.5),justifyContent:'center',
                                                            },SelectedOption!=null&&
                                                            SelectedOption.Entity.ProductId==element.ProductId?
                                                            {
                                                                backgroundColor:Colors.tealDark,
                                                            }:
                                                            {
                                                                backgroundColor:Colors.bgColor,
                                                            }]}>
                                                            <Text allowFontScaling={false} style={[styles.attributes,SelectedOption!=null&&
                                                                SelectedOption.Entity.ProductId==element.ProductId?
                                                                {
                                                                    color:Colors.whiteColor
                                                                }:{
                                                                    color:Colors.inputfontColor
                                                                }]}>{elementOption.Value}</Text>
                                                                </TouchableOpacity>)
                                                            }
                                                        }
                                                        
                                                        allAttributes.push(
                                                            <View>
                                                            <Text allowFontScaling={false} style={styles.eachTitle}>
                                                            {getTranslatedCatalogName(_product)}
                                                            </Text>
                                                            <View horizontal showsHorizontalScrollIndicator={false} style={{flexDirection:'row',flexWrap: "wrap",
                                                                width:widthPercentageToDP(72),}}>
                                                                {allItems}
                                                                </View>
                                                                </View>
                                                            )
                                                            return allAttributes;
                                                        }
                                                        const getAttribute=(_product)=>{
                                                            for (let index = 0; index < _product.Entity.AttributeItemList.length; index++) {
                                                                const element = _product.Entity.AttributeItemList[index];
                                                                allItems=[];
                                                                if(element.Active&&element.SelectionType==3){
                                                                    if(element.OptionList[0].ITL_AttributeItemName!=null&&element.OptionList[0].ITL_AttributeItemName.length>0){
                                                                        const elementOption = element.OptionList[0];
                                                                        return elementOption;
                                                                    }
                                                                }
                                                            }
                                                            return undefined;
                                                        }
                                                        
                                                        const getAllAttributes=(_product)=>{
                                                            allAttributes=[];
                                                            for (let index = 0; index < _product.Entity.AttributeItemList.length; index++) {
                                                                const element = _product.Entity.AttributeItemList[index];
                                                                allItems=[];
                                                                if(element.Active&&element.SelectionType==3){
                                                                    for (let i = 0; i < element.OptionList.length; i++) {
                                                                        if(element.OptionList[i].ITL_AttributeItemName!=null&&element.OptionList[i].ITL_AttributeItemName.length>0){
                                                                            const elementOption = element.OptionList[i];
                                                                            if(elementOption!=null&&elementOption.AttributeItemId!=null&&elementOption.AttributeItemId.length>0){
                                                                                allItems.push(<TouchableOpacity key={i+"TO"} onPress={()=>{
                                                                                    var itemIn=i;
                                                                                    // console.log("AT :"+JSON.stringify(elementOption));
                                                                                    setSelectedVariation(elementOption);
                                                                                    var _addedInfo=AdditionalInfo;
                                                                                    _addedInfo.displayname="Variable";
                                                                                    _addedInfo.type=WebServices.variableCommand;
                                                                                    _addedInfo.data=elementOption;
                                                                                    setAdditionalInfo(_addedInfo);
                                                                                    setPriceIn(_product.Entity.PriceDateList[0].PriceList[0].Value+elementOption.OptionalPrice);
                                                                                }} style={[{backgroundColor:Colors.bgColor, borderRadius:widthPercentageToDP(3),padding:5,margin:4,
                                                                                },SelectedVariation!=null&&
                                                                                SelectedVariation.AttributeItemId==elementOption.AttributeItemId?
                                                                                {
                                                                                    backgroundColor:Colors.tealDark,
                                                                                }:
                                                                                {
                                                                                    backgroundColor:Colors.bgColor,
                                                                                }]}>
                                                                                <Text allowFontScaling={false} style={[styles.attributes,{paddingHorizontal:widthPercentageToDP(2),},SelectedVariation!=null&&
                                                                                    SelectedVariation.AttributeItemId==elementOption.AttributeItemId?
                                                                                    {
                                                                                        fontFamily:'Cairo-Bold',
                                                                                        color:Colors.whiteColor
                                                                                    }:{
                                                                                        color:Colors.inputfontColor
                                                                                    }]}>{Tools.stringIsContains(element.AttributeCode,"players")?elementOption.AttributeItemName.replace(" Players",""):elementOption.AttributeItemName}</Text>
                                                                                    </TouchableOpacity>)
                                                                                }
                                                                            }
                                                                        }
                                                                        allAttributes.push(
                                                                            <View key={"V"+allAttributes.length}>
                                                                            <Text allowFontScaling={false} style={styles.eachTitle}>
                                                                            {Tools.stringIsContains(element.AttributeCode,"players")?i18n.t('chooseplayers'):element.AttributeName}
                                                                            </Text>
                                                                            <View 
                                                                            horizontal showsHorizontalScrollIndicator={false} 
                                                                            style={{flexDirection:'row',flexWrap: "wrap",maxWidth:widthPercentageToDP(72)}}>
                                                                            {allItems}
                                                                            </View>
                                                                            </View>
                                                                        )
                                                                    }
                                                                }
                                                                return allAttributes;
                                                            }
                                                            const getTranslatedCatalogName=(_Node)=>{
                                                                // console.log('Catalog :'+JSON.stringify(_Node));
                                                                return (Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_Node.ITL_CatalogName,'ar'):getTranslation(_Node.ITL_CatalogName,'en',_Node.CatalogName))
                                                            }
                                                            const getTranslation=(_Node,_code,_default=null)=>{
                                                                if(Tools.IsNull (_Node)){
                                                                    return "";
                                                                }
                                                                for(let t=0;t<_Node.length;t++){
                                                                    // console.log("T "+JSON.stringify(_Node[t]));
                                                                    
                                                                    if(Tools.IsNull (_Node[t].LangISO)){
                                                                        
                                                                    }else
                                                                    {
                                                                        if(Tools.stringIsContains(_code,_Node[t].LangISO)){
                                                                            return _Node[t].Translation;
                                                                        }
                                                                    }
                                                                }
                                                                if(_default!=null)
                                                                    return _default;
                                                                return _Node[0].Translation;
                                                            }
                                                            const getTranslatedProductName=(_Node)=>{
                                                                var name = Tools.IsNull(_Node.Entity)?getTranslatedCatalogName(_Node):(Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_Node.Entity.ITL_ProductName,'ar'):_Node.EntityType==5?getTranslatedCatalogName(_Node):getTranslation(_Node.Entity.ITL_ProductName,'en',_Node.Entity.ProductName));
                                                                return name;
                                                            }
                                                            const getTranslatedEventProductName=(_Node)=>{
                                                                // console.log("getTranslatedEventProductName : "+JSON.stringify(_Node));
                                                                var name = Tools.IsNull(_Node.ITL_ProductName)?(_Node.ProductName):(Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_Node.ITL_ProductName,'ar'):getTranslation(_Node.ITL_ProductName,'en',_Node.ProductName));
                                                                return name;
                                                            }
                                                            const OnCartIcon=()=>{
                                                                var gotoCart=props.route.params.gotoCart;
                                                                gotoCart(false);
                                                                // DeviceEventEmitter.emit("gotoCart", {p1:false});
                                                            }
                                                            const gettranslatedVersion=(_data)=>{
                                                                arabicIn=Tools.stringIsContains(i18n.locale,'ar');
                                                                for(let t=0;t<_data.length;t++){
                                                                    console.log(i18n.locale+"/"+arabicIn+" Is Arabic "+_data[t].LangISO);
                                                                    // console.log(" Data "+JSON.stringify(_data[t]));
                                                                    
                                                                    if(arabicIn&&_data[t].LangISO=="ar"){
                                                                        return _data[t];
                                                                    }else if(!arabicIn&&_data[t].LangISO=="en"){
                                                                        return _data[t];
                                                                    }
                                                                }
                                                                return _data[0];
                                                            }
                                                            
                                                            const getFreePerformance=(_performances)=>{
                                                                for (let index = 0; index < _performances.length; index++) {
                                                                    const element = _performances[index];
                                                                    canPress=checkPerformance(element);
                                                                    console.log(index+" canPress : "+canPress);
                                                                    if(canPress)
                                                                        return index;
                                                                }
                                                                return -1;
                                                                
                                                            }
                                                            
                                                            const fetchPerformanceDates=(_product)=>{
                                                                const{params}=props.route;
                                                                // console.log('fetchPerformanceDates'+_product.Entity.ParentEntityId)
                                                                setIsFetching(true);
                                                                currentDate=moment(new Date())
                                                                dateIn=moment(new Date())
                                                                toDate=currentDate.add(1,"month")
                                                                if(dateIn.format("YYYY-MM-DD")==currentDate.format("YYYY-MM-DD")){
                                                                    currentDate=currentDate.add("1","hours");
                                                                }else{
                                                                    dataIn=dateIn.set({hour:5,minute:0,second:0,millisecond:0});
                                                                    currentDate=dateIn;
                                                                }
                                                                JsonData={
                                                                    "Command": "SearchDate",
                                                                    "SearchDate": {
                                                                        "Event":{"EventId":_product.Entity.ParentEntityId},
                                                                        "DateFrom": currentDate.format("YYYY-MM-DD"),
                                                                        "DateTo": toDate.format("YYYY-MM-DD"),
                                                                    }
                                                                }
                                                                console.log("Req :"+JSON.stringify(JsonData));
                                                                
                                                                fetch (WebServices.MainURL+WebServices.searchPerformanceDate,{
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body:JSON.stringify(JsonData)
                                                                },5000)
                                                                .then((response) => response.text())
                                                                .then((responseJson) => {
                                                                    // console.log("fetchPerformanceDates R :"+responseJson);
                                                                    setIsFetching(false);
                                                                    var responseObj=JSON.parse(responseJson);
                                                                    if(!Tools.IsNull(responseObj)&&!Tools.IsNull(responseObj.Answer)&&!Tools.IsNull(responseObj.Answer.SearchDate))
                                                                        getValidPerformanceDays(responseObj.Answer.SearchDate.DateList)
                                                                    // console.log("ALL : "+allItems.length);
                                                                    
                                                                }).catch((error) =>{
                                                                    // console.log("Media "+ error);
                                                                });
                                                                
                                                            }
                                                            
                                                            const getallTimingsofPerformances=(_productId,_eventId,_dateIn,_EntityType=0)=>{
                                                                const{params}=props.route;
                                                                var _iscalender=checkCalenderProduct()
                                                                // console.log(_iscalender+'getallTimingsofPerformances'+_productId+'/'+_eventId+'/'+_dateIn+"/"+_EntityType)
                                                                setIsFetching(true);
                                                                currentDate=moment(new Date())
                                                                dateIn=moment(new Date(_dateIn))
                                                                toDate=moment(new Date(_dateIn))
                                                                toDate=toDate.add(1,"day");
                                                                if(dateIn.format("YYYY-MM-DD")==currentDate.format("YYYY-MM-DD")){
                                                                    currentDate=currentDate.add("2","hours");
                                                                }else{
                                                                    dataIn=dateIn.set({hour:5,minute:0,second:0,millisecond:0});
                                                                    currentDate=dateIn;
                                                                }
                                                                JsonData={
                                                                    "Command": "Search",
                                                                    "Search": {
                                                                        "SearchRecap": {
                                                                            "PagePos": 1,
                                                                            "RecordPerPage": 50
                                                                        },
                                                                        "EventId": _eventId,
                                                                        "SellableDateTimeFrom":_iscalender?currentDate.format("YYYY-MM-DD"):currentDate.format("YYYY-MM-DD\THH:mm:ss"),
                                                                        "ToDateTime":_iscalender?toDate.format("YYYY-MM-DD"): toDate.format("YYYY-MM-DD\T04:59:59"),
                                                                        // "SeatMinQuantity":1,
                                                                        "PerformanceStatus":2,
                                                                        "SellableOnly": true,
                                                                        // "ReturnProducts":true,
                                                                        // "PriceProductId":_productId
                                                                    }
                                                                }
                                                                // console.log("Req :"+JSON.stringify(JsonData));
                                                                
                                                                fetch (WebServices.MainURL+WebServices.checkPerformances,{
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body:JSON.stringify(JsonData)
                                                                },5000)
                                                                .then((response) => response.text())
                                                                .then((responseJson) => {
                                                                    // console.log("R :"+responseJson);
                                                                    setIsFetching(false);
                                                                    var responseObj=JSON.parse(responseJson);
                                                                    // console.log("ALL : "+allItems.length);
                                                                    if(!Tools.IsNull(responseObj.Answer.Search.TotalRecordCount)&&responseObj.Answer.Search.TotalRecordCount>0){
                                                                        setPerformancesForVisual(responseObj.Answer.Search.PerformanceList);
                                                                        let _performances=responseObj.Answer.Search.PerformanceList.filter((data)=>{
                                                                            return Tools.stringIsEmpty(data.PerformanceDesc);
                                                                        });
                                                                        setPerformances(_performances);
                                                                        let freePerform=getFreePerformance(_performances);
                                                                        if(_EntityType!=5)
                                                                            {
                                                                            const itemIn=getAttribute(params.product);
                                                                            let _additionalInfo={"type":WebServices.variableCommand,"data":itemIn};
                                                                            if(freePerform!=-1)
                                                                                _additionalInfo.performance=_performances[freePerform];
                                                                            setAdditionalInfo(_additionalInfo);
                                                                        }
                                                                        
                                                                        if(_EntityType==5)//events
                                                                        {
                                                                            if(freePerform!=-1){
                                                                                // setSelectedOption()
                                                                                setSelectedPerformance(_performances[freePerform]);
                                                                                getSellableProduct(_performances[freePerform].PerformanceId,params.product.CatalogId);
                                                                            }
                                                                        }else{
                                                                            if(freePerform!=-1){
                                                                                // setSelectedOption()
                                                                                setSelectedPerformance(_performances[freePerform]);
                                                                                setGotData(true);
                                                                            }
                                                                        }
                                                                    }else{
                                                                        setPerformances([]);
                                                                        setPerformancesForVisual([]);
                                                                        setSellableProducts(undefined);
                                                                    }
                                                                }).catch((error) =>{
                                                                    // console.log("Media "+ error);
                                                                });
                                                                
                                                            }
                                                            
                                                            const getSellableProduct=(_performanceID,_catalogId)=>{
                                                                // console.log('getSellableProduct'+_performanceID);
                                                                setIsFetchingProducts(true);
                                                                setGotData(false);
                                                                // console.log("getSellableProduct")
                                                                
                                                                JsonData={
                                                                    "Command": "GetSellableProducts",
                                                                    "GetSellableProducts": {
                                                                        "PerformanceId":_performanceID,
                                                                        "CatalogId":_catalogId,
                                                                        // "ReturnProducts":true,
                                                                        // "PriceProductId":_productId
                                                                    }
                                                                }
                                                                // console.log("Req :"+JSON.stringify(JsonData));
                                                                
                                                                fetch (WebServices.MainURL+WebServices.checkPerformances,{
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body:JSON.stringify(JsonData)
                                                                },5000)
                                                                .then((response) => response.text())
                                                                .then((responseJson) => {
                                                                    // console.log("R :"+responseJson);
                                                                    setIsFetchingProducts(false);
                                                                    setGotData(true);
                                                                    var responseObj=JSON.parse(responseJson);
                                                                    // console.log("ALL : "+allItems.length);
                                                                    if(!Tools.IsNull(responseObj.Answer.GetSellableProducts.ProductList)&&responseObj.Answer.GetSellableProducts.ProductList.length>0){
                                                                        setSellableProducts(responseObj.Answer.GetSellableProducts.ProductList);
                                                                        
                                                                        for (let index = 0; index < responseObj.Answer.GetSellableProducts.ProductList.length; index++) {
                                                                            const element = responseObj.Answer.GetSellableProducts.ProductList[index];
                                                                            if(SelectedOption==undefined||(SelectedOption!=undefined&&element.ProductId==SelectedOption.Entity.ProductId)){
                                                                                // console.log("SO:"+JSON.stringify(SelectedOption));
                                                                                setPriceIn(element.Price+elementOption.OptionalPrice);
                                                                                index=1000;
                                                                            }
                                                                        }
                                                                    }else{
                                                                        setSellableProducts(undefined);
                                                                    }
                                                                }).catch((error) =>{
                                                                    // console.log("Media "+ error);
                                                                });
                                                                
                                                            }
                                                            const checkPerformance=(_performance)=>{
                                                                if(!Tools.stringIsEmpty(_performance.PerformanceDesc)){
                                                                    return false;
                                                                }
                                                                if(_performance.QuantityFree<=0){
                                                                    return false;
                                                                }
                                                                return true;
                                                                // else if(){
                                                                //     return false;
                                                                // }
                                                                
                                                            }
                                                            const checkInformativeProduct=(_product)=>{
                                                                if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.Entity)&&!Tools.IsNull(_product.Entity.MetaDataList)){
                                                                    const metaData=_product.Entity.MetaDataList;
                                                                    for (let index = 0; index < metaData.length; index++) {
                                                                        const element = metaData[index];
                                                                        if(Tools.stringIsContains(element.MetaFieldCode,WebServices.informative)&&(element.Value==1||element.Value=='1')){
                                                                            return true;
                                                                        }
                                                                    }
                                                                }
                                                                return false;
                                                            }
                                                            // const updateAddon=(_newValue,_index)=>{
                                                                //         var indexIn=_index;
                                                            //         var elementIn=addOnEventsIn;
                                                            //         elementIn[indexIn].selected=_newValue;
                                                            //         setAddonEventsIn(elementIn);
                                                            //         // console.log(_newValue+":"+indexIn+" addOnEventsIn "+JSON.stringify(addOnEventsIn[indexIn]));
                                                            //         // updateAddOnPrice(addOnEventsIn);
                                                            // }
                                                            const checkProduct=(_product)=>{
                                                                if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.Entity)&&!Tools.IsNull(_product.Entity.MetaDataList)){
                                                                    const metaData=_product.Entity.MetaDataList;
                                                                    for (let index = 0; index < metaData.length; index++) {
                                                                        const element = metaData[index];
                                                                        if(Tools.stringIsContains(element.MetaFieldCode,WebServices.informative)&&(element.Value==1||element.Value=='1')){
                                                                            setIsInformative(true);
                                                                        }
                                                                        if(Tools.stringIsContains(element.MetaFieldCode,WebServices.calendar)&&(element.Value==1||element.Value=='1')){
                                                                            setIsCalendar(true);
                                                                        }
                                                                        if(Tools.stringIsContains(element.MetaFieldCode,WebServices.calendarId)){
                                                                            setCalendarId(element.Value);
                                                                        }
                                                                        if(Tools.stringIsContains(element.MetaFieldCode,WebServices.calendarEvent)){
                                                                            setEventId(element.Value);
                                                                        }
                                                                        if(Tools.stringIsContains(element.MetaFieldCode,WebServices.shareurl)){
                                                                            setShareURL(element.Value);
                                                                        }
                                                                        
                                                                        // if(Tools.stringIsContains(element.MetaFieldCode,WebServices.relatedProduct)){
                                                                        //     console.log("Related : "+element.Value.split(','));
                                                                        //     // setAddonEvent(element.Value.split(','));
                                                                        //     var elements= element.Value.split(',');
                                                                        //     setrelatedProducts(element.Value.split(','));
                                                                        // }
                                                                        
                                                                    }
                                                                }
                                                            }
                                                            const checkCalenderProduct=()=>{
                                                                var _product=params.product;
                                                                if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.Entity)&&!Tools.IsNull(_product.Entity.MetaDataList)){
                                                                    const metaData=_product.Entity.MetaDataList;
                                                                    for (let index = 0; index < metaData.length; index++) {
                                                                        const element = metaData[index];
                                                                        if(Tools.stringIsContains(element.MetaFieldCode,WebServices.calendar)&&(element.Value==1||element.Value=='1')){
                                                                            return (true);
                                                                        }
                                                                        
                                                                    }
                                                                }
                                                                return false;
                                                            }
                                                            const getAllPerformances=(_EntityType=0)=>{
                                                                allItems=[];
                                                                if(performancesforvisual!=null){
                                                                    for (let index = 0; index < performancesforvisual.length; index++) {
                                                                        const element = performancesforvisual[index];
                                                                        canPress=checkPerformance(element);
                                                                        
                                                                        allItems.push(<TouchableOpacity
                                                                            disabled={!canPress}
                                                                            onPress={()=>{
                                                                                let _additionalInfo=AdditionalInfo;
                                                                                if(!Tools.IsNull(_additionalInfo)){
                                                                                    _additionalInfo.performance=element;
                                                                                    setAdditionalInfo(_additionalInfo);
                                                                                }
                                                                                setSelectedPerformance(element);
                                                                                setGotData(true);
                                                                                // console.log(element.PerformanceId);
                                                                                if(_EntityType==5)//events
                                                                                getSellableProduct(element.PerformanceId,params.product.CatalogId);
                                                                            }} style={[{justifyContent:'center',opacity:canPress?1:0.5,backgroundColor:Colors.bgColor,borderRadius:widthPercentageToDP(3),padding:5,margin:widthPercentageToDP(0.75)},selectedPerformance!=null&&
                                                                                selectedPerformance.PerformanceId==element.PerformanceId?
                                                                                {
                                                                                    backgroundColor:Colors.tealDark,
                                                                                }:
                                                                                {
                                                                                    backgroundColor:Colors.bgColor,
                                                                                }]}>
                                                                                <Text allowFontScaling={false} style={[styles.attributes,{marginTop:widthPercentageToDP(1), lineHeight:widthPercentageToDP(4)*1.4},selectedPerformance!=null&&
                                                                                    selectedPerformance.PerformanceId==element.PerformanceId?
                                                                                    {
                                                                                        fontFamily:'Cairo-Bold',
                                                                                        color:Colors.whiteColor
                                                                                    }:{
                                                                                        color:Colors.inputfontColor
                                                                                    }]}>{moment(element.DateTimeFrom, 'YYYY-MM-DD\THH:mm:ss', true).format("hh:mm")}</Text>
                                                                                    <Text allowFontScaling={false} style={[styles.attributes,{alignSelf:'center',
                                                                                        lineHeight:widthPercentageToDP(3)*1.3,fontSize:widthPercentageToDP(3)},selectedPerformance!=null&&
                                                                                        selectedPerformance.PerformanceId==element.PerformanceId?
                                                                                        {
                                                                                            fontFamily:'Cairo-Bold',
                                                                                            color:Colors.whiteColor
                                                                                        }:{
                                                                                            color:Colors.inputfontColor
                                                                                        }]}>{moment(element.DateTimeFrom, 'YYYY-MM-DD\THH:mm:ss', true).format("A")}</Text>
                                                                                        </TouchableOpacity>)
                                                                                    }
                                                                                }
                                                                                if(allItems.length==0){
                                                                                    if(!isFetching){
                                                                                        allItems.push(<Text style={styles.eachTitle}>{i18n.t('noslotavailable')}</Text>)
                                                                                    }
                                                                                }else{
                                                                                    return(
                                                                                        <View style={{marginTop:widthPercentageToDP(2),paddingBottom:heightPercentageToDP(5)}}>
                                                                                        <Text allowFontScaling={false} style={styles.eachTitle}>{i18n.t('choosetime')}</Text>
                                                                                        <View 
                                                                                        // horizontal showsHorizontalScrollIndicator={false} 
                                                                                        style={{flexDirection:'row',flexWrap: "wrap"}}>
                                                                                        {allItems}
                                                                                        </View> 
                                                                                        </View>
                                                                                        
                                                                                    )
                                                                                }
                                                                                return allItems;
                                                                            }
                                                                            const getMetaTitle=(allelements)=>{
                                                                                switch (allelements.length) {
                                                                                    case 0:
                                                                                    return i18n.t('players')
                                                                                    break;
                                                                                    case 1:
                                                                                    return i18n.t('gametime')
                                                                                    break;
                                                                                    case 2:
                                                                                    return i18n.t('age')
                                                                                    break;
                                                                                    case 3:
                                                                                    return i18n.t('difficulty')
                                                                                    break;
                                                                                    default:
                                                                                    break;
                                                                                }
                                                                                
                                                                            }
                                                                            const getMetaValue=(allelements,element)=>{
                                                                                allimages=[]
                                                                                if(allelements.length==3){
                                                                                    for (let index = 0; index < 5; index++) {
                                                                                        allimages.push(
                                                                                            <Image resizeMode='contain' style={{opacity:(index<element.Value?1:0.6),tintColor:Colors.black,
                                                                                                width:widthPercentageToDP(3),height:widthPercentageToDP(4)}} source={diffLockIcon}></Image>
                                                                                            )
                                                                                            
                                                                                        }
                                                                                        return(
                                                                                            <View style={{flexDirection:'row',width:'80%',alignSelf:'center',justifyContent:'space-between'}}>
                                                                                            {allimages}
                                                                                            </View>
                                                                                        )
                                                                                    }else{
                                                                                        return( <Text allowFontScaling={false} numberOfLines={2} style={styles.metaTxt}>{(Tools.IsNull(element.MultiLanguageText)||Tools.IsNull(element.MultiLanguageText.TransList))?element.Value
                                                                                            :element.MultiLanguageText.TransList.filter((item)=>(Tools.stringIsContains(i18n.locale,item.LangISO)))[0].Translation}</Text>)
                                                                                        }
                                                                                        
                                                                                    }
                                                                                    const getPriceInfo=(_product)=>{
                                                                                        if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.Entity)&&!Tools.IsNull(_product.Entity.MetaDataList)){
                                                                                            const metaData=_product.Entity.MetaDataList;
                                                                                            for (let index = 0; index < metaData.length; index++) {
                                                                                                const element = metaData[index];
                                                                                                // console.log(_product.Entity.ProductName+" FN-"+element.MetaFieldCode+":"+element.Value);
                                                                                                if(Tools.stringIsContains(element.MetaFieldCode,WebServices.priceInfo)){
                                                                                                    return element.Value;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        return undefined;
                                                                                    }
                                                                                    const getMetaData=(_metaData)=>{
                                                                                        allelements=[];
                                                                                        for (let index = 0; index < _metaData.length; index++) {
                                                                                            const element = _metaData[index];  
                                                                                            if(Tools.stringIsContains(element.MetaFieldCode,"app")) {
                                                                                                allelements.push(
                                                                                                    <View style={{
                                                                                                        height:widthPercentageToDP(15),
                                                                                                        justifyContent:'center',width:widthPercentageToDP(22),
                                                                                                        backgroundColor:Colors.bgColor}}>
                                                                                                        <Text allowFontScaling={false} numberOfLines={1} style={styles.metaTitle}>{
                                                                                                            getMetaTitle(allelements)
                                                                                                        }</Text>
                                                                                                        {getMetaValue(allelements,element)}
                                                                                                        </View>
                                                                                                    )
                                                                                                }
                                                                                            }
                                                                                            return(
                                                                                                <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                                                                                                {allelements}
                                                                                                </View>
                                                                                            )
                                                                                        }
                                                                                        const styles = StyleSheet.create({
                                                                                            dontText:{
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                fontSize:widthPercentageToDP(4),
                                                                                                alignSelf:'center',
                                                                                                color:Colors.black,
                                                                                            },
                                                                                            countbgL:{
                                                                                                justifyContent:'center',
                                                                                                backgroundColor:Colors.bluelightShadeColor,
                                                                                                width:widthPercentageToDP(7.5),
                                                                                            },
                                                                                            countbg:{
                                                                                                justifyContent:'center',
                                                                                                backgroundColor:Colors.bluelightShadeColor,
                                                                                                width:widthPercentageToDP(7.5),
                                                                                            },
                                                                                            attributes:{
                                                                                                maxWidth:55,
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                // fontWeight:'100',
                                                                                                // paddingTop:heightPercentageToDP(0.5),
                                                                                                textAlign:'center',
                                                                                                color:Colors.inputfontColor,includeFontPadding:false,
                                                                                                fontSize:16,
                                                                                                // lineHeight:widthPercentageToDP(4)*1.3,
                                                                                            },
                                                                                            cardNumber:{
                                                                                                color:Colors.inputfontColor,
                                                                                                fontFamily:'Cairo-Bold',
                                                                                                alignSelf:'flex-start',
                                                                                                textAlign:'left',
                                                                                                fontSize:18,includeFontPadding:false,
                                                                                            },
                                                                                            cardNumberInput:{
                                                                                                borderWidth:2,
                                                                                                borderRadius:heightPercentageToDP(5),
                                                                                                backgroundColor:Colors.bgColor,
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                color:Colors.inputfontColor,
                                                                                                fontSize:widthPercentageToDP(5),
                                                                                                textAlign:'center',
                                                                                                alignSelf:'center',
                                                                                                justifyContent:'center',
                                                                                                alignContent:'center',
                                                                                                width:widthPercentageToDP(55),
                                                                                                height:'100%',
                                                                                                includeFontPadding:'false',
                                                                                                textAlignVertical:'center',paddingVertical:5
                                                                                            },
                                                                                            shadow:{
                                                                                                shadowOffset: { width: 0, height: 3 },
                                                                                                shadowRadius: 3,
                                                                                                shadowOpacity: 0.12,
                                                                                            },
                                                                                            carttext:{
                                                                                                marginLeft:10,
                                                                                                fontFamily:'Cairo-Bold',
                                                                                                fontWeight:'200',
                                                                                                color:Colors.whiteColor,
                                                                                                fontSize:widthPercentageToDP(4.25),
                                                                                                alignSelf:'center',includeFontPadding:false
                                                                                            },
                                                                                            addCart:{
                                                                                                paddingHorizontal:widthPercentageToDP(6),
                                                                                                position:'absolute',
                                                                                                // bottom:heightPercentageToDP(2),                                                                // position:'absolute',bottom:10,
                                                                                                justifyContent:'center',alignSelf:'center',
                                                                                                borderRadius:heightPercentageToDP(4.75),
                                                                                                height:heightPercentageToDP(4.75),
                                                                                                backgroundColor:Colors.blueColor,
                                                                                                flexDirection:'row'
                                                                                            },
                                                                                            button:{
                                                                                                justifyContent:'center',alignSelf:'center',
                                                                                                borderRadius:heightPercentageToDP(4),
                                                                                                height:heightPercentageToDP(4),
                                                                                                backgroundColor:Colors.blueColor,
                                                                                            },
                                                                                            buttontxt:{
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                color:Colors.whiteColor,
                                                                                                fontSize:widthPercentageToDP(4.25),
                                                                                                paddingHorizontal:widthPercentageToDP(4),
                                                                                                alignSelf:'center',includeFontPadding:false
                                                                                            },
                                                                                            modalView:{
                                                                                                height:"100%",
                                                                                                overflow:'hidden',
                                                                                                // backgroundColor:Colors.whiteColor
                                                                                            },
                                                                                            productImageView:{
                                                                                                shadowColor: "#000",
                                                                                                shadowOffset: {
                                                                                                    width: 0,
                                                                                                    height: 3,
                                                                                                },
                                                                                                // marginTop:10,
                                                                                                marginBottom:10,
                                                                                                shadowOpacity: 0.3,
                                                                                                shadowRadius: 4.65,
                                                                                                elevation: 6,
                                                                                            },productImageBox:{
                                                                                                // borderRadius:30,
                                                                                                resizeMode:'contain',
                                                                                                overflow:'hidden',
                                                                                                alignSelf:'baseline',
                                                                                                height:widthPercentageToDP(59.2),
                                                                                                width:widthPercentageToDP(100),
                                                                                            },productImage:{
                                                                                                justifyContent:'center',
                                                                                                alignSelf:'center',
                                                                                            },addtoCart:{
                                                                                                alignSelf:'center',
                                                                                                // margin:10,
                                                                                                // alignSelf:'flex-end',
                                                                                                height:widthPercentageToDP(6),
                                                                                                width:widthPercentageToDP(6),tintColor:Colors.whiteColor,
                                                                                            },productTheme:{
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                fontWeight:'100',includeFontPadding:false,
                                                                                                // alignSelf:'center',
                                                                                                // textAlign:'center',
                                                                                                alignSelf:'flex-start',
                                                                                                fontSize:widthPercentageToDP(3.5),
                                                                                                lineHeight:widthPercentageToDP(3.5)*1.35,
                                                                                                color:Colors.black
                                                                                            },productTextTitle:{
                                                                                                width:widthPercentageToDP(65),includeFontPadding:false,
                                                                                                textAlign:'left',
                                                                                                textTransform:'uppercase',
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                fontSize:widthPercentageToDP(5),
                                                                                                lineHeight:widthPercentageToDP(5)*1.35,
                                                                                                color:Colors.black
                                                                                                
                                                                                            },warningTxt:{
                                                                                                width:widthPercentageToDP(90),includeFontPadding:false,
                                                                                                textAlign:'center',
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                fontSize:widthPercentageToDP(5),
                                                                                                lineHeight:widthPercentageToDP(5)*1.35,
                                                                                                color:Colors.warningColor
                                                                                                
                                                                                            },productText:{
                                                                                                fontFamily:'Cairo-Regular',includeFontPadding:false,
                                                                                                fontSize:widthPercentageToDP(4.5),
                                                                                                lineHeight:widthPercentageToDP(4.5)*1.35,
                                                                                                color:Colors.black,
                                                                                                // paddingTop:heightPercentageToDP(1)
                                                                                            },tagline:{
                                                                                                
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                fontWeight:'100',
                                                                                                fontSize:15,
                                                                                                color:Colors.black
                                                                                                
                                                                                            },description:{
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                fontWeight:'100',
                                                                                                fontSize:15,
                                                                                                textAlign:'justify',
                                                                                                color:Colors.black
                                                                                                
                                                                                            },addminus:{
                                                                                                color:Colors.inputfontColor,
                                                                                                fontSize:widthPercentageToDP(6),
                                                                                                alignSelf:'center',
                                                                                                height:widthPercentageToDP(8)
                                                                                            },count:{
                                                                                                // fontFamily:'Cairo-Bold',
                                                                                                // fontWeight:'200',
                                                                                                fontSize:widthPercentageToDP(5),
                                                                                                width:widthPercentageToDP(10),
                                                                                                height:50,
                                                                                                alignSelf:'center',
                                                                                                textAlign:'center',
                                                                                                color:Colors.black,
                                                                                                backgroundColor:Colors.whiteColor,
                                                                                                // borderLeftWidth:0.5,borderRightWidth:0.5
                                                                                            },
                                                                                            cardNumberDrop:{
                                                                                                
                                                                                                fontSize:widthPercentageToDP(4),includeFontPadding:false,
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                color:Colors.black
                                                                                            },metaTitle:{
                                                                                                marginTop:heightPercentageToDP(.35),includeFontPadding:false,
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                fontSize:widthPercentageToDP(4),
                                                                                                lineHeight:widthPercentageToDP(4)*1.4,
                                                                                                alignSelf:'center',
                                                                                                textAlign:'center',
                                                                                                color:Colors.tealDark,
                                                                                                textTransform:'uppercase'
                                                                                            },
                                                                                            metaTxt:{
                                                                                                flexWrap:'wrap',includeFontPadding:false,
                                                                                                fontFamily:'Cairo-Regular',
                                                                                                fontSize:widthPercentageToDP(3.3),
                                                                                                color:Colors.black,
                                                                                                alignSelf:'center',
                                                                                                textAlign:'center',
                                                                                                lineHeight:widthPercentageToDP(3.3)*1.3,
                                                                                                
                                                                                            },
                                                                                            eachTitle:{
                                                                                                alignSelf:'flex-start',includeFontPadding:false,
                                                                                                color:Colors.tealDark,fontFamily:'Cairo-Regular',
                                                                                                fontSize:widthPercentageToDP(4),includeFontPadding:false}
                                                                                                
                                                                                            });
                                                                                            
                                                                                            const addMediaInfos=(_aInfo)=>{
                                                                                                _metainfo=state.mediaInfo;
                                                                                                if(!Tools.IsNull(_aInfo)&&!Tools.IsNull(_aInfo.displayname)){
                                                                                                    _filterData=_metainfo.filter((itemIn)=>{
                                                                                                        return(itemIn.mediaNumber==_aInfo.displayname);
                                                                                                    })
                                                                                                    if(_filterData.length==0)
                                                                                                        _metainfo.push({mediaNumber:_aInfo.displayname,data:_aInfo.data});
                                                                                                }
                                                                                                // props.updateMedia(_metainfo);
                                                                                                dispatch({
                                                                                                    type:'update_Media',
                                                                                                    stateIn:_metainfo
                                                                                                })
                                                                                            }
                                                                                            const insets = useSafeAreaInsets();
                                                                                            const addDates=(_aInfo)=>{
                                                                                                if(!Tools.IsNull(params.product.Nodes)&& Tools.stringIsContains (params.product.Nodes[0].Entity.TagNames,WebServices.mediaRequire))
                                                                                                    return;
                                                                                                if(selectedDate!=undefined)
                                                                                                    setAdditionalInfo({
                                                                                                    "displayname":selectedDate.toISOString().split('T')[0]
                                                                                                });
                                                                                            }
                                                                                            const callbackProductPage=(_cartItems)=>{
                                                                                                if(_cartItems==undefined){
                                                                                                    setShowInfoIn({"textToDisplay":i18n.t("error")})
                                                                                                    return;
                                                                                                }
                                                                                                if(_cartItems==null){
                                                                                                    setshowLogin(true);
                                                                                                    return;
                                                                                                }
                                                                                                setShowInfoIn({"textToDisplay":i18n.t("addedtocart")})
                                                                                                setAllProducts(_cartItems)
                                                                                            }
                                                                                            const CartUpdateNo=(valIn)=>{
                                                                                                total=totalNo;
                                                                                                total+=valIn;
                                                                                                if(total<1)
                                                                                                    total=1;
                                                                                                setTotalNo(total)
                                                                                            }
                                                                                            const OnDoneInfo=()=>{
                                                                                                
                                                                                                setShowInfoIn(undefined);
                                                                                            }
                                                                                            const OnDone=()=>{
                                                                                                props.navigation.goBack();
                                                                                                // props.navigation.navigate('Home')
                                                                                            }
                                                                                            const OnCalenderDone=(selectedDateIn)=>{
                                                                                                if(selectedDateIn!=null){
                                                                                                    // console.log(selectedDateIn);
                                                                                                    setSelectedDate(moment(selectedDateIn).add(4,'hours'));
                                                                                                }
                                                                                                setShowCalendar(false);
                                                                                            }
                                                                                            
                                                                                            const AddRelatedProducts=()=>{
                                                                                                return(
                                                                                                    <View><FlatList 
                                                                                                    // removeClippedSubviews
                                                                                                    horizontal
                                                                                                    removeClippedSubviews={false}
                                                                                                    initialNumToRender={3}
                                                                                                    maxToRenderPerBatch={1}
                                                                                                    onEndReachedThreshold={0.1}
                                                                                                    showsVerticalScrollIndicator={false}
                                                                                                    style={{}}
                                                                                                    contentContainerStyle={{ paddingBottom:heightPercentageToDP(15)}}
                                                                                                    data={catalogProducts}
                                                                                                    renderItem={({item})=>(<TouchableOpacity onPress={()=>{
                                                                                                        props.navigation.goBack();
                                                                                                        var itemIn=item;
                                                                                                        var openProductIn=props.route.params.openProductIn;
                                                                                                        openProductIn(itemIn);
                                                                                                        setcatalogProducts([]);
                                                                                                    }} style={{marginRight:widthPercentageToDP(3)}}><FastImage
                                                                                                    style={[{alignSelf:'flex-start',
                                                                                                        
                                                                                                        borderRadius:widthPercentageToDP(2),
                                                                                                        width:widthPercentageToDP(40),
                                                                                                        marginRight:widthPercentageToDP(1),
                                                                                                        backgroundColor:Colors.whiteColor,
                                                                                                        height:widthPercentageToDP(40)},styles.shadow]}
                                                                                                        source={{
                                                                                                            uri:WebServices.MainURL+item.Entity.ProfilePictureId,
                                                                                                            priority: FastImage.priority.high,
                                                                                                        }}
                                                                                                        resizeMode={FastImage.resizeMode.contain}/>
                                                                                                        {getAllBadges(item)}
                                                                                                        <Text style={[styles.dontText,{}]}>{getTranslatedProductName(item)}</Text></TouchableOpacity>)}/></View>);
                                                                                                    }
                                                                                                    
                                                                                                    // const AddonCheckBoxes=()=>{
                                                                                                        //     checkboxes=[];
                                                                                                    //     if(Tools.IsNull(addOnEventsIn)){
                                                                                                    //         return checkboxes;
                                                                                                    //     }
                                                                                                    //     for (let index = 0; index < addOnEventsIn.length; index++) {
                                                                                                    //         const element = addOnEventsIn[index];
                                                                                                    //         var testAddon=addOnEventsIn;
                                                                                                    //         checkboxes.push(
                                                                                                    //             <View style={{flexDirection:'row',alignSelf:'flex-start',marginBottom:heightPercentageToDP(1)}}>
                                                                                                    //             <CheckBox
                                                                                                    //             onFillColor={Colors.blueColor}
                                                                                                    //             onCheckColor={Colors.whiteColor}
                                                                                                    //             onTintColor={Colors.whiteColor}
                                                                                                    //             boxType='square'
                                                                                                    //             disabled={false}
                                                                                                    //             value={Tools.IsNull(addOnEventsIn[index].selected)?false:addOnEventsIn[index].selected}
                                                                                                    //             onValueChange={(newValue) => {
                                                                                                        //                 var indexI=index;
                                                                                                    //                 updateAddon(newValue,indexI);
                                                                                                    //             }}
                                                                                                    //             />
                                                                                                    //             <Text allowFontScaling={false} style={styles.dontText}>{getTranslatedEventProductName(addOnEventsIn[index].ProductList[0]) }</Text>
                                                                                                    //             <Text allowFontScaling={false} style={[styles.dontText,{fontFamily:'Cairo-Bold'}]}>{" + "+(addOnEventsIn[index].ProductList[0].FacePrice) +" QAR"}</Text>
                                                                                                    //             </View>
                                                                                                    //         )
                                                                                                    //     }
                                                                                                    //     return checkboxes;
                                                                                                    // }
                                                                                                    // var updatePro=params.updateProfile;
                                                                                                    var Description_localized='';
                                                                                                    var short_Description_localized='';
                                                                                                    
                                                                                                    if(!Tools.stringIsEmpty(params.product.description)){
                                                                                                        // console.log(params.product.description);
                                                                                                        Description_localized=removeHtml(params.product.description);//.replaceAll('<p>','').replaceAll('</p>','');
                                                                                                    }
                                                                                                    if(!Tools.stringIsEmpty(params.product.short_description)){
                                                                                                        // console.log(params.product.short_description);
                                                                                                        short_Description_localized= removeHtml(params.product.short_description);//.replaceAll('<p>','').replaceAll('</p>','');
                                                                                                    }
                                                                                                    var allimages=[];
                                                                                                    // for (let index = 0; index < params.product.images.length; index++) {
                                                                                                    //     const element = params.product.images[index];
                                                                                                    // console.log("ALL :"+params.product.EntityType+"  C:"+params.product.CatalogType+" P:"+SelectedOption);
                                                                                                    if(!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog&&!Tools.IsNull(SelectedOption)){
                                                                                                        if(SelectedOption.Entity.ProfilePictureId!=null){
                                                                                                            allimages.push(WebServices.MainURL+SelectedOption.Entity.ProfilePictureId);
                                                                                                            // console.log("ALL :"+allimages);
                                                                                                        }
                                                                                                        // console.log("ALL :"+allimages);
                                                                                                    }
                                                                                                    if(params.product.Entity!=null&&params.product.Entity.ProfilePictureId!=null)
                                                                                                        allimages.push(WebServices.MainURL+params.product.Entity.ProfilePictureId);
                                                                                                    // }
                                                                                                    
                                                                                                    return (
                                                                                                        <KeyboardAvoidingView style={{height:'100%',backgroundColor:Colors.bgColor}} behavior={(Platform.OS === 'ios' ? 'padding' : 'undefined')} enabled>
                                                                                                        {showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation} onDismiss={()=>{
                                                                                                            // updatePro();
                                                                                                            DeviceEventEmitter.emit("updateProfile", {});
                                                                                                            setshowLogin(false);
                                                                                                        }} />)}
                                                                                                        {/* <View style={{width:widthPercentageToDP(100),height:heightPercentageToDP(100),position:'absolute'}}>
                                                                                                            <SVGbg preserveAspectRatio="xMinYMin meet" width="540" height={heightPercentageToDP(100)} style={{position:'absolute'}} 
                                                                                                            viewBox="0 0 540 663"/>
                                                                                                            </View> */}
                                                                                                            <SafeAreaView style={{marginLeft:widthPercentageToDP(4),marginTop:StatusBar.currentHeight,marginRight:widthPercentageToDP(4),maxHeight:heightPercentageToDP(100),alignSelf:'center'}} onPress={()=>{
                                                                                                            }}>
                                                                                                            <View style={[styles.modalView,{height:heightPercentageToDP(93)}]}>
                                                                                                            <View style={{marginTop:heightPercentageToDP(1),width:widthPercentageToDP(90),alignSelf:'center',flexDirection:'row',justifyContent:'space-between'}}>
                                                                                                            <TouchableOpacity onPress={()=>{OnDone()}}>
                                                                                                            <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                                                                                                            </TouchableOpacity>
                                                                                                            <View style={{justifyContent:'flex-end',width:'20%',flexDirection:'row'}}>{!Tools.IsNull(shareURL)&&
                                                                                                                <TouchableOpacity
                                                                                                                style={{position:'absolute',alignSelf:'flex-start',left:0}}  
                                                                                                                onPress={()=>{
                                                                                                                    Share.open({ message:i18n.t("checkthisproduct").replace('$productname',getTranslatedProductName(params.product)), url: shareURL })
                                                                                                                }}>
                                                                                                                <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={shareIcon}/>
                                                                                                                </TouchableOpacity>}
                                                                                                                <TouchableOpacity style={{justifyContent:'center',alignSelf:'flex-end',right:0}} onPress={()=>{OnCartIcon()}}>
                                                                                                                <Image style={{tintColor:Colors.blueColor,width:28,height:28,resizeMode:'contain',alignSelf:'center'}} source={cartIcon}/>
                                                                                                                
                                                                                                                {allproducts.length>0&&
                                                                                                                    <View style={{position:'absolute',
                                                                                                                        justifyContent:'center',backgroundColor:Colors.inputfontColor,alignSelf:'flex-end',borderRadius:15,height:14,width:14,top:0,end:-5}}>
                                                                                                                        
                                                                                                                        <Text allowFontScaling={false} style={{
                                                                                                                            alignSelf:'center',textAlign:'center',color:Colors.whiteColor,includeFontPadding:false
                                                                                                                            ,fontSize:widthPercentageToDP(2.5)
                                                                                                                        }}>{allproducts.length}</Text>
                                                                                                                        </View>}
                                                                                                                        </TouchableOpacity></View>
                                                                                                                        </View>
                                                                                                                        <View style={{flex:1,marginTop:heightPercentageToDP(1),backgroundColor:Colors.whiteColor}}>
                                                                                                                        <ScrollView 
                                                                                                                        showsVerticalScrollIndicator={false}
                                                                                                                        ref={ref=>{mainScrollRef=ref}}
                                                                                                                        contentContainerStyle={{paddingBottom:heightPercentageToDP(4),}}
                                                                                                                        style={{  marginBottom:insets.bottom+heightPercentageToDP(5),width:widthPercentageToDP(100),backgroundColor:Colors.bg}}>
                                                                                                                        <KeyboardAvoidingView
                                                                                                                        style={{ flex: 1 }}
                                                                                                                        keyboardVerticalOffset={100}
                                                                                                                        behavior={"position"}
                                                                                                                        >{allimages!=undefined&&allimages.length>0&&
                                                                                                                            
                                                                                                                            <View style={styles.productImage}>
                                                                                                                            {/* <SliderBox
                                                                                                                                resizeMode='contain'
                                                                                                                                ViewStyle={styles.productImageView}
                                                                                                                                style={styles.productImageBox}
                                                                                                                                parentWidth={widthPercentageToDP(80)}
                                                                                                                                circleLoop ={params.product.images.length>1?true:false}
                                                                                                                                autoplay={params.product.images.length>1?true:false}
                                                                                                                                activeOpacity={0.5}
                                                                                                                                images={allimages}/> */}
                                                                                                                                
                                                                                                                                <View
                                                                                                                                style={styles.productImageView}>
                                                                                                                                {/* <CacheImage
                                                                                                                                    style={styles.productImageBox}
                                                                                                                                    uri={allimages[0]}
                                                                                                                                    /> */}
                                                                                                                                    <FastImage
                                                                                                                                    style={[styles.productImageBox,]}
                                                                                                                                    source={{
                                                                                                                                        uri: allimages[0],
                                                                                                                                        // headers: { Authorization: 'someAuthToken' },
                                                                                                                                        priority: FastImage.priority.normal,
                                                                                                                                    }}
                                                                                                                                    resizeMode={FastImage.resizeMode.cover}
                                                                                                                                    />
                                                                                                                                    {getAllBadges(params.product,true)}
                                                                                                                                    <TouchableOpacity
                                                                                                                                    onPress={()=>{
                                                                                                                                        setInfoModal(true);
                                                                                                                                    }} style={[{position:'absolute',
                                                                                                                                        bottom:-(widthPercentageToDP(7)),right:widthPercentageToDP(8),
                                                                                                                                        width:widthPercentageToDP(13),
                                                                                                                                        height:widthPercentageToDP(13),
                                                                                                                                        backgroundColor:Colors.blueColor,justifyContent:'center',
                                                                                                                                        borderRadius:widthPercentageToDP(13)},styles.shadow]}>
                                                                                                                                        <Image
                                                                                                                                        resizeMode='contain' style={{
                                                                                                                                            alignSelf:'center',
                                                                                                                                            position:'absolute',
                                                                                                                                            width:'100%',
                                                                                                                                            height:'100%',
                                                                                                                                        }} source={gsbgIcon}></Image>
                                                                                                                                        <Image
                                                                                                                                        resizeMode='contain' style={{
                                                                                                                                            alignSelf:'center',
                                                                                                                                            width:widthPercentageToDP(7),
                                                                                                                                            height:widthPercentageToDP(7),
                                                                                                                                        }} source={gamestoryIcon}></Image>
                                                                                                                                        <Text
                                                                                                                                        numberOfLines={2}
                                                                                                                                        style={{position:'absolute',includeFontPadding:false,
                                                                                                                                            color:Colors.inputfontColor,
                                                                                                                                            fontFamily:'Cairo-Regular',
                                                                                                                                            fontSize:widthPercentageToDP(3.5),
                                                                                                                                            lineHeight:widthPercentageToDP(3.5)*1.4,
                                                                                                                                            width:widthPercentageToDP(22),includeFontPadding:false,
                                                                                                                                            alignSelf:'center',
                                                                                                                                            textAlign:'center',
                                                                                                                                            top:widthPercentageToDP(15)}}>
                                                                                                                                            {(!Tools.IsNull(params.product.Entity)&&!Tools.IsNull(params.product.Entity.ParentEntityType)&&params.product.Entity.ParentEntityType==WebServices.EntityNo&&!isCalendar)?i18n.t('gamestory'):i18n.t('termsnconditions')}
                                                                                                                                            </Text>
                                                                                                                                            </TouchableOpacity>
                                                                                                                                            </View>
                                                                                                                                            </View>
                                                                                                                                        }
                                                                                                                                        <View style={{width:'93%',alignSelf:'center',marginTop:heightPercentageToDP(0.5)}}>
                                                                                                                                        <View style={{justifyContent:'space-between',flexDirection:'row',width:'100%',alignSelf:'center'}}>
                                                                                                                                        <View>
                                                                                                                                        <Text allowFontScaling={false} style={styles.productTextTitle}>{getTranslatedProductName(params.product)}</Text>
                                                                                                                                        <Text allowFontScaling={false} style={styles.productTheme}>{getTranslatedCatalogName(params.catalogName)}</Text>
                                                                                                                                        </View>
                                                                                                                                        </View>
                                                                                                                                        {!Tools.IsNull(params.product.Entity)&&!Tools.IsNull(params.product.Entity.MetaDataList)&& params.product.Entity.MetaDataList.length>0&&
                                                                                                                                            <View>
                                                                                                                                            {getMetaData(params.product.Entity.MetaDataList)}
                                                                                                                                            </View>
                                                                                                                                        }
                                                                                                                                        
                                                                                                                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                                                                                                        
                                                                                                                                        {!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog &&(params.product.EntityType!=5)&&
                                                                                                                                            <View>
                                                                                                                                            {getFolderProducts(params.product)}
                                                                                                                                            </View>
                                                                                                                                        }
                                                                                                                                        {checkIsVariable(params.product)!=-1&&
                                                                                                                                            
                                                                                                                                            <View>
                                                                                                                                            {getAllAttributes(params.product)}
                                                                                                                                            </View>
                                                                                                                                        }
                                                                                                                                        
                                                                                                                                        {/* {(params.product.EntityType==5)&&
                                                                                                                                            <>
                                                                                                                                            <View>
                                                                                                                                            {getEventProducts(params.product)}
                                                                                                                                            </View>
                                                                                                                                            <View style={{
                                                                                                                                            justifyContent:'flex-start',justifyContent:'center',
                                                                                                                                            maxHeight:heightPercentageToDP(15),
                                                                                                                                            height:'70%',
                                                                                                                                            alignSelf:'flex-end',
                                                                                                                                            borderStartWidth:(!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog||checkIsVariable(params.product)!=-1)?2:0,
                                                                                                                                            paddingStart:widthPercentageToDP((!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog||checkIsVariable(params.product)!=-1)?2:0),
                                                                                                                                            borderColor:Colors.tealDark}}>
                                                                                                                                            <Text style={styles.eachTitle}>{i18n.t('price')}</Text>
                                                                                                                                            <Text allowFontScaling={false} style={[styles.productText]}>{priceIn +" QAR"}</Text>
                                                                                                                                            </View></>
                                                                                                                                            
                                                                                                                                            } */}
                                                                                                                                            {Tools.IsNull(params.product.EntityType)||(params.product.EntityType!=5)&&!isInformative&&
                                                                                                                                                <View style={{
                                                                                                                                                    justifyContent:'flex-start',justifyContent:'center',
                                                                                                                                                    maxHeight:heightPercentageToDP(15),
                                                                                                                                                    height:'70%',
                                                                                                                                                    alignSelf:'flex-end',
                                                                                                                                                    borderStartWidth:(!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog||checkIsVariable(params.product)!=-1)?2:0,
                                                                                                                                                    paddingStart:widthPercentageToDP((!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog||checkIsVariable(params.product)!=-1)?2:0),
                                                                                                                                                    borderColor:Colors.tealDark}}>
                                                                                                                                                    <Text style={styles.eachTitle}>{i18n.t('price')}</Text>
                                                                                                                                                    <Text allowFontScaling={false} style={[styles.productText]}>{(priceIn) +" QAR"}</Text>
                                                                                                                                                    </View>
                                                                                                                                                }
                                                                                                                                                </View>
                                                                                                                                                {isInformative&&
                                                                                                                                                    <View style={{
                                                                                                                                                        justifyContent:'flex-start',justifyContent:'center',
                                                                                                                                                        maxHeight:heightPercentageToDP(15),
                                                                                                                                                        height:'20%',
                                                                                                                                                        alignSelf:'flex-start',
                                                                                                                                                        borderColor:Colors.tealDark}}>
                                                                                                                                                        <Text allowFontScaling={false} style={[styles.productText]}>{getPriceInfo(params.product)}</Text>
                                                                                                                                                        </View>
                                                                                                                                                    }
                                                                                                                                                    {
                                                                                                                                                        !Tools.IsNull(params.product.Nodes)&& 
                                                                                                                                                        Tools.stringIsContains (params.product.Nodes[0].Entity.TagNames,WebServices.mediaRequire)&&
                                                                                                                                                        <View >
                                                                                                                                                        <Text allowFontScaling={false} style={styles.eachTitle}>{i18n.t('playcardNumber')} *:</Text>
                                                                                                                                                        <Text allowFontScaling={false} style={[styles.eachTitle,{fontSize:widthPercentageToDP(3.5),fontWeight:'100'}]}>{i18n.t('shownatback')}</Text>
                                                                                                                                                        {UIElements.drawGap(10)}
                                                                                                                                                        <View style={{flexDirection:'row',alignSelf:'flex-start',height:widthPercentageToDP(12)}}>
                                                                                                                                                        <TextInput
                                                                                                                                                        value={valueText}
                                                                                                                                                        ref={(ref)=>{cardNumberInputRef.current=ref}}
                                                                                                                                                        onChangeText={(text)=>{
                                                                                                                                                            setShowError(false);
                                                                                                                                                            setValidation(0);
                                                                                                                                                            setValueText(text);
                                                                                                                                                            
                                                                                                                                                        }} 
                                                                                                                                                        onEndEditing={(text)=>{
                                                                                                                                                            setValueText(text.nativeEvent.text)
                                                                                                                                                            checkMediaCard(text)
                                                                                                                                                        }}
                                                                                                                                                        maxLength={14} allowFontScaling={false} style={[styles.cardNumberInput,styles.shadow,{includeFontPadding:false},
                                                                                                                                                            showError?{borderColor:Colors.redColor,borderWidth:3}:validation==1?{borderColor:Colors.greenColor,borderWidth:3}:{}]}
                                                                                                                                                            placeholderTextColor={Colors.placeholdertext}
                                                                                                                                                            placeholder='0000000000*000'></TextInput>
                                                                                                                                                            {!gotData&&<ActivityIndicator
                                                                                                                                                                style={{width:45,height:45,
                                                                                                                                                                    alignSelf:'center',justifyContent:'center',position:'absolute',right:0}}/>}
                                                                                                                                                                    {showdropIcon&&<TouchableOpacity 
                                                                                                                                                                        onPress={()=>{
                                                                                                                                                                            setShowDrop(!showDrop);
                                                                                                                                                                        }}
                                                                                                                                                                        style={{width:45,height:45,
                                                                                                                                                                            alignSelf:'center',justifyContent:'center',position:'absolute',right:0}}>
                                                                                                                                                                            <Image style={{width:12,height:12,alignSelf:'center',tintColor:Colors.blueColor,
                                                                                                                                                                                transform:[{rotateZ:!showDrop?'0deg':'180deg'}],
                                                                                                                                                                            }} source={dropIcon}/></TouchableOpacity>}
                                                                                                                                                                            </View>
                                                                                                                                                                            {showDrop&&props.route.params.profile.Medias.length>0&&
                                                                                                                                                                                <ScrollView style={{
                                                                                                                                                                                    flex:1,
                                                                                                                                                                                    backgroundColor:Colors.bgColor,
                                                                                                                                                                                    borderRadius:widthPercentageToDP(4),
                                                                                                                                                                                    alignSelf:'flex-start',
                                                                                                                                                                                    paddingLeft:'3%',
                                                                                                                                                                                    paddingRight:'3%',
                                                                                                                                                                                    // width:widthPercentageToDP(55),
                                                                                                                                                                                }}>
                                                                                                                                                                                {getallCards(product.parkType)}
                                                                                                                                                                                </ScrollView>}
                                                                                                                                                                                </View>
                                                                                                                                                                            }
                                                                                                                                                                            
                                                                                                                                                                            {params.product.EntityType!=5&&!isInformative&&(params.product.CatalogType==WebServices.FolderCatalog||(!Tools.IsNull(params.product.Entity)&&(Tools.IsNull(params.product.Entity.ParentEntityType)||(!Tools.IsNull(params.product.Entity.ParentEntityType)&&params.product.Entity.ParentEntityType!=WebServices.EntityNo))))
                                                                                                                                                                                && <View><Text style={styles.eachTitle}>{i18n.t('choosequantity')}</Text>
                                                                                                                                                                                <View style={{backgroundColor:Colors.whiteColor,
                                                                                                                                                                                    flexDirection:'row',height:widthPercentageToDP(7.5),
                                                                                                                                                                                    marginTop:heightPercentageToDP(0.5),
                                                                                                                                                                                    alignSelf:'flex-start',justifyContent:'space-between'}}>
                                                                                                                                                                                    
                                                                                                                                                                                    <TouchableOpacity style={styles.countbgL}  onPress={()=>{CartUpdateNo(-1)}}>
                                                                                                                                                                                    <Text allowFontScaling={false} style={styles.addminus}>-</Text>
                                                                                                                                                                                    </TouchableOpacity>
                                                                                                                                                                                    <TextInput editable={false} allowFontScaling={false} defaultValue={''+totalNo} style={styles.count}></TextInput>
                                                                                                                                                                                    <TouchableOpacity style={styles.countbg} onPress={()=>{CartUpdateNo(1)}}>
                                                                                                                                                                                    <Text allowFontScaling={false} style={styles.addminus}>+</Text>
                                                                                                                                                                                    </TouchableOpacity>
                                                                                                                                                                                    </View></View>}
                                                                                                                                                                                    {isCalendar&&
                                                                                                                                                                                        <View style={{flex:1,marginTop:widthPercentageToDP(3)}}>
                                                                                                                                                                                        <Text allowFontScaling={false} style={styles.eachTitle}>{i18n.t('choosedate')}</Text>
                                                                                                                                                                                        {!showCalendar&&<TouchableOpacity style={{flex:1,borderRadius:widthPercentageToDP(2),backgroundColor:Colors.transparent,height:heightPercentageToDP(5),justifyContent:'center'}}
                                                                                                                                                                                        onPress={()=>{
                                                                                                                                                                                            setShowCalendar(true);
                                                                                                                                                                                        }}>
                                                                                                                                                                                        <View style={{justifyContent:'space-between',borderWidth:1,overflow:'hidden',borderColor:Colors.tealDark,flexDirection:'row',width:widthPercentageToDP(50),borderRadius:widthPercentageToDP(3),height:heightPercentageToDP(4.75),paddingStart:widthPercentageToDP(2)}}>
                                                                                                                                                                                        <Image style={{tintColor:Colors.tealDark,alignSelf:'center',width:heightPercentageToDP(3),height:heightPercentageToDP(3)}} resizeMode='contain' source={calIcon}></Image>
                                                                                                                                                                                        <Text style={{includeFontPadding:false,fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(4),alignSelf:'center',textAlign:'center',color:Colors.inputfontColor}}>{Tools.IsNull(selectedDate)?"":selectedDate.format('YYYY-MM-DD')}</Text>
                                                                                                                                                                                        <View style={{backgroundColor:Colors.tealDark,alignSelf:'flex-end',width:heightPercentageToDP(4.75),height:heightPercentageToDP(4.75),justifyContent:'center'}}>
                                                                                                                                                                                        <Image style={{tintColor:Colors.whiteColor,alignSelf:'center',width:heightPercentageToDP(2.5),height:heightPercentageToDP(2.5)}} resizeMode='contain' source={dropIcon}></Image>
                                                                                                                                                                                        </View>
                                                                                                                                                                                        </View>
                                                                                                                                                                                        </TouchableOpacity>}
                                                                                                                                                                                        {showCalendar&&
                                                                                                                                                                                            <PopupCalender daysIn={daysIn} onClose={OnCalenderDone}/>
                                                                                                                                                                                        }
                                                                                                                                                                                        </View>
                                                                                                                                                                                    }
                                                                                                                                                                                    {/* For add on product to have check box */}
                                                                                                                                                                                    {/* {!Tools.IsNull(addOnEventsIn)&&
                                                                                                                                                                                        <View style={{flex:1,marginTop:widthPercentageToDP(3)}}>
                                                                                                                                                                                        <Text allowFontScaling={false} style={styles.eachTitle}>{i18n.t('AddOns')}</Text>
                                                                                                                                                                                        {AddonCheckBoxes()}
                                                                                                                                                                                        </View>} */}
                                                                                                                                                                                        
                                                                                                                                                                                        {/* addCalenderforevent */}
                                                                                                                                                                                        
                                                                                                                                                                                        {(catalogProducts.length>0)&&
                                                                                                                                                                                            <View style={{flex:1,marginTop:widthPercentageToDP(3)}}>
                                                                                                                                                                                            <Text allowFontScaling={false} style={styles.eachTitle}>{i18n.t('AddOns')}</Text>
                                                                                                                                                                                            {AddRelatedProducts()}
                                                                                                                                                                                            </View>
                                                                                                                                                                                        }
                                                                                                                                                                                        {(params.product.EntityType==5)&&
                                                                                                                                                                                            <View style={{flex:1,marginTop:widthPercentageToDP(3)}}>
                                                                                                                                                                                            <Text allowFontScaling={false} style={styles.eachTitle}>{i18n.t('choosedate')}</Text>
                                                                                                                                                                                            {!showCalendar&&<TouchableOpacity style={{flex:1,borderRadius:widthPercentageToDP(2),backgroundColor:Colors.transparent,height:heightPercentageToDP(5),justifyContent:'center'}}
                                                                                                                                                                                            onPress={()=>{
                                                                                                                                                                                                setShowCalendar(true);
                                                                                                                                                                                            }}>
                                                                                                                                                                                            <View style={{justifyContent:'space-between',borderWidth:1,overflow:'hidden',borderColor:Colors.tealDark,flexDirection:'row',width:widthPercentageToDP(50),borderRadius:widthPercentageToDP(3),height:heightPercentageToDP(4.75),paddingStart:widthPercentageToDP(2)}}>
                                                                                                                                                                                            <Image style={{tintColor:Colors.tealDark,alignSelf:'center',width:heightPercentageToDP(3),height:heightPercentageToDP(3)}} resizeMode='contain' source={calIcon}></Image>
                                                                                                                                                                                            <Text style={{includeFontPadding:false,fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(4),alignSelf:'center',textAlign:'center',color:Colors.inputfontColor}}>{Tools.IsNull(selectedDate)?"":selectedDate.format('YYYY-MM-DD')}</Text>
                                                                                                                                                                                            <View style={{backgroundColor:Colors.tealDark,alignSelf:'flex-end',width:heightPercentageToDP(4.75),height:heightPercentageToDP(4.75),justifyContent:'center'}}>
                                                                                                                                                                                            <Image style={{tintColor:Colors.whiteColor,alignSelf:'center',width:heightPercentageToDP(2.5),height:heightPercentageToDP(2.5)}} resizeMode='contain' source={dropIcon}></Image>
                                                                                                                                                                                            </View>
                                                                                                                                                                                            </View>
                                                                                                                                                                                            </TouchableOpacity>}
                                                                                                                                                                                            {showCalendar&&
                                                                                                                                                                                                <PopupCalender 
                                                                                                                                                                                                disabledByDefault={false}
                                                                                                                                                                                                daysIn={daysIn}
                                                                                                                                                                                                minDate={(params.product.EntityType==5)?(new Date(moment(new Date()).add(2,"days"))):new Date()}
                                                                                                                                                                                                maxDate={new Date(moment(new Date()).add(90,"days"))}
                                                                                                                                                                                                // calendarIn={calendarIn} 
                                                                                                                                                                                                onClose={(dateS)=>{
                                                                                                                                                                                                    setShowCalendar(false);
                                                                                                                                                                                                    if(dateS!=null){
                                                                                                                                                                                                        setAdditionalInfo({
                                                                                                                                                                                                            "type":'events',"data":SelectedOption})
                                                                                                                                                                                                            getallTimingsofPerformances('',SelectedOption.Entity.ParentEntityId,dateS,5);
                                                                                                                                                                                                            setGotData(false);
                                                                                                                                                                                                            setSelectedDate(dateS);
                                                                                                                                                                                                            
                                                                                                                                                                                                        }}
                                                                                                                                                                                                    }/>
                                                                                                                                                                                                }
                                                                                                                                                                                                
                                                                                                                                                                                                {isFetching&&<ActivityIndicator/>}
                                                                                                                                                                                                {!isFetching&&
                                                                                                                                                                                                    getAllPerformances(params.product.EntityType)
                                                                                                                                                                                                }
                                                                                                                                                                                                {(params.product.EntityType==5)&&isFetchingProducts&&<ActivityIndicator/>}
                                                                                                                                                                                                {(params.product.EntityType==5)&&!isFetchingProducts&&
                                                                                                                                                                                                    <View style={{maxHeight:heightPercentageToDP(15),flexDirection:'row'}}>
                                                                                                                                                                                                    <View>
                                                                                                                                                                                                    {getEventProducts(params.product)}
                                                                                                                                                                                                    </View>
                                                                                                                                                                                                    <View style={{
                                                                                                                                                                                                        justifyContent:'flex-start',justifyContent:'center',
                                                                                                                                                                                                        maxHeight:heightPercentageToDP(15),
                                                                                                                                                                                                        height:'70%',
                                                                                                                                                                                                        alignSelf:'flex-end',
                                                                                                                                                                                                        borderStartWidth:(!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog||checkIsVariable(params.product)!=-1)?2:0,
                                                                                                                                                                                                        paddingStart:widthPercentageToDP((!Tools.IsNull(params.product.CatalogType)&& params.product.CatalogType==WebServices.FolderCatalog||checkIsVariable(params.product)!=-1)?2:0),
                                                                                                                                                                                                        borderColor:Colors.tealDark}}>
                                                                                                                                                                                                        <Text style={styles.eachTitle}>{i18n.t('price')}</Text>
                                                                                                                                                                                                        <Text allowFontScaling={false} style={[styles.productText]}>{ (priceIn) +" QAR"}</Text>
                                                                                                                                                                                                        </View></View>
                                                                                                                                                                                                        
                                                                                                                                                                                                    }
                                                                                                                                                                                                    </View>
                                                                                                                                                                                                }
                                                                                                                                                                                                
                                                                                                                                                                                                
                                                                                                                                                                                                {(!Tools.IsNull(params.product.Entity)&&!Tools.IsNull(params.product.Entity.ParentEntityType)&&params.product.Entity.ParentEntityType==WebServices.EntityNo&&!isCalendar)&&
                                                                                                                                                                                                    <View style={{flex:1,marginTop:widthPercentageToDP(3)}}>
                                                                                                                                                                                                    <Text allowFontScaling={false} style={styles.eachTitle}>{i18n.t('choosedate')}</Text>
                                                                                                                                                                                                    {!showCalendar&&<TouchableOpacity style={{flex:1,borderRadius:widthPercentageToDP(2),backgroundColor:Colors.transparent,height:heightPercentageToDP(5),justifyContent:'center'}}
                                                                                                                                                                                                    onPress={()=>{
                                                                                                                                                                                                        setShowCalendar(true)
                                                                                                                                                                                                    }}>
                                                                                                                                                                                                    <View style={{justifyContent:'space-between',borderWidth:1,overflow:'hidden',borderColor:Colors.tealDark,flexDirection:'row',width:widthPercentageToDP(50),borderRadius:widthPercentageToDP(3),height:heightPercentageToDP(4.75),paddingStart:widthPercentageToDP(2)}}>
                                                                                                                                                                                                    <Image style={{tintColor:Colors.tealDark,alignSelf:'center',width:heightPercentageToDP(3),height:heightPercentageToDP(3)}} resizeMode='contain' source={calIcon}></Image>
                                                                                                                                                                                                    <Text style={{includeFontPadding:false, fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(4),alignSelf:'center',textAlign:'center',color:Colors.inputfontColor}}>{Tools.IsNull(selectedDate)?"":selectedDate.format('YYYY-MM-DD')}</Text>
                                                                                                                                                                                                    <View style={{backgroundColor:Colors.tealDark,alignSelf:'flex-end',width:heightPercentageToDP(4.75),height:heightPercentageToDP(4.75),justifyContent:'center'}}>
                                                                                                                                                                                                    <Image style={{tintColor:Colors.whiteColor,alignSelf:'center',width:heightPercentageToDP(2.5),height:heightPercentageToDP(2.5)}} resizeMode='contain' source={dropIcon}></Image>
                                                                                                                                                                                                    </View>
                                                                                                                                                                                                    </View>
                                                                                                                                                                                                    </TouchableOpacity>}
                                                                                                                                                                                                    {showCalendar&&
                                                                                                                                                                                                        <PopupCalender 
                                                                                                                                                                                                        // disabledByDefault={false} 
                                                                                                                                                                                                        daysIn={daysIn}
                                                                                                                                                                                                        minDate={new Date()}
                                                                                                                                                                                                        maxDate={new Date(moment(new Date()).add(90,"days"))} 
                                                                                                                                                                                                        
                                                                                                                                                                                                        onClose={(dateS)=>{
                                                                                                                                                                                                            if(dateS!=null){
                                                                                                                                                                                                                getallTimingsofPerformances(params.product.Entity.ProductId,params.product.Entity.ParentEntityId,moment(dateS),5);
                                                                                                                                                                                                                setGotData(false);
                                                                                                                                                                                                                // console.log("getallTimingsofPerformances moment")
                                                                                                                                                                                                                setSelectedDate(moment(dateS));
                                                                                                                                                                                                            }
                                                                                                                                                                                                            setShowCalendar(false);
                                                                                                                                                                                                        }}/>
                                                                                                                                                                                                    }
                                                                                                                                                                                                    
                                                                                                                                                                                                    
                                                                                                                                                                                                    {isFetching&&<ActivityIndicator/>}
                                                                                                                                                                                                    {!isFetching&&
                                                                                                                                                                                                        getAllPerformances()
                                                                                                                                                                                                    }
                                                                                                                                                                                                    
                                                                                                                                                                                                    
                                                                                                                                                                                                    </View>
                                                                                                                                                                                                }
                                                                                                                                                                                                
                                                                                                                                                                                                
                                                                                                                                                                                                </View>
                                                                                                                                                                                                </KeyboardAvoidingView>
                                                                                                                                                                                                </ScrollView>
                                                                                                                                                                                                </View>
                                                                                                                                                                                                {appHide&&<Text style={[styles.warningTxt,{alignSelf:'center',postion:'absolute',bottom:(insets.bottom+heightPercentageToDP(insets.bottom==0?7:9))}]}>{i18n.t('hiddenproduct')}</Text>}
                                                                                                                                                                                                {!isInformative&&!appHide&&<TouchableOpacity disabled={!gotData} style={[styles.addCart,{bottom:(insets.bottom+heightPercentageToDP(insets.bottom==0?7:9))}]} 
                                                                                                                                                                                                onPress={()=>{
                                                                                                                                                                                                    // console.log("ADD :"+JSON.stringify((params.product)));
                                                                                                                                                                                                    // console.log("SO : "+JSON.stringify(SelectedOption));
                                                                                                                                                                                                    if(!Tools.IsNull(params.product)&&!Tools.IsNull(params.product.Entity)&&params.product.Entity.ParentEntityType==5)//Events
                                                                                                                                                                                                    {
                                                                                                                                                                                                        var _addedInfo=undefined;
                                                                                                                                                                                                        if(Tools.IsNull(AdditionalInfo)){
                                                                                                                                                                                                            _addedInfo={
                                                                                                                                                                                                                type:'events',
                                                                                                                                                                                                                performance:selectedPerformance
                                                                                                                                                                                                            }
                                                                                                                                                                                                            setAdditionalInfo(_addedInfo)
                                                                                                                                                                                                        }else{
                                                                                                                                                                                                            _addedInfo=AdditionalInfo;
                                                                                                                                                                                                            _addedInfo.performance=selectedPerformance
                                                                                                                                                                                                            setAdditionalInfo(_addedInfo);
                                                                                                                                                                                                        }
                                                                                                                                                                                                        var addtoCart=props.route.params.addtoCart;
                                                                                                                                                                                                        addtoCart(state.shopCartInfo,params.product,priceIn,totalNo,false,_addedInfo,null,true);
                                                                                                                                                                                                    }else{
                                                                                                                                                                                                        // const {product} = props;
                                                                                                                                                                                                        if(!Tools.IsNull(params.product.Nodes)&& Tools.stringIsContains (params.product.Nodes[0].Entity.TagNames,WebServices.mediaRequire)&&Tools.stringIsEmpty(mediaCode)){
                                                                                                                                                                                                            setShowError(true);
                                                                                                                                                                                                            setShowInfoIn({"textToDisplay":i18n.t("invalidplaycard")});
                                                                                                                                                                                                            return;
                                                                                                                                                                                                        }
                                                                                                                                                                                                        addMediaInfos(AdditionalInfo);
                                                                                                                                                                                                        addDates(AdditionalInfo);
                                                                                                                                                                                                        // updatePro();
                                                                                                                                                                                                        DeviceEventEmitter.emit("updateProfile", {});
                                                                                                                                                                                                        
                                                                                                                                                                                                        // var addTo=params.addtoCart;
                                                                                                                                                                                                        if(!Tools.IsNull(params.product.Nodes)&& Tools.stringIsContains (params.product.Nodes[0].Entity.TagNames,WebServices.mediaRequire)){
                                                                                                                                                                                                            var addtoCart=props.route.params.addtoCart;
                                                                                                                                                                                                            addtoCart(state.shopCartInfo,SelectedOption,priceIn,totalNo,false,AdditionalInfo,null,true);
                                                                                                                                                                                                            // DeviceEventEmitter.emit("addtoCart", {p1:SelectedOption,p2:priceIn,p3:totalNo,p4:false,p5:AdditionalInfo,p6:null,p7:true});
                                                                                                                                                                                                            // addTo(SelectedOption,totalNo,false,AdditionalInfo,null,callback);
                                                                                                                                                                                                        }else{
                                                                                                                                                                                                            var addtoCart=props.route.params.addtoCart;
                                                                                                                                                                                                            addtoCart(state.shopCartInfo,params.product,priceIn,totalNo,false,AdditionalInfo,null,true);
                                                                                                                                                                                                            // DeviceEventEmitter.emit("addtoCart", {p1:params.product,p2:priceIn,p3:totalNo,p4:false,p5:AdditionalInfo,p6:null,p7:true});
                                                                                                                                                                                                            // addTo(params.product,totalNo,false,AdditionalInfo,null,callback);
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }}>
                                                                                                                                                                                                <Image style={styles.addtoCart} resizeMode='contain' source={addcartIcon}/>
                                                                                                                                                                                                <Text allowFontScaling={false} style={styles.carttext}>{i18n.t('addtocart')}</Text>
                                                                                                                                                                                                {(!gotData||validation==0)&&<ActivityIndicator color={Colors.whiteColor} style={styles.addtoCart}/>}
                                                                                                                                                                                                </TouchableOpacity>}
                                                                                                                                                                                                {isInformative&&<TouchableOpacity style={[styles.addCart,{bottom:(insets.bottom+heightPercentageToDP(insets.bottom==0?7:9))}]} 
                                                                                                                                                                                                onPress={()=>{
                                                                                                                                                                                                    Linking.openURL(WebServices.leisuresupportCall)
                                                                                                                                                                                                }}>
                                                                                                                                                                                                <Text allowFontScaling={false} style={styles.carttext}>{i18n.t('contactcallcentre')}</Text>
                                                                                                                                                                                                </TouchableOpacity>}
                                                                                                                                                                                                
                                                                                                                                                                                                </View>
                                                                                                                                                                                                {/* {ShowInfo!=undefined&&<InfoBar textToDisplay={ShowInfo.textToDisplay} isopen={true} onDone={OnDoneInfo}/>} */}
                                                                                                                                                                                                {/* <View style={{position:'absolute',height:'112%',width:'80%',alignSelf:'center'}} pointerEvents="box-none">
                                                                                                                                                                                                    {ShowInfo!=undefined&&<InfoBar textToDisplay={ShowInfo.textToDisplay} isopen={true} onDone={OnDoneInfo}/>}
                                                                                                                                                                                                    </View> */}
                                                                                                                                                                                                    </SafeAreaView>
                                                                                                                                                                                                    {infoModal&&
                                                                                                                                                                                                        getInfo()}
                                                                                                                                                                                                        </KeyboardAvoidingView>
                                                                                                                                                                                                    )
                                                                                                                                                                                                }
                                                                                                                                                                                                
                                                                                                                                                                                                
                                                                                                                                                                                                // const mapStateToProps = state=>{
                                                                                                                                                                                                    //     return {
                                                                                                                                                                                                //         mediaInfo:state.profileReducer.mediaInfo,
                                                                                                                                                                                                //     }                
                                                                                                                                                                                                // };
                                                                                                                                                                                                
                                                                                                                                                                                                // const mapDispatchToProps = (dispatch) => {
                                                                                                                                                                                                    //     return{
                                                                                                                                                                                                //         updateMedia:(mData)=> dispatch(updateMedia(mData)),
                                                                                                                                                                                                //     };
                                                                                                                                                                                                // }      
                                                                                                                                                                                                // export default connect(
                                                                                                                                                                                                //     mapStateToProps,
                                                                                                                                                                                                //     mapDispatchToProps
                                                                                                                                                                                                //     )(ProductPage)
                                                                                                                                                                                                
                                                                                                                                                                                                