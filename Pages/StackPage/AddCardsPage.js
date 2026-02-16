import React, { Component, createRef, useEffect, useState } from 'react'
import {TouchableWithoutFeedback,Image,SafeAreaView, Dimensions,View,Text,StyleSheet, Alert, FlatList,RefreshControl,TouchableOpacity, ScrollView, TextInput, AppState, StatusBar} from 'react-native'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../../Tools/constants/Colors';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import cardsList from '../../Data/cards.json';
import GestureFlipView from 'react-native-gesture-flip-card';
// import Carousel from 'react-native-snap-carousel';
import { PureComponent } from 'react';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
// import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
import * as Tools from '../../Tools/Components/Tools'
// import Barcode from 'react-native-barcode-builder';
import AddPlayCard from '../../Tools/Components/AddPlayCard';
import WebServices from '../../Tools/constants/WebServices';
// import OverlayLoad from '../../Tools/Components/OverlayLoad';
import FastImage from '@d11/react-native-fast-image'
import deleteButton from '../../assets/Icons/delete.png'
import PlayCardList from '../../Tools/Components/PlayCardList';
import ProfileData from '../../Tools/Components/ProfileData';
import LoadingLine from '../../Tools/Components/LoadingLine';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';
import { ActivityIndicator } from 'react-native';
import backButton from '../../assets/Icons/back.png'
import * as UIElements from '../../Tools/Components/UIElements'
import { Modal } from 'react-native';
import OverlayLoad from '../../Tools/Components/OverlayLoad';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import Barcode from '../../Tools/Components/Barcode';

