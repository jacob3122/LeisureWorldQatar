import React, { Component, createRef, useEffect, useState } from 'react'
import {TouchableWithoutFeedback,Image,SafeAreaView, Dimensions,View,Text,StyleSheet, Alert, FlatList,RefreshControl,TouchableOpacity, ScrollView, TextInput, AppState} from 'react-native'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../../Tools/constants/Colors';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import backButton from '../../assets/Icons/back.png'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import cardsList from '../../Data/cards.json';
import GestureFlipView from 'react-native-gesture-flip-card';
// import Carousel from 'react-native-snap-carousel';
import { PureComponent } from 'react';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
// import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
import * as Tools from '../../Tools/Components/Tools'
import proceedB from '../../assets/Icons/back.png'
// import Barcode from 'react-native-barcode-builder';
import AddPlayCard from '../../Tools/Components/AddPlayCard';
import WebServices from '../../Tools/constants/WebServices';
// import OverlayLoad from '../../Tools/Components/OverlayLoad';
import FastImage from 'react-native-fast-image'
import deleteButton from '../../assets/Icons/delete.png'
import PlayCardList from '../../Tools/Components/PlayCardList';
import ProfileData from '../../Tools/Components/ProfileData';
import LoadingLine from '../../Tools/Components/LoadingLine';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';
import colors from '../../Tools/constants/Colors';
import { ActivityIndicator } from 'react-native';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import Barcode from '../../Tools/Components/Barcode';

