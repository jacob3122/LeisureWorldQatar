import React, { Component, useCallback, useEffect, useRef, useState } from 'react'
import { Image,StyleSheet, TextInput,ScrollView, View,Text, TouchableOpacity, RefreshControl, FlatList, ImageBackground, Platform, StatusBar, SafeAreaView, Keyboard } from 'react-native';
import cartIcon from '../../assets/Icons/cart.png'
import searchIcon from '../../assets/Icons/search.png'
import squareIcon from '../../assets/Icons/square.png'
import gridIcon from '../../assets/Icons/grid.png'
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import barbg from '../../assets/bg/bottombar.png';
import addcartIcon from '../../assets/Icons/cart.png'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as Tools from '../../Tools/Components/Tools.js';
import { StackActions } from '@react-navigation/native';
// import Colors from '../../Tools/constants/Colors';
import productsData from '../../Data/products.json'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import ProductPage from '../../Tools/Components/ProductPage';
import CartPage from '../../Tools/Components/CartPage';
import WebServices from '../../Tools/constants/WebServices';
import InfoBar from '../../Tools/Components/InfoBar';
import WebView from 'react-native-webview';
import ProfileData from '../../Tools/Components/ProfileData';
import FastImage from '@d11/react-native-fast-image'

import { StateContext } from '../../Tools/context/ContextState';
import {DeviceEventEmitter} from "react-native"