export default function AddCardsPage (props){
    const Colors =useTheme();
    let sliderWidth = width*1.05;
    let itemWidth = widthPercentageToDP(95) + widthPercentageToDP(2) * 4;
    let itemHeight =  heightPercentageToDP(20) + heightPercentageToDP(2) * 2;
    let cardsViewRef=[];
    let unregcardsViewRef=[];
    let unregcardsInputRef=[];
    const [isLoading,setIsLoading]=useState(false);
    const[forrerender,setForrerender]=useState(0);
    const[refreshing,setRefreshing]=useState(false);
    const[findcard,setFindcard]=useState(0);
    const[selectedItem,setSelectedItem]=useState(0);
    const[loaded,setLoaded]=useState(0);
    const[loadedUnreg,setLoadedUnReg]=useState(0);
    const[cardNumber,setCardNumber]=useState([]);
    const[cardNoInput,setCardNoInput]=useState({});
    const[cardLists,setCardLists]=useState([]);
    const[unregcardLists,setUnregcardLists]=useState([]);
    const[addPlayCardView,setAddPlayCardView]=useState(false);
    const[addCardView,setAddCardView]=useState(false);
    const[showLogin,setShowLogin]=useState(false);
    const[callback,setCallback]=useState(undefined);
    const [unregcardNumber,setunregcardNumber]=useState(undefined);
    const [unregcardFullNumber,setunregcardFullNumber]=useState(undefined);
    const [unregcards,setunregcards]=useState([]);
    const [unregcardsView,setunregcardsView]=useState([]);
    const [unregcardsInput,setunregcardsInput]=useState([]);

    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    
    const initUnregister=(_cards)=>{
        console.log("DEBUG [AddCards] initUnregister called, _cards:", _cards, "_cards length:", _cards?.length, "type:", typeof _cards);
        var _unregCards=_cards;
        setLoadedUnReg(0);
        if(_unregCards===undefined)
        _unregCards=[];
        setUnregcardLists(_cards);
        let cards=[];
        let cardFullNumber=[];
        
        for(var t=0;t<_unregCards.length;t++){
            unregcardsViewRef.push(createRef())
            unregcardsInputRef.push(createRef())
            cards.push(getcardNumberUnReg(_unregCards[t]));
            cardFullNumber.push(getcardFullNumberUnReg(_unregCards[t]));
        }
        setunregcardNumber(cards)
        setunregcardFullNumber(cardFullNumber);
        setLoadedUnReg(1);
        console.log("DEBUG [AddCards] initUnregister done, setLoadedUnReg(1) called");

    }
    
    const initCards=(_CardsObj)=>{
        let _cardsObj=_CardsObj;
        setLoaded(0);
        
        if(_cardsObj===undefined)
        _cardsObj=[];
        setCardLists(_cardsObj);
        let cards=[];
        for(var t=0;t<_cardsObj.length;t++){
            _cardsObj[t].hasData=false;
            cardsViewRef.push(createRef())
            cards.push(getcardNumber(_cardsObj[t]));
        }
        setCardNumber(cards);
        setLoaded(1);
        if(callback!=undefined){
            var call=callback;
            call(_cardsObj);
            setCallback(undefined);
        }
        
    }
    const FindPlayCard=(_memberID=null,_access=null,callback=null)=>{
        console.log("DEBUG [AddCards] FindPlayCard called, isLoading:", isLoading);
        // console.log(_access+" - Token Find:"+(_access==null?props.accessToken.access_token:_access));
        setFindcard(0);
        // updateLoad(true);
        var search=WebServices.findMemberCards.replace('{MemberID}',_memberID==null?props.accessToken.MemberID:_memberID);
        console.log("DEBUG [AddCards] FindPlayCard URL:", WebServices.MainURL+search);
        // console.log("FPC"+search);
        fetch (WebServices.MainURL+search,{
            method: 'GET',
            headers:{
                'Authorization':'Bearer'+' '+(_access==null?props.accessToken.access_token:_access.access_token),
            },
        },5000)
        .then((response) => {
            console.log("DEBUG [AddCards] FindPlayCard raw response status:", response.status);
            return response.text();
        })
        .then((responseJson) => {
            console.log("DEBUG [AddCards] FindPlayCard responseJson received, length:", responseJson?.length, "first 200 chars:", responseJson?.substring(0,200));
            setFindcard(1);
            // console.log("Find Play Card : "+responseJson);

            if(Tools.stringIsContains(responseJson,'denied')){
                if(props.assignProfile!=null){
                    props.assignProfile("user",'','',(_memberID,_access)=>{FindPlayCard(_memberID,_access,callback)})
                }
                setLoadedUnReg(1);
                return;
            }
            var responseObj=JSON.parse(responseJson);
            console.log("DEBUG [AddCards] FindPlayCard response, Error:", responseObj.Error, "Medias count:", responseObj.Medias?.length);
            if(Tools.stringIsEmpty(responseObj.Error))
            {
                initUnregister(responseObj.Medias)
                if(callback!=null){
                    callback();
                }
            }else{
                setLoadedUnReg(1);
                if(callback!=null){
                    callback();
                }
            }
            
        }).catch((error) =>{
            console.log("DEBUG [AddCards] FindPlayCard CATCH error:", error, "error message:", error?.message);
            setFindcard(2);
            setLoadedUnReg(1);

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
            // console.log("SearchPlayCard : "+responseJson);
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
        RegisterPlayCard(unregcardFullNumber[_index],props.accessToken,unregcardLists[_index].MediaId);
    }
    const RegisterPlayCard=(_mediaCode,_access,_mediaId)=>{
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
                props.assignProfile("user",'','',(_memberID,_access)=>{SearchPlayCard(_mediaCode,_access)})
                return;
            }
            if(responseObj.Result){
                updateLoad(false)
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
        var search=WebServices.unregisterMediaId.replace('{MemberID}',props.accessToken.MemberID).replace('{MediaID}',_mediaId);
        
        fetch (WebServices.MainURL+search,{
            method: 'POST',
            headers:{
                'Authorization':'Bearer'+' '+props.accessToken.access_token,
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
            // console.log('RegisterPlayCard '+error);
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
    
    const renderBack=(card,index)=>{
        var _card=card;
        var _index=index;
        return(
            <View style={{justifyContent:'center',borderRadius:widthPercentageToDP(7)
            ,alignSelf:'center',width:widthPercentageToDP(79),height:(widthPercentageToDP(79)/1.58), backgroundColor:getColor(_card.Location)}}>
            
            
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
            viewStyle={{marginTop:heightPercentageToDP(1),marginBottom:heightPercentageToDP(1)}} width={widthPercentageToDP('.32%')}height={heightPercentageToDP('4%')}
            format="CODE128" />}
            <Text allowFontScaling={false}  style={[styles.cardno,{fontSize:14,marginTop:-12,color:'black'}]}>{cardNumber[_index]}*XXX</Text>
            </View>
            {card.hasData&&
                <View style={{flexDirection:'row',alignSelf:'center', width:'88%',bottom:0,alignItems:'flex-start'}}>
                {/* <Text allowFontScaling={false}  style={styles.balanceTxt}>{i18n.t("cardbalance")}</Text> */}
                {getCardBalance(_card,0)}
                <View style={{flexDirection:'column'}}>
                {getCardBalances(_card)}
                </View>
                </View>}
                {!card.hasData&&<ActivityIndicator
                    size='large'
                    color={Colors.whiteColor}/>}
                    </View>
                    
                }
                
                
                
                
                </View>
                );
            }
            useEffect(()=>{
                    i18n.locale=global.locale;
                },[global.locale])
            
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
                const {Colors}=props;
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
                            <View style={[{position:'absolute',flex:1, alignSelf:'flex-end',bottom:'25%'},i18n.locale=='ar'?{start:'4%'}:{end:'4%'}]}>
                            <Text allowFontScaling={false} style={{fontSize:widthPercentageToDP(3.7),fontFamily:'Cairo-Regular',color:Colors.whiteColor}}>{i18n.t("playcardNumber")}</Text>
                            
                            <Text allowFontScaling={false} style={{fontSize:widthPercentageToDP(5.2),fontFamily:'Cairo-Regular',color:Colors.whiteColor}}>{cardNumber[_index]}</Text>
                            </View>
                            
                            </View>
                            
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
                                            cardsViewRef[localIndex].current.flipLeft();  // counterclockwise
                                            if(!localItem.hasData){
                                                fetchMedia(localItem);
                                            }
                                        }
                                    }} style={styles.container}>
                                    <View>
                                    <GestureFlipView
                                    key={localIndex}
                                    ref={ref=>{
                                        if(cardsViewRef[localIndex]!=undefined){
                                            cardsViewRef[localIndex].current=ref;
                                        }
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
                                    console.log("DEBUG [AddCards] updateLoad called with:", _state);
                                    // var loading=props.updateLoading;
                                    // loading(_state);
                                    setIsLoading(_state);
                                }
                                const fetchMedias=()=>{
                                    // console.log("Token :"+props.accessToken.access_token);
                                    updateLoad(true)
                                    // var orders=WebServices.getMedias.replace("{MemberID}",props.accessToken.MemberID)
                                    var orders=WebServices.mediaSummary.replace("{MemberID}",props.accessToken.MemberID)
                                    fetch (WebServices.MainURL+orders,{
                                        method: 'GET',
                                        headers: {
                                            'Authorization':'Bearer '+props.accessToken.access_token,
                                            'Content-Type': 'application/json',
                                        },
                                    },5000)
                                    .then((response) => response.text())
                                    .then((responseJson) => {
                                        // console.log("fetchMedias"+responseJson)
                                        if(Tools.stringIsContains(responseJson,'denied')){
                                            if(props.assignProfile!=null){
                                                props.assignProfile("user",'','',(_memberID,_access)=>{fetchMedias()})
                                            }
                                            return;
                                        }
                                        updateLoad(false)
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
                                            'Authorization':'Bearer '+props.accessToken.access_token,
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
                                        fontFamily:'Cairo-Regular',
                                        textAlign:'center',
                                        color:Colors.whiteColor,
                                        fontSize: widthPercentageToDP(4.2),
                                        paddingHorizontal:widthPercentageToDP(3)
                                        // lineHeight:15*1.5,
                                        // textTransform:'uppercase'
                                    },buttonView:{
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
                                        alignSelf:'center',
                                        textTransform:'uppercase',
                                        fontFamily:'Cairo-Regular',
                                        fontSize: 30,
                                        textAlign:'center',
                                        color:Colors.whiteColor,
                                    },
                                    balanceTxt:{
                                        color:Colors.black,
                                        // paddingTop:15,
                                        alignSelf:'flex-start',
                                        // textTransform:'uppercase',
                                        fontFamily:'Cairo-Bold',
                                        fontSize: heightPercentageToDP(2),
                                        lineHeight: heightPercentageToDP(3),
                                        textAlign:'left',
                                    },
                                    balanceVal:{
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
                                    console.log("DEBUG [AddCards] OnDone called");
                                    setAddCardView(false);
                                    setAddPlayCardView(false);
                                    props.navigation.goBack();
                                }
                                const OnDonePL=(_doneVal=false,callback=null)=>{
                                    console.log("DEBUG [AddCards] OnDonePL called, _doneVal:", _doneVal);
                                    setAddPlayCardView(false);
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
                                    <SafeAreaView style={{marginTop:StatusBar.currentHeight,width:widthPercentageToDP(93),alignSelf:'center'}}>
                                    {/* <BackButton/> */}
                                    <TouchableOpacity style={{}} onPress={()=>{
                                        props.navigation.goBack();}}>
                                        <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                                        </TouchableOpacity>
                                        <View style={{width:'100%'}}>
                                        <AddPlayCard accessToken={props.accessToken} searchMedia={SearchPlayCard} /*isopen={addCardView}*/onDone={OnDone}/>
                                        {UIElements.drawGap(heightPercentageToDP(2))}
                                        <Text style={{color:Colors.blueColor,alignSelf:'center',fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(4)}}>{i18n.t('or')}</Text>
                                        {UIElements.drawGap(heightPercentageToDP(2))}
                                        <TouchableOpacity style={styles.buttonView}
                                        onPress={()=>{
                                            setAddPlayCardView(true);
                                            }} >
                                            <Text style ={styles.buttonText} allowFontScaling ={false}>{i18n.t('registercard')} </Text></TouchableOpacity>
                                            </View>
                                            {addPlayCardView&&
                                                <View style={{position:'absolute',width:'100%',height:'100%'}}>
                                                <PlayCardList 
                                                unregcardsViewRef={unregcardsViewRef} 
                                                cardLists={cardLists}
                                                updateLoad={updateLoad}
                                                unregcardsInputRef={unregcardsInputRef}
                                                unregcardFullNumber={unregcardFullNumber} 
                                                checkandRegister={checkandRegister}
                                                unregcardNumber={unregcardNumber} loadedUnreg={loadedUnreg} searchMedia={SearchPlayCard} 
                                                unregcardLists={unregcardLists} accessToken={props.accessToken} findPlayCard={FindPlayCard} 
                                                isopen={addPlayCardView} isLoading={isLoading}
                                                onDone={OnDonePL}/>
                                                </View>
                                            }
                                            
                                            </SafeAreaView>
                                            {showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation}  onDismiss={()=>{
                                                props.navigation.navigate('Homescreen');
                                                setShowLogin(false);
                                            }}/>)}
                                            {isLoading&&<OverlayLoad isopen={isLoading}/>}
                                            </View>
                                            )
                                        }
                                        
                                        
                                        