export default function CardsPage(props){
    const Colors =useTheme();
    //     return <CardsPageC {...props} Colors={Colors}/>
    // }
    // class CardsPageC extends PureComponent {
        const { state, dispatch } = useAppContext();
        i18n.translations = state.i18ntranslation;
    
    let sliderWidth = width*1.05;
    let itemWidth = widthPercentageToDP(95) + widthPercentageToDP(2) * 4;
    let itemHeight =  heightPercentageToDP(20) + heightPercentageToDP(2) * 2;
    let cardsViewRef=[];
    let unregcardsViewRef=[];
    let unregcardsInputRef=[];
    const [forrerender, setForrerender] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [findcard, setFindCard] = useState(0);
    const [selectedItem, setSelectedItem] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [loadedUnreg, setLoadedUnreg] = useState(0);
    const [cardNumber, setCardNumber] = useState([]);
    const [cardNoInput, setCardNoInput] = useState({});
    const [cardLists, setCardLists] = useState([]);
    const [unregcardLists, setUnregCardLists] = useState([]);
    const [addPlayCardView, setAddPlayCardView] = useState(false);
    const [addCardView, setAddCardView] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    // You can remove the commented out `accessToken` state, as it's not being used.
    const [callback, setCallback] = useState(undefined);
    const [unregcardFullNumber,setunregcardFullNumber]=useState('');
    const [alreadyIn,setAlreadyIn]=useState(false);
    
    //     state={
    //         forrerender:0,
    //         refreshing:false,
    //         findcard:0,
    //         selectedItem:0,
    //         loaded:0,loadedUnreg:0,
    //         cardNumber:[],
    //         cardNoInput:{},
    //         cardLists:[],
    //         unregcardLists:[],
    //         addPlayCardView:false,
    //         addCardView:false,
    //         showLogin:false,
    //         // accessToken:props.accessToken,
    //         callback:undefined,
    //     }
    //     OnDone=OnDone.bind(this);
    //     OnDonePL=OnDonePL.bind(this);
    //     RegisterPlayCard=RegisterPlayCard.bind(this);
    //     UnRegisterPlayCard=UnRegisterPlayCard.bind(this);
    //     updateLoad=updateLoad.bind(this);
    //     SearchPlayCard=SearchPlayCard.bind(this);
    //     initUnregister=initUnregister.bind(this);
    //     checkandRegister=checkandRegister.bind(this);
    //     FindPlayCard=FindPlayCard.bind(this);
    //     // console.log("Token "+props.accessToken.access_token);
    // }
    // componentDidMount(){
    useEffect(()=>{
        AppState.addEventListener('change', handleAppStateChange);
        
        
        
        if(Tools.IsNull(state.profile)){

        }else if (Tools.IsNull(cardLists)){
            fetchMedias();
        }
        // FindPlayCard();
        // if(props.profile!==undefined&&props.profile.FirstName!==undefined){
        //     fetchMedias();
        // }
        return()=>{
            // AppState.removeEventListener('change', handleAppStateChange);
            // if(willFocus){
            //     willFocus.remove();
            // }
        }
    },[])
    useFocusEffect(
        React.useCallback(() => {
          // Do something when the screen is focused
          onNavigatorEvent();
          if(setAlreadyIn){
            if(state.profile!=undefined){
                // console.log("Already");
                fetchMedias();
            }
          }
    
          return () => {
            setAlreadyIn(true);
            // Do something when the screen is unfocused
            // Useful for cleanup functions
          };
        }, [])
      );
    
useEffect(()=>{

    // console.log("Props :"+JSON.stringify(props.navigation));
},[props.navigation]);
      
 
    
    const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            // console.log("Focus")
            if(state.profile!=undefined){
                var _cardLists=cardLists;
                for (let index = 0; index < _cardLists.length; index++) {
                    _cardLists[index].hasData=false;
                    // console.log("Focus"+_cardLists[index].rotate)
                    
                    if(_cardLists[index].rotate==1)
                    cardsViewRef[index].flipLeft(); 
                }
                setCardLists(_cardLists);
                setLoaded(1);
                setForrerender(forrerender+1);
                
            }
            // App is in the foreground
            // You can perform actions here when the app comes to the foreground.
        } else if (nextAppState === 'background') {
            // App is in the background
            // You can perform actions here when the app goes into the background.
        }
    };
    const onNavigatorEvent=()=>{
        logScreenViewEvent("CardsPage","My Cards");

        let profileIn=Tools.IsNull(state.profile);
        // console.log("onNavigatorEvent"+profileIn)
        if(profileIn){
            setShowLogin(true);
        }else{
            setShowLogin(false);
        }
        // else{
        //     fetchMedias();
        // }
    }
    
    useEffect(()=>{
        if(state.profile!==undefined&&state.profile.FirstName!==undefined){
            setShowLogin(false);
        }
    },[props]) 
    
    const initUnregister=(_cards)=>{
        var _unregCards=_cards;
        setLoadedUnreg(0);
        
        // setState({loadedUnreg:0},()=>{
        if(_unregCards===undefined)
        _unregCards=[];
        setUnregCardLists(_cards);
        cards=[];
        cardFullNumber=[];
        
        for(var t=0;t<_unregCards.length;t++){
            unregcardsViewRef.push(createRef())
            unregcardsInputRef.push(createRef())
            cards.push(getcardNumberUnReg(_unregCards[t]));
            cardFullNumber.push(getcardFullNumberUnReg(_unregCards[t]));
        }
        setunregcardFullNumber(cardFullNumber);
        setLoadedUnreg(1);        
        // })
    }
    
    const initCards=(_CardsObj)=>{
            var _cardsObj=_CardsObj;
            setLoaded(0);
        
            if(_cardsObj===undefined)
            _cardsObj=[];
            cards=[];
            for(var t=0;t<_cardsObj.length;t++){
                _cardsObj[t].hasData=false;
                cardsViewRef.push(createRef());
                cards.push(getcardNumber(_cardsObj[t]));
                
            }
            setCardNumber(cards);
            setCardLists(_cardsObj);
            setLoaded(1);
            // console.log("initCards"+JSON.stringify(_cardsObj));
        if(callback!=undefined){
            var call= callback;
            call(_cardsObj);
            setCallback(undefined)
        }
    }
    const FindPlayCard=(_memberID=null,_access=null,callback=null)=>{
        // console.log(_access+" - Token Find:"+(_access==null?props.accessToken.access_token:_access));
        setFindCard(0);
        // updateLoad(true);
        var search=WebServices.findMemberCards.replace('{MemberID}',_memberID==null?state.accessToken.MemberID:_memberID);
        // console.log("FPC"+search);
        fetch (WebServices.MainURL+search,{
            method: 'GET',
            headers:{
                'Authorization':'Bearer'+' '+(_access==null?state.accessToken.access_token:_access.access_token),
            },
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            setFindCard(1);
            // console.log("Find Play Card : "+responseJson);
            
            updateLoad(false)
            if(Tools.stringIsContains(responseJson,'denied')){
                if(props.assignProfile!=null){
                    props.assignProfile("user",'','',(_memberID,_access)=>{FindPlayCard(_memberID,_access,callback)})
                }
                return;
            }
            var responseObj=JSON.parse(responseJson);
            if(Tools.stringIsEmpty(responseObj.Error))
            {
                initUnregister(responseObj.Medias)
                if(callback!=null){
                    callback();
                }
            }else{
                if(callback!=null){
                    callback();
                }
            }
            
        }).catch((error) =>{
            setFindCard(2);
            
            updateLoad(false)
            
            // console.log('Find play card '+error);
        });
    }
    
    const SearchPlayCard=(_mediaCode,_access)=>{
        updateLoad(true);
        var search=WebServices.searchMediaCard.replace('{MemberID}',_access.MemberID).replace('{MediaCode}',_mediaCode);
        fetch (WebServices.MainURL+search,{
            method: 'POST',
            headers:{
                'Authorization':'Bearer'+' '+_access.access_token,
            },
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            if(Tools.stringIsContains(responseJson,'denied')){
                if(props.assignProfile!=null)
                props.assignProfile("user",'','',(_memberID,_access)=>{SearchPlayCard(_mediaCode,_access)})
                return;
            }
            //console.log(responseJson);
            var responseObj=JSON.parse(responseJson);
            if(Tools.stringIsEmpty(responseObj.MediaId)){
                updateLoad(false)
                
                Alert.alert(i18n.t("invalidplaycard"))
            }else{
                RegisterPlayCard(_mediaCode,_access,responseObj.MediaId);
            }
        }).catch((error) =>{
            updateLoad(false)
            
            // console.log('Search '+error);
            Alert.alert(i18n.t("invalidplaycard"))
        });
    }
    
    const checkandRegister=(_index)=>{
        updateLoad(true);
        RegisterPlayCard(unregcardFullNumber[_index],state.accessToken,unregcardLists[_index].MediaId);
    }
    const RegisterPlayCard=(_mediaCode,_access,_mediaId)=>{
        // console.log("RegisterPlayCard-"+_mediaCode);

        var search=WebServices.registerMediaId.replace('{MemberID}',_access.MemberID).replace('{MediaID}',_mediaId);
        
        fetch (WebServices.MainURL+search,{
            method: 'POST',
            headers:{
                'Authorization':'Bearer'+' '+_access.access_token,
            },
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            // console.log("RegisterPlayCard-"+responseJson);
            var responseObj=JSON.parse(responseJson);
            if(Tools.stringIsContains(responseJson,'denied')){
                if(props.assignProfile!=null)
                props.assignProfile("user",'','',(_memberID,_access)=>{RegisterPlayCard(_mediaCode,_access,_mediaId)})
                return;
            }
            if(responseObj.Result){
                updateLoad(false);
                initCards(responseObj.MemberMedias);
                OnDone();
            }else{
                updateLoad(false)
                if(Tools.stringIsEmpty(responseObj.Error))
                Alert.alert(i18n.t("invalidplaycard"))
                else
                Alert.alert(responseObj.Error)
            }
            
        }).catch((error) =>{
            updateLoad(false)
            // console.log('RegisterPlayCard '+error);
            Alert.alert(i18n.t("invalidplaycard"))
        });
    }
    const UnRegisterPlayCard=(_mediaId)=>{
        updateLoad(true)
        var search=WebServices.unregisterMediaId.replace('{MemberID}',state.accessToken.MemberID).replace('{MediaID}',_mediaId);
        
        fetch (WebServices.MainURL+search,{
            method: 'POST',
            headers:{
                'Authorization':'Bearer'+' '+state.accessToken.access_token,
            },
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            // console.log("UnRegisterPlayCard - "+responseJson);
            var responseObj=JSON.parse(responseJson);
            if(Tools.stringIsContains(responseJson,'denied')){
                if(props.assignProfile!=null)
                props.assignProfile("user",'','',(_memberID,_access)=>{UnRegisterPlayCard(_mediaId)})
                return;
            }
            if(responseObj.Result){
                updateLoad(false)
                initCards(responseObj.MemberMedias);
                OnDone();
            }else{
                updateLoad(false)
                if(Tools.stringIsEmpty(responseObj.Error))
                Alert.alert(i18n.t("failed"))
                else
                Alert.alert(responseObj.Error)
            }
            
        }).catch((error) =>{
            updateLoad(false)
            console.log('RegisterPlayCard '+error);
            Alert.alert(i18n.t("failed"))
        });
    }
    
    const getColor=(_parkType)=>{
        if(_parkType=="Angry Birds World"){
            return Colors.abColor
        }
        else if(_parkType=="Virtuocity"){
            return Colors.vcColor
        }
        else if(_parkType=="Snow Dunes"){
            return Colors.sdColor
        }else{
            return Colors.bgColor
        }
    }
    const getbgImage=(_parkType)=>{
        if(_parkType=="Angry Birds World"){
            return WebServices.abcard
        }
        else if(_parkType=="Virtuocity"){
            return WebServices.vccard
        }
        else if(_parkType=="Snow Dunes"){
            return WebServices.vccard
        }
        
        return WebServices.generalcard
    }
    const replaceStringtoX=(_string)=>{
        var xstring=''
        for (let index = 0; index < _string.length; index++) {
            xstring+='X'
        }
        return xstring;
    }
    
    const getCardNo=(_card)=>{
        var _cardNo=_card.verify?(_card.CardNo):(replaceStringtoX(_card.CardNo.substring(0,_card.CardNo.length-4))+''+_card.CardNo.substring(_card.CardNo.length-4));
        return _cardNo;
        
    }
    const getcardNumber=(_cardIn)=>{
        var cardIn=_cardIn;
        _cardNo='';
        // console.log(JSON.stringify(cardIn));
        if(cardIn.MediaCodes!=null&&cardIn.MediaCodes.length>0){
            for(let t=0;t<cardIn.MediaCodes.length;t++){
                if(cardIn.MediaCodes[t].Type=="Default"){
                    return cardIn.MediaCodes[t].Code;
                }
            }
        }
        return _cardNo;
    }
    const getcardNumberUnReg=(_cardIn)=>{
        var cardIn=_cardIn;
        _cardNo='';
        if(cardIn.MediaCodes!=null&&cardIn.MediaCodes.length>0){
            for(let t=0;t<cardIn.MediaCodes.length;t++){
                if(cardIn.MediaCodes[t].MediaCodeTypeDesc=="Default"){
                    return (getX(cardIn.MediaCodes[t].MediaCode.length-4)+cardIn.MediaCodes[t].MediaCode.substring(cardIn.MediaCodes[t].MediaCode.length-4));
                }
            }
        }
        return _cardNo;
    }
    
    const getcardFullNumberUnReg=(_cardIn)=>{
        var cardIn=_cardIn;
        _cardNo='';
        if(cardIn.MediaCodes!=null&&cardIn.MediaCodes.length>0){
            for(let t=0;t<cardIn.MediaCodes.length;t++){
                if(cardIn.MediaCodes[t].MediaCodeTypeDesc=="Default"){
                    return cardIn.MediaCodes[t].MediaCode
                }
            }
        }
        return _cardNo;
    }
    const getX=(_len)=>{
        data="";
        for (let index = 0; index < _len; index++) {
            data+='X'
        }
        return data;
    }
    const formatDateToLocalString = (dateString) => {
        const date = new Date(dateString);
      
        // Use toLocaleDateString to format the date
        const options = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        };
      
        // Format the date to "DD-MM-YYYY"
        const formattedDate = date.toLocaleDateString('en-GB', options).split('/').reverse().join('-');
        return formattedDate;
      };
    
    const renderBack=(card,index)=>{
        let _card=card;
        let _index=index;
        return(
            <View style={{justifyContent:'center',borderRadius:widthPercentageToDP(7)
            ,alignSelf:'center',width:widthPercentageToDP(79),height:(widthPercentageToDP(79)/1.58), backgroundColor:getColor(_card.Location)}}>
            
            {/* {!card.verify&&<View style={{width:'100%',height:'100%',justifyContent:'center'}}>
            <TouchableOpacity disabled={index!=selectedItem} style={{width:'45%',alignSelf:'center',justifyContent:'center',backgroundColor:Colors.whiteColor,borderRadius:10,borderWidth:2,borderRadius:20,borderColor:Colors.orangeColor,height:'20%'}}
            onPress={()=>{
                cardsViewRef[index].current.flipRight();  // counterclockwise
            }}>
            <Text style={styles.buttonText}>{i18n.t('verifycard')}</Text>
            </TouchableOpacity>
            <View style={{ position:'absolute',
            bottom:'2%',width:'100%'}}>
            <Text style={styles.cardno}>{getCardNo(card)}</Text>
            </View>
        </View>} */}
        
        {
            // card.verify&&
            <View style={{width:'100%',height:'100%'}}>
            <TouchableOpacity style={{position:'absolute',justifyContent:'center',right:'3%',bottom:'4%'}} 
            onPress={()=>{
                Alert.alert(i18n.t('surewanttounregister'),"",
                [{text: i18n.t('proceed'), onPress: () => {
                    UnRegisterPlayCard(cardLists[_index].MediaId)
                }},
                {text: i18n.t('cancel'), onPress: () => console.log('Cancel Pressed')},
            ],
            {cancelable: true},
            )
        }}>
        <Image source={deleteButton} style={{width:20,resizeMode:'contain',tintColor:Colors.whiteColor,alignSelf:'center'}}/>
        </TouchableOpacity>
        <View style={{alignSelf:'center',backgroundColor:'white',borderRadius:5,overflow:'hidden',width:'85%',marginBottom:'2%',marginTop:'5%'}}>
        {!Tools.stringIsEmpty(cardNumber[_index])&& <Barcode value={cardNumber[_index]} 
        viewStyle={{marginTop:heightPercentageToDP(1),marginBottom:heightPercentageToDP(1)}} width={widthPercentageToDP('.32%')} height={heightPercentageToDP('4%')}
        format="CODE128" />}
        <Text allowFontScaling={false}  style={[styles.cardno,{fontSize:14,marginTop:-12,color:'black'}]}>{cardNumber[_index]}*XXX</Text>
        </View>
        {card.hasData&&
        <>
            <View style={{flexDirection:'row',alignSelf:'center', width:'88%',bottom:0,alignItems:'flex-start'}}>
            {/* <Text allowFontScaling={false}  style={styles.balanceTxt}>{i18n.t("cardbalance")}</Text> */}
            {getCardBalance(_card,0)}
            <View style={{flexDirection:'column'}}>
            {getCardBalances(_card)}
            </View>
            
            </View><View style={{position:'absolute',bottom:'2%',right:'10%', alignItems:'flex-end',alignContent:'flex-end',alignSelf:'flex-end',flexDirection:'row'}}>
                <Text allowFontScaling={false} style={[styles.balanceTxt,{fontSize:widthPercentageToDP('3.5%'),
                        lineHeight:widthPercentageToDP('5%'),textAlign:'right'}]}> {Tools.stringIsContains((_card.WalletExpiry),"000")? i18n.t('expired'):i18n.t('expireson')+": "}</Text>
                        {!Tools.stringIsContains((_card.WalletExpiry),"000")&&<Text allowFontScaling={false} style={[styles.balanceTxt,{fontWeight:'100',color:Colors.whiteColor, fontSize:widthPercentageToDP('3.5%'),
                        lineHeight:widthPercentageToDP('5%'),textAlign:'right'}]}>{" "+formatDateToLocalString(_card.WalletExpiry)}</Text>}
                </View></>}
            {!card.hasData&&<ActivityIndicator
                size='large'
                color={Colors.whiteColor}/>}
                </View>
                
            }
            
            
            
            
            </View>
            );
        }
        
        const getName=(_cardType)=>{
            if(Tools.stringIsContains(_cardType,"wallet")){
                return i18n.t("cardbalance")
            }else if(Tools.stringIsContains(_cardType,"etickets")){
                return i18n.t('redemptionbalance')
            }else {
                return i18n.t("bonusbalance")
            }
        }
        const getCardBalance=(_card,_number)=>{
            if(_card.WalletSlots.length==0){
                return;
            }
            var cards=[];
            let index=_number;
            // console.log(_card);
            // for (let index = 0; index < 1; index++) {
            const element = _card.WalletSlots[index];
            // if(Tools.stringIsContains(_card.WalletSlots[index].Name,"wallet"))
            cards.push(
                <View style={{flexDirection:index==0?'column':'row',paddingRight:'2%',justifyContent:'center',alignSelf:'center',width:'40%'}}>
                <Text allowFontScaling={false} style={styles.balanceTxt}>{getName(element.Name)}</Text>
                <Text allowFontScaling={false}  style={[styles.balanceVal,{alignSelf:'flex-start'}]}>{element.Balance} QAR</Text>
                </View>
                )
                return cards;
            }
            const getCardBalances=(_card)=>{
                var cards=[];
                // console.log(_card);
                for (let index = 1; index < _card.WalletSlots.length; index++) {
                    const element = _card.WalletSlots[index];
                    cards.push(
                        <View style={{flexDirection:'column',justifyContent:'center',width:'100%',borderLeftWidth:2,paddingLeft:'4%'}}>
                        <Text allowFontScaling={false} style={[styles.balanceTxt,{fontSize:widthPercentageToDP('3.5%'),
                        lineHeight:widthPercentageToDP('5%'),textAlign:'right',alignSelf:'flex-end'}]}>{getName(element.Name)}</Text>
                        <Text allowFontScaling={false}  style={[styles.balanceVal,{textAlign:'right',alignSelf:'flex-end',fontSize:widthPercentageToDP('4.25%'), lineHeight:widthPercentageToDP('5.75%')}]}>
                        {element.Balance + ''+(Tools.stringIsContains(element.Name,"etickets")?(' '+(element.Balance==1?i18n.t('ticket'):i18n.t('tickets'))):' QAR')}
                        </Text>
                        </View>
                        )
                    }
                    return(cards)
                }
                
                const renderFront=(card,index)=>{
                    var _card=card;
                    var _index=index;
                    return(
                        <View style={{justifyContent:'center',borderRadius:widthPercentageToDP(7),alignContent:'center',alignItems:'center',backgroundColor:getColor(card.Location)
                        ,alignSelf:'center',width:widthPercentageToDP(79),height:(widthPercentageToDP(79)/1.6) }}>
                        <FastImage
                        style={{position:'absolute',width:widthPercentageToDP(79),height:(widthPercentageToDP(79)/1.5779) ,alignSelf:'center',color:getColor(card.Location)}}
                        source={{
                            uri: getbgImage(card.Location),
                            // headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                        
                    <View style={{width:'100%',height:'100%'}}>
                    <View style={[{position:'absolute',flex:1, alignSelf:'flex-end',bottom:'25%'},global.locale=='ar'?{start:'4%'}:{end:'4%'}]}>
                    <Text allowFontScaling={false} style={{fontSize:widthPercentageToDP(3.7),includeFontPadding:false,fontFamily:'Cairo-Bold',color:Colors.whiteAlways}}>{i18n.t("playcardNumber")}</Text>
                    {/* </View>
                <View style={{position:'absolute',flexDirection:'row',flex:1, alignSelf:'flex-end',bottom:'25%',right:'4%'}}> */}
                <Text allowFontScaling={false} style={{fontSize:widthPercentageToDP(5.2),fontFamily:'Cairo-Regular',color:Colors.whiteAlways,includeFontPadding:false,}}>{cardNumber[_index]}</Text>
                </View>
                
                </View>
                {/* {!card.verify&&
                    <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
                    <TextInput disabled={index!=selectedItem}  placeholder={getCardNo(card)} 
                    onChangeText={(textIn)=>{
                        const valueText="Card"+index;
                        const newCardNos = { ...cardNoInput, valueText : textIn };
                        setState({cardNoInput:newCardNos})
                    }}
                    onEndEditing={(textIn)=>{
                        const valueText="Card"+index;
                        const newCardNos = { ...cardNoInput, valueText : textIn.nativeEvent.text };
                        setState({cardNoInput:newCardNos})
                        verifyCardNo(card,textIn.nativeEvent.text)
                    }}
                    style={{fontFamily:'Cairo-Regular',backgroundColor:Colors.whiteColor,
                    width:'60%',height:'20%',alignSelf:'center',borderRadius:10,padding:5,fontSize:20,
                    textAlign:'center'}}/>
                    <TouchableOpacity disabled={index!=selectedItem} 
                    style={{marginTop:'5%',backgroundColor:Colors.whiteColor,justifyContent:'center',alignSelf:'center',borderWidth:2,borderRadius:20,borderColor:Colors.orangeColor,height:'20%',paddingLeft:'5%',paddingRight:'2%'}} 
                    onPress={()=>{
                        const valueText="Card"+index;
                        verifyCardNo(card,cardNoInput.valueText)
                    }}>
                    <View style={{flexDirection:'row'}}>
                    <Text style={[styles.buttonText]}>{i18n.t('confirmcard')}</Text>
                    <Image source={proceedB} style={styles.backbut} ></Image>
                    </View>
                    </TouchableOpacity> 
                    </View>
                } */}
                </View>
                );
            }
            
            const _renderItem = ({item, index}) => {
                // console.log("RenderItem"+index+":"+JSON.stringify(item));
                const localItem=item;
                const localIndex=index;
                if(loaded==0)
                return(<></>)
                else{
                    // currentCard=item;
                    // currentIndex=index;
                    return (
                        <TouchableWithoutFeedback key={index+"twf"} onPress={()=>{
                            if(cardsViewRef[localIndex]!=undefined){
                                localItem.rotate=((localItem.rotate==undefined)?1:(localItem.rotate==1?0:1));
                                // console.log("R :"+localItem.rotate);
                                cardsViewRef[localIndex].flipLeft();  // counterclockwise
                                if(!localItem.hasData){
                                    fetchMedia(localItem);
                                }
                            }
                        }} style={styles.container}>
                        <View>
                        <GestureFlipView
                        key={localIndex}
                        ref={ref=>{
                            cardsViewRef[localIndex]=ref;
                        }}
                        width={(widthPercentageToDP(79))}
                        height={(widthPercentageToDP(79)/1.58)}
                        renderFront={() => renderFront(localItem, localIndex)}
                        renderBack={() => renderBack(localItem, localIndex)}
                        />
                        </View>
                        </TouchableWithoutFeedback>
                        )
                        ;
                    }
                }
                const verifyCardNo=(card,_cardNo)=>{
                    if(card.CardNo==_cardNo){
                        
                        const cards=cardLists;
                        for (let index = 0; index < cards.length; index++) {
                            if(cards[index].Id==card.Id){
                                cards[index].verify=true;
                            }
                            
                        }
                        setCardLists(cards);
                    }else{
                        Alert.alert(i18n.t("verificationfail"))
                    }
                }
                
                const refreshControl=()=>{
                    return (
                        <RefreshControl
                        tintColor={Colors.blueColor}
                        refreshing={refreshing}
                        onRefresh={()=>refreshListView()} />
                        )
                    }
                    const refreshListView=()=>{
                        fetchMedias();
                    }
                    const updateLoad=(_state)=>{
                        // var loading=props.updateLoading;
                        // loading(_state);
                    }
                    const fetchMedias=()=>{
                        // console.log("Token :"+props.accessToken.access_token);
                        updateLoad(true);
                        // var orders=WebServices.getMedias.replace("{MemberID}",props.accessToken.MemberID)
                        var orders=WebServices.mediaSummary.replace("{MemberID}",state.accessToken.MemberID)
                        fetch (WebServices.MainURL+orders,{
                            method: 'GET',
                            headers: {
                                'Authorization':'Bearer '+state.accessToken.access_token,
                                'Content-Type': 'application/json',
                            },
                        },5000)
                        .then((response) => response.text())
                        .then((responseJson) => {
                            // console.log("fetchMedias"+responseJson);
                            if(Tools.stringIsContains(responseJson,'denied')){
                                if(props.assignProfile!=null){
                                    props.assignProfile("user",'','',(_memberID,_access)=>{fetchMedias()});
                                }
                                return;
                            }
                            updateLoad(false);
                            var responseObj=JSON.parse(responseJson);
                            if(Tools.stringIsEmpty(responseObj.Error)){
                                initCards(responseObj.Medias);
                            }
                        }).catch((error) =>{
                            // console.log("Media "+ error);
                            updateLoad(false)
                        });
                    }
                    const fetchMedia=(_item)=>{
                        var orders=WebServices.mediaDetails.replace("{MediaID}",_item.Id)
                        fetch (WebServices.MainURL+orders,{
                            method: 'GET',
                            headers: {
                                'Authorization':'Bearer '+state.accessToken.access_token,
                                'Content-Type': 'application/json',
                            },
                        },5000)
                        .then((response) => response.text())
                        .then((responseJson) => {
                            // console.log("fetchMedia"+_item.Id+":"+responseJson)
                            if(Tools.stringIsContains(responseJson,'denied')){
                                if(props.assignProfile!=null){
                                    props.assignProfile("user",'','',(_memberID,_access)=>{fetchMedias()})
                                }
                                return;
                            }
                            var responseObj=JSON.parse(responseJson);
                            if(!Tools.IsNull(responseObj)){
                                for (let index = 0; index < cardLists.length; index++) {
                                    var _cardLists = cardLists;
                                    if(_cardLists[index].Id==_item.Id){
                                        _cardLists[index]=responseObj;
                                        _cardLists[index].hasData=true;
                                        _cardLists[index].rotate=1;
                                        setCardLists(_cardLists);
                                        setLoaded(1);
                                        setForrerender(forrerender+1);
                                        index=100000;
                                    }
                                    
                                }
                            }
                        }).catch((error) =>{
                            // console.log("Media "+ error);
                        });
                    }
                    const styles = StyleSheet.create({
                        nocards:{
                            alignSelf:'center',
                            fontFamily:'Cairo-Regular',
                            textAlign:'center',
                            fontSize: widthPercentageToDP(4.2),
                            // lineHeight:15*1.5,
                            // textTransform:'uppercase'
                        },
                        buttonText:{
                            includeFontPadding:false,
                            fontFamily:'Cairo-Regular',
                            textAlign:'center',
                            color:Colors.whiteColor,
                            fontSize: widthPercentageToDP(4.2),
                            paddingHorizontal:widthPercentageToDP(3)
                            // lineHeight:15*1.5,
                            // textTransform:'uppercase'
                        },buttonView:{
                            position:'absolute',
                            bottom:'3%',
                            backgroundColor:Colors.blueColor,
                            height:heightPercentageToDP(4.75),
                            borderRadius:heightPercentageToDP(4.75),alignSelf:'center',
                            justifyContent:'center',paddingLeft:'4%',paddingRight:'4%'
                        },
                        backbut:{
                            tintColor:Colors.orangeShadeColor,
                            alignSelf:'center',
                            width:25,
                            height:25,
                            transform:[{translateX:0}, {rotateZ:'180deg'}],
                            zIndex:10,
                        },
                        
                        cardno:{
                            includeFontPadding:false,
                            alignSelf:'center',
                            textTransform:'uppercase',
                            fontFamily:'Cairo-Regular',
                            fontSize: 30,
                            textAlign:'center',
                            color:Colors.whiteColor,
                        },
                        balanceTxt:{
                            includeFontPadding:false,
                            color:Colors.black,
                            // paddingTop:15,
                            fontWeight:'bold',
                            alignSelf:'flex-start',
                            // textTransform:'uppercase',
                            fontFamily:'Cairo-Regular',
                            fontSize: heightPercentageToDP(2),
                            lineHeight: heightPercentageToDP(3),
                            textAlign:'left',
                        },
                        balanceVal:{
                            includeFontPadding:false,
                            alignSelf:'flex-start',
                            textAlign:'left',
                            color:Colors.whiteColor,
                            // paddingTop:15,
                            fontWeight:'100',
                            fontFamily:'Cairo-Regular',
                            fontSize: heightPercentageToDP(2.25),
                            lineHeight: heightPercentageToDP(3.25)
                        },
                        container:{
                            
                            borderRadius:20,
                            // overflow:'hidden'
                        },
                        slider: {
                            marginTop: '50%',
                            marginBottom: '50%',
                            
                            overflow: 'visible' // for custom animations
                        },
                        
                        sliderContentContainer: {
                            marginTop:'-10%',
                            paddingTop:0,
                            paddingBottom:0,
                            // paddingVertical: 10 // for custom animation
                        }, tagline:{
                            fontFamily:'Cairo-Bold',
                            // fontWeight:'bold',
                            fontSize:widthPercentageToDP(7),
                            alignSelf:'flex-start',
                            color:Colors.inputfontColor,
                            
                        },storedesc:{
                            width:'90%',
                            textAlign:'left',
                            fontFamily:'Cairo-Regular',
                            fontSize:widthPercentageToDP(4),
                            lineHeight:widthPercentageToDP(4)*1.5,
                            flexWrap:'wrap',
                            alignSelf:'center',
                            marginBottom:'5%',
                            color:Colors.inputfontColor,
                        }
                    });
                    
                    const OnDone=()=>{
                        setAddCardView(false);
                    }
                    const OnDonePL=(_doneVal=false,callback=null)=>{
                        setAddCardView(false);
                        if(_doneVal){
                            setAddCardView(true);
                        }
                        if(callback){
                            setCallback(callback);
                        }
                    }
                    
                    return (
                        <View behavior="padding" style={{flex:1,backgroundColor:Colors.bgColor}}>
                        <BackgroundWall/>
                        {/* <SVGbg preserveAspectRatio="xMinYMin meet" width="540" height={heightPercentageToDP(100)} style={{position:'absolute'}} 
                    viewBox="0 0 540 663"/> */}
                    <SafeAreaView style={{flex:1,marginTop:StatusBar.currentHeight}}>
                    {/* <TouchableOpacity style={{marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{props.navigation.goBack()}}>
                    <Image style={{tintColor:Colors.blueColor,width:25,height:25}} source={backButton}/>
                </TouchableOpacity> */}
                <View style={{width:'100%',alignSelf:'center',marginTop:heightPercentageToDP(3)}}>
                {/* <View style={{width:'90%',alignSelf:'center'}}>
                <TouchableOpacity style={{}} onPress={()=>{
                    setState({loaded:0})
                    props.navigation.goBack()}}>
                    <Image style={{tintColor:Colors.orangeShadeColor,width:35,height:35}} source={backButton}/>
                </TouchableOpacity></View> */}
                {/* <ScrollView
                horizontal
                pagingEnabled={true}
                snapToAlignment='start'
            > */}
            <View style={{width:widthPercentageToDP(93),alignSelf:'center'}}>
            <Text allowFontScaling={false} style={styles.tagline}>
            {i18n.t('mycards')}
            </Text>
            <View style={{height:'94%',justifyContent:"center",alignItems:'center',alignSelf:'center'}}>
            {cardLists.length==0&&
                <ScrollView
                style={{alignSelf:'center',height:'100%',width:widthPercentageToDP(100),alignContent:'center'}}
                contentContainerStyle={{justifyContent:'center',alignItems:'center'}}
                refreshControl={refreshControl()}>
                <Text allowFontScaling={false}  style={styles.storedesc}>{i18n.t("nocardsavailablemycards")}</Text>
                <Text allowFontScaling={false}  style={styles.storedesc}>{i18n.t("moredetailsmycards")}</Text>
                
                </ScrollView>}
                {loaded==1&& cardLists.length>0&&
                    <View style={{flex:1,}}>
                    <FlatList
                    removeClippedSubviews={false}
                    data={cardLists}
                    keyExtractor={(item) => item.Id.toString()}
                    initialNumToRender={5}
                    // removeClippedSubviews
                    ItemSeparatorComponent={()=><View style={{height:20}}></View>}
                    showsVerticalScrollIndicator={false}
                    refreshControl={refreshControl()}
                    contentContainerStyle={{paddingBottom:'25%'}}
                    style={{width:'100%'}}
                    renderItem={_renderItem}
                    extraData={forrerender} // Force re-render when any item's hasData changes
                    />
                    
                    </View>}
                    </View></View>
                    
                    {/* </ScrollView> */}
                    <TouchableOpacity style={styles.buttonView}
                    onPress={()=>{
                        props.navigation.navigate('AddCards',{
                            navigation:props.navigation,fetchmedia:fetchMedia
                        })
                        // if(findcard==0){
                        //     FindPlayCard();
                        // }
                        // setState({isLoading:(findcard==0?true:false),addPlayCardView:true})
                    }} >
                    <Text style ={styles.buttonText} allowFontScaling ={false}>{i18n.t('registercard')} </Text>
                    </TouchableOpacity>
                    </View>
                    {/* {addPlayCardView&&<PlayCardList unregcardsViewRef={unregcardsViewRef} 
                    cardLists={cardLists}
                    updateLoad={updateLoad}
                    unregcardsInputRef={unregcardsInputRef}
                    unregcardFullNumber={unregcardFullNumber} 
                    checkandRegister={checkandRegister}
                    unregcardNumber={unregcardNumber} loadedUnreg={loadedUnreg} 
                    unregcardLists={unregcardLists} accessToken={props.accessToken} findPlayCard={FindPlayCard} 
                    isopen={addPlayCardView} isLoading={isLoading} onDone={OnDonePL}/>}
                    
                    {addCardView&&<AddPlayCard accessToken={props.accessToken} searchMedia={SearchPlayCard} isopen={addCardView} isLoading={isLoading} onDone={OnDone}/>}
                <SafeAreaView style={{position:'absolute',width:'93%',alignSelf:'center',top:'13%'}}>{isLoading&&<LoadingLine visibleText ={true}loadBar={Colors.blueColor}/>}</SafeAreaView>  */}
                </SafeAreaView>
                {showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation}  onDismiss={()=>{
                    props.navigation.navigate('Homescreen');
                    setShowLogin(false)
                }}/>)}
                </View>
                )
            }
            
            
            
            