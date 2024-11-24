import React, { Component, useEffect, useState } from 'react';
import {Image, View,Modal,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, ActivityIndicator} from 'react-native';
// import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import {AdaptiveWidth,AdaptiveHeight} from './AdaptiveSize';
import i18n from 'i18n-js';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import { Calendar,CalendarUtils } from 'react-native-calendars';
import WebServices from '../constants/WebServices';
import moment from 'moment';
import { disabled } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';
import closeIcon from '../../assets/Icons/close.png'

export default function PopupCalender(props){
    const Colors=useTheme();
    const [val,setVal]=useState('');
    const [showError,setshowError]=useState(false);
    const [visible,setVisible]=useState(true);
    const [isFetching,setIsFetching]=useState(true);
    // const [calendarIn,setCalendar]=useState(props.calendarIn);
    const [daysIn,setDays]=useState(props.daysIn);
    const [selectedDate,setSelectedDate]=useState(null);
    const [appliedTheme,setappliedTheme]=useState(
        {
        textDisabledColor:Colors.silver,
        dayTextColor:Colors.blueColor,
        textMonthFontWeight:'bold',
        monthTextColor:Colors.black,
        textSectionTitleColor:Colors.black,
        calendarBackground:Colors.bgColor,
        arrowColor:Colors.blueColor,
        todayTextColor:Tools.IsNull(props.daysIn[moment(new Date()).format("YYYY-MM-DD")])?Colors.silver:Colors.blueColor,
        selectedDayBackgroundColor:Colors.blueColor,
        selectedDayTextColor:Colors.whiteColor
    }
    );
    const [todayColor,setTodayColor]=useState(Colors.silver);
    useEffect(()=>{
        Tools.updateRatePoints(1);
    },[]);


    
    
    useEffect(()=>{
        setDays(props.daysIn);
    },[props.daysIn])
    
    const styles = StyleSheet.create({
        warning:{
            color:'#ed4f3b',
            paddingTop:15,
            fontWeight:'500',
            fontFamily:'Cairo-Regular',
            fontSize: AdaptiveWidth(20),
            lineHeight: AdaptiveWidth(20) * 1.6,
            height: AdaptiveWidth(20)* 1.3, 
        },
        modalView:{
            position:'absolute',
            bottom:0,
            borderRadius:heightPercentageToDP(3),
            width:'100%',
            height:'50%',
            backgroundColor:Colors.bgColor,
            // transform:[{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
        },
        Button:{
            // flex:1,
            width:'40%',
            height:heightPercentageToDP(4.75),
            alignSelf:'center',
            alignItems:'center',
            backgroundColor:Colors.blueColor,
            borderRadius:heightPercentageToDP(4.75),
            justifyContent:'center'
        },
        buttontext:{
            fontSize:17,
            // lineHeight:24,
            // height:25,
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            alignSelf:'center',includeFontPadding:false
            // lineHeight: AdaptiveWidth(18) * 1.6,
            // height: AdaptiveWidth(18)* 1.3, 
        },
        
        image:{
            flex:1,
            width: width -40,
            height: height/4,
            resizeMode:'contain',
            borderRadius: 10,
            // position:'absolute'
            // transform:[{translateY:-width/4.8}]
        },
        title:{
            padding:15,
            textAlign:'center',
            fontWeight:'100',
            color:Colors.inputfontColor,
            
            fontFamily:'Cairo-Regular',
            fontSize: 20,
            // lineHeight:30,
            // lineHeight: AdaptiveWidth(15) * 1.6,
            // height: AdaptiveWidth(15)* 1.3*3, 
        },
        
        view: {
            // margin: 5,
            // marginTop: 10,
            backgroundColor: 'lightblue',
            width: width -40,
            height: height/4,
            borderRadius: 10,
            alignSelf:'center',
            alignItems:'center',
            justifyContent:'center',
            flex:1,
            // borderWidth:2,
        },
        rowView:{
            // flex:1,
            flexDirection:'row',
            width:'100%',
            height:60,
            // borderWidth:2,
            justifyContent:'space-around'
        },addtoCart:{
            alignSelf:'center',
            height:widthPercentageToDP(6),
            width:widthPercentageToDP(6),
            tintColor:Colors.blueColor,
        }
    });
    
    // useEffect(()=>{
    //     if(!Tools.IsNull(calendarIn.CalendarName)){
    //         console.log(calendarIn.CalendarName);
    //         getValidDays();
    //     }
    // },[calendarIn]);
    useEffect(()=>{
        setIsFetching(false);
        // console.log(JSON.stringify(daysIn));
        // console.log("T :"+moment(new Date()).format("YYYY-MM-DD"));
        // console.log("T :"+JSON.stringify(daysIn[moment(new Date()).format("YYYY-MM-DD")]));
        var ColrIn=Tools.IsNull(daysIn[moment(new Date()).format("YYYY-MM-DD")])?Colors.silver:Colors.black;
        // console.log("C :"+ColrIn);
        var currentTheme=appliedTheme;
        currentTheme.todayTextColor=ColrIn;
        setappliedTheme(currentTheme);
        setTodayColor(ColrIn);
    },[daysIn])
    useEffect(()=>{
        console.log("TC :"+todayColor);

    },[todayColor]);
    useEffect(()=>{
        if(selectedDate!=null){
            console.log("S : "+selectedDate);
            OnSubmit(selectedDate)
        }
    },[selectedDate])
    
    const OnSubmit=(dateSelected)=>{
        //check OTP
        setVisible(false);
        OnDone(dateSelected);
        
    }
    
    const OnDone=(donestate)=>{
        let isdone=props.onClose;
        isdone(donestate);
    }
    
    const getDate = (count) => {
        const date = new Date();
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };
    return (
        <Modal  statusBarTranslucent={true} animationType = {"slide"} transparent = {true} visible={visible}>
        <BackgroundWall blur opacity={0.8}/>
        <TouchableOpacity
        activeOpacity={1.0} onPress={()=>OnSubmit(null)} style={{height:'100%',width:'100%',justifyContent:'center',alignSelf:'flex-end'}}>
        </TouchableOpacity>
        <View style={styles.modalView}>
           
        {<Calendar
            hideExtraDays
            onDayPress={(day) => 
                {
                    setSelectedDate(day.dateString);
                }
            }
            disabledByDefault={props.disabledByDefault==null?true:props.disabledByDefault}
            disableAllTouchEventsForInactiveDays
            displayLoadingIndicator={isFetching}
            disableAllTouchEventsForDisabledDays
            minDate={props.minDate==null?moment(new Date(), 'YYYY-MM-DD\THH:mm:ss', true).format("YYYY-MM-DD"):props.minDate}
            maxDate={props.maxDate==null?null:props.maxDate}
            theme={appliedTheme}
            markedDates={
                daysIn
            }
            style={{
                marginTop:'10%',
                backgroundColor: Colors.bgColor,
                width:'100%'
            }}
            />}
             <TouchableOpacity onPress={()=>OnSubmit(null)} style={{position:'absolute',width:25,height:25,alignSelf:'flex-end',right:widthPercentageToDP(5),top:widthPercentageToDP(5)}}>
                <Image style={styles.addtoCart} resizeMode='contain' source={closeIcon}></Image>
            </TouchableOpacity>
            </View></Modal>
        )
    }
    
    
    