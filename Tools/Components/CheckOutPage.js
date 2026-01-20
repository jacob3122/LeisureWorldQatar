import React, { Component, useEffect } from 'react';
import {Image, View,createRef,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity, ScrollView, SafeAreaView,TouchableHighlight, TouchableWithoutFeedback,Keyboard ,FlatList, Alert, KeyboardAvoidingView, DeviceEventEmitter} from 'react-native';
// import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import addcartIcon from '../../assets/Icons/add-to-cart.png'
import { SwipeListView } from 'react-native-swipe-list-view';
import backButton from '../../assets/Icons/back.png'
import deleteButton from '../../assets/Icons/delete.png'
import itemsButton from '../../assets/Icons/items.png'
import locationButton from '../../assets/Icons/loca.png'
import cardButton from '../../assets/Icons/cardpay.png'
import tejoryIcon from '../../assets/Icons/tejory.png'
import WebServices from '../constants/WebServices';
import OverlayLoad from './OverlayLoad';

import SVGbg from'../../assets/bg/Circles-Pattern.svg'
// import SVGbg from'../../assets/bg/Back_app-04.svg'
import WebView from 'react-native-webview';
import PhoneDropDownInput from './PhoneDropDownInput';

import countryCode from '../../Data/countrycode.json';
import CountryDropDown from './CountryDropDown';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import moment from'moment'
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import SecureStore from './SecureStore';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
// import Slider from '@react-native-community/slider';
import CheckBox from '@react-native-community/checkbox';
import { logAddPaymentInfoEvent, logBeginCheckoutEvent, logCancelPaymentEvent, logPurchaseEvent, logPurchaseFailedEvent, logScreenViewEvent } from '../Analytics/AppAnalytics';
import { Modal } from 'react-native';
import { StatusBar } from 'react-native';
import { useState } from 'react';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import QRCode from 'react-native-qrcode-svg';
import ReactMoE from 'react-native-moengage';
export default function CheckOutPage (props){
    const route=useRoute();
    const Colors=useTheme();
    
    let phoneInputRef=React.createRef();
    
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [finalPoints, setFinalPoints] = useState(0);
    const [finalAmount, setFinalAmount] = useState(props.route.params.shopCartInfo.Answer.ShopCart.TotalAmount);
    const [beforefinalAmount, setBeforeFinalAmount] = useState(props.route.params.shopCartInfo.Answer.ShopCart.TotalAmount);
    const [paymentMethod, setPaymentMethod] = useState('skipcash'); // 'skipcash' or 'paylater'
    const [pointsSlider, setPointsSlider] = useState(0);
    const [errorcheck, setErrorCheck] = useState(0);
    const [usePoints, setUsePoints] = useState(false);
    const [tempProfile, setTempProfile] = useState({
        "Id": "",
        "FirstName": "",
        "LastName": "",
        "Email": "",
        "Mobile": "",
        "Points": 0,
        "Amount": 0,
        "CardNo": "",
        "BillingAddress": { "street": "", "city": "", "country": "", "postalCode": "" }
    });
    const [paymentWebUrl, setPaymentWebUrl] = useState('');
    const [availablePoints, setAvailablePoints] = useState(undefined);
    const [showPay, setShowPay] = useState(false);
    const [val, setVal] = useState('');
    const [expandAddress, setExpandAddress] = useState(false);
    const [expandCart, setExpandCart] = useState(false);
    const [expandCard, setExpandCard] = useState(false);
    const [totalNo, setTotalNo] = useState(0);
    const [totalVal, setTotalVal] = useState(0);
    const [showError, setShowError] = useState(false);
    const [visible, setVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [allproducts, setAllProducts] = useState(props.route.params.allproducts);
    const [shopCartInfo, setShopCartInfo] = useState(props.route.params.shopCartInfo);
    const [profileIn, setProfileIn] = useState(state.profile);
    const [accessToken, setAccessToken] = useState(state.accessToken);
    const payLaterReferenceRef = React.useRef(null);

    const [profile, setProfile] = useState({
        "Id": "",
        "FirstName": "",
        "LastName": "",
        "Email": "",
        "Mobile": "",
        "Points": 0,
        "Amount": 1,
        "CardNo": "",
        "BillingAddress": { "street": "", "city": "", "country": "", "postalCode": "" }
    });
    const [toConfirmProfile, setToConfirmProfile] = useState({
        "Id": "",
        "FirstName": "",
        "LastName": "",
        "Email": "",
        "Mobile": "",
        "Points": 0,
        "Amount": 0,
        "CardNo": "",
        "BillingAddress": { "street": "", "city": "", "country": "", "postalCode": "" }
    });
    const [canPay, setCanPay] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [ReceiptData, setReceiptData] = useState({
        "Result": "",
        "Error": "",
        "SummaryURL": "",
        "AuthCode": "",
        "Amount": 0,
        "OrderSummary": {
            "SaleCode": "ssssss",
            "SaleId": "sssss-sss-ssssssss-sssss",
            "TransactionId": "sssss-sss-ssssssss-sssss",
            "PaymentReference": "sssss-sss-ssssssss-sssss",
            "TotalAmount": 0,
            "TotalTax": 0
        }
    });
    const [ShopcartId, setShopcartId] = useState('');
    const [LastShopcart, setLastShopcart] = useState(props.route.params.shopCartInfo.Answer.ShopCart);
    const [LastCartItems, setLastCartItems] = useState(state.cartItems);
    
    // useFocusEffect(
    //     React.useCallback(()=>{
        //         setProfile(state.profile);
    //         setAccessToken(state.accessToken);
    //     },[])
    // )
    useEffect(()=>{
        if(!Tools.IsNull(state.profile)){
            setProfile(state.profile);
            setAccessToken(state.accessToken);
        }
        logScreenViewEvent('CheckoutPage','CheckOut');
    },[])
    
    
    
    useEffect(()=>{
        // console.log(JSON.stringify(profile));
        
        if(!Tools.IsNull(profile.Id))
            getAvailableTejoryPoints();
        getTotal();
        // setState({
        //     profile:((props.route.params.profile.BillingAddress)===undefined)?profile:props.route.params.profile,
        //     // toConfirmProfile:((props.route.params.profile.BillingAddress)===undefined)?toConfirmProfile:props.route.params.profile
        // })
        if(!Tools.IsNull(profile.BillingAddress)){
            
            // const requestApprovalClone = props.route.params.profile;
            var currentData= JSON.parse(JSON.stringify( profile));
            setToConfirmProfile(currentData);
            // setProfile(JSON.parse(JSON.stringify( profile)));
            // setState({toConfirmProfile:currentData,profile:JSON.parse(JSON.stringify( profile))})
        }
        
    },[profile]);    
    useEffect(()=>{
        i18n.locale=global.locale;
    },[global.locale])
    const getTotal=()=>{
        var totalVal=0;
        for (let index = 0; index < allproducts.length; index++) {
            totalVal += allproducts[index].count*getProductPrice(allproducts[index])//.item.value.price;
        }
        setTotalVal(totalVal);
        setTotalNo(allproducts.length);
    }
    const getPicUrl=(_id)=>{
        for (let index = 0; index < allproducts.length; index++) {
            const element = allproducts[index];
            if(element.item.value.ProfilePictureId==_id){
                return element.item.value.Entity.ProfilePictureId;
            }
            
        }
        return '';
    }
    const getProduct=(_product)=>{
        for (let index = 0; index < allproducts.length; index++) {
            const element = allproducts[index];
            if(element.item.value.Entity.ProductId==_product.ProductId){
                return element.item;
            }
        }
        return null;
    }
    const getallMedias=(_product)=>{
        allMedias=[];
        _product.ItemDetailList.map((_itemIn,indexIn)=>{
            _mediaNo=getMediaNo(_itemIn.AccountId);
            if(Tools.IsNull(_mediaNo)){
                
            }else{
                allMedias.push( 
                    <Text style={styles.cardData}>{_mediaNo}</Text>)
                }
            });
            return allMedias;
        }
        const getMediaNo=(_AccountId)=>{
            // console.log('Media '+JSON.stringify(props.route.params.mediaInfo));
            if(Tools.IsNull(_AccountId))
                return null;
            
            _dataIn=props.route.params.mediaInfo.filter((_itemIn)=>{
                return (_itemIn.data.AccountId==_AccountId)
            })
            
            if(_dataIn.length>0)
                return _dataIn[0].mediaNumber;
            else 
            return null;
        }
        const getTranslatedProductName=(_Node)=>{
            var name = (Tools.stringIsContains(i18n.locale,'ar')?Tools.IsNull(_Node.ProductNameITL)?_Node.ProductName:_Node.ProductNameITL:_Node.ProductName);
            return name;
        }
        
        const checkProduct=(_product)=>{ //1 - calendarEvent
            if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.ProductMetaDataList)){
                const metaData=_product.ProductMetaDataList;
                for (let index = 0; index < metaData.length; index++) {
                    const element = metaData[index];
                    // if(Tools.stringIsContains(element.MetaFieldCode,WebServices.informative)&&(element.Value==1||element.Value=='1')){
                    //     setIsInformative(true);
                    // }
                    // if(Tools.stringIsContains(element.MetaFieldCode,WebServices.calendar)&&(element.Value==1||element.Value=='1')){
                    //     setIsCalendar(true);
                    // }
                    // if(Tools.stringIsContains(element.MetaFieldCode,WebServices.calendarId)){
                    //     setCalendarId(element.Value);
                    // }
                    if(Tools.stringIsContains(element.MetaFieldCode,WebServices.calendarEvent)){
                        return 1;// 
                    }
                    
                }
            }
            return 0;
        }
        const getCartItem=(product)=>{
            
            // _localProduct=getProduct(product);
            return(
                <View style={{marginBottom:10}}>
                <View style={{flexDirection:'row',borderWidth:0}}>
                {!Tools.IsNull(product.ProfilePictureId)&& 
                    // <CacheImage style={styles.productImage} uri={product.item.value.images[0].src} />
                    <FastImage
                    style={styles.productImage}
                    source={{
                        uri: WebServices.MainURL+getPicUrl(product.ProfilePictureId),
                        // headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    />
                }
                <View style={{marginLeft:widthPercentageToDP(2.5),width:widthPercentageToDP(50),flex:1}}>
                <Text allowFontScaling={false} style={[styles.productData]}>{getTranslatedProductName(product)}</Text>
                <View style={{}}>
                {product.ProductType!=5&&   <>
                    {product!=null&&!Tools.IsNull(product.OptionList)&&<Text allowFontScaling={false} style={styles.attributes}>{product.OptionList[0].AttributeItemName}</Text>}
                    {(checkProduct(product)==1&&product!=null&&!Tools.IsNull(product.PerformanceList))&&<Text allowFontScaling={false} style={styles.attributes}>{moment(product.PerformanceList[0].DateTimeFrom, 'YYYY-MM-DD\THH:mm:ss', true).format("DD-MM-YYYY")}</Text>}
                    {(checkProduct(product)==0&&product!=null&&!Tools.IsNull(product.PerformanceList))&&<Text allowFontScaling={false} style={styles.attributes}>{moment(product.PerformanceList[0].DateTimeFrom, 'YYYY-MM-DD\THH:mm:ss', true).format("DD-MM-YYYY hh:mm A")}</Text>}
                    {product!=null&&!Tools.IsNull(product.ValidDateFrom)&&<Text allowFontScaling={false} style={styles.attributes}>{product.ValidDateFrom}</Text>}
                    {/* {_localProduct!=null&&!Tools.IsNull(_localProduct.details)&&!Tools.IsNull(_localProduct.details.displayname)&&<Text allowFontScaling={false} style={styles.attributes}>{_localProduct.details.displayname}</Text>} */}
                    
                    {/* {_localProduct.item.details!==null&&<Text allowFontScaling={false} style={styles.attributes}>{product.item.details.displayname} -</Text>} */}
                    {/* <Text allowFontScaling={false} style={styles.count}>{product.Quantity +' X'} </Text> */}
                    {!Tools.IsNull(product.TagNames)&&Tools.stringIsContains(product.TagNames,WebServices.mediaRequire)&&
                        <View>{getallMedias(product)}</View>
                    }
                    </>}</View>
                    
                    <View style={{flexDirection:'row'}}>
                    {product.ProductType!=5&&  <Text allowFontScaling={false} style={[styles.productData,{fontFamily:'Cairo-Bold'}]}>{product.Quantity +' X'} </Text>}
                    {product.TotalDiscount>0&&<Text allowFontScaling={false} style={[styles.productData,{color:Colors.orangeColor,fontFamily:'Cairo-Bold',textDecorationLine: 'line-through',marginEnd:'2%'}]}>{product.TotalNetFull}</Text>}
                    <Text allowFontScaling={false} style={[styles.productData,{fontFamily:'Cairo-Bold'}]}>{getProductPrice(product) +" QAR"}</Text>
                    {/* <Text allowFontScaling={false} style={[styles.productData,{fontFamily:'Cairo-Bold'}]}>{(product.TotalNetFull) +" QAR"}</Text> */}
                    </View>
                    </View>
                    </View>
                    </View>
                );
            }
            
            const findCountry=(_number)=> {
                countries = countryCode; // as below
                i = 0;
                while(countries[i] && (!_number.includes(countries[i].dial_code))) {
                    i++;
                }
                if (countries[i]) {
                    return _number.replace(countries[i].dial_code,''); // Or countries[i].code, or the whole countries[i] object
                }
                return '';
            }
            const findCountryDialCode=(_number)=> {
                countries = countryCode; // as below
                i = 0;
                while(countries[i] && (!_number.includes(countries[i].dial_code))) {
                    i++;
                }
                if (countries[i]) {
                    return countries[i].dial_code; // Or countries[i].code, or the whole countries[i] object
                }
                return 'QA';
            }
            const getTotalValue=(_stateIn=true)=>{
                
                return(
                    <View style={{justifyContent:'flex-end',flex:1}}>
                    {availablePoints!=undefined&&finalPoints>0&&
                        <View>
                        <Text allowFontScaling={false} style={{textAlign:'right',fontSize:20,fontFamily:'Cairo-Bold',color:Colors.inputfontColor}}>{beforefinalAmount} QAR</Text>
                        <Text allowFontScaling={false} style={{textAlign:'right',fontSize:widthPercentageToDP(4),fontFamily:'Cairo-Bold',color:Colors.blueColor}}>{_stateIn?(i18n.t('paywithtejory')+" : "):'-'}{finalPoints/availablePoints.CalcRate} QAR</Text>
                        </View>
                    }
                    <View>
                    <Text allowFontScaling={false} style={{textAlign:'right',fontSize:20,fontFamily:'Cairo-Bold',color:Colors.inputfontColor}}>{finalAmount} QAR</Text>
                    </View>
                    </View>
                    
                )
            }
            const getProductPrice=(_product)=>{
                return (_product.TotalAmount);
            }
            // const removeCartItem=(product)=>{
                //     var allproductsIn=allproducts;
            
            //     allproductsIn=allproductsIn.filter(itemSelect=>{
                
            //         return (itemSelect.item.value.id!=product.item.value.id)
            //     });
            //     var updateProducts=props.route.params.updateProducts;
            //     updateProducts(allproductsIn);
            //     // DeviceEventEmitter.emit('updateProducts',{p1:allproductsIn});
            //     // setState({allproducts:allproductsIn});
            // }
            const onAddPoints=(_pointVal)=>{
                points=finalPoints+(availablePoints.PointsStep*_pointVal);
                if(finalPoints>0&&_pointVal==-1){
                    setFinalPoints(points);
                    setFinalAmount(beforefinalAmount-(points/availablePoints.CalcRate));
                }
                if(finalPoints<availablePoints.PointsMax&&_pointVal==1)
                    {
                    setFinalPoints(points);
                    setFinalAmount(beforefinalAmount-(points/availablePoints.CalcRate));
                }
                console.log('=== Tejory Points Update ===');
                console.log('Points Step:', availablePoints.PointsStep);
                console.log('Calc Rate:', availablePoints.CalcRate);
                console.log('Final Points:', points);
                console.log('Before Final Amount:', beforefinalAmount);
                console.log('New Final Amount:', beforefinalAmount - (points / availablePoints.CalcRate));
                console.log('=== End Tejory Debug ===');
            }
            
            const checkAddress=()=>{
                
                if(Tools.stringIsEmpty(profile.Email)||
                Tools.stringIsEmpty(profile.BillingAddress.street)||
                Tools.stringIsEmpty(profile.BillingAddress.city)||
                // Tools.stringIsEmpty(profile.BillingAddress.state)||
                Tools.stringIsEmpty(profile.BillingAddress.country)||
                Tools.stringIsEmpty(profile.BillingAddress.postalCode)){
                    return i18n.t("checkaddress")
                }
                if(!canPay)
                    setCanPay(true);
                return profile.BillingAddress.street+", "+profile.BillingAddress.city
                // +","+profile.BillingAddress.state
                +", "+profile.BillingAddress.country+", "+profile.BillingAddress.postalCode;
            }
            let ref_inputFN = React.createRef();
            let ref_inputLN =  React.createRef();
            let ref_inputMO =  React.createRef();
            let ref_inputEM =  React.createRef();
            let ref_inputST =  React.createRef();
            let ref_inputCT =  React.createRef();
            let ref_inputCN =  React.createRef();
            let ref_inputPO =  React.createRef();
            
            const styles = StyleSheet.create({
                sliderTxt:{
                    includeFontPadding:false,
                    textAlign:'center',fontSize:widthPercentageToDP(4),alignSelf:'center',
                    fontFamily:'Cairo-SemiBold'
                },
                sliderButtonTxt:{
                    includeFontPadding:false,
                    lineHeight:widthPercentageToDP(10),
                    fontSize:widthPercentageToDP(6),alignSelf:'center',
                    fontFamily:'Cairo-SemiBold',color:Colors.whiteColor
                },
                orderConfrim:{
                    includeFontPadding:false,
                    textAlign:'center',fontSize:22,alignSelf:'center',marginEnd:5,
                    fontFamily:'Cairo-Bold'
                }, orderthank:{
                    includeFontPadding:false,
                    textAlign:'center',fontSize:18,alignSelf:'center',marginEnd:5,
                    fontFamily:'Cairo-Regular'
                },
                attributes:{
                    includeFontPadding:false,
                    // textAlign:'left',fontSize:16,alignSelf:'center',marginEnd:5,
                    // fontFamily:'Cairo-Regular',
                    textAlign:'left',fontSize:heightPercentageToDP(2),marginEnd:5,lineHeight:heightPercentageToDP(2)*1.4,
                    color:Colors.blueColor,
                    fontFamily:'Cairo-Bold',
                },
                inputField:{
                    
                    includeFontPadding:false,
                    // borderColor:Colors.inputfontColor,
                    fontFamily:'Cairo-Regular',backgroundColor:Colors.bgColor,
                    color:Colors.inputfontColor,justifyContent:'center',alignSelf:'center',maxHeight:heightPercentageToDP(5),
                    fontSize:widthPercentageToDP(4),width:'90%',alignSelf:'center',verticalAlign:'middle',lineHeight:widthPercentageToDP(4)*1.75,
                    height:heightPercentageToDP(5),borderRadius:heightPercentageToDP(4.75)
                    ,paddingLeft:10,marginBottom:5,marginTop:5,paddingRight:10,paddingTop:0,bottom:0,
                },
                empty:{
                    includeFontPadding:false,
                    fontFamily:'Cairo-Bold',
                    fontWeight:'200',
                    color:Colors.inputfontColor,
                    fontSize:18,
                    textAlign:'center'
                },
                modalView:{
                    height:'100%',width:'90%',
                    overflow:'hidden',alignSelf:'center'
                },
                productData:{
                    includeFontPadding:false,
                    textAlign:'left',
                    alignSelf:'flex-start',
                    fontFamily:'Cairo-Regular',
                    fontSize:widthPercentageToDP(4.5),
                    color:Colors.inputfontColor,
                },
                rowFront: {
                    backgroundColor: Colors.whiteColor,
                },
                rowBack: {
                    borderRadius:30,
                    alignItems: 'center',
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 15,
                },
                carttext:{
                    includeFontPadding:false,
                    fontFamily:'Cairo-Regular',
                    color:Colors.whiteColor,
                    fontSize:18,
                    alignSelf:'center'
                },
                addCart:{
                    // position:'absolute',bottom:10,
                    justifyContent:'center',alignSelf:'center',
                    // width:'100%',
                    paddingHorizontal:widthPercentageToDP(3),
                    borderRadius:heightPercentageToDP(4.75),marginBottom:20,
                    backgroundColor:Colors.blueColor
                    ,height:heightPercentageToDP(4.75),flexDirection:'row'},
                    productImage:{
                        borderRadius:10,
                        height:heightPercentageToDP(10),
                        width:heightPercentageToDP(10),
                        alignSelf:'flex-start',
                        resizeMode:'contain'
                    },addtoCart:{
                        includeFontPadding:false,
                        alignSelf:'center',
                        // margin:10,
                        // alignSelf:'flex-end',
                        height:25,
                        width:25,tintColor:Colors.whiteColor,
                    },productText:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Regular',
                        fontWeight:'100',
                        fontSize:20,
                        marginBottom:10,
                    },tagline:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Bold',
                        // fontFamily:'Cairo-Bold',
                        fontSize:25,
                        color:Colors.black
                    },description:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Regular',
                        fontWeight:'100',
                        fontSize:15,
                        textAlign:'justify'
                    },addminus:{
                        includeFontPadding:false,
                        height:40,width:40,
                        textAlign:'center',
                        fontWeight:'100',
                        fontSize:25,alignSelf:'center'
                    },count:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Regular',
                        fontWeight:'100',
                        fontSize:16,
                        alignSelf:'flex-start',
                        textAlign:'left',borderLeftWidth:0.5,borderRightWidth:0.5
                    },
                    cardData:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Bold',
                        fontSize:heightPercentageToDP(2),
                        color:Colors.inputfontColor,
                        alignSelf:'center'
                    },shadow:{
                        shadowOffset: { width: 0, height: 3 },
                        shadowRadius: 3,
                        shadowOpacity: 0.12,
                    }
                    
                });
                
                const addAlltoShoppingCartVGS=(_totalVal,_profile,_LoadUpdate=null)=>{
                    if(_LoadUpdate!=null){
                        _LoadUpdate(true);
                    }
                    
                    var allItems=[];
                    for (let index = 0; index < allproducts.length; index++) {
                        // var sku=allproducts[index].item.value.sku;//getproductID(allproducts[index].item.value) 
                        if(allproducts[index].item.value.type==WebServices.variableCommand){
                            //allproducts[index].item.value.sku;
                            if(Tools.stringIsEmpty(allproducts[index].item.value.sku)){
                                allItems.push({
                                    // "ProductId":sku,
                                    "ProductCode":allproducts[index].item.details.data.sku,
                                    "Quantity":allproducts[index].count
                                })
                            }else{
                                allItems.push({
                                    // "ProductId":sku,
                                    "ProductCode":allproducts[index].item.value.sku,
                                    "Quantity":allproducts[index].count,
                                    "Options":getattribute(allproducts[index].item.details.data.sku)
                                })
                            }
                        }else{
                            allItems.push({
                                // "ProductId":sku,
                                "ProductCode":allproducts[index].item.value.sku,
                                "Quantity":allproducts[index].count
                            })
                        }
                        
                    }
                    var bodyData={
                        "ShopcartId":"",//shopCartInfo==undefined?"":shopCartInfo.Answer.ShopCart.ShopCartId,
                        "EntityType": 12,
                        "langIso": "en",
                        "Items": allItems
                    }
                    // console.log("add : "+JSON.stringify(bodyData));
                    fetch (WebServices.MainURL+WebServices.addtoCart,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify(bodyData)
                    },5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        var shopCart=JSON.parse(responseJson);
                        // console.log("addAlltoShoppingCartVGS"+responseJson);
                        if(Tools.stringIsEmpty(shopCart.Header.ErrorMessage)){
                            // console.log("addAlltoShoppingCartVGS"+responseJson);
                            setShopCartInfo(shopCart);
                            setAccountToCart(shopCart,_profile,_totalVal,_LoadUpdate);
                            //validateShoppingCartVGS(shopCart.Answer.ShopCart.ShopCartId,_totalVal)
                            //postTransaction(shopCart.Answer.ShopCart.ShopCartId,_totalVal)
                        }else{
                            Alert.alert(shopCart.Header.ErrorMessage)
                            updateLoading(false);
                        }
                    }).catch((error) =>{
                        // console.log('addall '+error);
                        updateLoading(false);
                        throwPaymentError("Check"+error);
                    });
                }
                const getData=(code)=>{
                    setFinalValue(code);
                }
                const setAccountToCart=(_shopcart,_profile,_totalVal,_LoadUpdate)=>{
                    
                    /*
                    {
                    "ShopcartId": "sample string 1",
                    "LangIso": "sample string 2",
                    "ShopCartItemAccounts": [
                    {
                    "ShopcartItemId": "sample string 1",
                    "Position": 2,
                    "AccountId": "sample string 3"
                    },
                    {
                    "ShopcartItemId": "sample string 1",
                    "Position": 2,
                    "AccountId": "sample string 3"
                    }
                    ]
                    }
                    */
                    // console.log('Check');
                    var allItems=[];
                    for (let index = 0; index < allproducts.length; index++) {
                        // console.log('Check'+JSON.stringify(allproducts[index]));
                        if(allproducts[index].item.details!=null){
                            // console.log('Check'+cartItems[index].item.details);
                            if(allproducts[index].item.details.type==WebServices.topupCommand){
                                shopCartItem=getShopCartItem(allproducts[index].item.value,_shopcart);
                                for (let i = 0; i < allproducts[index].count; i++) {
                                    allItems.push({
                                        "ShopcartItemId":shopCartItem.ShopCartItemId,
                                        "Position":i+1,
                                        "AccountId":allproducts[index].item.details.data.AccountId
                                    })
                                }
                            }
                        }
                    }
                    // return;
                    if(allItems.length==0){
                        saveShopCartAccount(_shopcart.Answer.ShopCart.ShopCartId,_profile,_totalVal,_LoadUpdate);
                        // validateShoppingCartVGS(_shopcart.Answer.ShopCart.ShopCartId,_profile,_totalVal,_LoadUpdate);
                        return;
                    }
                    
                    var bodyData={
                        "ShopcartId":shopCartInfo==undefined?"":shopCartInfo.Answer.ShopCart.ShopCartId,
                        "langIso": "en",
                        "ShopCartItemAccounts": allItems
                    }
                    
                    
                    fetch (WebServices.MainURL+WebServices.setItemAccount,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify(bodyData)
                    },5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        // console.log("Set account - "+responseJson);
                        saveShopCartAccount(_shopcart.Answer.ShopCart.ShopCartId,_profile,_totalVal,_LoadUpdate);
                        // validateShoppingCartVGS(_shopcart.Answer.ShopCart.ShopCartId,_profile,_totalVal,_LoadUpdate);
                        
                        // postTransaction(_shopcart.Answer.ShopCart.ShopCartId,_totalVal)
                    }).catch((error) =>{
                        // console.log('SAC '+error);
                        updateLoading(false);
                        throwPaymentError("Check"+error);
                    });
                }
                const validateShoppingCartVGS=(_shotCartId,_profile,_totalVal,_LoadUpdate)=>{
                    var bodyData={
                        "ShopcartId":_shotCartId,
                        "LangIso": "en",
                        "MemberId": Tools.IsNull(_profile.Id)?"":_profile.Id
                    }
                    console.log('=== validateShoppingCartVGS API Request ===');
                    console.log('Full bodyData:', JSON.stringify(bodyData, null, 2));
                    console.log('=== End validateShoppingCartVGS Request ===');
                    fetch (WebServices.MainURL+WebServices.validateCart,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify(bodyData)
                    },5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        // console.log("validateShoppingCartVGS : "+responseJson);
                        console.log('=== validateShoppingCartVGS API Response ===');
                        console.log('Full response:', responseJson);
                        console.log('=== End validateShoppingCartVGS Response ===');

                        var responseObj=JSON.parse(responseJson);
                        if(!responseObj.Answer.ValidateShopCart.RestrictValidPayments){
                            // console.log("getPaymentURL");
                            // postTransaction(_shotCartId,_totalVal,_LoadUpdate)
                            console.log('=== validateShoppingCartVGS Debug ===');
                            console.log('_totalVal being passed:', _totalVal);
                            console.log('paymentMethod:', paymentMethod);
                            console.log('=== End validateShoppingCartVGS Debug ===');
                               if (paymentMethod === 'paylater') {
                getPayLaterURL(_shotCartId, _profile, _totalVal);
            } else {
                getPaymentURL(_shotCartId, _profile, _totalVal);
            }
                            // saveShopCartAccount(_shotCartId,_profile,_totalVal,_LoadUpdate);
                        }
                        else{
                            updateLoading(false);
                        }
                    }).catch((error) =>{
                        // console.log('UPE '+error);
                        updateLoading(false);
                        throwPaymentError("Check"+error);
                    });
                }

             const generatePayLaterReference = () => {
  const timestamp = Date.now().toString(36);

  let perfEntropy = '';
  try {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      perfEntropy = Math.floor(performance.now()).toString(36);
    } else {
      perfEntropy = Math.floor(Math.random() * 1e6).toString(36);
    }
  } catch (e) {
    perfEntropy = Math.floor(Math.random() * 1e6).toString(36);
  }

  const randomPart = Math.random().toString(36).substring(2, 10);

  return `PL-${timestamp}-${perfEntropy}-${randomPart}`;
};





                const getAvailableTejoryPoints=()=>{
                    var verifyUrl=WebServices.getAvailablePoints.replace("{MemberId}",profileIn.Id).replace('{SCID}',shopCartInfo.Answer.ShopCart.ShopCartId)
                    // console.log("getAvailableTejoryPoints - "+verifyUrl);
                    fetch (WebServices.MainURL+verifyUrl,{
                        method: 'GET',
                        headers: {
                            'Authorization':'Bearer '+accessToken.access_token,
                            'Content-Type': 'application/json',
                        },
                    },5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        // console.log(responseJson);
                        var responseObj=JSON.parse(responseJson);
                        setAvailablePoints(responseObj);
                        
                    }).catch((error) =>{
                        // console.log("Media "+ error);
                    });
                }
                
                const saveShopCartAccount=(_shotCartId,_profile,_totalVal,_LoadUpdate)=>{
                    console.log('=== saveShopCartAccount Debug ===');
                    console.log('Received _totalVal:', _totalVal);
                    console.log('=== End saveShopCartAccount Debug ===');
                    if(_LoadUpdate!=null){
                        _LoadUpdate(true);
                    }
                    var bodyData={
                        "MemberId":_profile.Id,
                        "AccountcategoryIDs": "40C6BA8A-F16B-E67D-3C9C-0178C57B9AEE",
                        "SearchExist":true,
                        "Email": _profile.Email,
                        "Mobile":_profile.Mobile,
                        "FirstName":_profile.FirstName,
                        "LastName":_profile.LastName,
                        "ShopcartId":_shotCartId,
                        "SetAsCartOwner":true,
                        "SetAsCartGuest": false,
                        "fields": [
                            {
                                "MetaFieldCode": "FT1",
                                "Value": _profile.FirstName
                            },
                            {
                                "MetaFieldCode": "FT3",
                                "Value": _profile.LastName,
                            },
                            {
                                "MetaFieldCode": "FT21",
                                "Value": _profile.Email,
                            },
                            {
                                "MetaFieldCode": "FT15",
                                "Value": _profile.Mobile,
                            }
                        ]
                    }
                    console.log('=== saveShopCartAccount API Request ===');
                    console.log('Full bodyData:', JSON.stringify(bodyData, null, 2));
                    console.log('=== End saveShopCartAccount Request ===');

                    fetch (WebServices.MainURL+WebServices.saveAccount,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify(bodyData)
                    },5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        // console.log("saveShopCartAccount : "+responseJson);
                        
                        var responseObj=JSON.parse(responseJson);
                        if(Tools.stringIsEmpty(responseObj.Error)){
                            validateShoppingCartVGS(_shotCartId,_profile,_totalVal,_LoadUpdate);
                        }
                        else{
                            updateLoading(false);
                            Alert.alert(responseObj.Error)
                        }
                        // }
                        // else{
                        //     if(_LoadUpdate!=null){
                        //         _LoadUpdate(false);
                        //     }
                        // }
                    }).catch((error) =>{
                        // console.log('UPE '+error);
                        updateLoading(false);
                        throwPaymentError("Check"+error);
                    });
                }
                const checkPayment=(_paymentID,_shopcartID)=>{
                    console.log('🔁 [checkPayment START]', {
  paymentID: _paymentID,
  shopcartID: _shopcartID,
  errorcheck
});

if (showReceipt) {
    console.log('🛑 checkPayment aborted — receipt already shown');
    return;
  }

                    var checkPay=WebServices.checkPayment.replace("{PaymentId}",_paymentID).replace("{ShopCartId}",_shopcartID);
                    console.log(checkPay);
                    fetch (WebServices.MainURL+checkPay,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                    },5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        console.log('checkPayment-'+responseJson);
                        var responseObj=JSON.parse(responseJson);
                        if(Tools.stringIsEmpty(responseObj.Error)){
                            if(Tools.stringIsContains(responseObj.Result,"completed")||Tools.stringIsContains(responseObj.Result,"failed")){
                                updateLoading(false);
                                setReceiptData(responseObj);
                                setShowReceipt(true);
                                if(Tools.stringIsContains(responseObj.Result,"completed")){
                                    // var ondone=props.route.params.onDone;
                                    // ondone();
                                    // console.log("Resp :"+JSON.stringify(responseObj));
                                    // console.log("LastCartItems-"+ JSON.stringify(LastCartItems));
                                    // console.log("LastShopcart-"+ JSON.stringify(LastShopcart));
                                    // console.log("profile-"+ JSON.stringify(profile));
                                    logAddPaymentInfoEvent(responseObj);
                                    // logPurchaseEvent(responseObj,state.cartItems,shopCartInfo.Answer.ShopCart,state.profile);
                                    logPurchaseEvent(responseObj,LastShopcart,LastCartItems,profile);
                                    var onDoneCart=props.route.params.onDoneCart;
                                    onDoneCart();
                                    // DeviceEventEmitter.emit('onDoneCart');
                                    SecureStore.setItemAsync("shopcart",undefined);
                                }
                            }
                            else{
                                const tmpCheck=errorcheck+1;
                                // console.log(tmpCheck+"-errorcheck-"+errorcheck);
                                // setState({errorcheck:errorcheck+1},()=>{
                                    //     if(errorcheck>3){
                                //         updateLoading(false);
                                //         throwPaymentError(errorcheck+"Check"+error);
                                //     }else{
                                //         setTimeout(()=>{
                                    //             checkPayment(_paymentID,_shopcartID)
                                //         },5000);
                                //     }
                                // });
                                setErrorCheck(errorcheck=>errorcheck+1);
                                if(errorcheck<5){
                                    setTimeout(()=>{
                                        checkPayment(_paymentID,_shopcartID)
                                    },5000);
                                }else{
                                    updateLoading(false);
                                    throwPaymentError(errorcheck+"Check"+error);
                                }
                            }
                        }
                        else{
                            updateLoading(false);
                            Alert.alert(responseObj.Error)
                        }
                    }).catch((error) =>{
                        // console.log('UPE '+error);
                        throwPaymentError("Check"+error);
                        updateLoading(false);
                    });
                }

                const checkPayLaterPayment = (_paymentID, _shopcartID, _amount, _payPoints) => {
                    console.log('🔁 [checkPayLater START]', {
  paymentID: _paymentID,
  shopcartID: _shopcartID,
  amount: _amount,
  payPoints: _payPoints,
  errorcheck
});

 if (showReceipt) {
    console.log('🛑 checkPayLater aborted — receipt already shown');
    return;
  }

    var checkPayUrl = WebServices.checkPayLater
        .replace("{PaymentId}", _paymentID)
        .replace("{ShopCartId}", _shopcartID)
        .replace("{Amount}", _amount)
        .replace("{PayPoints}", _payPoints);
    
    console.log('checkPayLater URL:', checkPayUrl);
    
    fetch(WebServices.MainURL + checkPayUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    }, 5000)
    .then((response) => response.text())
    .then((responseJson) => {
        console.log('checkPayLater Response:', responseJson);
        var responseObj = JSON.parse(responseJson);
        console.log('📦 [checkPayLater RESPONSE]', responseObj);


        if (Tools.stringIsEmpty(responseObj.Error)) {
            if (Tools.stringIsContains(responseObj.Result, "completed") || Tools.stringIsContains(responseObj.Result, "failed")) {
                updateLoading(false);
                setReceiptData(responseObj);
                setShowReceipt(true);
                if (Tools.stringIsContains(responseObj.Result, "completed")) {
                    console.log('🎉 [checkPayment SUCCESS]');

                    logAddPaymentInfoEvent(responseObj);
                    logPurchaseEvent(responseObj, LastShopcart, LastCartItems, profile);
                    var onDoneCart = props.route.params.onDoneCart;
                    onDoneCart();
                    SecureStore.setItemAsync("shopcart", undefined);
                }
            } else {
                console.log('⏳ [checkPayment RETRY]', {
  currentErrorCheck: errorcheck,
  nextRetryInSeconds: 5
});

                // Payment still pending - retry
                const tmpCheck = errorcheck + 1;
                setErrorCheck(errorcheck => errorcheck + 1);
                if (errorcheck < 5) {
                    setTimeout(() => {
                        checkPayLaterPayment(_paymentID, _shopcartID, _amount, _payPoints);
                    }, 5000);
                } else {
                    updateLoading(false);
                    console.log('💥 [checkPayment FINAL ERROR]');

                    throwPaymentError(errorcheck + " PayLater Check Error");
                }
            }
        } else {
            updateLoading(false);
            Alert.alert(responseObj.Error);
        }
    })
    .catch((error) => {
        throwPaymentError("PayLater Check Error: " + error);
        updateLoading(false);
    });
}

                
                const throwPaymentError=(_from)=>{
                    // console.log("Error"+_from);
                    console.log('🚨 [throwPaymentError CALLED FROM] =>', _from);
                    Alert.alert(i18n.t('errorpayment'));
                    logPurchaseFailedEvent(state.cartItems,shopCartInfo.Answer.ShopCart);
                }
                const getPaymentURL=(_shopCardID,_profile,_totalAmount)=>{
                    var bodyData={
                        "MemberId":_profile.Id,
                        "ShopcartId":_shopCardID,
                        "Amount":_totalAmount,
                        "PayByPoints":finalPoints,
                        "Address":{
                            "street":_profile.BillingAddress.street,
                            "city":_profile.BillingAddress.city,
                            // "state":_profile.BillingAddress.state,
                            "country":_profile.BillingAddress.country,
                            "postalCode":_profile.BillingAddress.postalCode
                        },
                        "Account":{
                            "firstName":_profile.FirstName,
                            "lastName":_profile.LastName,
                            "phone":_profile.Mobile,
                            "email":_profile.Email
                        }
                    }
                    // console.log('initskipcash  Req : '+JSON.stringify(bodyData));
                    fetch (WebServices.MainURL+WebServices.initskipcash,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify(bodyData)
                    },5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        // console.log('initskipcash  Resp : '+responseJson);
                        var responseObj=JSON.parse(responseJson);
                        if(Tools.IsNull(responseObj.Error)){
                            updateLoading(false);
                            //openskipcashurl
                            setPaymentWebUrl(responseObj.PaymentURL);
                            setShowPay(true);
                        }
                        else{
                            throwPaymentError("Check"+responseJson);
                            updateLoading(false)
                        }
                    }).catch((error) =>{
                        updateLoading(false)
                        throwPaymentError("Check"+error);
                    });
                }

                const getPayLaterURL = (_shopCardID, _profile, _totalAmount) => {
    console.log('=== getPayLaterURL Debug ===');
    console.log('Received _totalAmount:', _totalAmount);
    console.log('finalPoints state:', finalPoints);
    console.log('bodyData Amount will be:', _totalAmount);
    console.log('=== End getPayLaterURL Debug ===');
    var bodyData = {
        "MemberId": _profile.Id,
        "ShopcartId": _shopCardID,
        "Amount": _totalAmount,
        "PayByPoints": finalPoints,
        "CustomReference": payLaterReferenceRef.current,
        "Address": {
            "street": _profile.BillingAddress.street,
            "city": _profile.BillingAddress.city,
            "country": _profile.BillingAddress.country,
            "postalCode": _profile.BillingAddress.postalCode
        },
        "Account": {
            "firstName": _profile.FirstName,
            "lastName": _profile.LastName,
            "phone": _profile.Mobile,
            "email": _profile.Email
        }
    }
    console.log('initPayLater Request:', JSON.stringify(bodyData));
    
    fetch(WebServices.MainURL + WebServices.initPayLater, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData)
    }, 5000)
    .then((response) => response.text())
    .then((responseJson) => {
        console.log('initPayLater Response:', responseJson);
        var responseObj = JSON.parse(responseJson);
        if (Tools.IsNull(responseObj.Error)) {
            updateLoading(false);
            // PaymentURL - same key as SkipCash (confirmed by BE)
            setPaymentWebUrl(responseObj.PaymentURL);
            setShowPay(true);
        } else {
            throwPaymentError("PayLater Init Error: " + responseJson);
            updateLoading(false);
        }
    })
    .catch((error) => {
        updateLoading(false);
        throwPaymentError("PayLater Init Error: " + error);
    });
}


                const getproductID=(_product)=>{
                    for (let index = 0; index < _product.attributes.length; index++) {
                        const element = _product.attributes[index];
                        if(element.name==WebServices.productid){
                            return element.options[0]
                        }
                    }
                    return null;
                }
                const getattribute=(_attribute)=>{
                    return _attribute.substring(_attribute.indexOf('-') + 1);
                }
                const getShopCartItem=(_item,_shopCart)=>{
                    for (let index = 0; index < _shopCart.Answer.ShopCart.Items.length; index++) {
                        // console.log(_item.sku+"//"+_shopCart.Answer.ShopCart.Items[index].ProductCode);
                        if(_item.sku==_shopCart.Answer.ShopCart.Items[index].ProductCode){
                            return _shopCart.Answer.ShopCart.Items[index];
                        }
                    }
                    return null;
                    
                }
                
                const CartUpdateNo=(product,valIn)=>{
                    var allproductsIn=allproducts;
                    for (let index = 0; index < allproductsIn.length; index++) {
                        if(allproductsIn[index].item.value.id == product.item.value.id){
                            allproductsIn[index].count+=valIn;
                            if(allproductsIn[index].count<1)
                                allproductsIn[index].count=1;
                        }
                        
                    }setAllProducts(allproductsIn);
                    getTotal();
                }
                const OnDone=()=>{
                    if(showReceipt){
                        props.navigation.navigate("Home");
                    }else{
                        props.navigation.setParams({ loading: false });
                        props.navigation.goBack();
                    }
                }
                const updateLoading=(_load)=>{
                    setIsLoading(_load);
                }
                
                const AddUserLevel=()=>{
                    var dataGot=profile;
                    console.log("USER : "+JSON.stringify(dataGot));
                    ReactMoE.setUserUniqueID(dataGot.Mobile);
                    setTimeout(() => {
                        ReactMoE.setUserName(dataGot.Mobile);
                        ReactMoE.setUserFirstName(dataGot.FirstName);
                        ReactMoE.setUserLastName(dataGot.LastName);
                        ReactMoE.setUserEmailID(dataGot.Email);
                        ReactMoE.setUserContactNumber(dataGot.Mobile);
                        ReactMoE.setUserAttribute("leisurepoints", dataGot.Points);
                        ReactMoE.setUserAttribute("leisurecardno", dataGot.CardNo);
                        //   ReactMoE.setUserAttribute("mediaId", GetMediaIDs(dataGot));
                        //   mediaBalance=GetMediaBalanceIDs(dataGot).walletBalance;
                        //   ReactMoE.setUserAttribute("mediaBalance", mediaBalance);
                        
                    }, 1500);
                }
                return (
                    <KeyboardAvoidingView style={{flex:1,backgroundColor:Colors.bgColor}} behavior={(Platform.OS === 'ios' ? 'padding' : 'undefined')} enabled>
                    <BackgroundWall />
                    <SafeAreaView style={{marginTop:StatusBar.currentHeight}} >
                    
                    <View style={{width:'90%',alignSelf:'center',marginTop:heightPercentageToDP(1)}}>
                    <TouchableOpacity onPress={()=>{OnDone()}}>
                    <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                    </TouchableOpacity>
                    </View>
                    <View style={styles.modalView}>
                    <View style={{alignSelf:'flex-start'}}>
                    
                    </View>
                    <ScrollView style={{flex:1,marginTop:widthPercentageToDP(2)}} contentContainerStyle={{paddingBottom:350}} showsVerticalScrollIndicator={false}>
                    {(!expandAddress)&& !showReceipt&&
                        <View  style={{backgroundColor:Colors.whiteColor,borderRadius:20,padding:10,marginBottom:15}}>
                        <View style={{flexDirection:'row',width:'100%'}}>
                        <Image style={{width:heightPercentageToDP(6),height:heightPercentageToDP(6),alignSelf:'center',tintColor:Colors.blueColor}} source={locationButton}/>
                        <View style={{flex:1}}>
                        <Text allowFontScaling={false} style={[styles.productData,{fontSize:20}]}>{i18n.t('billingaddress')}</Text>
                        {canPay&&
                            <Text numberOfLines={2} allowFontScaling={false} style={[styles.productData,{width:'72%', fontSize:18,color:Colors.black}]}>{checkAddress()}</Text>
                        }
                        {!canPay&&
                            <Text numberOfLines={1} allowFontScaling={false} style={[styles.productData,{width:'80%', fontSize:18,color:Colors.warningColor}]}>*{checkAddress()}</Text>}
                            </View>
                            {(!showReceipt)&&
                                <TouchableOpacity onPress={()=>{
                                    setExpandAddress(true);
                                }} style={{width:'20%',height:35,position:'absolute',bottom:0,justifyContent:'flex-end',right:0,paddingEnd:'5%',paddingStart:'5%',borderRadius:35,backgroundColor:Colors.blueColor}}>
                                <Text allowFontScaling={false} style={[styles.productData,{fontSize:18,textAlign:'right',alignSelf:'center',color:Colors.whiteColor}]}>{i18n.t("edit")}</Text>
                                </TouchableOpacity>}
                                </View>
                                </View>
                            }
                            {(expandAddress)&&!showReceipt&&
                                <View  style={{backgroundColor:Colors.whiteColor,borderRadius:20,padding:10,marginBottom:15}}>
                                <View>
                                <Text allowFontScaling={false} style={[styles.productData,{paddingLeft:10,color:Colors.tealGreen}]}>{i18n.t("billingaddress")}</Text>
                                {/* <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={{height:heightPercentageToDP(50)}}> */}
                                    <TextInput ref={ref=>{
                                        ref_inputFN.current=ref;
                                    }}
                                    blurOnSubmit={false} allowFontScaling={false} value={ toConfirmProfile.FirstName} maxLength={60} style={[styles.inputField,styles.shadow]} onChangeText={(text)=>{
                                        var currentProfile={...toConfirmProfile};
                                        currentProfile.FirstName=text;
                                        setToConfirmProfile(currentProfile);
                                    }}
                                    placeholderTextColor={Colors.placeholdertext}
                                    onSubmitEditing={() => {
                                        if(Tools.stringIsEmpty(toConfirmProfile.LastName)){
                                            ref_inputLN.current.focus();
                                        }else{
                                            Keyboard.dismiss();
                                        }
                                    }} 
                                    textContentType='name'
                                    placeholder='*First Name'></TextInput>
                                    <TextInput ref={ref=>{
                                        ref_inputLN.current=ref;
                                    }} blurOnSubmit={false} allowFontScaling={false} value={toConfirmProfile.LastName} maxLength={60} style={[styles.inputField,,styles.shadow]} onChangeText={(text)=>{
                                        var currentProfile={...toConfirmProfile};
                                        currentProfile.LastName=text;
                                        setToConfirmProfile(currentProfile);
                                    }}
                                    onSubmitEditing={()=>{Keyboard.dismiss()}}
                                    placeholderTextColor={Colors.placeholdertext}
                                    textContentType='familyName'
                                    placeholder='*Last Name'></TextInput>
                                    {/* <TextInput ref={ref=>{
                                        ref_inputMO.current=ref;
                                        }} onSubmitEditing={() => ref_inputMO.current.focus()} blurOnSubmit={false} allowFontScaling={false} editable={Tools.stringIsEmpty(props.route.params.profile.BillingAddress)} 
                                        value={toConfirmProfile.Mobile} maxLength={15} 
                                        style={[styles.inputField,
                                        Tools.stringIsEmpty(profile.Mobile)?{borderColor:Colors.black,color:Colors.black}:{borderColor:Colors.inactiveTab,color:Colors.inactiveTab} 
                                        ]}  onChangeText={(text)=>{
                                            var currentProfile=toConfirmProfile;
                                        currentProfile.Mobile=text;
                                        setState({toConfirmProfile:currentProfile});
                                        }}  placeholder='+974 3315 3315'></TextInput> */}
                                        <PhoneDropDownInput
                                        editable={Tools.IsNull(profile.Id)} 
                                        ref={phoneInputRef}
                                        textStyle={{color:Tools.IsNull(profile.Id)?Colors.inputfontColor:'#C0C0C0'}}
                                        inputStyle={{backgroundColor:Colors.bgColor,color:Tools.IsNull(profile.Id)?Colors.inputfontColor:'#C0C0C0'}}
                                        viewStyle={[{width:'91%',height:heightPercentageToDP(4.75),marginBottom:5,marginTop:5},
                                            Tools.IsNull(profile.Id)?{backgroundColor:Colors.bgColor}:{backgroundColor:Colors.bgColor}]}
                                            defaultValue={findCountryDialCode(toConfirmProfile.Mobile)}
                                            defaultPhone={findCountry(toConfirmProfile.Mobile)}
                                            inputChange={(text) => {
                                                var currentProfile={...toConfirmProfile};
                                                currentProfile.Mobile=text;
                                                setToConfirmProfile(currentProfile)
                                            }}/>
                                            <TextInput ref={ref=>{
                                                ref_inputEM.current=ref;
                                            }} onSubmitEditing={() => {
                                                if(Tools.stringIsEmpty(toConfirmProfile.BillingAddress.street)){
                                                    ref_inputST.current.focus()
                                                }else{
                                                    Keyboard.dismiss();
                                                }
                                            }
                                        } blurOnSubmit={false} allowFontScaling={false} value={toConfirmProfile.Email} maxLength={255} style={[styles.inputField,styles.shadow]} onChangeText={(text)=>{
                                            var currentProfile={...toConfirmProfile};
                                            currentProfile.Email=text;
                                            setToConfirmProfile(currentProfile)
                                        }}
                                        textContentType='emailAddress'
                                        placeholderTextColor={Colors.placeholdertext}
                                        placeholder='*Email'></TextInput>
                                        <TextInput ref={ref=>{
                                            ref_inputST.current=ref;
                                        }} onSubmitEditing={() => {
                                            if(Tools.stringIsEmpty(toConfirmProfile.BillingAddress.city)){
                                                ref_inputCT.current.focus()
                                            }else{
                                                Keyboard.dismiss();
                                            }
                                            
                                        }}
                                        blurOnSubmit={false} allowFontScaling={false}
                                        value={toConfirmProfile.BillingAddress.street} maxLength={60} style={[styles.inputField,styles.shadow]} onChangeText={(text)=>{
                                            // console.log("Up S");
                                            var currentProfile={...toConfirmProfile};
                                            currentProfile.BillingAddress.street=text;
                                            setToConfirmProfile(currentProfile)
                                            
                                        }} 
                                        textContentType='fullStreetAddress'
                                        placeholderTextColor={Colors.placeholdertext}
                                        placeholder='*Street'></TextInput>
                                        <TextInput allowFontScaling={false} ref={ref=>{
                                            ref_inputCT.current=ref;
                                        }}blurOnSubmit={false} 
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                            
                                        }}
                                        value={toConfirmProfile.BillingAddress.city} maxLength={50} style={[styles.inputField,styles.shadow]} onChangeText={(text)=>{
                                            // console.log("Up");
                                            const cc={...toConfirmProfile};
                                            cc.BillingAddress.city=text;
                                            setToConfirmProfile(cc)
                                            
                                        }} placeholderTextColor={Colors.placeholdertext}
                                        textContentType='addressCity'
                                        placeholder='*City'></TextInput>
                                        
                                        <TextInput ref={ref=>{
                                            ref_inputPO.current=ref;
                                        }}blurOnSubmit={false} allowFontScaling={false} 
                                        value={toConfirmProfile.BillingAddress.postalCode} maxLength={10} style={[styles.inputField,styles.shadow]} 
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                            
                                        }}
                                        onChangeText={(text)=>{
                                            var currentProfile={...toConfirmProfile};
                                            currentProfile.BillingAddress.postalCode=text;
                                            setToConfirmProfile(currentProfile);
                                        }}  
                                        placeholderTextColor={Colors.placeholdertext}
                                        textContentType='postalCode'
                                        placeholder='*P O Box'></TextInput>
                                        <TouchableOpacity style={[styles.inputField,{justifyContent:'center'},styles.shadow]}>
                                        <CountryDropDown
                                        defaultValue={toConfirmProfile.BillingAddress.country}
                                        textStyle={[{fontFamily:'Cairo-Regular',textAlign:'center',fontSize:widthPercentageToDP(4)}]}
                                        updateData={(text)=>{
                                            var currentProfile={...toConfirmProfile};
                                            currentProfile.BillingAddress.country=text;
                                            setToConfirmProfile(currentProfile);
                                        }}
                                        /></TouchableOpacity> 
                                        
                                        
                                        {/* </ScrollView> */}
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'flex-end',marginEnd:'1%',marginTop:'5%'}}>
                                        <TouchableOpacity onPress={()=>{
                                            var currentProfile=toConfirmProfile
                                            setProfile(currentProfile)
                                            setExpandAddress(false);
                                        }} style={{justifyContent:'flex-end',right:0,backgroundColor:Colors.blueColor,paddingEnd:'5%',paddingStart:'5%',borderRadius:heightPercentageToDP(4)}}>
                                        <Text allowFontScaling={false} style={[styles.productData,{fontSize:18,color:Colors.whiteColor,textAlign:'right',alignSelf:'flex-end'}]}>{i18n.t('update')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{
                                            setExpandAddress(false);
                                            setToConfirmProfile(((Tools.IsNull (profile.BillingAddress))?tempProfile:profile));
                                            // setState({expandAddress:false,toConfirmProfile:((Tools.IsNull (profile.BillingAddress))?tempProfile:profile),},)
                                        }} style={{justifyContent:'flex-end',right:0,backgroundColor:Colors.blueColor,paddingEnd:'5%',paddingStart:'5%',borderRadius:heightPercentageToDP(4),marginStart:'5%'}}>
                                        <Text allowFontScaling={false} style={[styles.productData,{fontSize:18,color:Colors.whiteColor,textAlign:'right',alignSelf:'flex-end'}]}>{i18n.t('cancel')}</Text>
                                        </TouchableOpacity></View>
                                        </View>
                                    }
                                    {!showReceipt&&availablePoints!=undefined&&
                                        <View style={{backgroundColor:Colors.whiteColor,borderRadius:20,padding:10,marginBottom:15}}>
                                        <View style={{flexDirection:'row'}}>
                                        <Image style={{width:heightPercentageToDP(3.5),height:heightPercentageToDP(3.5),marginHorizontal:widthPercentageToDP(3),alignSelf:'center',tintColor:Colors.blueColor}} source={tejoryIcon}/>
                                        <View style={{width:'85%'}}>
                                        <Text allowFontScaling={false} style={[styles.productData,{fontSize:20}]}>{i18n.t('paywithtejory')}</Text>
                                        <View style={{alignItems: 'center', justifyContent: 'center',width:'100%', }}>
                                        {/* <View style={{flexDirection:'row',justifyContent:'space-between',width:'83%',paddingStart:(widthPercentageToDP(2.5)),alignSelf:'center'}}>
                                            <Text style={styles.sliderTxt}>0</Text>
                                            <Text style={styles.sliderTxt}>{availablePoints.PointsMax}</Text>
                                            </View> */}
                                            {(availablePoints.PointsMax<=0)&& <Text style={[styles.productData,{fontSize:18,alignSelf:'center'}]}>{i18n.t('notenough')}</Text>}
                                            {availablePoints.PointsMax>0&&
                                                <View style={{flexDirection:'row',justifyContent:'space-between',width:'85%',alignSelf:'center'}}>
                                                
                                                <TouchableOpacity disabled={finalPoints<=0} onPress={()=>{onAddPoints(-1)}} style={{backgroundColor:Colors.yellowColor,width:widthPercentageToDP(10),
                                                    height:widthPercentageToDP(10),borderRadius:widthPercentageToDP(3),justifyContent:'center',opacity:finalPoints>0?1:0.5}}>
                                                    <Text style={styles.sliderButtonTxt}>-</Text></TouchableOpacity>
                                                    <Text style={[styles.sliderButtonTxt,{color:Colors.black}]}>{finalPoints}</Text>
                                                    <TouchableOpacity disabled={finalPoints>=availablePoints.PointsMax} onPress={()=>{onAddPoints(1)}} style={{backgroundColor:Colors.yellowColor,width:widthPercentageToDP(10),
                                                        opacity:finalPoints<availablePoints.PointsMax?1:0.5,
                                                        height:widthPercentageToDP(10),borderRadius:widthPercentageToDP(3),justifyContent:'center'}}>
                                                        <Text style={styles.sliderButtonTxt}>+</Text></TouchableOpacity>
                                                        </View>}
                                                        </View>
                                                        </View>
                                                        </View>
                                                        </View>
                                                    }
                                                    {(shopCartInfo.Answer.ShopCart.Items.length>0&&expandCart)&&
                                                        <TouchableOpacity onPress={()=>{
                                                            setExpandCart(false);
                                                        }} style={{backgroundColor:Colors.whiteColor,borderRadius:20,padding:10,marginBottom:15}}>
                                                        <FlatList
                                                        removeClippedSubviews={false}
                                                        data={shopCartInfo.Answer.ShopCart.Items}
                                                        renderItem={ (data, rowMap) => (
                                                            getCartItem(data.item)
                                                        )}
                                                        />
                                                        <View style={{height:heightPercentageToDP(3)}}>{getTotalValue()}</View>
                                                        </TouchableOpacity>
                                                    }
                                                    
                                                    {(shopCartInfo.Answer.ShopCart.Items.length>0&&!expandCart)&&
                                                        <TouchableOpacity onPress={()=>{
                                                            // var ondone=props.route.params.onDone;
                                                            // ondone();
                                                            setExpandCart(true);
                                                        }} style={{backgroundColor:Colors.whiteColor,borderRadius:20,padding:10,marginBottom:15}}>
                                                        <View style={{flexDirection:'row'}}>
                                                        <Image style={{width:heightPercentageToDP(6),height:heightPercentageToDP(6),alignSelf:'center',tintColor:Colors.blueColor}} source={itemsButton}/>
                                                        <View style={{width:'20%'}}><Text allowFontScaling={false} style={[styles.productData,{fontSize:20}]}>{i18n.t('total')}</Text>
                                                        <Text allowFontScaling={false} style={[styles.productData,{fontSize:20,color:Colors.inputfontColor}]}>{totalNo} items</Text></View>
                                                        <View style={{width:'60%'}}>{getTotalValue(false)}</View>
                                                        </View>
                                                        </TouchableOpacity>
                                                    }

                                                    {/* Payment Method Selection */}
{!showReceipt && (
    <View style={{backgroundColor: Colors.whiteColor, borderRadius: 20, padding: 10, marginBottom: 15}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Image 
                style={{width: heightPercentageToDP(4), height: heightPercentageToDP(4), marginRight: 10, tintColor: Colors.blueColor}} 
                source={cardButton}
            />
            <Text allowFontScaling={false} style={[styles.productData, {fontSize: 20}]}>
                {i18n.t('paymentmethod') || 'Payment Method'}
            </Text>
        </View>
        
        {/* Pay Now Option */}
        <TouchableOpacity 
            style={{
                flexDirection: 'row', 
                alignItems: 'center', 
                padding: 12,
                borderWidth: 1,
                borderColor: paymentMethod === 'skipcash' ? Colors.blueColor : Colors.bgColor,
                borderRadius: 10,
                marginBottom: 8,
                backgroundColor: paymentMethod === 'skipcash' ? Colors.bgColor : Colors.whiteColor
            }}
            onPress={() => setPaymentMethod('skipcash')}
        >
            <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: Colors.blueColor,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
            }}>
                {paymentMethod === 'skipcash' && (
                    <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: Colors.blueColor
                    }}/>
                )}
            </View>
            <View>
                <Text style={{fontFamily: 'Cairo-SemiBold', fontSize: 16, color: Colors.black}}>
                    {i18n.t('paynow') || 'Pay Now'}
                </Text>
                <Text style={{fontFamily: 'Cairo-Regular', fontSize: 12, color: Colors.inputfontColor}}>
                    {i18n.t('paynowdesc') || 'Pay full amount with card'}
                </Text>
            </View>
        </TouchableOpacity>

        {/* Pay Later Option */}
        <TouchableOpacity 
            style={{
                flexDirection: 'row', 
                alignItems: 'center', 
                padding: 12,
                borderWidth: 1,
                borderColor: paymentMethod === 'paylater' ? Colors.blueColor : Colors.bgColor,
                borderRadius: 10,
                backgroundColor: paymentMethod === 'paylater' ? Colors.bgColor : Colors.whiteColor,
                opacity: (finalAmount >= 300 && finalAmount <= 25000) ? 1 : 0.5
            }}
            onPress={() => {
                if (finalAmount >= 300 && finalAmount <= 25000) {
                    setPaymentMethod('paylater');
                } else {
                    Alert.alert(
                        i18n.t('paylaternotavailable') || 'Pay Later Not Available',
                        i18n.t('paylateramountlimit') || 'Pay Later is only available for amounts between 300 - 25,000 QAR'
                    );
                }
            }}
            disabled={!(finalAmount >= 300 && finalAmount <= 25000)}
        >
            <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: (finalAmount >= 300 && finalAmount <= 25000) ? Colors.blueColor : Colors.inputfontColor,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
            }}>
                {paymentMethod === 'paylater' && (
                    <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: Colors.blueColor
                    }}/>
                )}
            </View>
            <View style={{flex: 1}}>
                <Text style={{fontFamily: 'Cairo-SemiBold', fontSize: 16, color: Colors.black}}>
                    {i18n.t('paylater') || 'Pay Later'}
                </Text>
                <Text style={{fontFamily: 'Cairo-Regular', fontSize: 12, color: Colors.inputfontColor}}>
                    {i18n.t('paylaterdesc') || 'Pay in installments'}
                </Text>
                {!(finalAmount >= 300 && finalAmount <= 25000) && (
                    <Text style={{fontFamily: 'Cairo-Regular', fontSize: 11, color: Colors.warningColor}}>
                        {i18n.t('paylateramountlimit') || 'Available for 300 - 25,000 QAR only'}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    </View>
)}
                                                    
                                                    {!showReceipt&&
                                                        <TouchableHighlight underlayColor={Colors.transparent} disabled={(!allproducts.length>0)||!canPay} style={[styles.addCart,{opacity:((!allproducts.length>0)||!canPay)?0.5:1}]} onPress={()=>{
                                                            // var checkOutFallBack=props.route.params.onPlaceOrder;
                                                            // checkOutFallBack(totalVal,profile,updateLoading);
                                                            // addAlltoShoppingCartVGS(totalVal,profile,updateLoading);  
                                                            // setAccountToCart(shopCartInfo,profile,shopCartInfo.Answer.ShopCart.TotalAmount,updateLoading);
                                                            // console.log("P : "+JSON.stringify(state.profile));
                                                            if(Tools.IsNull(state.profile)){
                                                                AddUserLevel();
                                                            }
                                                            logBeginCheckoutEvent(state.cartItems,shopCartInfo.Answer.ShopCart);
                                                            console.log('=== Proceed to Pay Debug ===');
                                                            console.log('Shop Cart Total:', shopCartInfo.Answer.ShopCart.TotalAmount);
                                                            console.log('beforefinalAmount:', beforefinalAmount);
                                                            console.log('finalAmount (being sent):', finalAmount);
                                                            console.log('finalPoints:', finalPoints);
                                                            console.log('Payment Method:', paymentMethod);
                                                            if (paymentMethod === 'paylater') {
    payLaterReferenceRef.current = generatePayLaterReference();
    console.log('🔑 Generated PayLater CustomReference:', payLaterReferenceRef.current);
}

console.log('=== End Proceed Debug ===');
                                                            console.log('=== End Proceed Debug ===');
                                                            saveShopCartAccount(shopCartInfo.Answer.ShopCart.ShopCartId,profile,finalAmount,updateLoading);
                                                            
                                                        }}>
                                                        <Text allowFontScaling={false} style={styles.carttext}>{i18n.t('proceedtopay')}</Text>
                                                        </TouchableHighlight>
                                                    }
                                                    {showReceipt&&
                                                        <View style={{backgroundColor:Colors.whiteColor,borderRadius:20,padding:10,marginBottom:15}}>
                                                        <Text style={[styles.orderConfrim,{color:Colors.blueColor}]} allowFontScaling={false}>{Tools.stringIsContains(ReceiptData.Result,"completed")?i18n.t("orderconfirm"):i18n.t("failed")}</Text>
                                                        {Tools.stringIsContains(ReceiptData.Result,"completed")&&<View>
                                                            <Text style={[styles.orderthank]} allowFontScaling={false}>{i18n.t("thankyoufororder")}</Text>
                                                            <Text style={[styles.orderConfrim]} allowFontScaling={false}>Order No : {ReceiptData.OrderSummary.SaleCode}</Text>
                                                            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                                                            <QRCode value={ReceiptData.OrderSummary.SaleCode}
                                                            
                                                            size={widthPercentageToDP(40)}
                                                            
                                                            color={Colors.black}
                                                            backgroundColor={Colors.backgroudColor}/></View>
                                                            <Text style={[styles.orderthank]} allowFontScaling={false}>Transaction ID : {ReceiptData.OrderSummary.TransactionId}</Text>
                                                            </View>}
                                                            <View style={{flexDirection:'row'}}>
                                                            </View>
                                                            </View>
                                                        }
                                                        </ScrollView>
                                                        </View>
                                                        {isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={isLoading} />}
                                                        {showPay&&<Modal><SafeAreaView style={{backgroundColor:Colors.bgColor,position:'absolute',width:'100%',alignSelf:'center',height:heightPercentageToDP(100)}}>
                                                        <View style={{width:'90%',paddingTop:heightPercentageToDP(1),paddingBottom:heightPercentageToDP(1),alignSelf:'center'}}>
                                                        <TouchableOpacity onPress={()=>{
                                                            Alert.alert(i18n.t("surewanttocancelpay"),"",[
                                                                {
                                                                    text:i18n.t('yes'),
                                                                    onPress:()=>{
                                                                        setPaymentWebUrl('');
                                                                        setShowPay(false);
                                                                        logCancelPaymentEvent(state.cartItems,shopCartInfo.Answer.ShopCart);
                                                                    }
                                                                },
                                                                {
                                                                    text:i18n.t('no'),
                                                                    onPress:()=>{
                                                                    }
                                                                }
                                                            ])
                                                        }}>
                                                        <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                                                        </TouchableOpacity></View>
                                                        <WebView
                                                        style={{height:'100%'}}
                                                        onNavigationStateChange={(navState) => {
                                                            // console.log("navState.url ", navState)
                                                            console.log("WebView URL:---------------------------------------------------------->", navState.url);
                                                            console.log('🧭 [WebView NAV]---------------------------', {
  url: navState.url,
  loading: navState.loading,
  canGoBack: navState.canGoBack,
  paymentMethod,
  showPay,
  paymentWebUrl
});

                                                            console.log('=== WebView Navigation Debug ===');
                                                            console.log('Full URL:', navState.url);
                                                            console.log('Payment Method:', paymentMethod);
                                                            console.log('Contains SkipCash Return URL:', Tools.stringIsContains(navState.url, WebServices.paymentReturnUrl));
                                                            console.log('Contains PayLater Success URL:', Tools.stringIsContains(navState.url, 'leisure.qa/Success'));
                                                            console.log('Contains PayLater Failure URL:', Tools.stringIsContains(navState.url, 'leisure.qa/Failure'));
                                                            console.log('Contains leisure.qa:', Tools.stringIsContains(navState.url, 'leisure.qa'));
                                                            console.log('URL lowercase:', navState.url.toLowerCase());
                                                            console.log('=== End Debug ===');
                                                            console.log('➡️ Checking SkipCash return URL');

console.log('🧪 WebView condition evaluation START');

                                                            if (Tools.stringIsContains(navState.url, WebServices.paymentReturnUrl)) {
                                                                // SkipCash payment return
                                                                var paymentID = paymentWebUrl.substring(paymentWebUrl.lastIndexOf('/') + 1).split('?')[0];
                                                                setShowPay(false);
                                                                setPaymentWebUrl('');
                                                                setErrorCheck(0);
                                                                updateLoading(true);
                                                                setTimeout(() => {
                                                                    checkPayment(paymentID, shopCartInfo.Answer.ShopCart.ShopCartId);
                                                                }, 2000);
                                                            } else if (paymentMethod === 'paylater') {
                                                                if (Tools.stringIsContains(navState.url, WebServices.payLaterSuccessUrl)) {
                                                                    console.log('✅ PayLater SUCCESS URL detected');

                                                                    // PayLater Success - verify payment
                                                                    var paymentID = paymentWebUrl.substring(paymentWebUrl.lastIndexOf('/') + 1).split('?')[0];
                                                                    setShowPay(false);
                                                                    setPaymentWebUrl('');
                                                                    setErrorCheck(0);
                                                                    updateLoading(true);
                                                                    setTimeout(() => {
                                                                        checkPayLaterPayment(paymentID, shopCartInfo.Answer.ShopCart.ShopCartId, finalAmount, finalPoints);
                                                                    }, 2000);
                                                                } else if (Tools.stringIsContains(navState.url, WebServices.payLaterFailureUrl)) {
                                                                    console.log('❌ PayLater FAILURE URL detected');

                                                                    // PayLater Failure - show error
                                                                    setShowPay(false);
                                                                    setPaymentWebUrl('');
                                                                    Alert.alert(i18n.t('paymentfailed') || 'Payment Failed', i18n.t('payaborttryagain') || 'Your payment was not successful. Please try again.');
                                                                    logCancelPaymentEvent(state.cartItems, shopCartInfo.Answer.ShopCart);
                                                                }
                                                            }
                                                        }}
                                                        enableApplePay={(Platform=="ios")?true:false}
                                                        source={{uri:paymentWebUrl}}
                                                        /></SafeAreaView></Modal> 
                                                    }
                                                    </SafeAreaView>
                                                    </KeyboardAvoidingView>
                                                    // </Modal>
                                                )
                                            }
                                            
                                            
                                            
                                            
                                            