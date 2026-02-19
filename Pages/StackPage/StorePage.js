import React, { useEffect, useState, useRef, useMemo, useCallback, useContext } from 'react';
import { Image, StyleSheet, TextInput, ScrollView, View, Text, TouchableOpacity, RefreshControl, FlatList, Platform, StatusBar, SafeAreaView, Keyboard } from 'react-native';
import cartIcon from '../../assets/Icons/cart.png';
import searchIcon from '../../assets/Icons/search.png';
import addcartIcon from '../../assets/Icons/cart.png';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import * as Tools from '../../Tools/Components/Tools.js';
import { StackActions } from '@react-navigation/native';
import productsData from '../../Data/products.json';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import WebServices from '../../Tools/constants/WebServices';
import InfoBar from '../../Tools/Components/InfoBar';
import ProfileData from '../../Tools/Components/ProfileData';
import FastImage from '@d11/react-native-fast-image';
import { StateContext } from '../../Tools/context/ContextState';
import { DeviceEventEmitter } from "react-native";
import { Alert } from 'react-native';
import SecureStore from '../../Tools/Components/SecureStore';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { logAddToCartEvent, logRemoveFromCartEvent, logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function StorePage(props) {
    const { bottomBar, setBottomBar } = useContext(StateContext);
    const route = useRoute();
    const Colors = useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const { openProductCode, setOpenProductCode } = useContext(StateContext);

    // ---- State ----
    const [shuffled, setShuffled] = useState(false);
    const [allProducts, setallProducts] = useState([]);
    const [allProductsRandom, setallProductsRandom] = useState([]);
    const [allProductCategory, setallProductCategory] = useState([]);
    const [filterProductCategory, setfilterProductCategory] = useState(undefined);
    const [isLoading, setisLoading] = useState(true);
    const [sortVisible, setsortVisible] = useState(0);
    const [ShowInfo, setShowInfo] = useState(undefined);
    const [viewType, setviewType] = useState(0);
    const [OpenProduct, setOpenProduct] = useState('');
    const [cartItems, setcartItems] = useState([]);
    const [totalItems, settotalItems] = useState(0);
    const [cartModal, setcartModal] = useState(false);
    const [productModal, setproductModal] = useState(false);
    const [selectedStore, setselectedStore] = useState(undefined);
    const [allStoresIn, setallStoresIn] = useState([]);
    const [allstores, setallstores] = useState(productsData.stores);
    const [selectedProduct, setselectedProduct] = useState({});
    const [shopCartInfo, setshopCartInfo] = useState(undefined);
    const [storeCatalog, setstoreCatalog] = useState([]);
    const [refreshing, setrefreshing] = useState(false);
    const [profile, setprofile] = useState(props.profile);
    const [sorttext, setsorttext] = useState('');
    const [showPay, setshowPay] = useState(false);
    const [paymentWebUrl, setpaymentWebUrl] = useState('');
    const [showLogin, setshowLogin] = useState(false);
    const [changeRequired, setChangeRequired] = useState(false);
    const [folderDesc, setFolderDest] = useState(undefined);

    const hasCalledEvent = useRef(false);

    // FIX: was React.createRef() — recreated every render. Use useRef.
    const mainScrollRef = useRef(null);
    const searchInputRef = useRef(null);

    // ========================================
    // EFFECTS — FIXED
    // ========================================

    // Sort text change → refresh products
    useEffect(() => {
        getProductnItems();
    }, [sorttext]);

    // Profile change → fetch catalog
    useEffect(() => {
        if (!Tools.IsNull(state.profile)) {
            setChangeRequired(true);
        }
        const getCatlog = props.fetchCatalog;
        setisLoading(true);
        setrefreshing(true);
        getCatlog();
    }, [state.profile?.Id]); // FIX: was [state.profile] — object ref, use primitive .Id

    // DELETED: useEffect([global.locale]) — non-reactive, i18n handled by state.i18ntranslation

    // Focus effect
    useFocusEffect(
        useCallback(() => {
            onFocus();
        }, [])
    );

    // Mount: DeviceEventEmitter subscriptions
    useEffect(() => {
        const updateProfileSub = DeviceEventEmitter.addListener("updateProfile", () => updateProfile());
        const updateProductsSub = DeviceEventEmitter.addListener("updateProducts", ({ p1 }) => updateProducts(p1));

        return () => {
            updateProfileSub.remove();
            updateProductsSub.remove();
        };
    }, []);

    // Cart items from global state
    useEffect(() => {
        setcartItems(state.cartItems);
        settotalItems(state.cartItems.length);
    }, [state.cartItems]);

    // When products loaded, try opening deep-linked product
    useEffect(() => {
        if (!Tools.IsNull(state.profile)) {
            // profile exists
        }
        SecureStore.getItemAsync('accessToken').then(savedPass => {
            if (savedPass != undefined && savedPass != null && savedPass.length > 0) {
                openProductInit(true);
            } else {
                openProductInit(false);
            }
        }).catch(() => {
            openProductInit(false);
        });
    }, [allProducts]);

    // Deep link via openProductCode context
    useEffect(() => {
        SecureStore.getItemAsync('accessToken').then(savedPass => {
            if (savedPass != undefined && savedPass != null && savedPass.length > 0) {
                OpenProductPageWeb(openProductCode);
            } else {
                if (Tools.stringIsEmpty(OpenProduct)) {
                    setOpenProduct(openProductCode);
                }
            }
        }).catch(() => {
            if (Tools.stringIsEmpty(OpenProduct)) {
                setOpenProduct(openProductCode);
            }
        });
    }, [openProductCode]);

    // OpenProduct state change → open product page
    useEffect(() => {
        if (!Tools.stringIsEmpty(OpenProduct)) {
            OpenProductPageWeb(OpenProduct);
        }
    }, [OpenProduct]);

    // FIX: REPLACED useEffect([props]) — was INFINITE LOOP.
    // Split into specific dependencies.
    useEffect(() => {
        if (!Tools.IsNull(props.storeCatalog)) {
            setStores(() => {
                getProductnItems();
            });

            if (props.storeCatalog !== storeCatalog) {
                setisLoading(false);
                setrefreshing(false);
                setstoreCatalog(props.storeCatalog);
                setselectedStore('');
            }
        }
    }, [props.storeCatalog]);

    useEffect(() => {
        if (props.profile !== profile && props.profile != undefined) {
            const getCatlog = props.fetchCatalog;
            getCatlog();
            setisLoading(true);
            setrefreshing(true);
            setprofile(props.profile);
        }
    }, [props.profile]);

    // FIX: REPLACED useEffect([state]) — was INFINITE LOOP on entire reducer.
    // Only watch state.shopCartInfo.
    useEffect(() => {
        if (state.shopCartInfo != shopCartInfo) {
            setshopCartInfo(state.shopCartInfo);
            if (Tools.IsNull(state.shopCartInfo)) {
                settotalItems(0);
                setcartItems([]);
                dispatch({ type: 'update_CartItems', stateIn: [] });
            }
            props.navigation.setParams({ allproducts: [] });
        }
    }, [state.shopCartInfo]);

    const onFocus = () => {
        logScreenViewEvent('StorePage', 'Store');
    };

    // storeCatalog state change → refresh products
    useEffect(() => {
        getProductnItems();
    }, [storeCatalog]);

    // Filter/store change → refresh products
    useEffect(() => {
        getProductnItems();
    }, [filterProductCategory, selectedStore]);

    // ========================================
    // HELPERS
    // ========================================

    const openProductInit = (_stateIn) => {
        if (openProductCode.length > 0 && changeRequired && _stateIn) {
            OpenProductPageWeb(openProductCode);
            setChangeRequired(false);
        } else if (!Tools.stringIsEmpty(OpenProduct)) {
            OpenProductPageWeb(OpenProduct);
        }
    };

    const setViewType = (_viewType) => {
        setviewType(_viewType);
    };

    const setStores = (callback = undefined) => {
        const storesIn = [];
        if (Tools.IsNull(props.storeCatalog) || Tools.IsNull(props.storeCatalog.Nodes)) {
            return;
        }
        props.storeCatalog.Nodes.map((itemIn) => {
            // FIX: was `currentCat=itemIn` — global pollution
            const currentCat = itemIn;
            storesIn.push(currentCat);
        });
        setallStoresIn(storesIn);
        if (callback != undefined) {
            callback();
        }
    };

    const updateProfile = () => {
        if (props != undefined) {
            props.navigation.setParams({ profile: profile });
        }
    };

    const updateProducts = (_products) => {
        settotalItems(_products.length);
        setcartItems(_products);
        dispatch({ type: 'update_CartItems', stateIn: _products });
        props.navigation.setParams({ allproducts: _products });
    };

    const openCart = (_loading = true) => {
        props.navigation.dispatch(
            StackActions.replace('CartPage', {
                accessToken: props.accessToken,
                profile: profile,
                loading: _loading,
                checkOut: onCheckOut,
                allproducts: cartItems,
                shopCartInfo: shopCartInfo,
                addCouponToCart: AddCoupontoShoppingCartVGS,
                removeItem: removeItemfromCart,
                modifyItem: ModifyItemfromCart,
            })
        );
    };

    const onCheckOut = (_shopCartInfo) => {
        checkSeatOfPerformance(_shopCartInfo, () => {
            props.navigation.navigate('CheckOutPage', {
                onDoneCart: onDoneCart,
                allproducts: cartItems,
                shopCartInfo: _shopCartInfo,
                mediaInfo: props.mediaInfo,
            });
            DeviceEventEmitter.emit("setLoadingCart", { p1: false });
        });
    };

    const getOthercategory = (_catergories) => {
        for (let index = 0; index < _catergories.length; index++) {
            if (Tools.stringIsContains(_catergories[index].name, 'theme')) {
                if (_catergories.length > 1) return _catergories[index == 0 ? 1 : 0];
                else return _catergories[0];
            }
        }
        return null;
    };

    const getcategory = (_catergories) => {
        for (let index = 0; index < _catergories.length; index++) {
            if (Tools.stringIsContains(_catergories[index].name, 'theme')) {
                return _catergories[index];
            }
        }
        return null;
    };

    const onStoreSelect = (itemIn, index) => {
        setShuffled(true);
        setselectedStore(index == null ? '' : itemIn.CatalogId);
    };

    // ========================================
    // RENDER HELPERS — Store tabs, Product category tabs
    // ========================================

    const addstoreItem = (itemIn, index) => {
        const indexIn = itemIn != null ? itemIn.CatalogId : '';
        return (
            <TouchableOpacity
                key={"store_" + (index || 'all')}
                style={[styles.stores, indexIn == selectedStore
                    ? { borderColor: Colors.whiteColor, backgroundColor: Colors.blueColor, borderRadius: 40, paddingHorizontal: widthPercentageToDP(3) }
                    : { borderColor: Colors.inputfontColor }]}
                onPress={() => {
                    onStoreSelect(itemIn, index);
                    mainScrollRef.current?.scrollToOffset({ y: 0, animated: true });
                }}>
                <Text allowFontScaling={false} style={[styles.storetitle, (indexIn == selectedStore) ? { color: Colors.whiteColor } : { color: Colors.black }]}>
                    {itemIn == null ? i18n.t('all') : getTranslatedProductName(itemIn)}
                </Text>
            </TouchableOpacity>
        );
    };

    const addproductCategoryItem = (itemIn, index) => {
        const CheckBool = filterProductCategory != undefined && (itemIn.CatalogName == filterProductCategory.CatalogName);
        return (
            <TouchableOpacity
                key={"cat_" + index}
                style={[{ margin: 5 }, CheckBool
                    ? { borderColor: Colors.whiteColor, backgroundColor: Colors.blueColor, borderRadius: 40, paddingHorizontal: widthPercentageToDP(2) }
                    : { borderColor: Colors.inputfontColor, borderWidth: 1, borderRadius: 40, paddingHorizontal: widthPercentageToDP(2) }]}
                onPress={() => {
                    if (CheckBool) {
                        setFolderDest(undefined);
                    } else {
                        const richtext = itemIn.RichDescList.filter((itemLang) => (itemLang.LangISO === (Tools.stringIsContains(i18n.locale, "ar") ? "ar" : "en")));
                        setFolderDest(Tools.IsNull(itemIn.RichDescList) ? undefined : (richtext.length > 0 ? richtext[0].Description : undefined));
                    }
                    setfilterProductCategory((filterProductCategory != undefined && filterProductCategory.CatalogName == itemIn.CatalogName) ? undefined : itemIn);
                    mainScrollRef.current?.scrollToOffset({ y: 0, animated: true });
                }}>
                <Text allowFontScaling={false} style={[styles.storetitle, { fontSize: widthPercentageToDP(3.25) }, (CheckBool) ? { color: Colors.whiteColor } : { color: Colors.black }]}>
                    {itemIn == null ? i18n.t('all') : getTranslatedProductCatalog(itemIn)}
                </Text>
            </TouchableOpacity>
        );
    };

    // ========================================
    // TRANSLATION HELPERS
    // ========================================

    const getTranslatedProductCatalog = (_Node) => {
        return Tools.IsNull(_Node.Entity) ? getTranslatedCatalogName(_Node) : (Tools.stringIsContains(i18n.locale, 'ar') ? getTranslation(_Node.Entity.ITL_ProductName, 'ar') : getTranslation(_Node.Entity.ITL_ProductName, 'en'));
    };

    const getTranslatedCatalogName = (_Node) => {
        return Tools.stringIsContains(i18n.locale, 'ar') ? getTranslation(_Node.ITL_CatalogName, 'ar') : getTranslation(_Node.ITL_CatalogName, 'en', _Node.CatalogName);
    };

    const getTranslation = (_Node, _code, _default = null) => {
        if (Tools.IsNull(_Node)) return "";
        for (let t = 0; t < _Node.length; t++) {
            if (!Tools.IsNull(_Node[t].LangISO)) {
                if (Tools.stringIsContains(_code, _Node[t].LangISO)) {
                    return _Node[t].Translation;
                }
            }
        }
        if (_default != null) return _default;
        return _Node[0].Translation;
    };

    const getTranslationAvailable = (_Node, _code) => {
        if (Tools.IsNull(_Node)) return false;
        for (let t = 0; t < _Node.length; t++) {
            if (!Tools.IsNull(_Node[t].LangISO)) {
                if (Tools.stringIsContains(_code, _Node[t].LangISO)) {
                    return true;
                }
            }
        }
        return false;
    };

    const getTranslatedProductName = (_Node) => {
        return Tools.IsNull(_Node.Entity) ? getTranslatedCatalogName(_Node) : (Tools.stringIsContains(i18n.locale, 'ar') ? getTranslation(_Node.Entity.ITL_ProductName, 'ar') : getTranslation(_Node.Entity.ITL_ProductName, 'en', _Node.Entity.ProductName));
    };

    const getTranslatedEventName = (_Node) => {
        return Tools.stringIsContains(i18n.locale, 'ar') ? getTranslation(_Node.Entity.ITL_ProductName, 'ar') : getTranslation(_Node.Entity.ITL_ProductName, 'en', _Node.Entity.ProductName);
    };

    const getPriceToShow = (_Node) => {
        const ValueIn = getPriceInfo(_Node.Nodes[0]);
        return ValueIn == undefined ? _Node.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value + " QAR" : ValueIn;
    };

    // ========================================
    // PRODUCT HELPERS
    // ========================================

    const getAllBadges = (_product) => {
        const localCheck = Tools.stringIsContains(i18n.locale, "ar") ? false : true;
        // FIX: was `allImages=[]` and `alltags=...` — global pollution
        const allImages = [];
        const alltags = _product.Entity.TagNames.split(',');
        for (let index = 0; index < alltags.length; index++) {
            const element = alltags[index];
            if (Tools.stringIsContains(element, WebServices.AppIcon)) {
                allImages.push(
                    <View key={"badge_" + index}>
                        <FastImage
                            style={[styles.productImage, Tools.stringIsContains(global.locale, 'ar') ? { left: widthPercentageToDP(-72) } : { right: 0 }, { width: widthPercentageToDP(25), height: widthPercentageToDP(9) }]}
                            source={{
                                uri: WebServices.MainURL + WebServices.AppIconUrl.replace("{file}", element.replace(WebServices.AppIcon, "") + "_" + (Tools.stringIsContains(i18n.locale, 'ar') ? 'ar' : 'en')),
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>
                );
            }
        }
        return <View style={[{ position: 'absolute', top: heightPercentageToDP(1) }, localCheck ? { right: widthPercentageToDP(-1) } : { left: widthPercentageToDP(-1) }]}>{allImages}</View>;
    };

    const getInitCost = (_product) => {
        if (_product != null && _product.Entity != null)
            for (let index = 0; index < _product.Entity.AttributeItemList.length; index++) {
                const element = _product.Entity.AttributeItemList[index];
                if (element.Active && element.SelectionType == 3) {
                    return (_product.Entity.PriceDateList[0].PriceList[0].Value + element.OptionList[0].OptionalPrice);
                }
            }
        return 0;
    };

    const getItemCost = (_itemIn) => {
        const ValueIn = getPriceInfo(_itemIn);
        // FIX: was `costIn=...` — global pollution
        const costIn = ValueIn != undefined ? ValueIn : (checkIsVariable(_itemIn) != -1 ? getInitCost(_itemIn) + " QAR" : _itemIn.Entity.PriceDateList[0].PriceList[0].Value + " QAR");
        return costIn;
    };

    const checkIsVariable = (_productIn) => {
        if (_productIn != null && _productIn.Entity != null && _productIn.Entity.AttributeItemList != null)
            for (let index = 0; index < _productIn.Entity.AttributeItemList.length; index++) {
                const element = _productIn.Entity.AttributeItemList[index];
                if (element.Active && element.SelectionType == 3) {
                    return index;
                }
            }
        return -1;
    };

    const getPriceInfo = (_product) => {
        if (!Tools.IsNull(_product) && !Tools.IsNull(_product.Entity) && !Tools.IsNull(_product.Entity.MetaDataList)) {
            const metaData = _product.Entity.MetaDataList;
            for (let index = 0; index < metaData.length; index++) {
                const element = metaData[index];
                if (!Tools.IsNull(element.MultiLanguageText) && !Tools.IsNull(element.MultiLanguageText.TransList)) {
                    const localeIn = Tools.stringIsContains(i18n.locale, "ar") ? "ar" : "en";
                    return element.MultiLanguageText.TransList.filter((item) => item.LangISO == localeIn)[0].Translation;
                }
                if (Tools.stringIsContains(element.MetaFieldCode, WebServices.priceInfo)) {
                    return element.Value;
                }
            }
        }
        return undefined;
    };

    const checkInformativeProduct = (_product) => {
        if (!Tools.IsNull(_product) && !Tools.IsNull(_product.Entity) && !Tools.IsNull(_product.Entity.MetaDataList)) {
            const metaData = _product.Entity.MetaDataList;
            for (let index = 0; index < metaData.length; index++) {
                const element = metaData[index];
                if (Tools.stringIsContains(element.MetaFieldCode, WebServices.informative) && (element.Value == 1 || element.Value == '1')) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkAddonProduct = (_product) => {
        if (!Tools.IsNull(_product) && !Tools.IsNull(_product.Entity) && !Tools.IsNull(_product.Entity.MetaDataList)) {
            const metaData = _product.Entity.MetaDataList;
            for (let index = 0; index < metaData.length; index++) {
                const element = metaData[index];
                if (Tools.stringIsContains(element.MetaFieldCode, WebServices.addonProduct) && (!Tools.stringIsEmpty(element.Value))) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkDateProduct = (_product) => {
        if (!Tools.IsNull(_product) && !Tools.IsNull(_product.Entity) && !Tools.IsNull(_product.Entity.MetaDataList)) {
            const metaData = _product.Entity.MetaDataList;
            for (let index = 0; index < metaData.length; index++) {
                const element = metaData[index];
                if (Tools.stringIsContains(element.MetaFieldCode, WebServices.calendar) && (element.Value == 1 || element.Value == '1')) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkProductUrl = (_product, _url) => {
        if (!Tools.IsNull(_product) && !Tools.IsNull(_product.Entity) && !Tools.IsNull(_product.Entity.MetaDataList)) {
            const metaData = _product.Entity.MetaDataList;
            for (let index = 0; index < metaData.length; index++) {
                const element = metaData[index];
                if (Tools.stringIsContains(element.MetaFieldCode, WebServices.shareurl) && (Tools.stringIsContains(element.Value, _url))) {
                    return true;
                }
            }
        }
        return false;
    };

    // ========================================
    // PRODUCT ITEM RENDERERS
    // ========================================

    const addproductEventItem = (_folder) => {
        const priceInfo = getPriceInfo(_folder.Nodes[0]);
        return (
            <TouchableOpacity style={[styles.products, viewType == 0 ? { width: widthPercentageToDP(95), margin: 10 } : { width: widthPercentageToDP(37), margin: 10 }]}
                onPress={() => { onProductSelectEvent(_folder); }}>
                <View style={[styles.productImage, { width: widthPercentageToDP(viewType == 0 ? 95 : 37), height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37) }]}>
                    {_folder.Entity.ProfilePictureId != null && <FastImage
                        style={[styles.productImage, { width: widthPercentageToDP(viewType == 0 ? 95 : 37), height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37) }]}
                        source={{ uri: WebServices.MainURL + _folder.Entity.ProfilePictureId, priority: FastImage.priority.normal }}
                        resizeMode={FastImage.resizeMode.cover}
                    />}
                </View>
                <View style={[{ flexDirection: 'row', backgroundColor: Colors.whiteColor, height: widthPercentageToDP(viewType == 0 ? 15.5 : 9.5), width: '100%', borderBottomLeftRadius: widthPercentageToDP(3), borderBottomRightRadius: widthPercentageToDP(3), overflow: 'hidden' }]}>
                    <View style={{ flexDirection: 'row', width: '80%' }}>
                        <View style={{ flexDirection: 'column', width: '100%' }}>
                            <Text allowFontScaling={false} numberOfLines={1} style={[styles.productText, { fontSize: (viewType == 0 ? widthPercentageToDP(4) : widthPercentageToDP(3.5)) }]}>{getTranslatedEventName(_folder)}</Text>
                            <Text allowFontScaling={false} style={[styles.productText, { fontSize: (viewType == 0 ? widthPercentageToDP(4.5) : widthPercentageToDP(3.5)) }]}>
                                {priceInfo == undefined ? _folder.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value + " QAR" : priceInfo}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.cartButtonwithIcon, { end: 0 }]} onPress={() => { onProductSelectFolder(_folder); }}>
                        <Image style={[styles.addtoCart, { height: (viewType == 0 ? 30 : 25), width: (viewType == 0 ? 30 : 25) }]} resizeMode='contain' source={addcartIcon} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const addproductFolderItem = (_folder) => {
        return (
            <TouchableOpacity style={[styles.products, viewType == 0 ? { width: widthPercentageToDP(95), margin: 10 } : { width: widthPercentageToDP(37), margin: 10 }]}
                onPress={() => { onProductSelectFolder(_folder); }}>
                <View style={[styles.productImage, { width: widthPercentageToDP(viewType == 0 ? 95 : 37), height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37) }]}>
                    {_folder.ProfilePictureId != null && <FastImage
                        style={[styles.productImage, { width: widthPercentageToDP(viewType == 0 ? 95 : 37), height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37) }]}
                        source={{ uri: WebServices.MainURL + _folder.ProfilePictureId, priority: FastImage.priority.normal }}
                        resizeMode={FastImage.resizeMode.cover}
                    />}
                </View>
                <View style={[{ flexDirection: 'row', backgroundColor: Colors.whiteColor, height: widthPercentageToDP(viewType == 0 ? 15.5 : 9.5), width: '100%', borderBottomLeftRadius: widthPercentageToDP(3), borderBottomRightRadius: widthPercentageToDP(3), overflow: 'hidden' }]}>
                    <View style={{ flexDirection: 'row', width: '80%' }}>
                        <View style={{ flexDirection: 'column', width: '100%' }}>
                            <Text allowFontScaling={false} numberOfLines={1} style={[styles.productText, { fontSize: (viewType == 0 ? widthPercentageToDP(4) : widthPercentageToDP(3.5)) }]}>{getTranslatedProductName(_folder)}</Text>
                            <Text allowFontScaling={false} style={[styles.productText, { fontSize: (viewType == 0 ? widthPercentageToDP(4.5) : widthPercentageToDP(3.5)) }]}>{getPriceToShow(_folder)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.cartButtonwithIcon, { end: 0 }]} onPress={() => { onProductSelectFolder(_folder); }}>
                        <Image style={[styles.addtoCart, { height: (viewType == 0 ? 30 : 25), width: (viewType == 0 ? 30 : 25) }]} resizeMode='contain' source={addcartIcon} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const addproductItem = (itemIn, index) => {
        // FIX: was `indexIn=...` — global pollution
        const indexIn = index == null ? -1 : index;
        return (
            <TouchableOpacity style={[styles.products, viewType == 0 ? { width: widthPercentageToDP(95), margin: 10 } : { width: widthPercentageToDP(37), margin: 10 }]}
                onPress={() => { onProductSelect(itemIn); }}>
                <View style={[styles.productImage, { width: widthPercentageToDP(viewType == 0 ? 95 : 37), height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37) }]}>
                    {itemIn.ProfilePictureId != null && <FastImage
                        style={[styles.productImage, { width: widthPercentageToDP(viewType == 0 ? 95 : 37), height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37) }]}
                        source={{ uri: WebServices.MainURL + itemIn.Entity.ProfilePictureId, priority: FastImage.priority.normal }}
                        resizeMode={FastImage.resizeMode.cover}
                    />}
                    {getAllBadges(itemIn)}
                </View>
                <View style={[{ flexDirection: 'row', backgroundColor: Colors.whiteColor, height: widthPercentageToDP(viewType == 0 ? 15.5 : 9.5), width: '100%', overflow: 'hidden', borderBottomLeftRadius: widthPercentageToDP(3), borderBottomRightRadius: widthPercentageToDP(3) }]}>
                    <View style={{ flexDirection: 'row', width: '80%', height: '100%' }}>
                        <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
                            <Text allowFontScaling={false} numberOfLines={1} style={[styles.productText, { fontSize: (viewType == 0 ? widthPercentageToDP(4) : widthPercentageToDP(3.5)) }]}>{getTranslatedProductName(itemIn)}</Text>
                            <Text allowFontScaling={false} style={[styles.productText, { fontSize: widthPercentageToDP(viewType == 0 ? 4.5 : 3.5) }]}>{getItemCost(itemIn)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.cartButtonwithIcon, { end: 0 }]}
                        onPress={() => { onProductAdd(shopCartInfo, itemIn, getItemCost(itemIn), 1, true, null, profile); }}>
                        <Image style={[styles.addtoCart, { height: (viewType == 0 ? 30 : 25), width: (viewType == 0 ? 30 : 25) }]} resizeMode='contain' source={addcartIcon} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    // ========================================
    // NAVIGATION — Product selection
    // ========================================

    const OpenProductPageWeb = (_OpenProduct) => {
        // FIX: was `openItem=...` — global pollution
        const openItem = !Tools.stringIsEmpty(_OpenProduct) ? _OpenProduct.replaceAll('"', '') : '';
        if (!Tools.stringIsEmpty(openItem)) {
            if (allProductsRandom != undefined && allProductsRandom.length > 0) {
                allProductsRandom.map((productIn) => {
                    if (!Tools.IsNull(productIn)) {
                        if (!Tools.stringIsEmpty(openItem) && (openItem == productIn.EntityId || (!Tools.IsNull(productIn.Entity) && checkProductUrl(productIn, openItem)))) {
                            onProductSelect(productIn);
                            setOpenProduct('');
                            return;
                        }
                    }
                });
            }
        }
    };

    const getCatlogName = (_productCatId) => {
        for (let index = 0; index < props.storeCatalog.Nodes.length; index++) {
            const element = props.storeCatalog.Nodes[index];
            if (element.CatalogId == _productCatId) {
                return element;
            }
        }
        return '';
    };

    const onProductSelectEvent = (itemIn) => {
        const filteredProducts = [];
        props.navigation.navigate('ProductPage', {
            screen: "", accessToken: props.accessToken, profile: profile,
            addtoCart: onProductAdd, product: itemIn, openProductIn: onProductSelect,
            catalogName: getCatlogName(itemIn.ParentCatalogId),
            allproducts: cartItems, catalogProducts: filteredProducts, gotoCart: openCart,
        });
    };

    const onProductSelectFolder = (itemIn) => {
        const filteredProducts = [];
        props.navigation.navigate('ProductPage', {
            screen: "", accessToken: props.accessToken, profile: profile,
            addtoCart: onProductAdd, product: itemIn, openProductIn: onProductSelect,
            catalogName: getCatlogName(itemIn.ParentCatalogId),
            allproducts: cartItems, catalogProducts: filteredProducts, gotoCart: openCart,
        });
    };

    const onProductSelect = (itemIn) => {
        let filteredProducts = [];
        for (let index = 0; index < allProductsRandom.length; index++) {
            const element = allProductsRandom[index];
            if (!Tools.IsNull(element) && !Tools.IsNull(element.Entity)) {
                let elements = itemIn.Entity.MetaDataList.filter((meteD) => (meteD.MetaFieldCode === WebServices.relatedProduct));
                if (elements.length > 0) {
                    const elementsValue = elements[0].Value.split(',');
                    filteredProducts = allProductsRandom.filter(itemIn1 =>
                        elementsValue.some(el => !Tools.IsNull(itemIn1) && !Tools.IsNull(itemIn1.Entity) && itemIn1.Entity.ProductId === el)
                    );
                }
            }
        }
        props.navigation.navigate('ProductPage', {
            screen: "", accessToken: props.accessToken, profile: profile,
            addtoCart: onProductAdd, product: itemIn,
            catalogName: getCatlogName(itemIn.ParentCatalogId),
            allproducts: cartItems, openProductIn: onProductSelect,
            catalogProducts: filteredProducts, gotoCart: openCart,
        });
    };

    // ========================================
    // CART — Add / Modify / Remove / Validate
    // ========================================

    const removeItemfromCart = useCallback((_cartIn, _shopCartInfo, _producttoRemove) => {
        dispatch({ type: 'update_Cart', stateIn: _shopCartInfo });
        removeShoppingCartVGS(_cartIn, _shopCartInfo, _producttoRemove);
    }, []);

    const ModifyItemfromCart = (_shopCartInfo, _producttoModify, _countIn) => {
        modifyShoppingCartVGS(_shopCartInfo, _producttoModify, _countIn);
    };

    const onProductAdd = (_shopCartInfo, itemIn, priceIn, totalNo, check, additionalInfo, _profile, callback = false, template_Code = '', addonDetails = null) => {
        if (check) {
            if (checkInformativeProduct(itemIn)) { onProductSelect(itemIn); return; }
            if (checkAddonProduct(itemIn)) { onProductSelect(itemIn); return; }
            if (checkDateProduct(itemIn)) { onProductSelect(itemIn); return; }
            if (checkIsVariable(itemIn) != -1) { onProductSelect(itemIn); return; }
            else if ((itemIn.CatalogNameExt) == WebServices.topupCommand) { onProductSelect(itemIn); return; }
        }
        setShowInfo({ "textToDisplay": i18n.t('addedtocart') });
        const cartItemsIn = cartItems;
        const tempCartItem = { item: { value: itemIn, details: additionalInfo }, count: totalNo };
        const filteredCart = cartItemsIn.filter(itemSelect => {
            return ((itemIn.Entity.ProductId == itemSelect.item.value.Entity.ProductId && itemSelect.item.details == null && additionalInfo == null));
        });
        if (filteredCart.length > 0) {
            filteredCart[0].count += totalNo;
            modifyShoppingCartVGS(_shopCartInfo, itemIn.Entity, totalNo);
        } else {
            cartItemsIn.push(tempCartItem);
            addtoShoppingCartVGS(tempCartItem, priceIn, totalNo, (dataIn) => {
                if (callback) DeviceEventEmitter.emit("callbackProductPage", { p1: dataIn == "" ? cartItemsIn : "error" });
            });
        }
        settotalItems(cartItemsIn.length);
        setcartItems(cartItemsIn);
        dispatch({ type: 'update_CartItems', stateIn: cartItemsIn });
        props.navigation.setParams({ allproducts: cartItems });
    };

    const AddCoupontoShoppingCartVGS = (_shopCartInfo, _couponCode) => {
        const bodyData = {
            "Command": "AddCouponToCart",
            "ShopCartId": _shopCartInfo.Answer.ShopCart.ShopCartId,
            "AddCouponToCart": { "CouponCode": _couponCode },
        };
        fetch(WebServices.MainURL + WebServices.addCoupontoCart, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                // FIX: was `shopCart=...` — global pollution
                const shopCart = JSON.parse(responseJson);
                if (shopCart.Header.ErrorMessage != undefined) {
                    Alert.alert(shopCart.Header.ErrorMessage);
                    DeviceEventEmitter.emit("setLoadingCart", { p1: false });
                } else {
                    dispatch({ type: 'update_Cart', stateIn: shopCart });
                }
            }).catch((error) => {
                DeviceEventEmitter.emit("setLoadingCart", { p1: false });
            });
    };

    const modifyShoppingCartVGS = (_shopCartInfo, _itemtoCart, _count) => {
        if (Tools.IsNull(_shopCartInfo) || Tools.IsNull(_shopCartInfo.Answer) || Tools.IsNull(_shopCartInfo.Answer.ShopCart) || Tools.IsNull(_shopCartInfo.Answer.ShopCart.ShopCartId)) {
            return;
        }
        const filteredCart = _shopCartInfo.Answer.ShopCart.Items.filter((itemSelect) => {
            return (_itemtoCart.ProductId === itemSelect.ProductId);
        });
        if (filteredCart != undefined && filteredCart.length > 0) {
            const bodyData = {
                "ShopcartId": _shopCartInfo.Answer.ShopCart.ShopCartId,
                "ShopcartItemId": filteredCart[0].ShopCartItemId,
                "langIso": "en",
                "QuantityDifference": _count,
                "MemberId": Tools.IsNull(profile) ? "" : props.accessToken.MemberID,
            };
            fetch(WebServices.MainURL + WebServices.modifyCart, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            }, 5000)
                .then((response) => response.text())
                .then((responseJson) => {
                    const shopCart = JSON.parse(responseJson);
                    dispatch({ type: 'update_Cart', stateIn: shopCart });
                }).catch((error) => {
                    DeviceEventEmitter.emit("setLoadingCart", { p1: false });
                });
        }
    };

    const removeShoppingCartVGS = (_cartIn, _shopCartInfo, _itemtoCart) => {
        if (Tools.IsNull(_shopCartInfo) || Tools.IsNull(_shopCartInfo.Answer.ShopCart) || Tools.IsNull(_shopCartInfo.Answer.ShopCart.ShopCartId)) {
            return;
        }
        let cartItemsIn = _cartIn;
        const cartItemsRemoveIn = cartItemsIn.filter(itemSelect => (itemSelect.item.value.Entity.ProductId == _itemtoCart.ProductId));
        cartItemsIn = cartItemsIn.filter(itemSelect => (itemSelect.item.value.Entity.ProductId != _itemtoCart.ProductId));
        updateProducts(cartItemsIn);
        const filteredCart = _shopCartInfo.Answer.ShopCart.Items.filter(itemSelect => (_itemtoCart.ProductId == itemSelect.ProductId));
        if (filteredCart != undefined && filteredCart.length > 0) {
            const bodyData = {
                "ShopcartId": _shopCartInfo.Answer.ShopCart.ShopCartId,
                "ShopcartItemId": filteredCart[0].ShopCartItemId,
                "langIso": "en",
                "MemberId": Tools.IsNull(profile) ? "" : props.accessToken.MemberID,
            };
            fetch(WebServices.MainURL + WebServices.removeCart, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            }, 5000)
                .then((response) => response.text())
                .then((responseJson) => {
                    logRemoveFromCartEvent(cartItemsRemoveIn[0]);
                    const shopCart = JSON.parse(responseJson);
                    dispatch({ type: 'update_Cart', stateIn: shopCart });
                });
        }
    };

    const removeShoppingCartVGSWait = async (_itemtoCart) => {
        let cartItemsIn = cartItems;
        cartItemsIn = cartItemsIn.filter(itemSelect => (itemSelect.item.value.Entity.ProductId != _itemtoCart.ProductId));
        updateProducts(cartItemsIn);
        const filteredCart = shopCartInfo.Answer.ShopCart.Items.filter(itemSelect => (_itemtoCart.ProductId == itemSelect.ProductId));
        const bodyData = {
            "ShopcartId": shopCartInfo.Answer.ShopCart.ShopCartId,
            "ShopcartItemId": filteredCart[0].ShopCartItemId,
            "langIso": "en",
            "MemberId": Tools.IsNull(profile) ? "" : props.accessToken.MemberID,
        };
        await fetch(WebServices.MainURL + WebServices.removeCart, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                logRemoveFromCartEvent(_itemtoCart);
                const shopCart = JSON.parse(responseJson);
                dispatch({ type: 'update_Cart', stateIn: shopCart });
            });
    };

    const checkSeatOfPerformance = async (_shopCartInfo, _callback) => {
        let removed = false;
        for (let index = 0; index < _shopCartInfo.Answer.ShopCart.Items.length; index++) {
            const element = _shopCartInfo.Answer.ShopCart.Items[index];
            if (element.PerformanceList != undefined && !Tools.IsNull(element.PerformanceList) && element.PerformanceList.length > 0) {
                const bodyData = {
                    "Command": "LoadSeatStatus",
                    "LoadSeatStatus": {
                        "HoldId": _shopCartInfo.Answer.ShopCart.HoldId,
                        "PerformanceId": element.PerformanceList[0].PerformanceId,
                    },
                };
                await fetch(WebServices.MainURL + WebServices.checkSeat, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData)
                }, 5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        // FIX: was `responseObj=...` — global pollution
                        const responseObj = JSON.parse(responseJson);
                        if (!Tools.IsNull(responseObj.Answer.LoadSeatStatus.SeatList) && responseObj.Answer.LoadSeatStatus.SeatList.length > 0 &&
                            responseObj.Answer.LoadSeatStatus.SeatList[0].QuantityFree > 0) {
                            // seat available
                        } else {
                            removeShoppingCartVGSWait(element);
                            removed = true;
                        }
                    }).catch((error) => {
                        dispatch({ type: 'update_Cart', stateIn: undefined });
                    });
            }
        }
        if (removed) {
            Alert.alert(i18n.t('cartitemsadjusted'), '');
        }
        if (_callback != null && !removed) {
            const shopCart = _shopCartInfo;
            shopCart.random = Math.floor(Math.random() * 100000) + 1;
            dispatch({ type: 'update_Cart', stateIn: shopCart });
            _callback();
        }
    };

    const addtoShoppingCartVGS = (_itemtoCart, _priceIn, _count, callback = null) => {
        const allItems = [];
        if (!Tools.IsNull(_itemtoCart.item) && !Tools.IsNull(_itemtoCart.item.details) && _itemtoCart.item.details.type == 'events') {
            allItems.push({
                "ProductId": _itemtoCart.item.value.Entity.ProductId,
                "Quantity": _count,
                "PerformanceIDs": (Tools.IsNull(_itemtoCart.item.details) || Tools.IsNull(_itemtoCart.item.details.performance)) ? null : _itemtoCart.item.details.performance.PerformanceId,
            });
        } else {
            if (checkIsVariable(_itemtoCart.item.value) != -1) {
                allItems.push({
                    "ProductId": _itemtoCart.item.value.Entity.ProductId,
                    "Quantity": _count,
                    "Options": _itemtoCart.item.details.data.AttributeItemId,
                    "PerformanceIDs": (Tools.IsNull(_itemtoCart.item.details) || Tools.IsNull(_itemtoCart.item.details.performance)) ? null : _itemtoCart.item.details.performance.PerformanceId,
                });
            } else {
                allItems.push({ "ProductId": _itemtoCart.item.value.Entity.ProductId, "Quantity": _count });
            }
        }
        const bodyData = {
            "ShopcartId": (Tools.IsNull(shopCartInfo) || Tools.IsNull(shopCartInfo.Answer) || Tools.IsNull(shopCartInfo.Answer.ShopCart)) ? "" : shopCartInfo.Answer.ShopCart.ShopCartId,
            "EntityType": 12, "langIso": "en",
            "Items": allItems,
            "MediaCode": (!Tools.IsNull(_itemtoCart.item.details) && _itemtoCart.item.details.type == WebServices.topupCommand) ? _itemtoCart.item.details.displayname : '',
            "AccountId": Tools.IsNull(_itemtoCart.item.details) || Tools.IsNull(_itemtoCart.item.details.data) ? "" : _itemtoCart.item.details.data.AccountId,
            "MemberId": Tools.IsNull(profile) ? "" : profile.Id,
            "ValidFrom": ((!Tools.IsNull(_itemtoCart.item.details) && !Tools.IsNull(_itemtoCart.item.details.displayname) && _itemtoCart.item.details.displayname == 'date') ? _itemtoCart.item.details.data : ''),
        };
        fetch(WebServices.MainURL + WebServices.addtoCart, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        }, WebServices.timeout)
            .then((response) => {
                if (!response.ok) { if (callback != null) callback("Error"); }
                else { if (callback != null) callback(""); }
                return response.text();
            })
            .then((responseJson) => {
                const shopCart = JSON.parse(responseJson);
                logAddToCartEvent(_itemtoCart, _priceIn, _count);
                dispatch({ type: 'update_Cart', stateIn: shopCart });
                SecureStore.setItemAsync("shopcart", shopCart.Answer.ShopCart.ShopCartId);
            }).catch((error) => {
                dispatch({ type: 'update_Cart', stateIn: undefined });
            });
    };

    const validateShoppingCartVGS = (_shotCartId, _profile, _totalVal, _LoadUpdate) => {
        const bodyData = {
            "ShopcartId": _shotCartId, "LangIso": "en",
            "MemberId": Tools.IsNull(props.route?.params?.accessToken) ? "" : props.route.params.accessToken.MemberID,
        };
        fetch(WebServices.MainURL + WebServices.validateCart, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                const responseObj = JSON.parse(responseJson);
                if (!responseObj.Answer.ValidateShopCart.RestrictValidPayments) {
                    getPaymentURL(_shotCartId, _profile, _totalVal);
                } else {
                    if (_LoadUpdate != null) _LoadUpdate(false);
                }
            }).catch(() => {
                if (_LoadUpdate != null) _LoadUpdate(false);
            });
    };

    const getPaymentURL = (_shopCardID, _profile, _totalAmount) => {
        const bodyData = {
            "MemberId": Tools.IsNull(profile) ? "" : props.accessToken.MemberID,
            "ShopcartId": _shopCardID, "Amount": _totalAmount,
            "Address": {
                "street": _profile.BillingAddress.street, "city": _profile.BillingAddress.city,
                "state": _profile.BillingAddress.state, "country": _profile.BillingAddress.country,
                "postalCode": _profile.BillingAddress.postalCode,
            },
            "Account": {
                "firstName": _profile.FirstName, "lastName": _profile.LastName,
                "phone": _profile.Mobile, "email": _profile.Email,
            },
        };
        fetch(WebServices.MainURL + WebServices.initskipcash, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                const responseObj = JSON.parse(responseJson);
                if (Tools.stringIsEmpty(responseObj.Error)) {
                    setshowPay(true);
                    setpaymentWebUrl(responseObj.PaymentURL);
                }
            }).catch(() => { });
    };

    const getShopCartItem = (_item, _shopCart) => {
        for (let index = 0; index < _shopCart.Answer.ShopCart.Items.length; index++) {
            if (_item.Entity.ProductId == _shopCart.Answer.ShopCart.Items[index].ProductId) {
                return _shopCart.Answer.ShopCart.Items[index];
            }
        }
        return null;
    };

    const setAccountToCart = (_shopcart, _profile, _totalVal, _LoadUpdate) => {
        const allItems = [];
        for (let index = 0; index < cartItems.length; index++) {
            if (cartItems[index].item.details != null) {
                if (cartItems[index].item.details.type == WebServices.topupCommand) {
                    const shopCartItem = getShopCartItem(cartItems[index].item.value, _shopcart);
                    for (let i = 0; i < cartItems[index].count; i++) {
                        allItems.push({
                            "ShopcartItemId": shopCartItem.ShopCartItemId,
                            "Position": i + 1,
                            "AccountId": cartItems[index].item.details.data.AccountId,
                        });
                    }
                }
            }
        }
        const bodyData = {
            "ShopcartId": shopCartInfo == undefined ? "" : shopCartInfo.Answer.ShopCart.ShopCartId,
            "langIso": "en", "ShopCartItemAccounts": allItems,
        };
        fetch(WebServices.MainURL + WebServices.setItemAccount, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then(() => {
                validateShoppingCartVGS(_shopcart.Answer.ShopCart.ShopCartId, _profile, _totalVal, _LoadUpdate);
            }).catch(() => {
                if (_LoadUpdate != null) _LoadUpdate(false);
            });
    };

    // ========================================
    // PRODUCT LIST BUILDER
    // ========================================

    const getProductnItems = () => {
        const allProductsIn = [];
        const allProductCat = [];
        const allProductCatVal = [];
        if (props.storeCatalog.Nodes != null) {
            props.storeCatalog.Nodes.map((itemIn) => {
                if (selectedStore == '' || itemIn.CatalogId == selectedStore) {
                    itemIn.Nodes.map((_productIn) => {
                        let CanProcced = false;
                        const isElementInArray = allProductCat.includes(_productIn.CatalogName);
                        if (!isElementInArray && Tools.stringIsContains(_productIn.TemplateCode, WebServices.category)) {
                            allProductCat.push(_productIn.CatalogName);
                            allProductCatVal.push(_productIn);
                        }
                        CanProcced = filterProductCategory == undefined || (filterProductCategory != undefined && (filterProductCategory.CatalogName == _productIn.CatalogName));
                        if (CanProcced) {
                            _productIn.Nodes.map((productIn) => {
                                if (Tools.stringIsEmpty(sorttext) || Tools.stringIsContains(getTranslatedProductName(productIn), sorttext)) {
                                    productIn.parkType = itemIn.CatalogName;
                                    if (productIn.CatalogType == 3 && productIn.Entity.ProductStatus == 2) {
                                        const productT = productIn;
                                        productT.productTitle = _productIn.CatalogName;
                                        productT.CatalogType = 3;
                                        allProductsIn.push(productT);
                                    } else if (productIn.CatalogType == 3 && productIn.EntityType == 5) {
                                        const productT = productIn;
                                        productT.productTitle = _productIn.CatalogName;
                                        productT.CatalogType = 2;
                                        allProductsIn.push(productT);
                                    } else if (productIn.CatalogType == 2) {
                                        const productT = productIn;
                                        productT.productTitle = _productIn.CatalogName;
                                        productT.CatalogType = 2;
                                        allProductsIn.push(productT);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
        let allProductsInSort = [];
        for (let index = 0; index < allProductCatVal.length; index++) {
            const element = allProductsIn.filter((_itemInCheck) => _itemInCheck.productTitle == allProductCatVal[index].CatalogName);
            for (let j = 0; j < element.length; j++) {
                allProductsInSort.push(element[j]);
            }
        }
        if (!shuffled && (filterProductCategory == undefined)) {
            shuffleArray(allProductsInSort);
            setallProductsRandom(allProductsInSort);
        }
        if (shuffled && (filterProductCategory == undefined) && Tools.IsNull(selectedStore)) {
            allProductsInSort = allProductsRandom;
        }
        let allcat = undefined;
        if (filterProductCategory != undefined) {
            allcat = allProductCatVal.filter((_itemcheck) => _itemcheck.CatalogName == filterProductCategory.CatalogName);
            if (allcat == null || allcat == undefined || allcat.length == 0)
                setfilterProductCategory(undefined);
        }
        allProductsInSort = [undefined, ...allProductsInSort];
        setallProducts(allProductsInSort);
        setallProductCategory(allProductCatVal);
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const getStores = () => {
        const allStores = [];
        allStoresIn.map((itemIn, index) => {
            if (index == 0) {
                allStores.push(addstoreItem(null, null));
            }
            allStores.push(addstoreItem(itemIn, itemIn.CatalogId));
        });
        return allStores;
    };

    const getProductCategory = () => {
        const allStores = [];
        allProductCategory.map((itemIn, index) => {
            allStores.push(addproductCategoryItem(itemIn, index));
        });
        return allStores;
    };

    // ========================================
    // FLATLIST RENDER
    // ========================================

    const renderProducts = ({ item, index }) => {
        if (item == undefined) {
            return (
                <View>
                    <Text allowFontScaling={false} style={styles.storedesc}>{folderDesc != undefined ? folderDesc : i18n.t("storedesc")}</Text>
                </View>
            );
        } else {
            if (item.CatalogType == 2 && item.EntityType == 5) {
                return <View>{addproductEventItem(item)}</View>;
            } else if (item.CatalogType == 3) {
                return <View>{addproductItem(item, index)}</View>;
            } else if (item.CatalogType == 2) {
                return <View>{addproductFolderItem(item)}</View>;
            }
        }
        return null;
    };

    // ========================================
    // LOADING SKELETON
    // ========================================

    const getLoading = () => {
        // FIX: was `allLoad=[]` and `randHeight=30` — global pollution
        const allLoad = [];
        const randHeight = 30;
        allLoad.push(
            <ContentLoader key="loader"
                speed={0.7} width={widthPercentageToDP(93)} height={heightPercentageToDP(90)}
                style={{ alignSelf: 'center' }}
                backgroundColor={Colors.whiteColor} foregroundColor={Colors.bgColor}>
                <Rect x="0" y={40} rx="2" ry="2" width={widthPercentageToDP(93)} height={heightPercentageToDP(3)} />
                <Rect x="0" y={40 + heightPercentageToDP(4)} rx="2" ry="2" width={widthPercentageToDP(93)} height={heightPercentageToDP(6)} />
                <Rect x="0" y={40 + heightPercentageToDP(12)} rx={widthPercentageToDP(2)} ry={widthPercentageToDP(2)} width={widthPercentageToDP(93)} height={heightPercentageToDP(randHeight - 1)} />
                <Rect x="0" y={40 + heightPercentageToDP(12 + randHeight)} rx={widthPercentageToDP(2)} ry={widthPercentageToDP(2)} width={widthPercentageToDP(93)} height={heightPercentageToDP(randHeight - 1)} />
                <Rect x="0" y={40 + heightPercentageToDP(12 + (2 * randHeight))} rx={widthPercentageToDP(2)} ry={widthPercentageToDP(2)} width={widthPercentageToDP(93)} height={heightPercentageToDP(randHeight - 1)} />
            </ContentLoader>
        );
        return allLoad;
    };

    const OnDoneInfo = () => { setShowInfo(undefined); };

    const refreshListView = () => {
        setShuffled(true);
        const fetchCatalog = props.fetchCatalog;
        setisLoading(true);
        setrefreshing(true);
        fetchCatalog();
    };

    const onDoneCart = () => {
        setTimeout(() => {
            setshopCartInfo(undefined);
            setcartModal(false);
            setcartItems([]);
            settotalItems(0);
            dispatch({ type: 'update_CartItems', stateIn: [] });
            dispatch({ type: 'update_Cart', stateIn: undefined });
            props.navigation.setParams({ allproducts: [] });
        }, 500);
    };

    // ========================================
    // STYLES (memoized)
    // ========================================

    const styles = useMemo(() => StyleSheet.create({
        moreShadow: { shadowColor: "#ffffff", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.53, shadowRadius: 13.97, elevation: 21 },
        shadow: { shadowColor: "#ffffff", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
        storetitle: { fontFamily: 'Cairo-Regular', fontSize: 18, color: Colors.black, alignSelf: 'center', includeFontPadding: false },
        topBar: { justifyContent: 'space-between', alignSelf: 'flex-end', width: '80%', flexDirection: 'row', marginEnd: widthPercentageToDP(4) },
        cartIcon: { marginTop: heightPercentageToDP(1), tintColor: Colors.blueColor, height: 28, width: 28 },
        sizeIcon: { height: 30, width: 30, alignSelf: 'center' },
        addtoCart: { position: 'absolute', tintColor: Colors.blueColor, alignSelf: 'center', height: 35, width: 35 },
        cartCricle: { height: 30, justifyContent: 'center', alignContent: 'center' },
        cartNo: { color: Colors.black, fontFamily: 'Cairo-Bold', fontSize: 20 },
        homeScrollView: { flex: 1 },
        homeView: {},
        productsContent: { borderWidth: 1, flexWrap: 'wrap', justifyContent: 'flex-start', flexDirection: 'row' },
        productsView: { alignSelf: 'center', width: '100%' },
        inner: { flex: 1, flexDirection: 'row', padding: 5, alignContent: 'space-between' },
        productparent: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', justifyContent: 'center' },
        stores: { margin: 10, justifyContent: 'center' },
        productContain: { paddingBottom: heightPercentageToDP(35), alignContent: 'center', justifyContent: 'center', alignItems: 'center', width: '100%' },
        productView: { height: heightPercentageToDP(100), alignContent: 'center', justifyContent: 'center', alignItems: 'center' },
        products: { backgroundColor: Colors.bgColor, borderRadius: widthPercentageToDP(3) },
        cartButtonwithIcon: { flex: 1, borderBottomRightRadius: widthPercentageToDP(3), justifyContent: 'center' },
        productImage: { height: widthPercentageToDP(90), width: widthPercentageToDP(90), resizeMode: 'contain', bottom: 0, borderTopLeftRadius: widthPercentageToDP(3), borderTopRightRadius: widthPercentageToDP(3) },
        productText: { includeFontPadding: false, width: '95%', color: Colors.black, textAlign: 'left', marginStart: widthPercentageToDP(3), marginTop: widthPercentageToDP(0.5), fontFamily: 'Cairo-SemiBold', fontSize: widthPercentageToDP(5), lineHeight: widthPercentageToDP(7), flexWrap: 'wrap' },
        productPrice: { paddingTop: widthPercentageToDP(1.1), justifyContent: 'center', overflow: 'hidden', color: Colors.whiteColor, alignSelf: 'center', textAlign: 'center', fontFamily: 'Cairo-Bold', fontSize: widthPercentageToDP(4.75), flexWrap: 'wrap' },
        storedesc: { includeFontPadding: false, color: Colors.black, width: widthPercentageToDP(92), textAlign: 'left', fontFamily: 'Cairo-Regular', fontSize: widthPercentageToDP(3.75), lineHeight: widthPercentageToDP(3.75) * 1.5, flexWrap: 'wrap', alignSelf: 'center' },
    }), [Colors]);

    // ========================================
    // JSX
    // ========================================

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : '11%', backgroundColor: Colors.bgColor }}>
            {showLogin && (<ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation} onDismiss={() => setshowLogin(false)} />)}
            <BackgroundWall />

            {isLoading && getLoading()}

            {!isLoading && <>
                <View style={[styles.topBar]}>
                    <TextInput
                        ref={searchInputRef}
                        value={sorttext}
                        numberOfLines={1}
                        allowFontScaling={false}
                        onChangeText={(text) => { setsorttext(text); }}
                        style={[{
                            includeFontPadding: false, alignContent: 'center', opacity: sortVisible,
                            marginTop: heightPercentageToDP(0.5), paddingVertical: heightPercentageToDP(0.1),
                            paddingHorizontal: widthPercentageToDP(3),
                            borderWidth: 1, borderColor: Colors.blueColor, color: Colors.blueColor,
                            alignSelf: 'center', justifyContent: 'center',
                            borderRadius: heightPercentageToDP(4), backgroundColor: Colors.bgColor,
                            fontFamily: 'Cairo-Regular', fontSize: widthPercentageToDP(4.5),
                            width: '70%', height: heightPercentageToDP(4),
                        }, styles.shadow]}
                    />
                    {sorttext.length > 0 && <TouchableOpacity onPress={() => {
                        Keyboard.dismiss();
                        setTimeout(() => { setsortVisible(0); setsorttext(''); }, 100);
                    }} style={{
                        height: heightPercentageToDP(3), backgroundColor: Colors.blueColor,
                        marginTop: heightPercentageToDP(1), position: 'absolute', start: widthPercentageToDP(48),
                        justifyContent: 'center', width: heightPercentageToDP(3), borderRadius: heightPercentageToDP(3),
                    }}>
                        <Text style={{ color: Colors.bgColor, includeFontPadding: false, fontFamily: 'Cairo-Bold', alignSelf: 'center' }}>X</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity onPress={() => { searchInputRef.current?.focus(); setsortVisible(1); }}>
                        <Image style={styles.cartIcon} resizeMode='contain' source={searchIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { openCart(false); }}>
                        <Image style={styles.cartIcon} resizeMode='contain' source={cartIcon} />
                        {totalItems > 0 && <View style={{
                            position: 'absolute', justifyContent: 'center', backgroundColor: Colors.inputfontColor,
                            alignSelf: 'flex-end', borderRadius: 15, height: 14, width: 14, top: 3, end: -5,
                        }}>
                            <Text allowFontScaling={false} style={{
                                includeFontPadding: false, alignSelf: 'center', textAlign: 'center',
                                color: Colors.whiteColor, fontSize: widthPercentageToDP(2.5),
                            }}>{totalItems}</Text>
                        </View>}
                    </TouchableOpacity>
                </View>

                <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.homeView}>
                        <View style={styles.inner}>{getStores()}</View>
                    </ScrollView>
                    <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingEnd: widthPercentageToDP(2) }}
                        style={[styles.homeView, { paddingStart: widthPercentageToDP(2), paddingEnd: widthPercentageToDP(5), marginTop: -heightPercentageToDP(1) }]}>
                        {getProductCategory()}
                    </ScrollView>
                </View>

                <View style={styles.productView}>
                    <FlatList
                        removeClippedSubviews={false}
                        ref={mainScrollRef}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={3}
                        data={allProducts}
                        contentContainerStyle={styles.productContain}
                        refreshControl={<RefreshControl tintColor={Colors.orangeShadeColor} refreshing={refreshing} onRefresh={refreshListView} />}
                        style={styles.productsView}
                        keyExtractor={(item, idx) => item?.EntityId?.toString() || idx.toString()}
                        renderItem={renderProducts}
                    />
                </View>
            </>}

            {ShowInfo != undefined && <InfoBar textToDisplay={ShowInfo.textToDisplay} onDone={OnDoneInfo} />}
        </SafeAreaView>
    );
}