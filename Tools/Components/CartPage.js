import React, { Component, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import {Image, View,Modal,StyleSheet,Dimensions,Text,ActivityIndicator,TextInput,TouchableOpacity, ScrollView, SafeAreaView,TouchableHighlight, TouchableWithoutFeedback, Alert, DeviceEventEmitter, StatusBar} from 'react-native';
// import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'
import cartIcon from '../../assets/Icons/cart.png'
import { SwipeListView } from 'react-native-swipe-list-view';
import backButton from '../../assets/Icons/back.png'
import deleteButton from '../../assets/Icons/delete.png'
import WebServices from '../constants/WebServices';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import { useFocusEffect, useRoute } from '@react-navigation/native';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {connect} from 'react-redux';
import {updateCart,updateMedia} from '../../src/js/actions/profileActions';
import LoadingLine from '../../Tools/Components/LoadingLine';
import dropIcon from '../../assets/Icons/caret-down.png'
import { StateContext } from '../context/ContextState';
import moment from'moment'
import { disabled } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';
import { Pressable } from 'react-native';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
import { logScreenViewEvent, logViewCartEvent } from '../Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function CartPage(props){
    
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const {bottomBar, setBottomBar} = useContext(StateContext);
    const route=useRoute();
    const Colors=useTheme();
    const{params}=props.route;
    //     return <CartPageC {...props} setBottomBar={setBottomBar} route={route} Colors={colors}/>
    // }
    
    // class CartPageC extends Component {
    cardNumberInputRef=React.createRef();
    let empty=(Tools.IsNull(state.shopCartInfo)||(Tools.IsNull(state.shopCartInfo.Answer))||(Tools.IsNull(state.shopCartInfo.Answer.ShopCart))||(Tools.IsNull(state.shopCartInfo.Answer.ShopCart.Items))||state.shopCartInfo.Answer.ShopCart.Items.length==0);
    const [gotData,setGotData]=useState(false);
    const [isAllowed, setIsAllowed] = useState(true);
    const [couponCode,setcouponCode]=useState("");
    const [isEmpty, setIsEmpty] = useState(empty);
    const [val, setVal] = useState('');
    const [totalNo, setTotalNo] = useState(0);
    const [totalVal, setTotalVal] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalGross, setTotalGross] = useState(0);
    const [showError, setShowError] = useState(false);
    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(props.route.params.loading);
    const [shopCartInfo, setShopCartInfo] = useState(state.shopCartInfo);
    const [viewshopCartInfo, setviewShopCartInfo] = useState({});
    const [allproducts, setAllProducts] = useState(props.route.params.allproducts);
    const [selectCardPopup, setSelectCardPopup] = useState({
        enabled: false,
        product: {},
        itemIn: {},
    });
    const [additionalInfo, setAdditionalInfo] = useState(undefined);
    const [profile, setProfile] = useState(props.route.params.profile);
    const [MediaIds, setMediaIds] = useState([]);
    const [validation,setvalidation]=useState(undefined);
    const [mediaInfo,setMediaInfo]=useState(state.mediaInfo);
    const [ShowInfo,setShowInfo]=useState({});
    const [valueText,setValueText]=useState(undefined);
    const [showDrop,setShowDrop]=useState(false);
    const [viewCart,setViewCart]=useState(true);
    const [mediaCode,setMediaCode]=useState('');
    const hasCalledEvent = useRef(false);
    // useFocusEffect(
    //     // ()=>{
        //     React.useCallback(() => {
            //         setShopCartInfo(state.shopCartInfo)
    //         const loadin = route.params?.loading || undefined;
    //         console.log(loadin);
    //         const valueIn=(loadin==undefined?props.route.params.loading:loadin);
    //         setLoading(valueIn);
    //         console.log( "Load : "+valueIn);
    //         onFocus();
    //     }, [])
    //     // }
    //     );
    useEffect(()=>{
        if(!empty&&!Tools.IsNull(state.shopCartInfo.Answer.ShopCart)){
            for (let index = 0; index < state.shopCartInfo.Answer.ShopCart.Items.length; index++) {
                const element =  state.shopCartInfo.Answer.ShopCart.Items[index];
                if(Tools.stringIsContains(element.TagNames,WebServices.mediaRequire)){
                    if(element.ItemDetailList.filter((itemIn)=>{
                        return(Tools.IsNull(itemIn.AccountId));
                    }).length>0){
                        setIsAllowed(false)
                    }
                }
            }
        }
        if(!hasCalledEvent.current){
            logScreenViewEvent("CartPage","Cart");
            hasCalledEvent.current = true;
        }
        Tools.updateRatePoints(1);
        DeviceEventEmitter.addListener("setLoadingCart", ({p1}) => 
            setLoadingCart(p1));
        
        return()=>{
            DeviceEventEmitter.removeAllListeners("setLoadingCart", ({p1}) => 
                setLoadingCart(p1));
        }
    },[]);
    
    useEffect(()=>{
        let shopItems=state.shopCartInfo;
        let mediaInfos=state.mediaInfo;
        // console.log("M :"+JSON.stringify(state.mediaInfo))
        // console.log("S :"+JSON.stringify(state.shopCartInfo))
        if(!Tools.IsNull(shopItems)&&!Tools.IsNull(shopItems.Answer)&&!Tools.IsNull(shopItems.Answer.ShopCart)&&!Tools.IsNull(shopItems.Answer.ShopCart.Items)){
            shopItems.Answer.ShopCart.Items=shopItems.Answer.ShopCart.Items.filter(itemSelect=>{
                return (itemSelect.TotalNetFull!=0)
            });
            filterItems=shopItems.Answer.ShopCart.Items.filter(itemSelect=>{
                return (itemSelect.ProductType==5)
            });
            shopItems.Answer.ShopCart.Items=shopItems.Answer.ShopCart.Items.filter(itemSelect=>{
                return (itemSelect.ProductType!=5)
            });
            for (let index = 0; index < filterItems.length; index++) {
                const element = filterItems[index];
                shopItems.Answer.ShopCart.Items.push(element);
            }
            setShopCartInfo(shopItems);
            setMediaInfo(mediaInfos);
            // setLoading(false);
            
        }  
        if(!Tools.IsNull(mediaInfos)){
            setShopCartInfo(shopItems);
            setMediaInfo(mediaInfos);
        }  
        
    },[state.shopCartInfo,state.mediaInfo])
    
    useFocusEffect(
        React.useCallback(() => {
            // console.log("Focus");
            if (viewshopCartInfo !==shopCartInfo) {
                ViewCartData();
            }
        }, [])
    );
    useEffect(()=>{
        
        if (state.shopCartInfo !==shopCartInfo) {
            // console.log(JSON.stringify(state.shopCartInfo))
            setShopCartInfo(state.shopCartInfo);
            setLoading(false);
            props.navigation.setParams({ loading: false });
            getTotal();
            setIsEmpty((Tools.IsNull(state.shopCartInfo)||(Tools.IsNull(state.shopCartInfo.Answer))||(Tools.IsNull(state.shopCartInfo.Answer.ShopCart))||state.shopCartInfo.Answer.ShopCart.Items.length==0));
            var empty=(Tools.IsNull(state.shopCartInfo)||Tools.IsNull(state.shopCartInfo.Answer)||(Tools.IsNull(state.shopCartInfo.Answer.ShopCart))||state.shopCartInfo.Answer.ShopCart.Items.length==0);
            setIsAllowed(true);
            if(!empty&&!Tools.IsNull(state.shopCartInfo.Answer.ShopCart)){
                for (let index = 0; index < state.shopCartInfo.Answer.ShopCart.Items.length; index++) {
                    const element =  state.shopCartInfo.Answer.ShopCart.Items[index];
                    if(Tools.stringIsContains(element.TagNames,WebServices.mediaRequire)){
                        if(element.ItemDetailList.filter((itemIn)=>{
                            return(Tools.IsNull(itemIn.AccountId))
                        }).length>0){
                            setIsAllowed(false);
                        }
                    }
                }
                
            }
            if(!Tools.IsNull(state.shopCartInfo)){
                ViewCartData();
            }
        }
    },[state.shopCartInfo])
    
    
    const onFocus=()=>{
        setShopCartInfo(state.shopCartInfo);
        setIsEmpty(Tools.IsNull(state.shopCartInfo)||Tools.IsNull(state.shopCartInfo.Answer)||(Tools.IsNull(state.shopCartInfo.Answer.ShopCart))||state.shopCartInfo.Answer.ShopCart.Items.length==0)
        var empty=(Tools.IsNull(state.shopCartInfo)||Tools.IsNull(state.shopCartInfo.Answer)||(Tools.IsNull(state.shopCartInfo.Answer.ShopCart))||state.shopCartInfo.Answer.ShopCart.Items.length==0);
        setIsAllowed(true);
        if(!empty&&!Tools.IsNull(state.shopCartInfo.Answer.ShopCart)){
            for (let index = 0; index < state.shopCartInfo.Answer.ShopCart.Items.length; index++) {
                const element =  state.shopCartInfo.Answer.ShopCart.Items[index];
                if(Tools.stringIsContains(element.TagNames,WebServices.mediaRequire)){
                    if(element.ItemDetailList.filter((itemIn)=>{
                        return(Tools.IsNull(itemIn.AccountId))
                    }).length>0){
                        setIsAllowed(false);
                    }
                }
            }
        }
        
        // setTimeout(() => {
            //     setBottomBar(0);
        // }, 600);
    }
    
    
    const ViewCartData=()=>{
        if(!Tools.IsNull(state.shopCartInfo)){
            console.log("View cart");
            logViewCartEvent(state.cartItems,state.shopCartInfo.Answer.ShopCart);
            setViewCart(false);
            setviewShopCartInfo(shopCartInfo);
        }
    }
    const getTotal=()=>{
        const allproducts = (Tools.IsNull(state.shopCartInfo)||Tools.IsNull(state.shopCartInfo.Answer)||Tools.IsNull(state.shopCartInfo.Answer.ShopCart))?[]:state.shopCartInfo.Answer.ShopCart.Items;
        var totalVal=0;
        var totalDiscount=0;
        for (let index = 0; index < allproducts.length; index++) {
            totalVal += (allproducts[index].TotalAmount>0)?allproducts[index].TotalAmount:0;
            totalDiscount+=allproducts[index].TotalDiscount;
        }
        setTotalVal(totalVal);
        setTotalDiscount(totalDiscount);
    }
    const getProductPrice=(_product)=>{
        // console.log("Price "+_product.item)
        return (_product.TotalAmount);//item.value.type==WebServices.variableCommand)?_product.item.details.data.price:_product.item.value.Pricelist[0].Price
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
    const getTranslatedCatalogName=(_Node)=>{
        return (Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_Node.ITL_CatalogName,'ar'):getTranslation(_Node.ITL_CatalogName,'en',_Node.CatalogName))
    }
    const getTranslation=(_Node,_code,_default=null)=>{
        if(Tools.IsNull (_Node)){
            return "";
        }
        for(let t=0;t<_Node.length;t++){
            if(Tools.IsNull (_Node[t].LangISO)){
                
            }else{
                // console.log("T "+_Node[t].LangIso);
                if(Tools.stringIsContains(_code,_Node[t].LangISO)){
                    return _Node[t].Translation;
                }
            }
        }
        if(_default!=null){
            return _default;
        }
        return _Node[0].Translation;
    }
    const getTranslatedProductName=(_Node)=>{
        // console.log(JSON.stringify(_Node));
        _productName=Tools.IsNull(_Node.ProductNameRaw)?_Node.ProductName:_Node.ProductNameRaw;
        var name = (Tools.stringIsContains(i18n.locale,'ar')?(Tools.IsNull(_Node.ProductNameITL)?_productName:_Node.ProductNameITL):_productName);
        return name;
    }
    const getCartItem=(product,_index)=>{
        // console.log("product :"+JSON.stringify(product));
        _localProduct=getProduct(product);
        if(_localProduct==null&&product.TotalAmount==0)
            return(<></>)
        else
        return(
            <View style={{flex:1,marginHorizontal:10,padding:12,backgroundColor:Colors.bgColor,borderRadius:widthPercentageToDP(2),marginBottom:15}}>
            <View style={{flexDirection:'row',borderWidth:0}}>
            {product.ProfilePictureId!=null&& 
                // <CacheImage style={styles.productImage} uri={product.item.value.images[0].src} />
                <FastImage
                style={styles.productImage}
                source={{
                    uri: WebServices.MainURL+ getPicUrl(product.ProfilePictureId),
                    // headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                />
            }
            <View style={{width:widthPercentageToDP(50),flex:1}}>
            <Text allowFontScaling={false} style={[styles.productData,{fontSize:heightPercentageToDP(2),lineHeight:heightPercentageToDP(2)*1.35}]}>{ getTranslatedProductName(product)}</Text>
            {/* {(_localProduct!=null)&& */}
            {product.ActionQuantity.Enabled&&(!Tools.stringIsContains(product.ProductCategoryName,WebServices.enigma))&&(!Tools.stringIsContains(product.ProductCategoryName,WebServices.eventpackage))&&
                <>
                <View style={{flexDirection:'row',height:widthPercentageToDP(6),marginBottom:heightPercentageToDP(0.8),alignSelf:'flex-start',justifyContent:'space-between'}}>
                <TouchableOpacity disabled={!product.ActionMinus.Enabled} style={[styles.plusminusbgL,{opacity:product.ActionMinus.Enabled?1:0.5}]} onPress={()=>{CartUpdateNo(product,-1,_index)}}>
                <Text allowFontScaling={false} style={styles.addminus}>-</Text>
                </TouchableOpacity>
                <TextInput editable={false} allowFontScaling={false} defaultValue={''+product.Quantity} style={styles.count}></TextInput>
                <TouchableOpacity disabled={!product.ActionPlus.Enabled} style={[styles.plusminusbg,{opacity:product.ActionPlus.Enabled?1:0.5}]} onPress={()=>{CartUpdateNo(product,1,_index)}}>
                <Text allowFontScaling={false} style={styles.addminus}>+</Text>
                </TouchableOpacity>
                </View></>
            }
            {product.ActionTrash.Enabled&&<>
                <TouchableOpacity style={{position:'absolute',right:'2%',bottom:'45%',zIndex:10}} 
                onPress={()=>{
                    Alert.alert(i18n.t("sureremoveitem"),"",[
                        {
                            text:i18n.t('yes'),
                            onPress:()=>{
                                removeCartItem(product);
                                setLoading(true);
                            }
                        },
                        {
                            text:i18n.t('no'),
                            onPress:()=>{
                            }
                        }
                    ])
                }}>
                <Image resizeMode='contain' source={deleteButton} style={{width:widthPercentageToDP(5),height:widthPercentageToDP(5)}}/>
                </TouchableOpacity></>
            } 
            <View style={{flexDirection:'column'}}>
            {product!=null&&!Tools.IsNull(product.OptionList)&&<Text allowFontScaling={false} style={styles.attributes}>{product.OptionList[0].AttributeItemName}</Text>}
            {product!=null&&!Tools.IsNull(product.ValidDateFrom)&&<Text allowFontScaling={false} style={styles.attributes}>{product.ValidDateFrom}</Text>}
            {product!=null&&!Tools.IsNull(product.PerformanceList)&&<Text allowFontScaling={false} style={styles.attributes}>{moment(product.PerformanceList[0].DateTimeFrom, 'YYYY-MM-DD\THH:mm:ss', true).format("DD-MM-YYYY")}</Text>}
            {checkProduct(product)!=1&&product!=null&&!Tools.IsNull(product.PerformanceList)&&<Text allowFontScaling={false} style={styles.attributes}>{moment(product.PerformanceList[0].DateTimeFrom, 'YYYY-MM-DD\THH:mm:ss', true).format("hh:mm A")}</Text>}
            {/* {_localProduct==null||Tools.IsNull(_localProduct.details)&&UIElements.drawGap(10)} */}
            {/* {_localProduct!=null&&!Tools.IsNull(_localProduct.details)&&!Tools.IsNull(_localProduct.details.displayname)&&<Text allowFontScaling={false} style={styles.attributes}>{_localProduct.details.displayname}</Text>} */}
            {!Tools.IsNull(product.TagNames)&&Tools.stringIsContains(product.TagNames,WebServices.mediaRequire)&&
                <View style={{marginTop:'5%'}}>{getallMedias(product)}</View>
            }
            {/* {_localProduct==null||Tools.IsNull(_localProduct.details)&&UIElements.drawGap(10)} */}
            <View style={{marginTop:'1%'}}>
            {product.TotalDiscount>0&&<Text  allowFontScaling={false} style={[styles.productDataR,{color:Colors.inactiveTab,textDecorationStyle:"solid", textDecorationColor:Colors.orangeColor,textDecorationLine: 'line-through',marginEnd:'2%'}]}>{product.TotalNetFull} QAR</Text>}
            <Text allowFontScaling={false} style={[styles.productData]}>{getProductPrice(product) +" QAR"}</Text></View>
            </View></View>
            </View>
            </View>
        );
    }
    const getMediaNo=(_AccountId)=>{
        console.log('Media '+JSON.stringify(mediaInfo));
        if(Tools.IsNull(_AccountId))
            return null;
        
        _dataIn=mediaInfo.filter((_itemIn)=>{
            return (_itemIn.data.AccountId==_AccountId)
        })
        
        if(_dataIn.length>0)
            return _dataIn[0].mediaNumber;
        else 
        return null;
    }
    
    const setAccountToCart=(_account)=>{
        setLoading(true);
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
        var allItems=[];
        // console.log('Check'+cartItems[index].item.details);
        allItems.push({
            "ShopcartItemId":selectCardPopup.product.ShopCartItemId,
            "Position":selectCardPopup.itemIn.Position,
            "AccountId":_account.data.AccountId
        })
        
        var bodyData={
            "ShopcartId":shopCartInfo==undefined?"":shopCartInfo.Answer.ShopCart.ShopCartId,
            "langIso": "en",
            "MemberId":Tools.IsNull(props.route.params.accessToken)?"": props.route.params.accessToken.MemberID,
            "ShopCartItemAccounts": allItems
        }
        // console.log('Set Account '+JSON.stringify(bodyData));
        
        fetch (WebServices.MainURL+WebServices.setItemAccount,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(bodyData)
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            // props.updateCart(JSON.parse(responseJson));
            dispatch({
                type:'update_Cart',
                stateIn:JSON.parse(responseJson)
                
            })
            // console.log("Set account - "+responseJson);
            
        }).catch((error) =>{
            // console.log('UPE '+error);
            setLoading(false);
        });
    }
    
    const validateShoppingCartVGS=(_shotCartId)=>{
        // console.log('S :'+_shotCartId);
        var bodyData={
            "ShopcartId":_shotCartId,
            "LangIso": "en",
            "MemberId":Tools.IsNull(props.route.params.accessToken)?"": props.route.params.accessToken.MemberID,
        }
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
            
        }).catch((error) =>{
            
        });
    }
    
    const getallMedias=(_product)=>{
        
        allMedias=[];
        _product.ItemDetailList.map((_itemIn,indexIn)=>{
            _mediaNo=getMediaNo(_itemIn.AccountId);
            // console.log('M : '+JSON.stringify(_mediaNo));
            if(Tools.IsNull(_mediaNo)){
                
                allMedias.push( <TouchableOpacity onPress={()=>{
                    fetchMedias();
                    setShowError(false);
                    setvalidation(0);
                    setValueText('');
                    setAdditionalInfo(undefined);
                    setSelectCardPopup({enabled:true,product:_product,itemIn:_itemIn})
                    
                }} style={{width:'80%',borderRadius:widthPercentageToDP(2),padding:widthPercentageToDP(1),backgroundColor:Colors.whiteColor,
                    borderColor:Colors.orangeShadeColor,marginBottom:'3%'}}>
                    <Text  allowFontScaling={false} style={[styles.cardData,{color:Colors.orangeShadeColor}]}>*Add Card</Text>
                    </TouchableOpacity>) 
                }else{
                    allMedias.push( <TouchableOpacity onPress={()=>{
                        fetchMedias();
                        setShowError(false);
                        setvalidation(0);
                        setValueText('');
                        setAdditionalInfo(undefined);
                        setSelectCardPopup({enabled:true,product:_product,itemIn:_itemIn})
                    }} style={{width:'80%',borderRadius:widthPercentageToDP(5),padding:widthPercentageToDP(0.8),backgroundColor:Colors.blueColor,marginBottom:'3%'}}>
                    <Text  allowFontScaling={false} style={styles.cardData}>{_mediaNo}</Text>
                    </TouchableOpacity>)
                }
            });
            return allMedias;
        }
        const getTotalValue=()=>{
            
            return(
                <View style={{flexDirection:'row',flex:1,height:heightPercentageToDP(7),alignSelf:'center'}}>
                {totalDiscount>0&&
                    <View style={{flexDirection:'row'}}>
                    <View style={{alignSelf:'center',width:widthPercentageToDP(15)}}>
                    <Text numberOfLines={2} allowFontScaling={false} style={[styles.totalPrice,{fontSize:widthPercentageToDP(3.5),lineHeight:widthPercentageToDP(3.5)*1.45}]}>{i18n.t('subtotal')}</Text>
                    <Text numberOfLines={2} allowFontScaling={false} style={[styles.totalPrice,{fontSize:widthPercentageToDP(3.7),lineHeight:widthPercentageToDP(3.7)*1.45}]}>{shopCartInfo!=undefined?(totalDiscount+totalVal):0} QAR</Text>
                    </View>
                    <View style={{backgroundColor:Colors.warningColor,height:3,width:widthPercentageToDP(3),alignSelf:'center',marginHorizontal:widthPercentageToDP(1)}}></View>
                    <View style={{alignSelf:'center',width:widthPercentageToDP(15)}}>
                    <Text numberOfLines={2} allowFontScaling={false} style={[styles.totalPrice,{fontSize:widthPercentageToDP(3.5),lineHeight:widthPercentageToDP(3.5)*1.45}]}>{i18n.t('discount')}</Text>
                    <Text numberOfLines={2} allowFontScaling={false} style={[styles.totalPrice,{fontSize:widthPercentageToDP(3.7),lineHeight:widthPercentageToDP(3.7)*1.45,}]}>{shopCartInfo!=undefined?totalDiscount:0} QAR</Text>
                    </View></View>}
                    <View style={[totalDiscount>0?{borderStartWidth:2,borderColor:Colors.tealGreen,
                        paddingStart:widthPercentageToDP(1),marginStart:widthPercentageToDP(1)}:{}
                        ,{alignSelf:'center'}]}>
                        <Text allowFontScaling={false} style={styles.totalPrice}>{i18n.t('total')}</Text>
                        <Text allowFontScaling={false} style={styles.totalPrice}>{shopCartInfo!=undefined&&!Tools.IsNull(shopCartInfo.Answer)&&(!Tools.IsNull(shopCartInfo.Answer.ShopCart))?shopCartInfo.Answer.ShopCart.TotalAmount:0} QAR</Text>
                        </View></View>
                    )
                }
                
                const modifyCartItem=(_product,_count)=>{
                    setLoading(true);
                    var productModify=props.route.params.modifyItem;
                    productModify(state.shopCartInfo,_product,_count);
                    // DeviceEventEmitter.emit('modifyItemfromCart',{p1:_product,p2:_count});
                    
                }
                
                const removeCartItem=(product)=>{
                    var productRemove=props.route.params.removeItem;
                    productRemove(allproducts,state.shopCartInfo,product);
                    // DeviceEventEmitter.emit('removeItemfromCart',{p1:product,p2:shopCartInfo});
                    // var allproductsIn=allproducts;
                    
                    // allproductsIn=allproductsIn.filter(itemSelect=>{
                        //     return (itemSelect.item.value.id!=product.item.value.id)
                    // });
                    // var updateProducts=props.route.params.updateProducts;
                    // updateProducts(allproductsIn);
                    // setState({allproducts:allproductsIn},()=>getTotal());
                    
                }
                
                const checkMediaCard=(_cardNumber,_value='')=>{
                    setvalidation(0);
                    _cardNumber=Tools.stringIsEmpty(_value)?_cardNumber.nativeEvent.text:_value;
                    _cardNumber=_cardNumber.substring(0, 10);
                    if(_cardNumber.length<10||Tools.stringIsContains(_cardNumber,'*')){
                        setShowError(true);
                        setShowInfo({"textToDisplay":i18n.t("invalidplaycard")})
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
                            setvalidation(1);
                            setAdditionalInfo(_info);
                        }else{
                            setMediaCode('');
                            setvalidation(-1);
                            setShowError(true);
                            setShowInfo({"textToDisplay":i18n.t("invalidplaycard")});
                        }
                    })
                }
                
                const fetchMedias=()=>{
                    // console.log(params.accessToken.MemberID+"-params-"+params.accessToken)
                    if(Tools.IsNull(profile)||Tools.stringIsEmpty(params.accessToken)||Tools.stringIsEmpty(params.accessToken.MemberID)){
                        setGotData(true);
                        return;
                    }
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
                        // console.log("fetchMedias"+responseJson)
                        if(Tools.stringIsContains(responseJson,'denied')){
                            if(props.assignProfile!=null){
                                props.assignProfile("user",'','',(_memberID,_access) =>{fetchMedias()})
                            }
                            return;
                        }
                        var responseObj=JSON.parse(responseJson);
                        if(Tools.stringIsEmpty(responseObj.Error)){
                            setMediaIds(responseObj.Medias);
                            setGotData(true);
                        }
                    }).catch((error) =>{
                        // console.log("Media "+ error);
                    });
                }
                const getallCards=(_product)=>{
                    allCards=[];
                    allTags=_product.TagNames.split(',');
                    
                    _mediaIds=[];
                    for (let index = 0; index < allTags.length; index++) {
                        const element = allTags[index].replace(" ",'');
                        // console.log(element+'Loc '+MediaIds[0].Location.toLowerCase());
                        _mediaIds=MediaIds.filter((_media)=>Tools.stringIsContains(_media.Location.toLowerCase().replace(" ",''),element.toLowerCase()))
                        if(_mediaIds.length>0){
                            index=1000;
                        }
                        
                    }
                    
                    for (let index = 0; index < _mediaIds.length; index++) {
                        const element = _mediaIds[index];
                        const _mediacode=element.MediaCodes.length>0?element.MediaCodes[0].Code:'' ;
                        const _mediabalance=element.WalletSlots.length>0?element.WalletSlots[0].Balance:''+0 ;
                        
                        allCards.push(<TouchableOpacity onPress={()=>{
                            _element=element;
                            setShowError(false);
                            setValueText(_mediacode);
                            setAdditionalInfo(undefined);
                            // cardNumberInputRef.current.setNativeProps({ text: _mediacode});
                            checkMediaCard('',_element.MediaCodes[0].Code);
                            setShowDrop(false);
                        }} style={{flexDirection:'row',alignSelf:'center',justifyContent:'center',padding:10}}>
                        <Text allowFontScaling={false} style={styles.cardNumberDrop}>{_mediacode}*XXX - {_mediabalance} QAR</Text>
                        </TouchableOpacity>)
                    }
                    // console.log(allCards.length);
                    
                    return allCards;
                }
                const setLoadingCart=(_state)=>{
                    // console.log("setLoadingCart"+_state);
                    setLoading(_state);
                    props.navigation.setParams({ loading: _state });
                }
                const getTotalItemCount=()=>{
                    var total=0;
                    if(!Tools.IsNull(shopCartInfo)&&!Tools.IsNull(shopCartInfo.Answer)&&!Tools.IsNull(shopCartInfo.Answer.ShopCart)){
                        var shopCartData=shopCartInfo.Answer.ShopCart.Items;
                        for (let index = 0; index < shopCartData.length; index++) {
                            const element = shopCartData[index];
                            if(element.TotalAmount>0){
                                total+=1;
                            }
                        }
                    }
                    return total;
                    
                }
                const styles = StyleSheet.create({
                    plusminusbgL:
                    {backgroundColor:Colors.bluelightShadeColor,width:widthPercentageToDP(6),justifyContent:'center'},
                    plusminusbg:
                    {backgroundColor:Colors.bluelightShadeColor,width:widthPercentageToDP(6),justifyContent:'center'},
                    empty:{
                        includeFontPadding:false,
                        alignSelf:'center',
                        fontFamily:'Cairo-Bold',
                        fontWeight:'200',
                        color:Colors.inputfontColor,
                        fontSize:18,
                        textAlign:'center'
                    },
                    modalView:{
                        width:'90%',height:'100%',overflow:'hidden',alignSelf:'center'
                    },
                    cardData:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Bold',
                        fontSize:heightPercentageToDP(2),
                        color:Colors.whiteColor,
                        alignSelf:'center'
                    },
                    productData:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-SemiBold',
                        fontSize:heightPercentageToDP(2.15),
                        lineHeight:heightPercentageToDP(2.15)*1.3,
                        color:Colors.inputfontColor,
                        alignSelf:'flex-start'
                    },
                    productDataR:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Regular',
                        fontSize:heightPercentageToDP(2.15),
                        lineHeight:heightPercentageToDP(2.15)*1.3,
                        color:Colors.inputfontColor,
                        alignSelf:'flex-start'
                    },
                    rowFront: {
                        backgroundColor: Colors.whiteColor,
                    },
                    rowBack: {
                        top:20,
                        zIndex:0,
                        position:'absolute',
                        right:0,
                        alignSelf:'center',
                        alignContent:'center',
                        alignItems: 'center',
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                    },
                    attributes:{
                        includeFontPadding:false,
                        // borderWidth:1,
                        textAlign:'left',fontSize:widthPercentageToDP(3.75),marginEnd:5,lineHeight:widthPercentageToDP(3.75)*1.3,
                        color:Colors.inputfontColor,
                        fontFamily:'Cairo-Regular',
                    },
                    carttext:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Regular',
                        color:Colors.whiteColor,
                        fontSize:widthPercentageToDP(3.75),
                        alignSelf:'center'
                    },
                    addCart:{
                        justifyContent:'center',
                        borderRadius:heightPercentageToDP(4.75),
                        height:heightPercentageToDP(4.75),
                        backgroundColor:Colors.blueColor,
                        flexDirection:'row',
                        paddingHorizontal:widthPercentageToDP(3),
                    },
                    productImage:{
                        borderRadius:widthPercentageToDP(2),
                        height:widthPercentageToDP(22),
                        width:widthPercentageToDP(22),
                        marginRight:'5%',
                        alignSelf:'flex-start',
                        resizeMode:'contain'
                    },addtoCart:{
                        alignSelf:'center',
                        // margin:10,
                        // alignSelf:'flex-end',
                        height:25,
                        width:25,tintColor:Colors.whiteColor,
                    },productText:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Bold',
                        fontWeight:'200',
                        fontSize:20,
                        marginBottom:10,
                        color:Colors.black,
                        alignSelf:'flex-start'
                        
                    },tagline:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Bold',
                        fontSize:25,
                        color:Colors.black,
                        alignSelf:'flex-start'
                    },description:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Bold',
                        fontWeight:'200',
                        fontSize:15,
                        textAlign:'justify',
                        color:Colors.black
                        
                    },addminus:{
                        color:Colors.inputfontColor,
                        textAlign:'center',
                        fontSize:widthPercentageToDP(5.15),
                    },count:{
                        // fontFamily:'Cairo-Bold',
                        // fontWeight:'200',
                        fontSize:widthPercentageToDP(4),
                        width:widthPercentageToDP(9),
                        // alignSelf:'center',
                        paddingVertical:0,
                        textAlign:'center',
                        color:Colors.black
                        
                    },cardNumber:{
                        includeFontPadding:false,
                        fontFamily:'Cairo-Bold',
                        fontWeight:'500',
                        alignSelf:'flex-start',
                        textAlign:'left',
                        fontSize:18,
                    },
                    cardNumberInput:{
                        includeFontPadding:false,
                        borderWidth:0.5,
                        borderRadius:widthPercentageToDP(4),
                        backgroundColor:Colors.bgColor,
                        fontFamily:'Cairo-Bold',
                        fontWeight:'100',
                        color:Colors.inputfontColor,
                        fontSize:21,textAlign:'center',
                        alignSelf:'center',
                        justifyContent:'center',alignContent:'center',padding:10,
                        width:widthPercentageToDP(55),
                        height:50,
                    },shadow:{
                        shadowOffset: { width: 0, height: 3 },
                        shadowRadius: 3,
                        shadowOpacity: 0.12,elevation:3
                    },totalPrice:{
                        includeFontPadding:false,
                        flexWrap:'wrap',
                        alignSelf:'flex-start',
                        lineHeight:widthPercentageToDP(4.25)*1.45,
                        color:Colors.inputfontColor,
                        fontSize:widthPercentageToDP(4.25),
                        fontFamily:'Cairo-SemiBold'}
                        
                    });
                    
                    const addMediaInfos=(_aInfo)=>{
                        let _metainfo=mediaInfo;
                        if(!Tools.IsNull(_aInfo.displayname)){
                            _filterData=_metainfo.filter((itemIn)=>{
                                return(itemIn.mediaNumber==_aInfo.displayname);
                            })
                            if(_filterData.length==0)
                                _metainfo.push({mediaNumber:_aInfo.displayname,data:_aInfo.data});
                        }
                        
                        dispatch({
                            type:'update_Media',
                            stateIn:_metainfo
                        })
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
                    const CartUpdateNo=(product,valIn,_index)=>{
                        var allproductsIn=allproducts;
                        // for (let index = 0; index < allproductsIn.length; index++) {
                        //     if(allproductsIn[index].item.value.id == product.item.value.id){
                        //         allproductsIn[index].count+=valIn;
                        //         if(allproductsIn[index].count<1)
                        //         allproductsIn[index].count=1;
                        //     }
                        
                        // }
                        allproductsIn[_index].count+=valIn;
                        if(allproductsIn[_index].count<1)
                            allproductsIn[_index].count=1;
                        setAllProducts(allproductsIn);
                        modifyCartItem(product,valIn);
                        // getTotal();
                    }
                    const OnDone=()=>{
                        setBottomBar(1);
                        
                        // props.navigation.goBack();
                        props.navigation.navigate('Home',()=>{
                        })
                    }
                    
                    return (
                        // <Modal animationType = {"slide"} transparent = {false} visible={visible}>
                        <View style={{backgroundColor:Colors.bgColor,flex:1}}>
                        
                        <View style={{width:widthPercentageToDP(100),height:heightPercentageToDP(100),position:'absolute'}}>
                        <BackgroundWall/>
                        </View>
                        <SafeAreaView style={{marginTop:StatusBar.currentHeight,flex:1}}> 
                        <KeyboardAvoidingView
                        behavior={"position"}
                        contentContainerStyle={styles.container}
                        keyboardVerticalOffset={0}
                        style={{backgroundColor:Colors.bgColor,flex:1}}>
                        
                        <View style={{width:'90%',alignSelf:'center',marginTop:heightPercentageToDP(1)}}>
                        <TouchableOpacity onPress={()=>{OnDone()}}>
                        <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                        </TouchableOpacity>
                        </View>
                        
                        <View style={[styles.modalView,{borderRadius:widthPercentageToDP(3),backgroundColor:Colors.whiteColor,
                            marginTop:heightPercentageToDP(4.5)
                            ,height:heightPercentageToDP(52)}]}>
                            {/* <View style={{alignSelf:'flex-start'}}>
                                <Text allowFontScaling={false} style={styles.tagline}>
                                {i18n.t('mycart')}
                                </Text>
                                <Text allowFontScaling={false} style={styles.productText}>
                                {i18n.t('checknpay')}
                                </Text>
                                </View> */}
                                <View style={{position:'absolute',width:'100%'}}>{(loading)
                                    // (state.shopCartInfo==undefined)||(state.shopCartInfo.Answer.ShopCart.Items.length!=allproducts.length)
                                    &&<LoadingLine visibleText={false} loadBar={{backgroundColor:Colors.blueColor}}/>}</View>
                                    {
                                        isEmpty&&<View style={{justifyContent:'center',height:'100%'}}>
                                        <Text  allowFontScaling={false} style={styles.empty} >{i18n.t('yourcartempty')}</Text>
                                        </View>
                                    }
                                    {!isEmpty&&
                                        <SwipeListView
                                        style={{backgroundColor:Colors.whiteColor,marginTop:heightPercentageToDP(6),marginBottom:heightPercentageToDP(2)
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        disableLeftSwipe
                                        disableRightSwipe
                                        data={shopCartInfo.Answer.ShopCart.Items}
                                        renderItem={  (data)  => {
                                            return(
                                                <View style={{zIndex:1}}>
                                                <TouchableWithoutFeedback style={{borderRadius:15,overflow:'hidden'}}>
                                                {getCartItem(data.item,data.index)}
                                                </TouchableWithoutFeedback>
                                                {/* {data.index==(shopCartInfo.Answer.ShopCart.Items.length-1)&&
                                                    <View style={{alignSelf:'center',width:widthPercentageToDP(100),height:heightPercentageToDP(9),opacity:allproducts.length>0?1:0.5}}>
                                                    {getTotalValue()}
                                                    </View>} */}
                                                    </View>)
                                                }}
                                                renderHiddenItem={ (data, rowMap) => {
                                                    _localProduct=getProduct(data.item);
                                                    if(_localProduct==null){
                                                        return(
                                                            <></>
                                                        )
                                                    }
                                                    return(
                                                        <View style={styles.rowBack}>
                                                        <TouchableOpacity onPress={()=>{removeCartItem(data.item)}} style={{zIndex:0,backgroundColor:Colors.whiteColor,alignSelf:'center',justifyContent:'center',height:80,width:50,borderRadius:20,}}>
                                                        <Image resizeMode='contain' source={deleteButton} style={{tintColor:Colors.orangeShadeColor, alignSelf:'center',width:30,height:30}}></Image></TouchableOpacity>
                                                        </View>
                                                    )}
                                                }
                                                leftOpenValue={50}
                                                rightOpenValue={-50}
                                                />
                                            }
                                            
                                            </View>
                                            {/* <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':'height'} style={{backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(5),justifyContent:'center',
                                                width:widthPercentageToDP(90),alignSelf:'center',height:heightPercentageToDP(8),marginTop:heightPercentageToDP(1)}}>
                                                
                                                
                                                </KeyboardAvoidingView> */}
                                                <View 
                                                style={{backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(5),justifyContent:'center',
                                                    width:widthPercentageToDP(90),alignSelf:'center',marginTop:heightPercentageToDP(1)}}>
                                                    
                                                    <View style={{flexDirection:'row',width:'93%',alignSelf:'center',justifyContent:'space-between',marginBottom:heightPercentageToDP(1),marginTop:heightPercentageToDP(1)}}>
                                                    <TextInput placeholderTextColor={Colors.placeholdertext}
                                                    placeholder={i18n.t('couponcode')}
                                                    allowFontScaling={false} numberOfLines={1} style={{
                                                        justifyContent:'center',
                                                        width:'100%',
                                                        paddingHorizontal:10,
                                                        alignSelf:'center',
                                                        fontFamily:'Cairo-Regular',
                                                        fontSize:widthPercentageToDP(5),
                                                        borderWidth:2,
                                                        borderRadius:30,
                                                        height:40,
                                                        borderColor:Colors.blueColor,
                                                        color:Colors.inputfontColor,backgroundColor:Colors.white,
                                                        width:widthPercentageToDP(55)}}
                                                        value={couponCode}
                                                        onChangeText={(text)=>setcouponCode(text)}/>
                                                        <TouchableHighlight disabled={!(isAllowed&&!loading)} 
                                                        style={[styles.addCart,{alignSelf:'center',opacity:(isAllowed&&!loading)?1:0.5,}]} onPress={()=>{
                                                            setLoading(true);
                                                            var addCoupon=props.route.params.addCouponToCart;
                                                            addCoupon(shopCartInfo,couponCode);
                                                        }}>
                                                        <Text allowFontScaling={false} adjustsFontSizeToFit={true} style={styles.carttext}> {i18n.t('addcoupon')} </Text>
                                                        </TouchableHighlight></View>
                                                        
                                                        <View style={{flexDirection:'row',width:'93%',alignSelf:'center'}}>
                                                        {getTotalValue()}
                                                        <TouchableHighlight disabled={!(isAllowed&&!loading&&!isEmpty)} 
                                                        style={[styles.addCart,{alignSelf:'center',opacity:(isAllowed&&!loading&&!isEmpty)?1:0.5,}]} onPress={()=>{
                                                            setLoading(true);
                                                            // DeviceEventEmitter.emit("checkOut");                     
                                                            var checkOutFallBack=props.route.params.checkOut;
                                                            checkOutFallBack(shopCartInfo);
                                                            
                                                        }}>
                                                        <Text allowFontScaling={false} adjustsFontSizeToFit={true} style={styles.carttext}> {i18n.t('checkout')} </Text>
                                                        </TouchableHighlight></View>
                                                        </View>
                                                        <View style={[{position:'absolute',marginTop:heightPercentageToDP(2), 
                                                            backgroundColor:Colors.whiteColor,width:widthPercentageToDP(20),height:widthPercentageToDP(20)
                                                            ,justifyContent:'center',alignSelf:'center'
                                                            ,borderRadius:widthPercentageToDP(20)},styles.shadow]}>
                                                            <Image resizeMode='contain' style={{marginStart:widthPercentageToDP(4),tintColor:Colors.blueColor,width:widthPercentageToDP(10),height:widthPercentageToDP(10),}} source={cartIcon}/>
                                                            {shopCartInfo!=undefined&&!Tools.IsNull(shopCartInfo.Answer)&&!Tools.IsNull(shopCartInfo.Answer.ShopCart) &&(!Tools.IsNull(shopCartInfo.Answer.ShopCart.Items)&&shopCartInfo.Answer.ShopCart.Items.length>0)&&
                                                                <View
                                                                style={{position:'absolute',borderRadius:21,width:21,height:21,justifyContent:'center'
                                                                    ,end:12,top:12,backgroundColor:Colors.inputfontColor}}><Text allowFontScaling={false} style={{
                                                                        alignSelf:'center',textAlign:'center',color:Colors.whiteColor,includeFontPadding:false,
                                                                        fontSize:widthPercentageToDP(3.5)}}>{getTotalItemCount()}</Text></View> }
                                                                        </View>
                                                                        {selectCardPopup.enabled&&
                                                                            <Modal transparent={true} visible={selectCardPopup.enabled}>
                                                                            <View style={{height:'100%',width:'100%',backgroundColor:Colors.transparentBlack,justifyContent:'center'}} >
                                                                            <View style={{alignSelf:'center',alignContent:'center', width:widthPercentageToDP(80)
                                                                                ,backgroundColor:Colors.bgColor,borderRadius:widthPercentageToDP(3),padding:heightPercentageToDP(2)}}>
                                                                                
                                                                                <Text allowFontScaling={false} style={styles.cardNumber}>{i18n.t('playcardNumber')} *:</Text>
                                                                                <Text allowFontScaling={false} style={[styles.cardNumber,{fontSize:14,fontWeight:'100'}]}>(Shown at the back of your current play card)</Text>
                                                                                {UIElements.drawGap(10)}
                                                                                <View style={{flexDirection:'row',alignSelf:'center'}}>
                                                                                <TextInput
                                                                                value={valueText}
                                                                                ref={(ref)=>{cardNumberInputRef.current=ref}}
                                                                                onChangeText={(text)=>{
                                                                                    setShowError(false);
                                                                                    setvalidation(0);
                                                                                    setValueText(text);
                                                                                }} 
                                                                                
                                                                                onEndEditing={(text)=>{
                                                                                    setValueText(text.nativeEvent.text);
                                                                                    setGotData(false);
                                                                                    checkMediaCard(text)
                                                                                }}
                                                                                maxLength={14} allowFontScaling={false} style={[styles.cardNumberInput,
                                                                                    showError?{borderColor:Colors.redColor,borderWidth:2}:validation==1?{borderColor:Colors.greenColor,borderWidth:2}:{}]}
                                                                                    placeholderTextColor={Colors.placeholdertext}
                                                                                    placeholder='0000000000*000'></TextInput>
                                                                                    {!gotData&&<ActivityIndicator
                                                                                        style={{width:45,height:45,
                                                                                            alignSelf:'center',justifyContent:'center',position:'absolute',right:0}}/>}
                                                                                            {MediaIds.length>0 &&<TouchableOpacity 
                                                                                                onPress={()=>{
                                                                                                    setShowDrop(!showDrop);
                                                                                                }}
                                                                                                style={{width:45,height:45,
                                                                                                    alignSelf:'center',justifyContent:'center',position:'absolute',right:0}}>
                                                                                                    <Image style={{width:12,height:12,alignSelf:'center',
                                                                                                        transform:[{rotateZ:!showDrop?'0deg':'180deg'}],
                                                                                                    }} source={dropIcon}/></TouchableOpacity>}
                                                                                                    </View>
                                                                                                    {showDrop&&MediaIds.length>0&&
                                                                                                        <ScrollView style={{
                                                                                                            backgroundColor:Colors.whiteColor,
                                                                                                            borderRadius:widthPercentageToDP(4),
                                                                                                            alignSelf:'center',
                                                                                                            paddingLeft:'3%',
                                                                                                            paddingRight:'3%',
                                                                                                            maxHeight:heightPercentageToDP(18),
                                                                                                            // width:widthPercentageToDP(55),
                                                                                                        }}>
                                                                                                        {getallCards(selectCardPopup.product)}
                                                                                                        </ScrollView>}
                                                                                                        {UIElements.drawGap(30)}
                                                                                                        <TouchableHighlight disabled={additionalInfo==undefined} style={[styles.addCart,{position:'relative',opacity:(additionalInfo!=undefined)?1:0.5}]}
                                                                                                        onPress={()=>{
                                                                                                            // console.log(JSON.stringify(additionalInfo));
                                                                                                            addMediaInfos(additionalInfo);
                                                                                                            setAccountToCart(additionalInfo);
                                                                                                            setSelectCardPopup({enabled:false,product:selectCardPopup.product,
                                                                                                                itemIn:selectCardPopup.product.itemIn})
                                                                                                            }}>
                                                                                                            <Text allowFontScaling={false} style={styles.carttext}> {i18n.t('confirmcard')} </Text>
                                                                                                            </TouchableHighlight>
                                                                                                            {UIElements.drawGap(10)}
                                                                                                            <TouchableHighlight  style={[styles.addCart,{position:'relative'}]}
                                                                                                            onPress={()=>{
                                                                                                                setSelectCardPopup({enabled:false,product:selectCardPopup.product,
                                                                                                                    itemIn:selectCardPopup.product.itemIn})
                                                                                                                }}>
                                                                                                                <Text allowFontScaling={false} style={styles.carttext}> {i18n.t('close')} </Text>
                                                                                                                </TouchableHighlight>
                                                                                                                </View>
                                                                                                                
                                                                                                                </View>
                                                                                                                </Modal>}</KeyboardAvoidingView>
                                                                                                                </SafeAreaView>
                                                                                                                {loading&&<View style={{position:'absolute',bottom:0,width:'100%',height:'80%'}} >
                                                                                                                </View>}
                                                                                                                </View>
                                                                                                                // </Modal>
                                                                                                            )
                                                                                                        }
                                                                                                        
                                                                                                        // const mapStateToProps = state=>{
                                                                                                            
                                                                                                        //     shopItems=state.profileReducer.shopCartInfo;
                                                                                                        //     mediaInfos=state.profileReducer.mediaInfo;
                                                                                                        //     if(!Tools.IsNull(shopItems)&&!Tools.IsNull(shopItems.Answer)&&!Tools.IsNull(shopItems.Answer.ShopCart)){
                                                                                                        //         shopItems.Answer.ShopCart.Items=shopItems.Answer.ShopCart.Items.filter(itemSelect=>{
                                                                                                            //             return (itemSelect.TotalNetFull!=0)
                                                                                                        //         });
                                                                                                        //         filterItems=shopItems.Answer.ShopCart.Items.filter(itemSelect=>{
                                                                                                            //             return (itemSelect.ProductType==5)
                                                                                                        //         });
                                                                                                        //         shopItems.Answer.ShopCart.Items=shopItems.Answer.ShopCart.Items.filter(itemSelect=>{
                                                                                                            //             return (itemSelect.ProductType!=5)
                                                                                                        //         });
                                                                                                        //         for (let index = 0; index < filterItems.length; index++) {
                                                                                                        //             const element = filterItems[index];
                                                                                                        //             shopItems.Answer.ShopCart.Items.push(element);
                                                                                                        //         }
                                                                                                        //         return {
                                                                                                        //             shopCartInfo:shopItems,mediaInfo:mediaInfos,loading:false
                                                                                                        //         }    
                                                                                                        //     }  
                                                                                                        //     if(!Tools.IsNull(mediaInfos)){
                                                                                                        //         return {
                                                                                                        //             shopCartInfo:shopItems,mediaInfo:mediaInfos,
                                                                                                        //         }  
                                                                                                        //     }         
                                                                                                        // };
                                                                                                        
                                                                                                        
                                                                                                        // const mapDispatchToProps = (dispatch) => {
                                                                                                            //     return{
                                                                                                        //         updateCart:(cData)=> dispatch(updateCart(cData)),
                                                                                                        //         updateMedia:(cData)=> dispatch(updateMedia(cData)),
                                                                                                        
                                                                                                        //     };
                                                                                                        // }
                                                                                                        
                                                                                                        // export default connect(
                                                                                                        //     mapStateToProps,
                                                                                                        //     mapDispatchToProps
                                                                                                        //     )(CartPage)
                                                                                                        
                                                                                                        
                                                                                                        