import {connect} from 'react-redux';
import {updateCart} from '../../src/js/actions/profileActions';
import { Alert } from 'react-native';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { err } from 'react-native-svg/lib/typescript/xml';
import SecureStore from '../../Tools/Components/SecureStore';
import LoadingLine from '../../Tools/Components/LoadingLine';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useContext } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { logAddToCartEvent, logRemoveFromCartEvent, logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function StorePage(props){
    
    const {bottomBar, setBottomBar} = useContext(StateContext);
    const route=useRoute();
    const Colors=useTheme();
    
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const {openProductCode, setOpenProductCode} = useContext(StateContext);
    const [shuffled,setShuffled]=useState(false);
    const [allProducts,setallProducts]=useState([]);
    const [allProductsRandom,setallProductsRandom]=useState([]);
    const [allProductCategory,setallProductCategory]=useState([]);
    const [filterProductCategory,setfilterProductCategory]=useState(undefined);
    const [isLoading,setisLoading]=useState(true);
    const [sortVisible,setsortVisible]=useState(0);
    const [ShowInfo,setShowInfo]=useState(undefined);
    const [viewType,setviewType]=useState(0);
    const [OpenProduct,setOpenProduct]=useState('');
    const [cartItems,setcartItems]=useState([]);
    const [totalItems,settotalItems]=useState(0);
    const [cartModal,setcartModal]=useState(false);
    const [productModal,setproductModal]=useState(false);
    const [selectedStore,setselectedStore]=useState(undefined);
    const [allStoresIn,setallStoresIn]=useState([]);
    const [allstores,setallstores]=useState(productsData.stores);
    const [selectedProduct,setselectedProduct]=useState({});
    const [shopCartInfo,setshopCartInfo]=useState(undefined);
    const [storeCatalog,setstoreCatalog]=useState([]);
    const [refreshing,setrefreshing]=useState(false);
    const [profile,setprofile]=useState(props.profile);
    const [sorttext,setsorttext]=useState('');
    const [showPay,setshowPay]=useState(false);
    const [paymentWebUrl,setpaymentWebUrl]=useState('');
    const [showLogin,setshowLogin]=useState(false);
    const [changeRequired,setChangeRequired]=useState(false);
    
    const [folderDesc,setFolderDest]=useState(undefined);
    const hasCalledEvent = useRef(false);
    
    let mainScrollRef=React.createRef(null)
    let searchInputRef=React.createRef(null)
    
    useEffect(()=>{
        getProductnItems();
    },[sorttext])
    
    useEffect(()=>{
        if(!Tools.IsNull(state.profile)){
            console.log("Profile store"+state.profile.Id);
            setChangeRequired(true);
        }else{
        }
        // fetchCatalog
        var getCatlog=props.fetchCatalog;
        setisLoading(true);
        setrefreshing(true);
        getCatlog();
        
    },[state.profile]);
    
    // useEffect(()=>{
        
    // })
    
    useEffect(()=>{
        i18n.locale=global.locale;
    },[global.locale])
    
    useFocusEffect(
        React.useCallback(() => {
            // setcartItems(state.cartItems);
            onFocus();
        }, [])
    );
    useEffect(()=>{
        // console.log("StorePage");
        // if(!hasCalledEvent.current){
        //     hasCalledEvent.current=true;
        // }
        // var getCatlog=props.fetchCatalog;
        // setisLoading(true);
        // setrefreshing(true);
        // getCatlog();
        
        
        DeviceEventEmitter.addListener("updateProfile", () => 
            updateProfile());
        // DeviceEventEmitter.addListener("addtoCart", ({p1,p2,p3,p4,p5,p6,p7}) => 
            // onProductAdd(p1,p2,p3,p4,p5,p6,p7));
        // DeviceEventEmitter.addListener("gotoCart", ({p1}) => 
            // openCart(p1));
        // DeviceEventEmitter.addListener("checkOut", () => 
            // onCheckOut());
        // DeviceEventEmitter.addListener("removeItemfromCart", ({p1}) => 
            // removeItemfromCart(p1));
        // DeviceEventEmitter.addListener("modifyItemfromCart", ({p1,p2}) => 
            // ModifyItemfromCart(p1,p2));
        DeviceEventEmitter.addListener("updateProducts", ({p1}) => 
            updateProducts(p1));
        
        // DeviceEventEmitter.addListener("onDoneCart", () => 
            // onDoneCart());
        // if(state.OpenProduct!=undefined&&state.OpenProduct!==OpenProduct){
        //     // console.log("OP : "+JSON(state.OpenProduct));
        //     setOpenProduct(state.OpenProduct);
        //     OpenProductPageWeb(state.OpenProduct)
        // }
        // if(openProductCode.length>0){
        //     // console.log("OPCode : "+openProductCode);
        //     OpenProductPageWeb(openProductCode);
        // }
        return()=>{
            // if(willFocus)
            // willFocus.remove();
            DeviceEventEmitter.removeAllListeners("updateProfile", () => 
                updateProfile());
            // DeviceEventEmitter.removeAllListeners("addtoCart", ({p1,p2,p3,p4,p5,p6,p7}) => 
                // onProductAdd(p1,p2,p3,p4,p5,p6,p7));
            // DeviceEventEmitter.removeAllListeners("gotoCart", ({p1}) => 
                // openCart(p1));
            // DeviceEventEmitter.removeAllListeners("checkOut", () => 
                // onCheckOut());
            // DeviceEventEmitter.removeAllListeners("removeItemfromCart", ({p1}) => 
                // removeItemfromCart(p1));
            // DeviceEventEmitter.removeAllListeners("modifyItemfromCart", ({p1,p2}) => 
                // modifyShoppingCartVGS(p1,p2));
            DeviceEventEmitter.removeAllListeners("updateProducts", ({p1}) => 
                updateProducts(p1));
            
            // DeviceEventEmitter.removeAllListeners("onDoneCart", () => 
                // onDoneCart());
        }
    },[])
    useEffect(()=>{
        setcartItems(state.cartItems);
        settotalItems(state.cartItems.length)
    },[state.cartItems]);
    
    // useEffect(()=>{
        //     if(state.OpenProduct!==OpenProduct){
    //         setOpenProduct(state.OpenProduct);
    //     }
    //     OpenProductPageWeb(state.OpenProduct)
    // },[state.OpenProduct])
    
    // useEffect(()=>{
        //         if(openProductCode.length>0){
    //             OpenProductPageWeb(openProductCode);
    //         }
    // },[openProductCode])
    const openProductInit=(_stateIn)=>{
        console.log("_stateIn:"+_stateIn+"changeRequired"+changeRequired)
        if(openProductCode.length>0&&changeRequired&&_stateIn){
            OpenProductPageWeb(openProductCode);
            setChangeRequired(false);
        }else if(!Tools.stringIsEmpty(OpenProduct)){
            OpenProductPageWeb(OpenProduct);
        }
        
    }
    useEffect(()=>{
        
        if(!Tools.IsNull(state.profile)){
            console.log("Profile Found :"+state.profile.Id);
        }else{
            console.log("Profile not found");
        }
        
        SecureStore.getItemAsync('accessToken').then(savedPass=>{
            if(savedPass!=undefined&&savedPass!=null&&savedPass.length>0){
                openProductInit(true);
            }else{
                openProductInit(false);
            }
        }).catch(error => {
            // console.log(error);
            openProductInit(false);
        });
        // if(state.OpenProduct.length>0){
        //     OpenProductPageWeb(state.OpenProduct);
        // }
        // else
        
        
    },[allProducts])
    
    useEffect(()=>{
        console.log(changeRequired+"//"+OpenProduct+"//"+openProductCode);
        SecureStore.getItemAsync('accessToken').then(savedPass=>{
        console.log("save /"+savedPass);

            if(savedPass!=undefined&&savedPass!=null&&savedPass.length>0){
                OpenProductPageWeb(openProductCode);
            }else{
                if(Tools.stringIsEmpty(OpenProduct)){
                    setOpenProduct(openProductCode);
                }
            }
        }).catch(error => {
        if(Tools.stringIsEmpty(OpenProduct)){
            setOpenProduct(openProductCode);
        }
    });
    },[openProductCode])
    
    useEffect(()=>{
        
        console.log(OpenProduct+"//OPEN");
        if(!Tools.stringIsEmpty(OpenProduct)){
            console.log(OpenProduct+"//OPENIn");
            OpenProductPageWeb(OpenProduct);
        }
        
        
    },[OpenProduct])
    
    useEffect(()=>{
        if(props.storeCatalog!==storeCatalog){
            setStores(()=>{
                getProductnItems();
            });
            
        }
        
        // console.log("componentDidUpdate"+JSON.stringify(props.storeCatalog));
        
        
        
        if(props.profile!==profile&&props.profile!=undefined){
            let getCatlog=props.fetchCatalog;
            getCatlog();
            setisLoading(true);
            setrefreshing(true);
            setprofile(props.profile);
        } 
        
        if(!Tools.IsNull(props.storeCatalog)&&props.storeCatalog!==storeCatalog){
            // console.log("Cat :"+JSON.stringify(props.storeCatalog));
            
            setisLoading(false);
            setrefreshing(false);
            setstoreCatalog(props.storeCatalog);
            // setOpenProductAll(OpenProduct!=undefined?OpenProduct:'');
            setselectedStore('');
        }
    },[props]);
    
    
    useEffect(()=>{
        // console.log("shopcart :"+JSON.stringify( shopCartInfo)+"shopcartin : "+JSON.stringify(state.shopCartInfo));
        if (state.shopCartInfo != shopCartInfo) {
            // console.log("shopcartin change");
            setshopCartInfo(state.shopCartInfo);
            if(Tools.IsNull(state.shopCartInfo)){
                settotalItems(0);
                setcartItems([]);
                dispatch({
                    type:'update_CartItems',
                    stateIn:[]
                })
            }
            props.navigation.setParams({
                allproducts:[],
            })
        }
    },[state])
    
    
    const onFocus=()=>{
        console.log("Rest");
        logScreenViewEvent('StorePage','Store');
        // OpenProductPage(state.OpenProduct);
    }
    
    useEffect(()=>{
        getProductnItems();
    },[storeCatalog])
    
    const setViewType=(_viewType)=>{
        setviewType(_viewType)
    }
    const setStores=(callback=undefined)=>{
        let allStoresIn=[];
        if(Tools.IsNull(props.storeCatalog)||Tools.IsNull(props.storeCatalog.Nodes)){
            return;
        }
        // console.log('Store '.JSON.stringify(props.storeCatalog.Nodes));
        props.storeCatalog.Nodes.map((itemIn,index)=>{
            currentCat=itemIn;// getcategory(itemIn.categories);
            // if(!Tools.stringIsEmpty(profile.FirstName)&&Tools.stringIsContains(currentCat.TagNames,WebServices.leisuremember)){
            //     if(!allStoresIn.some(item=>item.CatalogId==currentCat.CatalogId))
            //     allStoresIn.push(currentCat)
            // }else if(Tools.stringIsEmpty(profile.FirstName)){
            // currentCat.displayName=itemIn.CatalogName;// currentCat.name.replace(" Theme Park","");
            // if(!allStoresIn.some(item=>item.CatalogId==currentCat.CatalogId))
            allStoresIn.push(currentCat)
            // }
        });
        setallStoresIn(allStoresIn);
        if(callback!=undefined){
            callback();
        }
    }
    
    const updateProfile=()=>{
        // console.log("props "+props);
        if(props!=undefined){
            props.navigation.setParams({
                profile:profile,
            })
        }
    }
    const updateProducts=(_products)=>{
        settotalItems(_products.length);
        setcartItems(_products);
        dispatch({
            type:'update_CartItems',
            stateIn:_products
        })
        props.navigation.setParams({
            allproducts:_products,
        })
    }
    const openCart=(_loading=true)=>{
        // context.setBottomBar(0);
        // setTimeout(() => {
            props.navigation.dispatch(
            StackActions.replace('CartPage',{
                // updateProfile:updateProfile,
                accessToken:props.accessToken,
                profile:profile,
                loading:_loading,
                // onDone:onDoneCart,
                checkOut:onCheckOut,
                allproducts:cartItems,
                shopCartInfo:shopCartInfo,
                addCouponToCart:AddCoupontoShoppingCartVGS,
                removeItem:removeItemfromCart,
                modifyItem:ModifyItemfromCart,
                // updateProducts:updateProducts,
            }))
            // }, 500);
            
        }
        const onCheckOut=(_shopCartInfo)=>{
            checkSeatOfPerformance(_shopCartInfo,()=>{
                props.navigation.navigate('CheckOutPage',{
                    onDoneCart:onDoneCart,
                    allproducts:cartItems,
                    // updateProducts:updateProducts,
                    shopCartInfo:_shopCartInfo,
                    // onPlaceOrder:onPlaceOrder,
                    mediaInfo:props.mediaInfo
                    
                })
                
                DeviceEventEmitter.emit("setLoadingCart",{p1:false});  
            })
            
        }
        
        
        // const onPlaceOrder=(_totalVal,_profile,LoadUpdate)=>{
            //     // console.log("Total Value : "+_totalVal);
        //     addAlltoShoppingCartVGS(_totalVal,_profile,LoadUpdate);                
        // }
        const getOthercategory=(_catergories)=>{
            // console.log(_catergories);
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
        const getcategory=(_catergories)=>{
            for (let index = 0; index < _catergories.length; index++) {
                if(Tools.stringIsContains(_catergories[index].name,'theme')){
                    return _catergories[index];
                }
            }
            return null;
        }
        const addstoreItem=(itemIn,index)=>{
            let indexIn=itemIn!=null?itemIn.CatalogId:'';
            // console.log("Store Catalog :"+itemIn);
            return(<TouchableOpacity style={[styles.stores,indexIn==selectedStore?
                {borderColor:Colors.whiteColor,backgroundColor:Colors.blueColor,borderRadius:40,paddingHorizontal:widthPercentageToDP(3)}:
                {borderColor:Colors.inputfontColor}]} onPress={()=>{
                    onStoreSelect(itemIn,index);
                    mainScrollRef.current?.scrollToOffset({
                        y:0,animated:true
                    });
                    
                }}>
                <Text allowFontScaling={false} style={[styles.storetitle,(indexIn==selectedStore)?{color:Colors.whiteColor}:{color:Colors.black}]}>{itemIn==null?i18n.t('all'):getTranslatedProductName(itemIn)}</Text>
                </TouchableOpacity>
            );
        }
        
        const addproductCategoryItem=(itemIn,index)=>{
            
            
            let CheckBool=filterProductCategory!=undefined&&(itemIn.CatalogName==filterProductCategory.CatalogName);
            return(<TouchableOpacity style={[{margin:5},CheckBool?
                {borderColor:Colors.whiteColor,backgroundColor:Colors.blueColor,borderRadius:40,paddingHorizontal:widthPercentageToDP(2)}:
                {borderColor:Colors.inputfontColor,borderWidth:1,borderRadius:40,paddingHorizontal:widthPercentageToDP(2)}]} onPress={()=>{
                    if(CheckBool){
                        setFolderDest(undefined);
                    }else{
                        var richtext=itemIn.RichDescList.filter((itemLang)=>(itemLang.LangISO===(Tools.stringIsContains(i18n.locale,"ar")?"ar":"en")));
                        
                        // console.log("CAT : "+JSON.stringify(itemIn));
                        // console.log(Tools.IsNull(itemIn.RichDescList)?undefined:itemIn.RichDescList.filter((itemLang)=>(itemLang.LangISO===(Tools.stringIsContains(i18n.locale,"ar")?"ar":"en")))[0].Description)
                        setFolderDest(Tools.IsNull(itemIn.RichDescList)?undefined:(richtext.length>0?richtext[0].Description:undefined));
                    }
                    setfilterProductCategory((filterProductCategory!=undefined&&filterProductCategory.CatalogName==itemIn.CatalogName)?undefined:itemIn);
                    mainScrollRef.current?.scrollToOffset({
                        y:0,animated:true
                    });
                    
                }}>
                <Text allowFontScaling={false} style={[styles.storetitle,{fontSize:widthPercentageToDP(3.25),},(CheckBool)?{color:Colors.whiteColor}:{color:Colors.black}]}>{itemIn==null?i18n.t('all'):getTranslatedProductCatalog(itemIn)}</Text>
                </TouchableOpacity>
            );
        }
        const getTranslatedProductCatalog=(_Node)=>{
            var name = Tools.IsNull(_Node.Entity)?getTranslatedCatalogName(_Node):(Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_Node.Entity.ITL_ProductName,'ar'):getTranslation(_Node.Entity.ITL_ProductName,'en'));
            return name;
        }
        
        useEffect(()=>{
            getProductnItems();
        },[filterProductCategory,selectedStore]);
        const onStoreSelect=(itemIn,index)=>{
            setShuffled(true);
            setselectedStore((index==null)?'':itemIn.CatalogId);
        }
        
        const getStores=()=>{
            // console.log("getstores1 - "+JSON.stringify(props.storeCatalog))
            let allStores=[];
            allStoresIn.map((itemIn,index)=>{
                if(index==0){
                    allStores.push(addstoreItem(null,null));
                }
                allStores.push(addstoreItem(itemIn,itemIn.CatalogId))
            })
            return(allStores);
        }
        const getProduct=(_productID)=>{
            console.log("getProduct - "+(_productID));
            
            for (let index = 0; index < allProducts.length; index++) {
                const element = allProducts[index];
                console.log("getProduct - "+(JSON.stringify(element)));
                
                if(!Tools.IsNull(element.Entity)&&!Tools.IsNull(element.Entity.ProductId)){
                    console.log(element.Entity.ProductId+" getProduct - "+(_productID));
                    
                    if(element.Entity.ProductId==_productID){
                        return element.item;
                    }
                }
            }
            
            return(null);
        }
        
        const getProductCategory=()=>{
            // console.log("getProductCategory - "+(allProductCategory.length))
            let allStores=[];
            allProductCategory.map((itemIn,index)=>{
                allStores.push(addproductCategoryItem(itemIn,index))
            })
            return(allStores);
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
            if(_default!=null)
                return _default;
            return _Node[0].Translation;
        }
        
        const getTranslationAvailable=(_Node,_code)=>{
            if(Tools.IsNull (_Node)){
                return false;
            }
            for(let t=0;t<_Node.length;t++){
                if(Tools.IsNull (_Node[t].LangISO)){
                    
                }else{
                    // console.log(_code+" T "+_Node[t].LangISO);
                    if(Tools.stringIsContains(_code,_Node[t].LangISO)){
                        return true;
                    }
                }
            }
            return false;
        }
        const getTranslatedProductName=(_Node)=>{
            var name = Tools.IsNull(_Node.Entity)?getTranslatedCatalogName(_Node):(Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_Node.Entity.ITL_ProductName,'ar'):getTranslation(_Node.Entity.ITL_ProductName,'en',_Node.Entity.ProductName));
            return name;
        }
        const getPriceToShow=(_Node)=>{
            let ValueIn=getPriceInfo(_Node.Nodes[0]);
            var name =ValueIn==undefined?_Node.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value+" QAR":ValueIn;
            // var name =!getTranslationAvailable(_Node,'tur')?_Node.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value:(Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_Node.Entity.ITL_ProductName,'tur'):getTranslation(_Node.Entity.ITL_ProductName,'cn'));
            return name;
        }
        const getTranslatedEventName=(_Node)=>{
            var name = (Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_Node.Entity.ITL_ProductName,'ar'):getTranslation(_Node.Entity.ITL_ProductName,'en',_Node.Entity.ProductName));
            return name;
        }
        
        const getAllBadges=(_product)=>{
            var localCheck=Tools.stringIsContains(i18n.locale,"ar")?false:true;
            
            allImages=[];
            alltags=_product.Entity.TagNames.split(',');
            // console.log(_product.Entity.ProductName+""+alltags);
            
            for (let index = 0; index < alltags.length; index++) {
                const element = alltags[index];
                if(Tools.stringIsContains(element,WebServices.AppIcon)){
                    // console.log(_product.Entity.ProductName+""+element);
                    allImages.push(<View>
                        <FastImage
                        style={[styles.productImage,Tools.stringIsContains(global.locale,'ar')?{
                            left:widthPercentageToDP(-72),
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
                return <View style={[{position:'absolute',top:heightPercentageToDP(1)},localCheck?{right:widthPercentageToDP(-1)}:{left:widthPercentageToDP(-1)}]}>{allImages}</View>;
                
                // return <View style={{position:'absolute',right:widthPercentageToDP(-1),top:heightPercentageToDP(1)}}>{allImages}</View>;
            }
            
            const addproductEventItem=(_folder)=>{
                // console.log("addproductEventItem:"+JSON.stringify(_folder))
                let priceInfo=getPriceInfo(_folder.Nodes[0]);
                return(
                    <TouchableOpacity style={[styles.products,viewType==0?{
                        width:widthPercentageToDP(95),
                        // height:widthPercentageToDP(75),
                        margin:10,
                    }:{
                        width:widthPercentageToDP(37),
                        // height:widthPercentageToDP(42.5),
                        margin:10,
                    }]} onPress={()=>{
                        onProductSelectEvent(_folder);
                    }}>
                    <View style={[styles.productImage,{
                        width:widthPercentageToDP(viewType==0?95:37),
                        height:viewType==0?(widthPercentageToDP(95)/1.69):heightPercentageToDP(37),
                    }]}>
                    {_folder.Entity.ProfilePictureId!=null&&<FastImage
                        style={[styles.productImage,{
                            width:widthPercentageToDP(viewType==0?95:37),
                            height:viewType==0?(widthPercentageToDP(95)/1.69):heightPercentageToDP(37),
                        }]}
                        source={{
                            uri: WebServices.MainURL+_folder.Entity.ProfilePictureId,
                            // headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />}</View>
                        
                        
                        <View style={[{flexDirection:'row', backgroundColor:Colors.whiteColor,height:widthPercentageToDP(viewType==0?15.5:9.5),width:'100%',borderBottomLeftRadius:widthPercentageToDP(3),borderBottomRightRadius:widthPercentageToDP(3),overflow:'hidden'}]}>
                        
                        {/* <Image source={barbg} style={{position:'absolute',width:'100%',height:'100%'}}/> */}
                        <View style={{flexDirection:'row',width:'80%'}}>
                        <View style={{flexDirection:'column',width:'100%'}}>
                        <Text allowFontScaling={false} numberOfLines={1} style={[styles.productText,
                            {fontSize:(viewType==0?widthPercentageToDP(4):widthPercentageToDP(3.5)),
                            }]}>{getTranslatedEventName(_folder)}</Text>
                            <Text allowFontScaling={false} style={[styles.productText,{fontSize:(viewType==0?widthPercentageToDP(4.5):widthPercentageToDP(3.5)),
                            }]}>
                            {priceInfo==undefined?_folder.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value+" QAR":priceInfo }
                            {/* {!getTranslationAvailable(_folder,'tur')?_folder.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value +" QAR":
                                (Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_itemIn.Entity.ITL_ProductName,'tur'):getTranslation(_itemIn.Entity.ITL_ProductName,'cn'))} */}
                                </Text>
                                </View>
                                
                                </View>
                                <TouchableOpacity style={[styles.cartButtonwithIcon,{end:0, }]}
                                onPress={()=>{
                                    onProductSelectFolder(_folder);
                                }}>
                                <Image style={[styles.addtoCart,{
                                    height:(viewType==0?30:25),
                                    width:(viewType==0?30:25),
                                }]} resizeMode='contain' source={addcartIcon}/>
                                
                                </TouchableOpacity>
                                </View>
                                </TouchableOpacity>
                            );
                            
                        }
                        const addproductTitleItem=(_itemsIn)=>{
                            return(
                                <View style={{width:widthPercentageToDP(95),padding:0,alignSelf:'flex-start'}}>
                                <Text allowFontScaling={false} numberOfLines={1} style={[
                                    {fontFamily:'Cairo-Regular',textTransform:'uppercase',fontSize:(viewType==0?widthPercentageToDP(5):widthPercentageToDP(3.5)),
                                    }]}>{getTranslatedProductName(_itemsIn)}</Text>
                                    </View>
                                )
                            }
                            const addproductFolderItem=(_folder)=>{
                                
                                return(
                                    <TouchableOpacity style={[styles.products,viewType==0?{
                                        width:widthPercentageToDP(95),
                                        margin:10,
                                    }:{
                                        width:widthPercentageToDP(37),
                                        margin:10,
                                    }]} onPress={()=>{
                                        onProductSelectFolder(_folder);
                                    }}>
                                    <View style={[styles.productImage,{
                                        width:widthPercentageToDP(viewType==0?95:37),
                                        height:viewType==0?(widthPercentageToDP(95)/1.69):heightPercentageToDP(37),
                                    }]}>
                                    {_folder.ProfilePictureId!=null&&<FastImage
                                        style={[styles.productImage,{
                                            width:widthPercentageToDP(viewType==0?95:37),
                                            height:viewType==0?(widthPercentageToDP(95)/1.69):heightPercentageToDP(37),
                                        }]}
                                        source={{
                                            uri: WebServices.MainURL+_folder.ProfilePictureId,
                                            // headers: { Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                        />}
                                        </View>
                                        
                                        <View style={[{flexDirection:'row', backgroundColor:Colors.whiteColor,height:widthPercentageToDP(viewType==0?15.5:9.5),width:'100%',borderBottomLeftRadius:widthPercentageToDP(3),borderBottomRightRadius:widthPercentageToDP(3),overflow:'hidden'}]}>
                                        
                                        {/* <Image source={barbg} style={{position:'absolute',width:'100%',height:'100%'}}/> */}
                                        <View style={{flexDirection:'row',width:'80%'}}>
                                        <View style={{flexDirection:'column',width:'100%'}}>
                                        <Text allowFontScaling={false} numberOfLines={1} style={[styles.productText,
                                            {fontSize:(viewType==0?widthPercentageToDP(4):widthPercentageToDP(3.5)),
                                            }]}>{getTranslatedProductName(_folder)}</Text>
                                            <Text allowFontScaling={false} style={[styles.productText,{fontSize:(viewType==0?widthPercentageToDP(4.5):widthPercentageToDP(3.5)),
                                            }]}>{getPriceToShow(_folder)}</Text>
                                            
                                            {/* {_folder.Nodes.length>0&&<Text allowFontScaling={false} style={[styles.productText,{fontFamily:'Cairo-Bold',width:'33%',textAlign:'center',marginStart:0}]}>{_folder.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value +" QAR"}</Text>} */}
                                            </View>
                                            
                                            </View>
                                            <TouchableOpacity style={[styles.cartButtonwithIcon,{end:0, }]}
                                            onPress={()=>{
                                                onProductSelectFolder(_folder);
                                            }}>
                                            <Image style={[styles.addtoCart,{
                                                height:(viewType==0?30:25),
                                                width:(viewType==0?30:25),
                                            }]} resizeMode='contain' source={addcartIcon}/>
                                            
                                            </TouchableOpacity>
                                            </View>
                                            </TouchableOpacity>
                                        );
                                        
                                    }
                                    const getInitCost=(_product)=>{
                                        if(_product!=null&&_product.Entity!=null)
                                            for (let index = 0; index < _product.Entity.AttributeItemList.length; index++) {
                                            const element = _product.Entity.AttributeItemList[index];
                                            if(element.Active&&element.SelectionType==3){
                                                // console.log("Ele : "+JSON.stringify(element));
                                                // console.log("Entity :"+JSON.stringify(_product.Entity));
                                                // return getTranslationAvailable(_product,'tur')?(_product.Entity.PriceDateList[0].PriceList[0].Value+element.OptionList[0].OptionalPrice):(Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_product.Entity.ITL_ProductName,'tur'):getTranslation(_product.Entity.ITL_ProductName,'cn'));
                                                return (_product.Entity.PriceDateList[0].PriceList[0].Value+element.OptionList[0].OptionalPrice);
                                            }
                                        }
                                        return 0;
                                    }
                                    const getItemCost=(_itemIn)=>{
                                        let ValueIn=getPriceInfo(_itemIn);
                                        costIn=ValueIn!=undefined?ValueIn:(checkIsVariable(_itemIn)!=-1?getInitCost(_itemIn)+" QAR" :_itemIn.Entity.PriceDateList[0].PriceList[0].Value+" QAR");
                                        // costIn=(checkIsVariable(_itemIn)!=-1?getInitCost(_itemIn) : (!getTranslationAvailable(_itemIn,'tur')?_itemIn.Entity.PriceDateList[0].PriceList[0].Value:
                                        // (Tools.stringIsContains(i18n.locale,'ar')?getTranslation(_itemIn.Entity.ITL_ProductName,'tur'):getTranslation(_itemIn.Entity.ITL_ProductName,'cn'))));
                                        return costIn;
                                    }
                                    const addproductItem=(itemIn,index)=>{
                                        indexIn=index==null?-1:index;
                                        const isInformative=checkInformativeProduct(itemIn);
                                        // console.log(index+" : "+ JSON.stringify(itemIn.Entity))
                                        return(
                                            <TouchableOpacity style={[styles.products,
                                                viewType==0?{
                                                    width:widthPercentageToDP(95),
                                                    // height:widthPercentageToDP(75),
                                                    margin:10,
                                                    // borderColor:(indexIn==selectedStore?Colors.orangeColor:Colors.inputfontColor)
                                                }:{
                                                    width:widthPercentageToDP(37),
                                                    // height:widthPercentageToDP(45),
                                                    margin:10,
                                                }]} onPress={()=>{
                                                    onProductSelect(itemIn);
                                                }}>
                                                <View style={[styles.productImage,{
                                                    width:widthPercentageToDP(viewType==0?95:37),
                                                    height:viewType==0?(widthPercentageToDP(95)/1.69):heightPercentageToDP(37),
                                                }]}>
                                                
                                                {itemIn.ProfilePictureId!=null&&<FastImage
                                                    style={[styles.productImage,{
                                                        width:widthPercentageToDP(viewType==0?95:37),
                                                        height:viewType==0?(widthPercentageToDP(95)/1.69):heightPercentageToDP(37),
                                                        // height:heightPercentageToDP(viewType==0?25:37),
                                                    }]}
                                                    source={{
                                                        uri: WebServices.MainURL+itemIn.Entity.ProfilePictureId,
                                                        // headers: { Authorization: 'someAuthToken' },
                                                        priority: FastImage.priority.normal,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                    />}
                                                    {getAllBadges(itemIn)}
                                                    </View>
                                                    {/* <View style={{position:'absolute',alignContent:'center',justifyContent:'center'
                                                        ,right:widthPercentageToDP(2),
                                                        top:widthPercentageToDP(2), 
                                                        width:widthPercentageToDP(viewType==0?14:11),
                                                        height:widthPercentageToDP(viewType==0?14:11)
                                                        ,backgroundColor:Colors.orangeShadeColor,borderRadius:widthPercentageToDP(2)}} >
                                                        <Text allowFontScaling={false} style={[styles.productPrice,{ fontSize:widthPercentageToDP(viewType==0?4.75:3.5),
                                                        lineHeight:widthPercentageToDP(viewType==0? 4.75:3.5)*1.3,}]}>{(checkIsVariable(itemIn)!=-1?getInitCost(itemIn) : itemIn.Entity.PriceDateList[0].PriceList[0].Value)+"\nQAR"}</Text>
                                                        
                                                        </View> */}
                                                        <View style={[{flexDirection:'row',backgroundColor:Colors.whiteColor,height:widthPercentageToDP(viewType==0?15.5:9.5),width:'100%',overflow:'hidden',borderBottomLeftRadius:widthPercentageToDP(3),borderBottomRightRadius:widthPercentageToDP(3)}]}>
                                                        <View style={{flexDirection:'row',width:'80%',height:'100%'}}>
                                                        <View style={{flexDirection:'column',width:'100%',height:'100%'}}>
                                                        <Text allowFontScaling={false} numberOfLines={1} style={[styles.productText,
                                                            {fontSize:(viewType==0?widthPercentageToDP(4):widthPercentageToDP(3.5)),
                                                            }]}>{getTranslatedProductName(itemIn)}</Text>
                                                            {<Text allowFontScaling={false} style={[styles.productText,
                                                                { fontSize:widthPercentageToDP(viewType==0?4.5:3.5),}]}>{(getItemCost(itemIn))}</Text>}
                                                                
                                                                </View>
                                                                
                                                                </View>
                                                                
                                                                {/* <View style={{flex:1,flexDirection:'row-reverse',borderWidth:1}}> */}
                                                                <TouchableOpacity style={[styles.cartButtonwithIcon,{end:0,}]}
                                                                onPress={()=>{
                                                                    onProductAdd(shopCartInfo,itemIn,getItemCost(itemIn),1,true,null,profile);
                                                                }}>
                                                                <Image style={[styles.addtoCart,{
                                                                    // left:(widthPercentageToDP(viewType==0?3:1.1)),
                                                                    height:(viewType==0?30:25),
                                                                    width:(viewType==0?30:25),
                                                                }]} resizeMode='contain' source={addcartIcon}/>
                                                                
                                                                </TouchableOpacity>
                                                                </View>
                                                                {/* </View> */}
                                                                </TouchableOpacity>
                                                            );
                                                        }
                                                        const OpenProductPageWeb=(_OpenProduct)=>{
                                                            openItem=!Tools.stringIsEmpty(_OpenProduct)?_OpenProduct.replaceAll('"',''):'';
                                                            if((!Tools.stringIsEmpty(openItem))){
                                                                console.log(allProductsRandom.length+'Open'+ openItem)
                                                                if(allProductsRandom!=undefined&&allProductsRandom.length>0)
                                                                    {
                                                                    allProductsRandom.map((productIn,index)=>{
                                                                        {
                                                                            { 
                                                                                // console.log('Open'+ openItem+"//"+JSON.stringify(productIn));
                                                                                if(!Tools.IsNull(productIn)){
                                                                                    // console.log(JSON.stringify(productIn))
                                                                                    if((!Tools.stringIsEmpty(openItem)&&(openItem==productIn.EntityId||(!Tools.IsNull(productIn.Entity)&&(checkProductUrl(productIn,openItem)))))){
                                                                                        // console.log('Open'+ openItem+"//"+productIn.CatalogType)
                                                                                        // console.log('Open'+ JSON.stringify(productIn))
                                                                                        onProductSelect(productIn);
                                                                                        // setOpenProductAll('');
                                                                                        setOpenProduct('');
                                                                                        // setOpenProductCode(''); 
                                                                                        
                                                                                        // setState({OpenProduct:''})
                                                                                        return;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                    // setOpenProductAll('');
                                                                }
                                                            }
                                                            
                                                        }
                                                        const OpenProductPage=(_OpenProduct)=>{
                                                            openItem=!Tools.stringIsEmpty(_OpenProduct)?_OpenProduct.replaceAll('"',''):'';
                                                            // console.log(allProducts.length+'Open'+ openItem)
                                                            if((!Tools.stringIsEmpty(openItem))){
                                                                if(allProducts!=undefined&&allProducts.length>0)
                                                                    {
                                                                    allProducts.map((productIn,index)=>{
                                                                        {
                                                                            { 
                                                                                // console.log('Open'+ openItem+"//"+JSON.stringify(productIn));
                                                                                if(!Tools.IsNull(productIn)){
                                                                                    // console.log(JSON.stringify(productIn))
                                                                                    if((!Tools.stringIsEmpty(openItem)&&(openItem==productIn.EntityId||(!Tools.IsNull(productIn.Entity)&&(openItem==productIn.Entity.ProductId||openItem==productIn.Entity.ProductCode))))){
                                                                                        // console.log('Open'+ openItem+"//"+productIn.CatalogType)
                                                                                        // console.log('Open'+ JSON.stringify(productIn))
                                                                                        onProductSelect(productIn);
                                                                                        setTimeout(() => {
                                                                                            setOpenProductAll('');
                                                                                            setOpenProductCode(''); 
                                                                                        }, 1000);
                                                                                        // setState({OpenProduct:''})
                                                                                        return;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                    // setOpenProductAll('');
                                                                }
                                                            }
                                                            
                                                        }
                                                        // const setOpenProductAll=(valueIn)=>{
                                                            //     // dispatch({
                                                        //     //     type:'update_OpenProduct',
                                                        //     //     payload:valueIn
                                                        //     // })
                                                        //     setOpenProductCode(valueIn);
                                                        //     // setOpenProduct(valueIn);
                                                        // }
                                                        const getProductnItems=()=>{
                                                            let allProductsIn=[];
                                                            let allProductCat=[];
                                                            let allProductCatVal=[];
                                                            if(props.storeCatalog.Nodes!=null)
                                                                {
                                                                props.storeCatalog.Nodes.map((itemIn,index)=>{
                                                                    if((selectedStore==''||itemIn.CatalogId==selectedStore)){
                                                                        itemIn.Nodes.map((_productIn,pindex)=>{
                                                                            let CanProcced=false;
                                                                            
                                                                            const isElementInArray =allProductCat.includes(_productIn.CatalogName);
                                                                            if(!isElementInArray&&Tools.stringIsContains(_productIn.TemplateCode,WebServices.category)){
                                                                                allProductCat.push(_productIn.CatalogName);
                                                                                allProductCatVal.push(_productIn);
                                                                            }
                                                                            CanProcced=filterProductCategory==undefined||(filterProductCategory!=undefined&&(filterProductCategory.CatalogName==_productIn.CatalogName));
                                                                            // if(filterProductCategory.length==0||filterProductCategory.length>0){
                                                                            //     if(filterProductCategory.length>0){
                                                                            //         let ValIn=[];
                                                                            //         ValIn= filterProductCategory.filter((itm)=>itm.CatalogName==_productIn.CatalogName);
                                                                            //         if(ValIn!=undefined&&ValIn.length>0){
                                                                            //             CanProcced=true;
                                                                            //         }
                                                                            //     }else{
                                                                            //         CanProcced=true;
                                                                            //     }
                                                                            if(CanProcced){
                                                                                // console.log("item :"+(itemIn.CatalogName));
                                                                                // console.log("getProductnItems"+_productIn.CatalogName+"/"+_productIn.CatalogType+"/"+_productIn.TemplateCode);
                                                                                _productIn.Nodes.map((productIn,pindex)=>{
                                                                                    if(Tools.stringIsEmpty(sorttext)||Tools.stringIsContains(getTranslatedProductName(productIn),sorttext)){
                                                                                        productIn.parkType=itemIn.CatalogName;
                                                                                        if(productIn.CatalogType==3&&productIn.Entity.ProductStatus==2)// on sale products only
                                                                                        { 
                                                                                            var productT=productIn;
                                                                                            productT.productTitle=_productIn.CatalogName;
                                                                                            productT.CatalogType=3;
                                                                                            allProductsIn.push(productT);
                                                                                        }else if(productIn.CatalogType==3&&productIn.EntityType==5){
                                                                                            var productT=productIn;
                                                                                            productT.productTitle=_productIn.CatalogName;
                                                                                            productT.CatalogType=2;
                                                                                            allProductsIn.push(productT);
                                                                                        }else if(productIn.CatalogType==2){
                                                                                            var productT=productIn;
                                                                                            productT.productTitle=_productIn.CatalogName;
                                                                                            productT.CatalogType=2;
                                                                                            allProductsIn.push(productT);
                                                                                        }
                                                                                    }
                                                                                })
                                                                                
                                                                            }
                                                                            // }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                            let allProductsInSort=[];
                                                            for (let index = 0; index < allProductCatVal.length; index++) {
                                                                const element = allProductsIn.filter((_itemInCheck)=>_itemInCheck.productTitle==allProductCatVal[index].CatalogName);
                                                                // if(element.length>0)
                                                                // allProductsInSort.push({
                                                                //     item:allProductCatVal[index]
                                                                // });
                                                                for (let index = 0; index < element.length; index++) {
                                                                    const elementIn = element[index];
                                                                    allProductsInSort.push(elementIn);
                                                                }
                                                            }
                                                            // if(allProductCatVal.length>0)
                                                            if(!shuffled&&(filterProductCategory==undefined)){
                                                                shuffleArray(allProductsInSort);
                                                                setallProductsRandom(allProductsInSort);
                                                            }
                                                            if(shuffled&&(filterProductCategory==undefined)&&Tools.IsNull(selectedStore)){
                                                                allProductsInSort=(allProductsRandom);
                                                            }
                                                            let allcat=undefined;
                                                            if(filterProductCategory!=undefined){
                                                                allcat=allProductCatVal.filter((_itemcheck)=>_itemcheck.CatalogName==filterProductCategory.CatalogName);
                                                                if(allcat==null||allcat==undefined||allcat.length==0)
                                                                    setfilterProductCategory(undefined);
                                                            }
                                                            allProductsInSort=[undefined,...allProductsInSort];
                                                            setallProducts(allProductsInSort);
                                                            setallProductCategory(allProductCatVal);
                                                            // OpenProductPage(state.OpenProduct);
                                                            
                                                        }
                                                        const shuffleArray=(array) =>{
                                                            for (let i = array.length - 1; i > 0; i--) {
                                                                const j = Math.floor(Math.random() * (i + 1));
                                                                [array[i], array[j]] = [array[j], array[i]];
                                                            }
                                                        }
                                                        const  getCatlogName=(_productCatId)=>{
                                                            // console.log("getCatlogName"+_productCatId);
                                                            for (let index = 0; index < props.storeCatalog.Nodes.length; index++) {
                                                                const element = props.storeCatalog.Nodes[index];
                                                                // console.log(element.CatalogId+":"+_productCatId);
                                                                
                                                                if(element.CatalogId==_productCatId){
                                                                    return element;//.CatalogName;
                                                                }
                                                                
                                                            }
                                                            return '';
                                                        }
                                                        const onProductSelectOpen=()=>{
                                                            
                                                        }
                                                        
                                                        const onProductSelectEvent=(itemIn)=>{
                                                            var selectedProduct=itemIn;
                                                            var filteredProducts=[];
                                                            
                                                            
                                                            var selectedProduct=itemIn;
                                                            // console.log("onProductSelectEvent "+JSON.stringify( selectedProduct));
                                                            // context.setBottomBar(0);
                                                            props.navigation.navigate('ProductPage',{
                                                                screen:"",
                                                                // updateProfile:updateProfile.bind(this),
                                                                accessToken:props.accessToken,
                                                                profile:profile,
                                                                // onDone:onDoneProduct,
                                                                addtoCart:onProductAdd,
                                                                product:selectedProduct,
                                                                openProductIn:onProductSelect,
                                                                catalogName:getCatlogName(selectedProduct.ParentCatalogId),
                                                                allproducts:cartItems, catalogProducts:filteredProducts,
                                                                gotoCart:openCart
                                                            })
                                                        }
                                                        const onProductSelectFolder=(itemIn)=>{
                                                            var selectedProduct=itemIn;
                                                            var filteredProducts=[];
                                                            
                                                            
                                                            var selectedProduct=itemIn;
                                                            // console.log("onProductSelectFolder "+JSON.stringify( selectedProduct));
                                                            
                                                            // console.log("onProductSelectFolder "+JSON.stringify( profile));
                                                            // context.setBottomBar(0);
                                                            props.navigation.navigate('ProductPage',{
                                                                screen:"",
                                                                // updateProfile:updateProfile.bind(this),
                                                                accessToken:props.accessToken,
                                                                profile:profile,
                                                                // onDone:onDoneProduct,
                                                                addtoCart:onProductAdd,
                                                                product:selectedProduct,
                                                                openProductIn:onProductSelect,
                                                                catalogName:getCatlogName(selectedProduct.ParentCatalogId),
                                                                allproducts:cartItems, catalogProducts:filteredProducts,
                                                                gotoCart:openCart
                                                            })
                                                        }
                                                        
                                                        const onProductSelect=(itemIn)=>{
                                                            var selectedProduct=itemIn;
                                                            var filteredProducts=[];
                                                            for (let index = 0; index < allProductsRandom.length; index++) {
                                                                const element = allProductsRandom[index];
                                                                if(!Tools.IsNull(element)&&!Tools.IsNull(element.Entity)){
                                                                    var elements=[];
                                                                    elements=selectedProduct.Entity.MetaDataList.filter((meteD)=>
                                                                        (meteD.MetaFieldCode===WebServices.relatedProduct));
                                                                    if(elements.length>0){
                                                                        const elementsValue=elements[0].Value.split(',');
                                                                        filteredProducts = allProductsRandom.filter(itemIn1 =>
                                                                            // console.log(!Tools.IsNull(itemIn1)&&!Tools.IsNull(itemIn1.Entity)?itemIn1.Entity.ProductId+"="+elementsValue:"no");
                                                                            elementsValue.some(element => !Tools.IsNull(itemIn1)&&!Tools.IsNull(itemIn1.Entity)&&itemIn1.Entity.ProductId === element)
                                                                        );
                                                                    }
                                                                }
                                                            }
                                                            // console.log("onProductSelect "+JSON.stringify( selectedProduct));
                                                            
                                                            // context.setBottomBar(0);
                                                            props.navigation.navigate('ProductPage',{
                                                                screen:"",
                                                                // updateProfile:updateProfile.bind(this),
                                                                accessToken:props.accessToken,
                                                                profile:profile,
                                                                // onDone:onDoneProduct,
                                                                addtoCart:onProductAdd,
                                                                product:selectedProduct,
                                                                catalogName:getCatlogName(selectedProduct.ParentCatalogId),
                                                                allproducts:cartItems,
                                                                openProductIn:onProductSelect,
                                                                catalogProducts:filteredProducts,
                                                                gotoCart:openCart
                                                            })
                                                            // setState({selectedProduct:itemIn,productModal:true})
                                                        }
                                                        
                                                        const checkIsVariable=(_productIn)=>{
                                                            if(_productIn!=null&&_productIn.Entity!=null&&_productIn.Entity.AttributeItemList!=null)
                                                                for (let index = 0; index < _productIn.Entity.AttributeItemList.length; index++) {
                                                                const element = _productIn.Entity.AttributeItemList[index];
                                                                if(element.Active&&element.SelectionType==3){
                                                                    return index;
                                                                }
                                                            }
                                                            return -1;
                                                        }
                                                        
                                                        const removeItemfromCart=useCallback((_cartIn,_shopCartInfo,_producttoRemove)=>{
                                                            dispatch({
                                                                type:'update_Cart',
                                                                stateIn:_shopCartInfo
                                                            })
                                                            removeShoppingCartVGS(_cartIn,_shopCartInfo,_producttoRemove);
                                                        },[]);
                                                        const ModifyItemfromCart=(_shopCartInfo,_producttoModify,_countIn)=>{
                                                            modifyShoppingCartVGS(_shopCartInfo,_producttoModify,_countIn);
                                                        }
                                                        
                                                        const onProductAddFolder=(itemIn,totalNo,check,additionalInfo,_profile,callback=null)=>{
                                                            if(check){
                                                                if( checkIsVariable (itemIn)!=-1){
                                                                    onProductSelect(itemIn)
                                                                    return;
                                                                }
                                                                else if((itemIn.CatalogNameExt)==WebServices.topupCommand){
                                                                    onProductSelect(itemIn)
                                                                    return;
                                                                }
                                                            }
                                                            // if(checkLeisure(itemIn,_profile)){
                                                            //     //open register
                                                            //     // console.log(callback)
                                                            //     if(callback!=null){
                                                            //         callback(null)
                                                            //         return;
                                                            //     }
                                                            //     setState({showLogin:true})
                                                            //     return;
                                                            // }
                                                            // else{
                                                            //     if((itemIn.type)==WebServices.variableCommand){
                                                            
                                                            //         return;
                                                            //     }
                                                            //     if(getOthercategory(itemIn.categories).slug==WebServices.topupCommand){
                                                            //         return;
                                                            //     }
                                                            
                                                            // }
                                                            // console.log("Add : "+JSON.stringify(additionalInfo));
                                                            setShowInfo({"textToDisplay":i18n.t('addedtocart')});
                                                            // setState({ShowInfo:{"textToDisplay":i18n.t('addedtocart')}})
                                                            var cartItemsIn=cartItems;
                                                            const tempCartItem={item:{value:itemIn,details:additionalInfo},count:totalNo};
                                                            // var filteredCart=cartItemsIn.filter(itemSelect=>{
                                                                //     return ((itemIn.Entity.ProductCode==itemSelect.item.value.Entity.ProductCode&&itemSelect.item.details==null&&additionalInfo==null)||(itemSelect.item.details!=null&&additionalInfo!=null&&additionalInfo.displayname==itemSelect.item.details.displayname))
                                                            // });
                                                            
                                                            // if(filteredCart.length>0){
                                                            //     filteredCart[0].count+=totalNo;
                                                            //     modifyShoppingCartVGS(tempCartItem,totalNo);
                                                            // }else
                                                            {
                                                                cartItemsIn.push(tempCartItem);
                                                                addtoShoppingCartVGS(tempCartItem,totalNo);
                                                            }
                                                            settotalItems(cartItemsIn.length);
                                                            setcartItems(cartItemsIn);
                                                            dispatch({
                                                                type:'update_CartItems',
                                                                stateIn:cartItemsIn
                                                            })
                                                            props.navigation.setParams({
                                                                allproducts:cartItems,
                                                            })
                                                            if(callback!=null)
                                                                callback(cartItemsIn);
                                                            // openCart();
                                                        }
                                                        
                                                        const onProductAdd=(_shopCartInfo,itemIn,priceIn,totalNo,check,additionalInfo,_profile,callback=false,template_Code='',addonDetails=null)=>{
                                                            if(check){
                                                                if(checkInformativeProduct(itemIn)){
                                                                    onProductSelect(itemIn)
                                                                    return;
                                                                }
                                                                
                                                                if(checkAddonProduct(itemIn)){
                                                                    onProductSelect(itemIn)
                                                                    return;
                                                                }
                                                                
                                                                if(checkDateProduct(itemIn)){
                                                                    onProductSelect(itemIn)
                                                                    return;
                                                                }
                                                                if( checkIsVariable (itemIn)!=-1){
                                                                    onProductSelect(itemIn)
                                                                    return;
                                                                }
                                                                else if((itemIn.CatalogNameExt)==WebServices.topupCommand){
                                                                    onProductSelect(itemIn)
                                                                    return;
                                                                }
                                                            }
                                                            setShowInfo({"textToDisplay":i18n.t('addedtocart')});
                                                            // setState({ShowInfo:{"textToDisplay":i18n.t('addedtocart')}})
                                                            var cartItemsIn=cartItems;
                                                            const tempCartItem={item:{value:itemIn,details:additionalInfo},count:totalNo};
                                                            // console.log("Temp Cart : "+JSON.stringify(tempCartItem));
                                                            var filteredCart=cartItemsIn.filter(itemSelect=>{
                                                                return ((itemIn.Entity.ProductId==itemSelect.item.value.Entity.ProductId&&itemSelect.item.details==null&&additionalInfo==null))
                                                                // ||(itemSelect.item.details!=null&&additionalInfo!=null&&additionalInfo.displayname==itemSelect.item.details.displayname))
                                                            });
                                                            // console.log(filteredCart.length+":cartItemsIn:"+cartItemsIn.length);
                                                            // if(addonDetails!=null)
                                                            // {
                                                            //     cartItemsIn.push(tempCartItem);
                                                            //     // addmultipletoShoppingCartVGS(tempCartItem,addonDetails,totalNo);
                                                            // }
                                                            // else 
                                                            if(filteredCart.length>0){
                                                                filteredCart[0].count+=totalNo;
                                                                modifyShoppingCartVGS(_shopCartInfo,itemIn.Entity,totalNo);
                                                            }else {
                                                                cartItemsIn.push(tempCartItem);
                                                                addtoShoppingCartVGS(tempCartItem,priceIn,totalNo,(dataIn)=>{
                                                                    if(callback)
                                                                        DeviceEventEmitter.emit("callbackProductPage",{p1:dataIn==""?cartItemsIn:"error"})
                                                                });
                                                            }
                                                            settotalItems(cartItemsIn.length);
                                                            setcartItems(cartItemsIn);
                                                            dispatch({
                                                                type:'update_CartItems',
                                                                stateIn:cartItemsIn
                                                            })
                                                            // setState({totalItems:cartItemsIn.length,cartItems:cartItemsIn});
                                                            props.navigation.setParams({
                                                                allproducts:cartItems,
                                                            })
                                                            // if(callback)
                                                            //     DeviceEventEmitter.emit("callbackProductPage",{p1:cartItemsIn})
                                                            // callback(cartItemsIn);
                                                            // openCart(true);
                                                        }
                                                        const AddCoupontoShoppingCartVGS=(_shopCartInfo,_couponCode)=>{
                                                            
                                                            console.log('AddCoupontoShoppingCartVGS :'+(_couponCode));
                                                            
                                                            var bodyData={
                                                                "Command":"AddCouponToCart",
                                                                "ShopCartId":_shopCartInfo.Answer.ShopCart.ShopCartId,
                                                                "AddCouponToCart":{
                                                                    "CouponCode":_couponCode,
                                                                },
                                                            }
                                                            // console.log('modify - '+JSON.stringify(bodyData));
                                                            fetch (WebServices.MainURL+WebServices.addCoupontoCart,{
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body:JSON.stringify(bodyData)
                                                            },5000)
                                                            .then((response) => response.text())
                                                            .then((responseJson) => {
                                                                shopCart=JSON.parse(responseJson);
                                                                // console.log("Coupon: "+JSON.stringify(shopCart));
                                                                if(shopCart.Header.ErrorMessage!=undefined){
                                                                    Alert.alert(shopCart.Header.ErrorMessage);
                                                                    DeviceEventEmitter.emit("setLoadingCart",{p1:false});  
                                                                }else{
                                                                    dispatch({
                                                                        type:'update_Cart',
                                                                        stateIn:shopCart
                                                                    })
                                                                }
                                                            }).catch((error) =>{
                                                                console.log("error"+error);
                                                                DeviceEventEmitter.emit("setLoadingCart",{p1:false});  
                                                            });
                                                        }
                                                        
                                                        const modifyShoppingCartVGS=(_shopCartInfo,_itemtoCart,_count)=>{
                                                            if(Tools.IsNull(_shopCartInfo)||Tools.IsNull(_shopCartInfo.Answer)||Tools.IsNull(_shopCartInfo.Answer.ShopCart)||Tools.IsNull(_shopCartInfo.Answer.ShopCart.ShopCartId)){
                                                                return;
                                                            }
                                                            console.log('Modify :'+JSON.stringify(_itemtoCart));
                                                            // console.log('M :'+JSON.stringify(shopCartInfo));
                                                            const filteredCart=_shopCartInfo.Answer.ShopCart.Items.filter((itemSelect)=>{
                                                                // return ((_itemtoCart.item.value.Entity.ProductId==itemSelect.ProductId&&itemSelect.item.details==null&&additionalInfo==null)||(itemSelect.item.details!=null&&additionalInfo!=null&&additionalInfo.displayname==itemSelect.item.details.displayname))
                                                                return (_itemtoCart.ProductId===itemSelect.ProductId)
                                                            });
                                                            
                                                            if(filteredCart!=undefined&&filteredCart.length>0){
                                                                var bodyData={
                                                                    "ShopcartId":_shopCartInfo.Answer.ShopCart.ShopCartId,
                                                                    "ShopcartItemId": filteredCart[0].ShopCartItemId,
                                                                    "langIso": "en",
                                                                    "QuantityDifference": _count,
                                                                    "MemberId":Tools.IsNull(profile)?"":props.accessToken.MemberID
                                                                }
                                                                // console.log('modify - '+JSON.stringify(bodyData));
                                                                fetch (WebServices.MainURL+WebServices.modifyCart,{
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body:JSON.stringify(bodyData)
                                                                },5000)
                                                                .then((response) => response.text())
                                                                .then((responseJson) => {
                                                                    shopCart=JSON.parse(responseJson);
                                                                    dispatch({
                                                                        type:'update_Cart',
                                                                        stateIn:shopCart
                                                                    })
                                                                }).catch((error) =>{
                                                                    console.log("error"+error);
                                                                    DeviceEventEmitter.emit("setLoadingCart",{p1:false});  
                                                                });
                                                            }
                                                        }
                                                        const removeShoppingCartVGS=(_cartIn,_shopCartInfo,_itemtoCart)=>{
                                                            if(Tools.IsNull(_shopCartInfo)||Tools.IsNull(_shopCartInfo.Answer.ShopCart)||Tools.IsNull(_shopCartInfo.Answer.ShopCart.ShopCartId)){
                                                                return;
                                                            }
                                                            var cartItemsIn=_cartIn;
                                                            var cartItemsRemoveIn=_cartIn;
                                                            cartItemsRemoveIn=cartItemsIn.filter(itemSelect=>{
                                                                return(itemSelect.item.value.Entity.ProductId==_itemtoCart.ProductId)
                                                            })
                                                            cartItemsIn=cartItemsIn.filter(itemSelect=>{
                                                                return(itemSelect.item.value.Entity.ProductId!=_itemtoCart.ProductId)
                                                            })
                                                            updateProducts(cartItemsIn);
                                                            // console.log("REmove "+JSON.stringify(cartItemsIn));
                                                            var filteredCart=_shopCartInfo.Answer.ShopCart.Items.filter(itemSelect=>{
                                                                // return ((_itemtoCart.item.value.Entity.ProductId==itemSelect.ProductId&&itemSelect.item.details==null&&additionalInfo==null)||(itemSelect.item.details!=null&&additionalInfo!=null&&additionalInfo.displayname==itemSelect.item.details.displayname))
                                                                return (_itemtoCart.ProductId==itemSelect.ProductId)
                                                            });
                                                            if(filteredCart!=undefined&&filteredCart.length>0){
                                                                var bodyData={
                                                                    "ShopcartId":_shopCartInfo.Answer.ShopCart.ShopCartId,
                                                                    "ShopcartItemId": filteredCart[0].ShopCartItemId,
                                                                    "langIso": "en",
                                                                    "MemberId":Tools.IsNull(profile)?"":props.accessToken.MemberID
                                                                }
                                                                fetch (WebServices.MainURL+WebServices.removeCart,{
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body:JSON.stringify(bodyData)
                                                                },5000)
                                                                .then((response) => response.text())
                                                                .then((responseJson) => {
                                                                    // console.log("logRemoveFromCartEvent "+JSON.stringify(cartItemsRemoveIn));
                                                                    // _productIn=getProduct(_itemtoCart.ProductId);
                                                                    logRemoveFromCartEvent(cartItemsRemoveIn[0]);
                                                                    shopCart=JSON.parse(responseJson);
                                                                    dispatch({
                                                                        type:'update_Cart',
                                                                        stateIn:shopCart
                                                                    })
                                                                })
                                                            }
                                                        }
                                                        const removeShoppingCartVGSWait = async (_itemtoCart)=>{
                                                            var cartItemsIn=cartItems;
                                                            cartItemsIn=cartItemsIn.filter(itemSelect=>{
                                                                return(itemSelect.item.value.Entity.ProductId!=_itemtoCart.ProductId)
                                                            })
                                                            updateProducts(cartItemsIn);
                                                            // console.log("REmove "+JSON.stringify(_itemtoCart));
                                                            var filteredCart=shopCartInfo.Answer.ShopCart.Items.filter(itemSelect=>{
                                                                // return ((_itemtoCart.item.value.Entity.ProductId==itemSelect.ProductId&&itemSelect.item.details==null&&additionalInfo==null)||(itemSelect.item.details!=null&&additionalInfo!=null&&additionalInfo.displayname==itemSelect.item.details.displayname))
                                                                return (_itemtoCart.ProductId==itemSelect.ProductId)
                                                            });
                                                            var bodyData={
                                                                "ShopcartId":shopCartInfo.Answer.ShopCart.ShopCartId,
                                                                "ShopcartItemId": filteredCart[0].ShopCartItemId,
                                                                "langIso": "en",
                                                                "MemberId":Tools.IsNull(profile)?"":props.accessToken.MemberID
                                                            }
                                                            await fetch (WebServices.MainURL+WebServices.removeCart,{
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body:JSON.stringify(bodyData)
                                                            },5000)
                                                            .then((response) => response.text())
                                                            .then((responseJson) => {
                                                                // console.log("REmoved logRemoveFromCartEvent"+JSON.stringify(_itemtoCart));
                                                                logRemoveFromCartEvent(_itemtoCart)
                                                                shopCart=JSON.parse(responseJson);
                                                                dispatch({
                                                                    type:'update_Cart',
                                                                    stateIn:shopCart
                                                                })
                                                            })
                                                        }
                                                        const checkSeatOfPerformance= async (_shopCartInfo,_callback) =>{
                                                            var removed=false;
                                                            for (let index = 0; index < _shopCartInfo.Answer.ShopCart.Items.length; index++) {
                                                                const element = _shopCartInfo.Answer.ShopCart.Items[index];
                                                                // console.log("Ele "+JSON.stringify(element));
                                                                if(element.PerformanceList!=undefined&&!Tools.IsNull(element.PerformanceList)&&element.PerformanceList.length>0){
                                                                    var bodyData={
                                                                        "Command":"LoadSeatStatus",
                                                                        "LoadSeatStatus":{
                                                                            "HoldId":_shopCartInfo.Answer.ShopCart.HoldId,
                                                                            "PerformanceId":element.PerformanceList[0].PerformanceId,
                                                                        },
                                                                    }
                                                                    // console.log("Add - "+JSON.stringify(bodyData));
                                                                    await fetch (WebServices.MainURL+WebServices.checkSeat,{
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                        body:JSON.stringify(bodyData)
                                                                    },5000)
                                                                    .then((response) => response.text())
                                                                    .then((responseJson) => {
                                                                        // console.log("LoadSeatStatus : "+responseJson);
                                                                        responseObj=JSON.parse(responseJson);
                                                                        if(!Tools.IsNull(responseObj.Answer.LoadSeatStatus.SeatList)&&responseObj.Answer.LoadSeatStatus.SeatList.length>0&&
                                                                        responseObj.Answer.LoadSeatStatus.SeatList[0].QuantityFree>0){
                                                                            
                                                                        }else{
                                                                            (removeShoppingCartVGSWait(element));
                                                                            removed=true;
                                                                        }
                                                                    }).catch((error) =>{
                                                                        console.log('UPE Store'+error);
                                                                        dispatch({
                                                                            type:'update_Cart',
                                                                            stateIn:undefined
                                                                        })
                                                                    });
                                                                }
                                                                
                                                            }
                                                            if(removed){
                                                                Alert.alert(i18n.t('cartitemsadjusted'),'');
                                                            }
                                                            if(_callback!=null&&!removed){
                                                                shopCart=_shopCartInfo;
                                                                shopCart.random=Math.floor(Math.random() * 100000) + 1;
                                                                dispatch({
                                                                    type:'update_Cart',
                                                                    stateIn:shopCart
                                                                })
                                                                _callback();
                                                            }
                                                            // var bodyData={
                                                            //     "Command":"LoadSeatStatus",
                                                            //     "LoadSeatStatus":{
                                                            //         "HoldId":"",
                                                            //         "PerformanceId":(Tools.IsNull(_itemtoCart.item.details)||Tools.IsNull(_itemtoCart.item.details.performance))?null:_itemtoCart.item.details.performance.PerformanceId,
                                                            //     },
                                                            // }
                                                            // console.log("Add - "+JSON.stringify(bodyData));
                                                            // fetch (WebServices.MainURL+WebServices.checkSeat,{
                                                            //     method: 'POST',
                                                            //     headers: {
                                                            //         'Content-Type': 'application/json',
                                                            //     },
                                                            //     body:JSON.stringify(bodyData)
                                                            // },5000)
                                                            // .then((response) => response.text())
                                                            // .then((responseJson) => {
                                                                //     console.log("R : "+responseJson);
                                                            //     shopCart=JSON.parse(responseJson);
                                                            
                                                            // }).catch((error) =>{
                                                                //     console.log('UPE '+error);
                                                            //     props.updateCart(null);
                                                            //     setState({shopCartInfo:null},()=>{
                                                                //     });
                                                            //     // Al
                                                            // });
                                                        }
                                                        
                                                        const addmultipletoShoppingCartVGS=(_itemtoCart,_addonDetails,_count)=>{
                                                            // console.log("addtoShoppingCartVGS"+JSON.stringify(_itemtoCart))
                                                            var allItems=[];
                                                            allItems.push({
                                                                "ProductId": _itemtoCart.item.value.Entity.ProductId,
                                                                "Quantity":_count,
                                                                // "PerformanceIDs":(Tools.IsNull(_itemtoCart.item.details)||Tools.IsNull(_itemtoCart.item.details.performance))?null:_itemtoCart.item.details.performance.PerformanceId
                                                            })
                                                            for (let index = 0; index < _addonDetails.length; index++) {
                                                                const element = _addonDetails[index];
                                                                var indexIn=index;
                                                                allItems.push({
                                                                    "ProductId": _addonDetails[indexIn].ProductList[0].ProductId,
                                                                    "Quantity":_count,
                                                                    "PerformanceIDs":_addonDetails[indexIn].PerformanceId
                                                                })
                                                            }
                                                            
                                                            var bodyData={
                                                                "ShopcartId":(Tools.IsNull(shopCartInfo)||Tools.IsNull(shopCartInfo.Answer)||Tools.IsNull(shopCartInfo.Answer.ShopCart))?"":shopCartInfo.Answer.ShopCart.ShopCartId,
                                                                "EntityType": 12,
                                                                "langIso": "en",
                                                                // "PerformanceIDs":(Tools.IsNull(_itemtoCart.item.details)||Tools.IsNull(_itemtoCart.item.details.performance))?null:_itemtoCart.item.details.performance.PerformanceId,
                                                                "Items": allItems,
                                                                "MediaCode":(!Tools.IsNull(_itemtoCart.item.details)&&_itemtoCart.item.details.type==WebServices.topupCommand)?_itemtoCart.item.details.displayname:'',
                                                                "AccountId":Tools.IsNull(_itemtoCart.item.details)||Tools.IsNull(_itemtoCart.item.details.data)?"":_itemtoCart.item.details.data.AccountId,
                                                                "MemberId":Tools.IsNull(profile)?"":profile.Id,
                                                                "ValidFrom":(!Tools.IsNull(_itemtoCart.item.details)&&!Tools.IsNull(_itemtoCart.item.details.displayname)&&_itemtoCart.item.details.displayname=='date'?_itemtoCart.item.details.data:'')
                                                            }
                                                            // console.log("Add - "+JSON.stringify(bodyData));
                                                            fetch (WebServices.MainURL+WebServices.addtoCart,{
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body:JSON.stringify(bodyData)
                                                            },WebServices.timeout)
                                                            .then((response) => response.text())
                                                            .then((responseJson) => {
                                                                // console.log("Multiple R : "+responseJson);
                                                                shopCart=JSON.parse(responseJson);
                                                                logAddToCartEvent(_itemtoCart,_priceIn,_count); 
                                                                dispatch({
                                                                    type:'update_Cart',
                                                                    stateIn:shopCart
                                                                })
                                                                {
                                                                    SecureStore.setItemAsync("shopcart",shopCart.Answer.ShopCart.ShopCartId);
                                                                };
                                                            }).catch((error) =>{
                                                                // console.log('UPE addtocart'+error);
                                                                dispatch({
                                                                    type:'update_Cart',
                                                                    stateIn:undefined
                                                                })
                                                            });
                                                        }
                                                        
                                                        const addtoShoppingCartVGS=(_itemtoCart,_priceIn,_count,callback=null)=>{
                                                            // console.log("addtoShoppingCartVGS"+JSON.stringify(_itemtoCart))
                                                            var allItems=[];
                                                            if(!Tools.IsNull(_itemtoCart.item)&&!Tools.IsNull(_itemtoCart.item.details)&&_itemtoCart.item.details.type=='events'){
                                                                allItems.push({
                                                                    "ProductId": _itemtoCart.item.value.Entity.ProductId,
                                                                    "Quantity":_count,
                                                                    // "Options":((checkIsVariable(_itemtoCart.item.value)!=-1)?_itemtoCart.item.details.data.AttributeItemId:""),
                                                                    "PerformanceIDs":(Tools.IsNull(_itemtoCart.item.details)||Tools.IsNull(_itemtoCart.item.details.performance))?null:_itemtoCart.item.details.performance.PerformanceId
                                                                })
                                                            }else{
                                                                if(checkIsVariable(_itemtoCart.item.value)!=-1){
                                                                    allItems.push({
                                                                        "ProductId": _itemtoCart.item.value.Entity.ProductId,
                                                                        "Quantity":_count,
                                                                        "Options":_itemtoCart.item.details.data.AttributeItemId,
                                                                        "PerformanceIDs":(Tools.IsNull(_itemtoCart.item.details)||Tools.IsNull(_itemtoCart.item.details.performance))?null:_itemtoCart.item.details.performance.PerformanceId
                                                                    })
                                                                }else{
                                                                    allItems.push({
                                                                        "ProductId": _itemtoCart.item.value.Entity.ProductId,
                                                                        "Quantity":_count
                                                                    })
                                                                }
                                                            }
                                                            // console.log("_itemtoCart"+JSON.stringify(_itemtoCart));
                                                            var bodyData={
                                                                "ShopcartId":(Tools.IsNull(shopCartInfo)||Tools.IsNull(shopCartInfo.Answer)||Tools.IsNull(shopCartInfo.Answer.ShopCart))?"":shopCartInfo.Answer.ShopCart.ShopCartId,
                                                                "EntityType": 12,
                                                                "langIso": "en",
                                                                // "PerformanceIDs":(Tools.IsNull(_itemtoCart.item.details)||Tools.IsNull(_itemtoCart.item.details.performance))?null:_itemtoCart.item.details.performance.PerformanceId,
                                                                "Items": allItems,
                                                                "MediaCode":(!Tools.IsNull(_itemtoCart.item.details)&&_itemtoCart.item.details.type==WebServices.topupCommand)?_itemtoCart.item.details.displayname:'',
                                                                "AccountId":Tools.IsNull(_itemtoCart.item.details)||Tools.IsNull(_itemtoCart.item.details.data)?"":_itemtoCart.item.details.data.AccountId,
                                                                "MemberId":Tools.IsNull(profile)?"":profile.Id,
                                                                "ValidFrom":((!Tools.IsNull(_itemtoCart.item.details)&&!Tools.IsNull(_itemtoCart.item.details.displayname)&&_itemtoCart.item.details.displayname=='date')?_itemtoCart.item.details.data:'')
                                                            }
                                                            console.log("Add - "+JSON.stringify(bodyData));
                                                            fetch (WebServices.MainURL+WebServices.addtoCart,{
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body:JSON.stringify(bodyData)
                                                            },WebServices.timeout)
                                                            .then((response) => {
                                                                console.log("Status :"+response.ok);
                                                                if (!response.ok) {
                                                                    if(callback!=null){
                                                                        callback("Error");
                                                                    }
                                                                }else{
                                                                    if(callback!=null){
                                                                        callback("");
                                                                    }
                                                                }
                                                                return response.text();
                                                            })
                                                            .then((responseJson) => {
                                                                console.log("R : "+responseJson);
                                                                shopCart=JSON.parse(responseJson);
                                                                logAddToCartEvent(_itemtoCart,_priceIn,_count); 
                                                                dispatch({
                                                                    type:'update_Cart',
                                                                    stateIn:shopCart
                                                                })
                                                                {
                                                                    SecureStore.setItemAsync("shopcart",shopCart.Answer.ShopCart.ShopCartId);
                                                                };
                                                                
                                                            }).catch((error) =>{
                                                                // console.log('UPE addtocart'+error);
                                                                dispatch({
                                                                    type:'update_Cart',
                                                                    stateIn:undefined
                                                                })
                                                            });
                                                        }
                                                        
                                                        const validateShoppingCartVGS=(_shotCartId,_profile,_totalVal,_LoadUpdate)=>{
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
                                                                
                                                                var responseObj=JSON.parse(responseJson);
                                                                if(!responseObj.Answer.ValidateShopCart.RestrictValidPayments){
                                                                    // postTransaction(_shotCartId,_totalVal,_LoadUpdate)
                                                                    getPaymentURL(_shopCardID,_profile,_totalAmount,_account,_address)
                                                                }
                                                                else{
                                                                    if(_LoadUpdate!=null){
                                                                        _LoadUpdate(false);
                                                                    }
                                                                }
                                                            }).catch((error) =>{
                                                                // console.log('UPE '+error);
                                                                if(_LoadUpdate!=null){
                                                                    _LoadUpdate(false);
                                                                }
                                                            });
                                                        }
                                                        const getPaymentURL=(_shopCardID,_profile,_totalAmount,_account,_address)=>{
                                                            var bodyData={
                                                                "MemberId":Tools.IsNull(profile)?"":props.accessToken.MemberID,
                                                                "ShopcartId":_shopCardID,
                                                                "Amount":_totalAmount,
                                                                "Address":{
                                                                    "street":_profile.BillingAddress.street,
                                                                    "city":_profile.BillingAddress.city,
                                                                    "state":_profile.BillingAddress.state,
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
                                                            fetch (WebServices.MainURL+WebServices.initskipcash,{
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body:JSON.stringify(bodyData)
                                                            },5000)
                                                            .then((response) => response.text())
                                                            .then((responseJson) => {
                                                                // console.log(responseJson);
                                                                var responseObj=JSON.parse(responseJson);
                                                                if(Tools.stringIsEmpty(responseObj.Error)){
                                                                    //openskipcashurl
                                                                    setshowPay(true)
                                                                    setpaymentWebUrl(responseObj.PaymentURL);
                                                                    // setState({showPay:true,paymentWebUrl:responseObj.PaymentURL})
                                                                }
                                                                else{
                                                                    if(_LoadUpdate!=null){
                                                                        _LoadUpdate(false);
                                                                    }
                                                                }
                                                            }).catch((error) =>{
                                                                // console.log('UPE '+error);
                                                                if(_LoadUpdate!=null){
                                                                    _LoadUpdate(false);
                                                                }
                                                            });
                                                        }
                                                        const getattribute=(_attribute)=>{
                                                            return _attribute.substring(_attribute.indexOf('-') + 1);
                                                        }
                                                        const getShopCartItem=(_item,_shopCart)=>{
                                                            for (let index = 0; index < _shopCart.Answer.ShopCart.Items.length; index++) {
                                                                // console.log(_item.sku+"//"+_shopCart.Answer.ShopCart.Items[index].ProductId);
                                                                if(_item.Entity.ProductId==_shopCart.Answer.ShopCart.Items[index].ProductId){
                                                                    return _shopCart.Answer.ShopCart.Items[index];
                                                                }
                                                            }
                                                            return null;
                                                            
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
                                                            var allItems=[];
                                                            for (let index = 0; index < cartItems.length; index++) {
                                                                if(cartItems[index].item.details!=null){
                                                                    // console.log('Check'+cartItems[index].item.details);
                                                                    if(cartItems[index].item.details.type==WebServices.topupCommand){
                                                                        shopCartItem=getShopCartItem(cartItems[index].item.value,_shopcart);
                                                                        for (let i = 0; i < cartItems[index].count; i++) {
                                                                            allItems.push({
                                                                                "ShopcartItemId":shopCartItem.ShopCartItemId,
                                                                                "Position":i+1,
                                                                                "AccountId":cartItems[index].item.details.data.AccountId
                                                                            })
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            // if(allItems.length==0){
                                                            //     validateShoppingCartVGS(_shopcart.Answer.ShopCart.ShopCartId,_profile,_totalVal,_LoadUpdate);
                                                            //     return;
                                                            // }
                                                            
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
                                                                
                                                                validateShoppingCartVGS(_shopcart.Answer.ShopCart.ShopCartId,_profile,_totalVal,_LoadUpdate);
                                                                
                                                                // postTransaction(_shopcart.Answer.ShopCart.ShopCartId,_totalVal)
                                                            }).catch((error) =>{
                                                                // console.log('UPE '+error);
                                                                if(_LoadUpdate!=null){
                                                                    _LoadUpdate(false);
                                                                }
                                                            });
                                                        }
                                                        
                                                        const getPriceInfo=(_product)=>{
                                                            if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.Entity)&&!Tools.IsNull(_product.Entity.MetaDataList)){
                                                                const metaData=_product.Entity.MetaDataList;
                                                                for (let index = 0; index < metaData.length; index++) {
                                                                    const element = metaData[index];
                                                                    // console.log(_product.Entity.ProductName+" FN-"+JSON.stringify(element));
                                                                    if(!Tools.IsNull(element.MultiLanguageText)&&!Tools.IsNull(element.MultiLanguageText.TransList)){
                                                                        var localeIn=Tools.stringIsContains(i18n.locale,"ar")?"ar":"en";
                                                                        return element.MultiLanguageText.TransList.filter((item)=>item.LangISO==localeIn)[0].Translation;
                                                                    }
                                                                    if(Tools.stringIsContains(element.MetaFieldCode,WebServices.priceInfo)){
                                                                        return element.Value;
                                                                    }
                                                                }
                                                            }
                                                            return undefined;
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
                                                        const checkAddonProduct=(_product)=>{
                                                            if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.Entity)&&!Tools.IsNull(_product.Entity.MetaDataList)){
                                                                const metaData=_product.Entity.MetaDataList;
                                                                for (let index = 0; index < metaData.length; index++) {
                                                                    const element = metaData[index];
                                                                    if(Tools.stringIsContains(element.MetaFieldCode,WebServices.addonProduct)&&(!Tools.stringIsEmpty(element.Value))){
                                                                        return true;
                                                                    }
                                                                }
                                                            }
                                                            return false;
                                                        }
                                                        
                                                        const checkDateProduct=(_product)=>{
                                                            if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.Entity)&&!Tools.IsNull(_product.Entity.MetaDataList)){
                                                                const metaData=_product.Entity.MetaDataList;
                                                                for (let index = 0; index < metaData.length; index++) {
                                                                    const element = metaData[index];
                                                                    if(Tools.stringIsContains(element.MetaFieldCode,WebServices.calendar)&&(element.Value==1||element.Value=='1')){
                                                                        return true;
                                                                    }
                                                                }
                                                            }
                                                            return false;
                                                        }
                                                        
                                                        const checkProductUrl=(_product,_url)=>{
                                                            if(!Tools.IsNull(_product)&&!Tools.IsNull(_product.Entity)&&!Tools.IsNull(_product.Entity.MetaDataList)){
                                                                const metaData=_product.Entity.MetaDataList;
                                                                for (let index = 0; index < metaData.length; index++) {
                                                                    const element = metaData[index];
                                                                    if(Tools.stringIsContains(element.MetaFieldCode,WebServices.shareurl)&&(Tools.stringIsContains(element.Value,_url))){
                                                                        return true;
                                                                    }
                                                                }
                                                            }
                                                            return false;
                                                        }
                                                        const renderProducts=({item,index})=>
                                                            {
                                                            // console.log("renderProducts"+item.CatalogType+":"+item.EntityType+":"+item.CatalogName);
                                                            if(item==undefined){
                                                                return(<View>
                                                                    <Text allowFontScaling={false} style={styles.storedesc}>{folderDesc!=undefined?folderDesc:i18n.t("storedesc")}</Text>
                                                                    </View>)
                                                                }else{
                                                                    if(item.CatalogType==2&&item.EntityType==5){
                                                                        return (
                                                                            <View>
                                                                            {addproductEventItem(item)}
                                                                            </View>);
                                                                        }else if(item.CatalogType==3){
                                                                            // if(!Tools.stringIsEmpty(OpenProduct)){
                                                                            //     OpenProductPage();
                                                                            // }
                                                                            return (
                                                                                <View>
                                                                                {addproductItem(item,index)}
                                                                                </View>);
                                                                            }
                                                                            else if(item.CatalogType==2){
                                                                                return (
                                                                                    <View>
                                                                                    {addproductFolderItem(item)}
                                                                                    </View>);
                                                                                }
                                                                                // else if(item.item!=undefined){
                                                                                //     return(
                                                                                //         <View>
                                                                                //         {addproductTitleItem(item.item)}
                                                                                //         </View>)
                                                                                //     }
                                                                            }
                                                                        }
                                                                        const getLoading=()=>{
                                                                            allLoad=[];
                                                                            {for (let index = 0; index < 1; index++) {
                                                                                randHeight=30;
                                                                                allLoad.push (
                                                                                    <ContentLoader 
                                                                                    speed={0.7}
                                                                                    width={widthPercentageToDP(93)}
                                                                                    height={heightPercentageToDP(90)}
                                                                                    style={{alignSelf:'center'}}
                                                                                    // viewBox="0 0 400 460"
                                                                                    backgroundColor={Colors.whiteColor}
                                                                                    foregroundColor={Colors.bgColor}
                                                                                    >
                                                                                    <Rect x="0" y={40} rx="2" ry="2" width={widthPercentageToDP(93)} height={heightPercentageToDP(3)} />
                                                                                    <Rect x="0" y={40+heightPercentageToDP(4)} rx="2" ry="2" width={widthPercentageToDP(93)} height={heightPercentageToDP(6)} />
                                                                                    <Rect x="0" y={40+heightPercentageToDP(12)} rx={widthPercentageToDP(2)} ry={widthPercentageToDP(2)} width={widthPercentageToDP(93)} height={heightPercentageToDP(randHeight-1)} />
                                                                                    <Rect x="0" y={40+heightPercentageToDP(12+randHeight)} rx={widthPercentageToDP(2)} ry={widthPercentageToDP(2)} width={widthPercentageToDP(93)} height={heightPercentageToDP(randHeight-1)} />
                                                                                    <Rect x="0" y={40+heightPercentageToDP(12+(2*randHeight))} rx={widthPercentageToDP(2)} ry={widthPercentageToDP(2)} width={widthPercentageToDP(93)} height={heightPercentageToDP(randHeight-1)} />
                                                                                    </ContentLoader>
                                                                                )
                                                                            }}
                                                                            return allLoad;
                                                                        }
                                                                        
                                                                        const OnDoneInfo=()=>{
                                                                            setShowInfo(undefined);
                                                                        }
                                                                        const refreshControl=()=>{
                                                                            return (
                                                                                <RefreshControl
                                                                                tintColor={Colors.orangeShadeColor}
                                                                                refreshing={refreshing}
                                                                                onRefresh={()=>refreshListView()} />
                                                                            )
                                                                        }
                                                                        const refreshListView = ()=> {
                                                                            setShuffled(true);
                                                                            var fetchCatalog=props.fetchCatalog;
                                                                            setisLoading(true);
                                                                            setrefreshing(true);
                                                                            fetchCatalog();
                                                                            
                                                                            // setStores();
                                                                            // setTimeout(()=>{
                                                                                //     setrefreshing(false);
                                                                            // },500);
                                                                        }
                                                                        const onDoneProduct=()=>{
                                                                            setproductModal(false);
                                                                        }
                                                                        const onDoneCart=()=>{
                                                                            
                                                                            setTimeout(() => {
                                                                                // console.log("onDoneCart");
                                                                                setshopCartInfo(undefined);
                                                                                setcartModal(false);
                                                                                setcartItems([]);
                                                                                settotalItems(0);
                                                                                dispatch({
                                                                                    type:'update_CartItems',
                                                                                    stateIn:[]
                                                                                })
                                                                                
                                                                                dispatch({
                                                                                    type:'update_Cart',
                                                                                    stateIn:undefined
                                                                                })
                                                                                props.navigation.setParams({
                                                                                    allproducts:[],
                                                                                })
                                                                            }, 500);
                                                                            
                                                                            
                                                                        }
                                                                        
                                                                        const styles = StyleSheet.create({
                                                                            moreShadow:{
                                                                                shadowColor: "#ffffff",
                                                                                shadowOffset: {
                                                                                    width: 0,
                                                                                    height: 10,
                                                                                },
                                                                                shadowOpacity: 0.53,
                                                                                shadowRadius: 13.97,
                                                                                
                                                                                elevation: 21,
                                                                            },
                                                                            shadow:{
                                                                                shadowColor: "#ffffff",
                                                                                shadowOffset: {
                                                                                    width: 0,
                                                                                    height: 2,
                                                                                },
                                                                                shadowOpacity: 0.25,
                                                                                shadowRadius: 3.84,
                                                                                
                                                                                elevation: 5,
                                                                            },
                                                                            storetitle:{
                                                                                fontFamily:'Cairo-Regular',
                                                                                fontSize:18,
                                                                                color:Colors.black,
                                                                                alignSelf:'center',
                                                                                includeFontPadding: false 
                                                                            },
                                                                            topBar:{
                                                                                justifyContent:'space-between',
                                                                                alignSelf:'flex-end',
                                                                                width:'80%',
                                                                                flexDirection:'row',
                                                                                marginEnd:widthPercentageToDP(4)
                                                                            },
                                                                            cartIcon:{
                                                                                marginTop:heightPercentageToDP(1),
                                                                                tintColor:Colors.blueColor,
                                                                                height:28,
                                                                                width:28,
                                                                            },
                                                                            sizeIcon:{
                                                                                height:30,
                                                                                width:30,
                                                                                alignSelf:'center'
                                                                            },
                                                                            addtoCart:{
                                                                                position:'absolute',
                                                                                tintColor:Colors.blueColor,
                                                                                alignSelf:'center',
                                                                                height:35,
                                                                                width:35,
                                                                                // tintColor:Colors.whiteColor
                                                                            },
                                                                            cartCricle:{
                                                                                height:30,
                                                                                justifyContent:'center',
                                                                                alignContent:'center',
                                                                            },
                                                                            cartNo:{
                                                                                color:Colors.black,
                                                                                fontFamily:'Cairo-Bold',
                                                                                fontSize:20,
                                                                            },homeScrollView: {
                                                                                flex:1,
                                                                            },homeView: {
                                                                            },productsContent:{
                                                                                borderWidth:1,flexWrap:'wrap',
                                                                                justifyContent:'flex-start',flexDirection:'row'
                                                                            },productsView:{
                                                                                alignSelf:'center',width:'100%'
                                                                            }, inner: {
                                                                                flex: 1,flexDirection:'row', padding:5,
                                                                                alignContent:'space-between'
                                                                            }, productparent: {
                                                                                // borderWidth:1,
                                                                                marginTop:10,flexDirection:'row',flexWrap:'wrap',alignSelf:'center',justifyContent:'center'
                                                                            },stores:{
                                                                                margin:10,justifyContent:'center'
                                                                            },productContain:{
                                                                                paddingBottom:heightPercentageToDP(35),alignContent:'center',justifyContent:'center',alignItems:'center',width:'100%'
                                                                            },productView:{
                                                                                height:heightPercentageToDP(100),alignContent:'center',justifyContent:'center',alignItems:'center'
                                                                            },products:{
                                                                                // borderWidth:1,
                                                                                // alignContent:'flex-start',
                                                                                // alignItems:'flex-start',
                                                                                // overflow:'hidden',
                                                                                backgroundColor:Colors.bgColor,
                                                                                // height:widthPercentageToDP( 40),width:widthPercentageToDP(40),
                                                                                borderRadius:widthPercentageToDP(3), 
                                                                            },cartButtonwithIcon:{
                                                                                flex:1,
                                                                                borderBottomRightRadius:widthPercentageToDP(3),
                                                                                justifyContent:'center',
                                                                                // backgroundColor:Colors.orangeShadeColor
                                                                                
                                                                            },productImage:{
                                                                                height:widthPercentageToDP(90),
                                                                                width:widthPercentageToDP(90),
                                                                                resizeMode:'contain',
                                                                                bottom:0,
                                                                                borderTopLeftRadius:widthPercentageToDP(3), 
                                                                                borderTopRightRadius:widthPercentageToDP(3), 
                                                                                // borderTopLeftRadius:20,
                                                                                // borderTopRightRadius:20,
                                                                            },productText:{
                                                                                includeFontPadding: false,
                                                                                width:'95%',
                                                                                color:Colors.black,
                                                                                textAlign:'left',
                                                                                marginStart:widthPercentageToDP(3),
                                                                                marginTop:widthPercentageToDP(0.5),
                                                                                fontFamily:'Cairo-SemiBold',
                                                                                // fontWeight:'200',
                                                                                fontSize:widthPercentageToDP(5),
                                                                                lineHeight:widthPercentageToDP(7),
                                                                                flexWrap:'wrap',
                                                                            },
                                                                            productPrice:{
                                                                                // width:widthPercentageToDP(13),
                                                                                // height:widthPercentageToDP(13),
                                                                                paddingTop:widthPercentageToDP(1.1),
                                                                                justifyContent:'center',
                                                                                overflow:'hidden',
                                                                                color:Colors.whiteColor,
                                                                                alignSelf:'center',
                                                                                textAlign:'center',
                                                                                fontFamily:'Cairo-Bold',
                                                                                fontSize:widthPercentageToDP(4.75),
                                                                                // lineHeight:widthPercentageToDP(4.75)*1.3,
                                                                                flexWrap:'wrap',
                                                                            },storedesc:{
                                                                                includeFontPadding: false,
                                                                                color:Colors.black,
                                                                                width:widthPercentageToDP(92),
                                                                                textAlign:'left',
                                                                                // borderWidth:1,
                                                                                fontFamily:'Cairo-Regular',
                                                                                fontSize:widthPercentageToDP(3.75),
                                                                                lineHeight:widthPercentageToDP(3.75)*1.5,
                                                                                flexWrap:'wrap',
                                                                                alignSelf:'center',
                                                                            }
                                                                        });
                                                                        return (
                                                                            
                                                                            <SafeAreaView style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : '11%' ,backgroundColor:Colors.bgColor}}>
                                                                            {showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation} onDismiss={()=>
                                                                                setshowLogin(false)
                                                                            } />)}
                                                                            <BackgroundWall/>
                                                                            
                                                                            {isLoading&&getLoading()}
                                                                            {/* <SafeAreaView style={{position:'absolute',width:'93%',alignSelf:'center',top:'10%'}}>{isLoading&&<LoadingLine visibleText ={true}loadBar={Colors.blueColor}/>}</SafeAreaView>  */}
                                                                            {!isLoading&& <>
                                                                                <View style={[styles.topBar,{}]}>
                                                                                <TextInput
                                                                                ref={searchInputRef}
                                                                                value={sorttext}
                                                                                numberOfLines={1}
                                                                                allowFontScaling={false}
                                                                                caretProps={{
                                                                                    caretColor: 'red' // Change this to the desired color
                                                                                }}
                                                                                onChangeText={(text)=>{
                                                                                    setsorttext(text);
                                                                                    // getProductnItems();
                                                                                }}
                                                                                style={[{
                                                                                    includeFontPadding: false,
                                                                                    alignContent:'center',
                                                                                    opacity:sortVisible,
                                                                                    marginTop:heightPercentageToDP(0.5),
                                                                                    paddingVertical:heightPercentageToDP(0.1),
                                                                                    paddingHorizontal:widthPercentageToDP(3),
                                                                                    borderWidth:1,borderColor:Colors.blueColor,
                                                                                    color:Colors.blueColor,alignSelf:'center',
                                                                                    justifyContent:'center',
                                                                                    borderRadius:heightPercentageToDP(4),backgroundColor:Colors.bgColor,
                                                                                    fontFamily:'Cairo-Regular',
                                                                                    fontSize:widthPercentageToDP(4.5),
                                                                                    width:'70%',height:heightPercentageToDP(4)},styles.shadow]}/>
                                                                                    {sorttext.length>0&&<TouchableOpacity onPress={()=>
                                                                                        {
                                                                                            Keyboard.dismiss();
                                                                                            setTimeout(() => {
                                                                                                setsortVisible(0);
                                                                                                setsorttext('');
                                                                                                // setState({sorttext:'',sortVisible:0},()=>{
                                                                                                    // getProductnItems();
                                                                                                // });
                                                                                            }, 100);
                                                                                            
                                                                                        }} style={{height:heightPercentageToDP(3),
                                                                                            backgroundColor:Colors.blueColor,marginTop:heightPercentageToDP(1),
                                                                                            position:'absolute',start:widthPercentageToDP(48),
                                                                                            justifyContent:'center',
                                                                                            width:heightPercentageToDP(3),borderRadius:heightPercentageToDP(3)}}><Text
                                                                                            style={{color:Colors.bgColor,includeFontPadding: false,fontFamily:'Cairo-Bold',alignSelf:'center'}}>X</Text></TouchableOpacity>}
                                                                                            <TouchableOpacity style={{}}  onPress={()=>{
                                                                                                searchInputRef.current.focus();
                                                                                                setsortVisible(1);
                                                                                                // setState({canSearch:true,sortVisible:1})
                                                                                            }}>
                                                                                            <Image style={styles.cartIcon} resizeMode='contain' source={searchIcon}/>
                                                                                            </TouchableOpacity>
                                                                                            <TouchableOpacity onPress={()=>{openCart(false)}}>
                                                                                            
                                                                                            <Image style={styles.cartIcon} resizeMode='contain' source={cartIcon}/>
                                                                                            
                                                                                            {totalItems>0&& <View style={{position:'absolute',
                                                                                                justifyContent:'center',backgroundColor:Colors.inputfontColor,alignSelf:'flex-end',borderRadius:15,height:14,width:14,top:3,end:-5}}>
                                                                                                
                                                                                                <Text allowFontScaling={false} style={{
                                                                                                    includeFontPadding: false,
                                                                                                    alignSelf:'center',textAlign:'center',color:Colors.whiteColor
                                                                                                    ,fontSize:widthPercentageToDP(2.5)
                                                                                                }}>{totalItems}</Text>
                                                                                                </View>}
                                                                                                </TouchableOpacity>
                                                                                                {/* </View> */}
                                                                                                </View>
                                                                                                <View>
                                                                                                <ScrollView 
                                                                                                horizontal={true}
                                                                                                showsHorizontalScrollIndicator={false}
                                                                                                showsVerticalScrollIndicator = {false}
                                                                                                // contentContainerStyle={styles.homeScrollView}
                                                                                                style={styles.homeView}>
                                                                                                <View style={styles.inner}>
                                                                                                {getStores()}
                                                                                                </View>
                                                                                                
                                                                                                
                                                                                                </ScrollView>
                                                                                                <ScrollView 
                                                                                                pagingEnabled={true}
                                                                                                horizontal={true}
                                                                                                showsHorizontalScrollIndicator={false}
                                                                                                showsVerticalScrollIndicator = {false}
                                                                                                contentContainerStyle={{paddingEnd:widthPercentageToDP(2)}}
                                                                                                style={[styles.homeView,{paddingStart:widthPercentageToDP(2),paddingEnd:widthPercentageToDP(5), marginTop:-heightPercentageToDP(1)}]}>
                                                                                                {getProductCategory()}
                                                                                                </ScrollView>
                                                                                                </View>
                                                                                                
                                                                                                <View style={styles.productView}>
                                                                                                <FlatList 
                                                                                                removeClippedSubviews={false}
                                                                                                ref={mainScrollRef}
                                                                                                showsVerticalScrollIndicator={false}
                                                                                                // horizontal={undefined}
                                                                                                initialNumToRender={3}
                                                                                                // removeClippedSubviews
                                                                                                data={allProducts}
                                                                                                contentContainerStyle={styles.productContain}
                                                                                                refreshControl={refreshControl()}
                                                                                                style={styles.productsView}
                                                                                                renderItem={renderProducts}>
                                                                                                </FlatList>
                                                                                                </View></>}
                                                                                                </SafeAreaView>
                                                                                                // </Image>
                                                                                            )
                                                                                        }
                                                                                        
                                                                                        // const mapStateToProps = state=>{
                                                                                            //     return {
                                                                                        //         shopCartInfo:state.profileReducer.shopCartInfo,mediaInfo:state.profileReducer.mediaInfo,
                                                                                        //     }                
                                                                                        // };
                                                                                        
                                                                                        // const mapDispatchToProps = (dispatch) => {
                                                                                            //     return{
                                                                                        //         updateCart:(cData)=> dispatch(updateCart(cData)),
                                                                                        //     };
                                                                                        // }
                                                                                        
                                                                                        // export default connect(
                                                                                        //     mapStateToProps,
                                                                                        //     mapDispatchToProps
                                                                                        //     )(StorePage)
                                                                                        
                                                                                        
                                                                                        