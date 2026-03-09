/**
 * StorePageCartOps.js
 *
 * Custom hook: useCartOperations
 *
 * Owns all cart state and VGS cart API operations extracted from StorePage.js:
 * - Cart state (cartItems, totalItems, shopCartInfo)
 * - Add to cart (single + multiple items)
 * - Modify cart item quantity
 * - Remove cart item
 * - Apply coupon
 * - Validate cart
 * - Get payment URL
 * - Check seat availability
 * - Cart clear (onDoneCart)
 *
 * Consolidates original useEffects:
 * - [state.cartItems] → sync local cart state
 * - [state] → sync shopCartInfo, clear cart if null
 *
 * Does NOT own: product list state, deep link state, or navigation.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { StackActions } from '@react-navigation/native';
import * as Tools from '../../Tools/Components/Tools.js';
import WebServices from '../../Tools/constants/WebServices';
import SecureStore from '../../Tools/Components/SecureStore';
import {
    checkIsVariable,
    checkInformativeProduct,
    checkAddonProduct,
    checkDateProduct,
} from './StorePageHelpers';
import {
    logAddToCartEvent,
    logRemoveFromCartEvent,
} from '../../Tools/Analytics/AppAnalytics';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';

const i18n = new I18n(translations);

/**
 * @param {object} params
 * @param {object} params.props - Props from ProfileData (navigation, accessToken, profile, mediaInfo)
 * @param {object} params.state - Full AppReducer state
 * @param {function} params.dispatch - AppReducer dispatch
 * @param {function} params.onProductSelect - Function to navigate to ProductPage for a product
 * @param {object} params.profile - Current profile (local copy from useStoreProducts)
 */
export default function useCartOperations({ props, state, dispatch, onProductSelect, profile }) {

    // ─── State ───────────────────────────────────────────────────────────────────

    const [cartItems, setCartItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [shopCartInfo, setShopCartInfo] = useState(undefined);

    // ─── Effect 1: Sync cartItems from AppReducer ────────────────────────────────
    // Replaces original [state.cartItems] useEffect

    useEffect(() => {
        console.log('[STORE-DEBUG-07] Cart items synced', state.cartItems.length);
        setCartItems(state.cartItems);
        setTotalItems(state.cartItems.length);
    }, [state.cartItems]);

    // ─── Effect 2: Sync shopCartInfo from AppReducer ─────────────────────────────
    // Replaces original [state] useEffect that syncs shopCartInfo

    useEffect(() => {
        if (state.shopCartInfo != shopCartInfo) {
            console.log('[STORE-DEBUG-08] ShopCartInfo synced');
            setShopCartInfo(state.shopCartInfo);
            if (Tools.IsNull(state.shopCartInfo)) {
                setTotalItems(0);
                setCartItems([]);
                dispatch({
                    type: 'update_CartItems',
                    stateIn: []
                });
                props.navigation.setParams({
                    allproducts: [],
                });
            }
        }
    }, [state.shopCartInfo]);

    // ─── Helper: updateProducts (used by remove) ─────────────────────────────────

    const updateProducts = useCallback((_products) => {
        setTotalItems(_products.length);
        setCartItems(_products);
        dispatch({
            type: 'update_CartItems',
            stateIn: _products
        });
        props.navigation.setParams({
            allproducts: _products,
        });
    }, [dispatch, props.navigation]);

    // ─── API: Add to Shopping Cart (VGS) ─────────────────────────────────────────

    const addtoShoppingCartVGS = useCallback((_itemtoCart, _priceIn, _count, callback = null) => {
        var allItems = [];
        if (!Tools.IsNull(_itemtoCart.item) && !Tools.IsNull(_itemtoCart.item.details) && _itemtoCart.item.details.type == 'events') {
            allItems.push({
                "ProductId": _itemtoCart.item.value.Entity.ProductId,
                "Quantity": _count,
                "PerformanceIDs": (Tools.IsNull(_itemtoCart.item.details) || Tools.IsNull(_itemtoCart.item.details.performance)) ? null : _itemtoCart.item.details.performance.PerformanceId
            });
        } else {
            if (checkIsVariable(_itemtoCart.item.value) != -1) {
                allItems.push({
                    "ProductId": _itemtoCart.item.value.Entity.ProductId,
                    "Quantity": _count,
                    "Options": _itemtoCart.item.details.data.AttributeItemId,
                    "PerformanceIDs": (Tools.IsNull(_itemtoCart.item.details) || Tools.IsNull(_itemtoCart.item.details.performance)) ? null : _itemtoCart.item.details.performance.PerformanceId
                });
            } else {
                allItems.push({
                    "ProductId": _itemtoCart.item.value.Entity.ProductId,
                    "Quantity": _count
                });
            }
        }

        var bodyData = {
            "ShopcartId": (Tools.IsNull(shopCartInfo) || Tools.IsNull(shopCartInfo.Answer) || Tools.IsNull(shopCartInfo.Answer.ShopCart)) ? "" : shopCartInfo.Answer.ShopCart.ShopCartId,
            "EntityType": 12,
            "langIso": "en",
            "Items": allItems,
            "MediaCode": (!Tools.IsNull(_itemtoCart.item.details) && _itemtoCart.item.details.type == WebServices.topupCommand) ? _itemtoCart.item.details.displayname : '',
            "AccountId": Tools.IsNull(_itemtoCart.item.details) || Tools.IsNull(_itemtoCart.item.details.data) ? "" : _itemtoCart.item.details.data.AccountId,
            "MemberId": Tools.IsNull(profile) ? "" : profile.Id,
            "ValidFrom": ((!Tools.IsNull(_itemtoCart.item.details) && !Tools.IsNull(_itemtoCart.item.details.displayname) && _itemtoCart.item.details.displayname == 'date') ? _itemtoCart.item.details.data : '')
        };
        console.log('[STORE-DEBUG-12] Adding to cart API', bodyData.Items[0].ProductId);
        console.log('[STORE-DEBUG-CART-03] Full add-to-cart body:', JSON.stringify(bodyData));
        console.log("Add - " + JSON.stringify(bodyData));
        fetch(WebServices.MainURL + WebServices.addtoCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }, WebServices.timeout)
            .then((response) => {
                console.log("Status :" + response.ok);
                if (!response.ok) {
                    if (callback != null) {
                        callback("Error");
                    }
                } else {
                    if (callback != null) {
                        callback("");
                    }
                }
                return response.text();
            })
            .then((responseJson) => {
                console.log("R : " + responseJson);
                let shopCart = JSON.parse(responseJson);
                if (shopCart?.Answer?.ShopCart && !shopCart.Answer.ShopCart.Items) {
                    shopCart.Answer.ShopCart.Items = [];
                }
                console.log('[STORE-DEBUG-CART-04] Parsed cart response:', {hasAnswer: !!shopCart?.Answer, hasShopCart: !!shopCart?.Answer?.ShopCart, itemCount: shopCart?.Answer?.ShopCart?.Items?.length, shopCartId: shopCart?.Answer?.ShopCart?.ShopCartId});
                logAddToCartEvent(_itemtoCart, _priceIn, _count);
                dispatch({
                    type: 'update_Cart',
                    stateIn: shopCart
                });
                SecureStore.setItemAsync("shopcart", shopCart.Answer.ShopCart.ShopCartId);
            }).catch((error) => {
                console.log('[STORE-DEBUG-CART-05] Add to cart API ERROR:', error);
                dispatch({
                    type: 'update_Cart',
                    stateIn: undefined
                });
            });
    }, [shopCartInfo, profile, dispatch]);

    // ─── API: Add multiple items to Shopping Cart (VGS) ──────────────────────────

    const addmultipletoShoppingCartVGS = useCallback((_itemtoCart, _addonDetails, _count) => {
        var allItems = [];
        allItems.push({
            "ProductId": _itemtoCart.item.value.Entity.ProductId,
            "Quantity": _count,
        });
        for (let index = 0; index < _addonDetails.length; index++) {
            const element = _addonDetails[index];
            var indexIn = index;
            allItems.push({
                "ProductId": _addonDetails[indexIn].ProductList[0].ProductId,
                "Quantity": _count,
                "PerformanceIDs": _addonDetails[indexIn].PerformanceId
            });
        }

        var bodyData = {
            "ShopcartId": (Tools.IsNull(shopCartInfo) || Tools.IsNull(shopCartInfo.Answer) || Tools.IsNull(shopCartInfo.Answer.ShopCart)) ? "" : shopCartInfo.Answer.ShopCart.ShopCartId,
            "EntityType": 12,
            "langIso": "en",
            "Items": allItems,
            "MediaCode": (!Tools.IsNull(_itemtoCart.item.details) && _itemtoCart.item.details.type == WebServices.topupCommand) ? _itemtoCart.item.details.displayname : '',
            "AccountId": Tools.IsNull(_itemtoCart.item.details) || Tools.IsNull(_itemtoCart.item.details.data) ? "" : _itemtoCart.item.details.data.AccountId,
            "MemberId": Tools.IsNull(profile) ? "" : profile.Id,
            "ValidFrom": ((!Tools.IsNull(_itemtoCart.item.details) && !Tools.IsNull(_itemtoCart.item.details.displayname) && _itemtoCart.item.details.displayname == 'date') ? _itemtoCart.item.details.data : '')
        };
        fetch(WebServices.MainURL + WebServices.addtoCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }, WebServices.timeout)
            .then((response) => response.text())
            .then((responseJson) => {
                let shopCart = JSON.parse(responseJson);
                 if (shopCart?.Answer?.ShopCart && !shopCart.Answer.ShopCart.Items) {
                    shopCart.Answer.ShopCart.Items = [];
                }
                logAddToCartEvent(_itemtoCart, undefined, _count);
                dispatch({
                    type: 'update_Cart',
                    stateIn: shopCart
                });
                SecureStore.setItemAsync("shopcart", shopCart.Answer.ShopCart.ShopCartId);
            }).catch((error) => {
                dispatch({
                    type: 'update_Cart',
                    stateIn: undefined
                });
            });
    }, [shopCartInfo, profile, dispatch]);

    // ─── API: Modify Shopping Cart (VGS) ─────────────────────────────────────────

    const modifyShoppingCartVGS = useCallback((_shopCartInfo, _itemtoCart, _count) => {
        if (Tools.IsNull(_shopCartInfo) || Tools.IsNull(_shopCartInfo.Answer) || Tools.IsNull(_shopCartInfo.Answer.ShopCart) || Tools.IsNull(_shopCartInfo.Answer.ShopCart.ShopCartId)) {
            return;
        }
        console.log('Modify :' + JSON.stringify(_itemtoCart));
        const filteredCart = _shopCartInfo.Answer.ShopCart.Items.filter((itemSelect) => {
            return (_itemtoCart.ProductId === itemSelect.ProductId);
        });

        if (filteredCart != undefined && filteredCart.length > 0) {
            var bodyData = {
                "ShopcartId": _shopCartInfo.Answer.ShopCart.ShopCartId,
                "ShopcartItemId": filteredCart[0].ShopCartItemId,
                "langIso": "en",
                "QuantityDifference": _count,
                "MemberId": Tools.IsNull(profile) ? "" : props.accessToken.MemberID
            };
            fetch(WebServices.MainURL + WebServices.modifyCart, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            }, 5000)
                .then((response) => response.text())
                .then((responseJson) => {
                    let shopCart = JSON.parse(responseJson);
                    dispatch({
                        type: 'update_Cart',
                        stateIn: shopCart
                    });
                }).catch((error) => {
                    console.log("error" + error);
                    DeviceEventEmitter.emit("setLoadingCart", { p1: false });
                });
        }
    }, [profile, props.accessToken, dispatch]);

    // ─── API: Remove from Shopping Cart (VGS) ────────────────────────────────────

    const removeShoppingCartVGS = useCallback((_cartIn, _shopCartInfo, _itemtoCart) => {
        if (Tools.IsNull(_shopCartInfo) || Tools.IsNull(_shopCartInfo.Answer.ShopCart) || Tools.IsNull(_shopCartInfo.Answer.ShopCart.ShopCartId)) {
            return;
        }
        var cartItemsIn = _cartIn;
        var cartItemsRemoveIn = _cartIn;
        cartItemsRemoveIn = cartItemsIn.filter(itemSelect => {
            return (itemSelect.item.value.Entity.ProductId == _itemtoCart.ProductId);
        });
        cartItemsIn = cartItemsIn.filter(itemSelect => {
            return (itemSelect.item.value.Entity.ProductId != _itemtoCart.ProductId);
        });
        updateProducts(cartItemsIn);

        var filteredCart = _shopCartInfo.Answer.ShopCart.Items.filter(itemSelect => {
            return (_itemtoCart.ProductId == itemSelect.ProductId);
        });
        if (filteredCart != undefined && filteredCart.length > 0) {
            console.log('[STORE-DEBUG-13] Removing from cart API');
            var bodyData = {
                "ShopcartId": _shopCartInfo.Answer.ShopCart.ShopCartId,
                "ShopcartItemId": filteredCart[0].ShopCartItemId,
                "langIso": "en",
                "MemberId": Tools.IsNull(profile) ? "" : props.accessToken.MemberID
            };
            fetch(WebServices.MainURL + WebServices.removeCart, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            }, 5000)
                .then((response) => response.text())
                .then((responseJson) => {
                    logRemoveFromCartEvent(cartItemsRemoveIn[0]);
                    let shopCart = JSON.parse(responseJson);
                     if (shopCart?.Answer?.ShopCart && !shopCart.Answer.ShopCart.Items) {
                        shopCart.Answer.ShopCart.Items = [];
                    }
                    dispatch({
                        type: 'update_Cart',
                        stateIn: shopCart
                    });
                }).catch((error) => {
                    console.log("error" + error);
                });
        }
    }, [profile, props.accessToken, dispatch, updateProducts]);

    // ─── API: Remove from Shopping Cart (VGS) — async/await version ──────────────
    // Used by checkSeatOfPerformance to await removal before continuing.

    const removeShoppingCartVGSWait = useCallback(async (_itemtoCart) => {
        var cartItemsIn = cartItems;
        cartItemsIn = cartItemsIn.filter(itemSelect => {
            return (itemSelect.item.value.Entity.ProductId != _itemtoCart.ProductId);
        });
        updateProducts(cartItemsIn);

        var filteredCart = shopCartInfo.Answer.ShopCart.Items.filter(itemSelect => {
            return (_itemtoCart.ProductId == itemSelect.ProductId);
        });
        var bodyData = {
            "ShopcartId": shopCartInfo.Answer.ShopCart.ShopCartId,
            "ShopcartItemId": filteredCart[0].ShopCartItemId,
            "langIso": "en",
            "MemberId": Tools.IsNull(profile) ? "" : props.accessToken.MemberID
        };
        await fetch(WebServices.MainURL + WebServices.removeCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                logRemoveFromCartEvent(_itemtoCart);
                let shopCart = JSON.parse(responseJson);
                 if (shopCart?.Answer?.ShopCart && !shopCart.Answer.ShopCart.Items) {
                    shopCart.Answer.ShopCart.Items = [];
                }
                dispatch({
                    type: 'update_Cart',
                    stateIn: shopCart
                });
            });
    }, [cartItems, shopCartInfo, profile, props.accessToken, dispatch, updateProducts]);

    // ─── API: Add Coupon to Shopping Cart (VGS) ──────────────────────────────────

    const AddCoupontoShoppingCartVGS = useCallback((_shopCartInfo, _couponCode) => {
        console.log('AddCoupontoShoppingCartVGS :' + (_couponCode));

        var bodyData = {
            "Command": "AddCouponToCart",
            "ShopCartId": _shopCartInfo.Answer.ShopCart.ShopCartId,
            "AddCouponToCart": {
                "CouponCode": _couponCode,
            },
        };
        fetch(WebServices.MainURL + WebServices.addCoupontoCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                let shopCart = JSON.parse(responseJson);
                if (shopCart.Header.ErrorMessage != undefined) {
                    Alert.alert(shopCart.Header.ErrorMessage);
                    DeviceEventEmitter.emit("setLoadingCart", { p1: false });
                } else {
                    dispatch({
                        type: 'update_Cart',
                        stateIn: shopCart
                    });
                }
            }).catch((error) => {
                console.log("error" + error);
                DeviceEventEmitter.emit("setLoadingCart", { p1: false });
            });
    }, [dispatch]);

    // ─── API: Validate Shopping Cart (VGS) ───────────────────────────────────────

    const validateShoppingCartVGS = useCallback((_shotCartId, _profile, _totalVal, _LoadUpdate) => {
        var bodyData = {
            "ShopcartId": _shotCartId,
            "LangIso": "en",
            "MemberId": Tools.IsNull(props.accessToken) ? "" : props.accessToken.MemberID,
        };
        fetch(WebServices.MainURL + WebServices.validateCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                var responseObj = JSON.parse(responseJson);
                if (!responseObj.Answer.ValidateShopCart.RestrictValidPayments) {
                    getPaymentURL(_shotCartId, _profile, _totalVal, null, null);
                } else {
                    if (_LoadUpdate != null) {
                        _LoadUpdate(false);
                    }
                }
            }).catch((error) => {
                if (_LoadUpdate != null) {
                    _LoadUpdate(false);
                }
            });
    }, [props.accessToken]);

    // ─── API: Get Payment URL (SkipCash) ─────────────────────────────────────────

    const getPaymentURL = useCallback((_shopCardID, _profile, _totalAmount, _account, _address) => {
        var bodyData = {
            "MemberId": Tools.IsNull(profile) ? "" : props.accessToken.MemberID,
            "ShopcartId": _shopCardID,
            "Amount": _totalAmount,
            "Address": {
                "street": _profile.BillingAddress.street,
                "city": _profile.BillingAddress.city,
                "state": _profile.BillingAddress.state,
                "country": _profile.BillingAddress.country,
                "postalCode": _profile.BillingAddress.postalCode
            },
            "Account": {
                "firstName": _profile.FirstName,
                "lastName": _profile.LastName,
                "phone": _profile.Mobile,
                "email": _profile.Email
            }
        };
        fetch(WebServices.MainURL + WebServices.initskipcash, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                var responseObj = JSON.parse(responseJson);
                if (Tools.stringIsEmpty(responseObj.Error)) {
                    // Payment URL is handled by CheckOutPage now — this is dead code in StorePage
                    // but preserved for compatibility
                } else {
                    // Error handling preserved from original
                }
            }).catch((error) => {
                // Error handling preserved from original
            });
    }, [profile, props.accessToken]);

    // ─── API: Check Seat of Performance ──────────────────────────────────────────

    const checkSeatOfPerformance = useCallback(async (_shopCartInfo, _callback) => {
        i18n.translations = state.i18ntranslation;
        i18n.locale = global.locale;

        var removed = false;
        for (let index = 0; index < _shopCartInfo.Answer.ShopCart.Items.length; index++) {
            const element = _shopCartInfo.Answer.ShopCart.Items[index];
            if (element.PerformanceList != undefined && !Tools.IsNull(element.PerformanceList) && element.PerformanceList.length > 0) {
                var bodyData = {
                    "Command": "LoadSeatStatus",
                    "LoadSeatStatus": {
                        "HoldId": _shopCartInfo.Answer.ShopCart.HoldId,
                        "PerformanceId": element.PerformanceList[0].PerformanceId,
                    },
                };
                await fetch(WebServices.MainURL + WebServices.checkSeat, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyData)
                }, 5000)
                    .then((response) => response.text())
                    .then((responseJson) => {
                        let responseObj = JSON.parse(responseJson);
                        if (!Tools.IsNull(responseObj.Answer.LoadSeatStatus.SeatList) && responseObj.Answer.LoadSeatStatus.SeatList.length > 0 &&
                            responseObj.Answer.LoadSeatStatus.SeatList[0].QuantityFree > 0) {
                            // Seat available — do nothing
                        } else {
                            (removeShoppingCartVGSWait(element));
                            removed = true;
                        }
                    }).catch((error) => {
                        console.log('UPE Store' + error);
                        dispatch({
                            type: 'update_Cart',
                            stateIn: undefined
                        });
                    });
            }
        }
        if (removed) {
            Alert.alert(i18n.t('cartitemsadjusted'), '');
        }
        if (_callback != null && !removed) {
            let shopCart = _shopCartInfo;
            shopCart.random = Math.floor(Math.random() * 100000) + 1;
            dispatch({
                type: 'update_Cart',
                stateIn: shopCart
            });
            _callback();
        }
    }, [state.i18ntranslation, removeShoppingCartVGSWait, dispatch]);

    // ─── API: Set Item Account to Cart ───────────────────────────────────────────

    const setAccountToCart = useCallback((_shopcart, _profile, _totalVal, _LoadUpdate) => {
        var allItems = [];
        for (let index = 0; index < cartItems.length; index++) {
            if (cartItems[index].item.details != null) {
                if (cartItems[index].item.details.type == WebServices.topupCommand) {
                    let shopCartItem = getShopCartItem(cartItems[index].item.value, _shopcart);
                    for (let i = 0; i < cartItems[index].count; i++) {
                        allItems.push({
                            "ShopcartItemId": shopCartItem.ShopCartItemId,
                            "Position": i + 1,
                            "AccountId": cartItems[index].item.details.data.AccountId
                        });
                    }
                }
            }
        }

        var bodyData = {
            "ShopcartId": shopCartInfo == undefined ? "" : shopCartInfo.Answer.ShopCart.ShopCartId,
            "langIso": "en",
            "ShopCartItemAccounts": allItems
        };

        fetch(WebServices.MainURL + WebServices.setItemAccount, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }, 5000)
            .then((response) => response.text())
            .then((responseJson) => {
                validateShoppingCartVGS(_shopcart.Answer.ShopCart.ShopCartId, _profile, _totalVal, _LoadUpdate);
            }).catch((error) => {
                if (_LoadUpdate != null) {
                    _LoadUpdate(false);
                }
            });
    }, [cartItems, shopCartInfo, validateShoppingCartVGS]);

    // ─── Helper: getShopCartItem ─────────────────────────────────────────────────

    const getShopCartItem = (_item, _shopCart) => {
        for (let index = 0; index < _shopCart.Answer.ShopCart.Items.length; index++) {
            if (_item.Entity.ProductId == _shopCart.Answer.ShopCart.Items[index].ProductId) {
                return _shopCart.Answer.ShopCart.Items[index];
            }
        }
        return null;
    };

    // ─── Action: onProductAdd ────────────────────────────────────────────────────
    // Main add-to-cart handler called from product cards and ProductPage.
    // Checks product type first — redirects to ProductPage if needed.

    const onProductAdd = useCallback((_shopCartInfo, itemIn, priceIn, totalNo, check, additionalInfo, _profile, callback = false, template_Code = '', addonDetails = null) => {
        console.log('[STORE-DEBUG-09] onProductAdd', itemIn?.Entity?.ProductName);
        console.log('[STORE-DEBUG-CART-01] onProductAdd check:', {check, isVariable: checkIsVariable(itemIn), isInformative: checkInformativeProduct(itemIn), isAddon: checkAddonProduct(itemIn), isDate: checkDateProduct(itemIn), catalogNameExt: itemIn?.CatalogNameExt});
        i18n.translations = state.i18ntranslation;
        i18n.locale = global.locale;

        if (check) {
            if (checkInformativeProduct(itemIn)) {
                onProductSelect(itemIn);
                return;
            }
            if (checkAddonProduct(itemIn)) {
                onProductSelect(itemIn);
                return;
            }
            if (checkDateProduct(itemIn)) {
                onProductSelect(itemIn);
                return;
            }
            if (checkIsVariable(itemIn) != -1) {
                onProductSelect(itemIn);
                return;
            } else if ((itemIn.CatalogNameExt) == WebServices.topupCommand) {
                onProductSelect(itemIn);
                return;
            }
        }
        showInfoRef.current({ "textToDisplay": i18n.t('addedtocart') });
        console.log('[STORE-DEBUG-CART-02] Past type checks, adding to cart', {productId: itemIn?.Entity?.ProductId, productName: itemIn?.Entity?.ProductName, priceIn, totalNo, additionalInfo, filteredCartLength: cartItems.filter(itemSelect => ((itemIn.Entity.ProductId == itemSelect.item.value.Entity.ProductId && itemSelect.item.details == null && additionalInfo == null))).length});

        var cartItemsIn = cartItems;
        const tempCartItem = { item: { value: itemIn, details: additionalInfo }, count: totalNo };
        var filteredCart = cartItemsIn.filter(itemSelect => {
            return ((itemIn.Entity.ProductId == itemSelect.item.value.Entity.ProductId && itemSelect.item.details == null && additionalInfo == null));
        });

        if (filteredCart.length > 0) {
            filteredCart[0].count += totalNo;
            modifyShoppingCartVGS(_shopCartInfo, itemIn.Entity, totalNo);
        } else {
            cartItemsIn.push(tempCartItem);
            addtoShoppingCartVGS(tempCartItem, priceIn, totalNo, (dataIn) => {
                if (callback)
                    DeviceEventEmitter.emit("callbackProductPage", { p1: dataIn == "" ? cartItemsIn : "error" });
            });
        }
        setTotalItems(cartItemsIn.length);
        setCartItems(cartItemsIn);
        dispatch({
            type: 'update_CartItems',
            stateIn: cartItemsIn
        });
        console.log('[STORE-DEBUG-CART-06] Cart state updated', {cartItemsLength: cartItemsIn.length, totalItems: cartItemsIn.length});
        props.navigation.setParams({
            allproducts: cartItems,
        });
    }, [cartItems, state.i18ntranslation, onProductSelect, addtoShoppingCartVGS, modifyShoppingCartVGS, dispatch, props.navigation]);

    // ─── Action: onProductAddFolder ──────────────────────────────────────────────
    // Add-to-cart handler for folder products (called from ProductPage).

    const onProductAddFolder = useCallback((itemIn, totalNo, check, additionalInfo, _profile, callback = null) => {
        i18n.translations = state.i18ntranslation;
        i18n.locale = global.locale;

        if (check) {
            if (checkIsVariable(itemIn) != -1) {
                onProductSelect(itemIn);
                return;
            } else if ((itemIn.CatalogNameExt) == WebServices.topupCommand) {
                onProductSelect(itemIn);
                return;
            }
        }
        showInfoRef.current({ "textToDisplay": i18n.t('addedtocart') });

        var cartItemsIn = cartItems;
        const tempCartItem = { item: { value: itemIn, details: additionalInfo }, count: totalNo };

        cartItemsIn.push(tempCartItem);
        addtoShoppingCartVGS(tempCartItem, totalNo);

        setTotalItems(cartItemsIn.length);
        setCartItems(cartItemsIn);
        dispatch({
            type: 'update_CartItems',
            stateIn: cartItemsIn
        });
        props.navigation.setParams({
            allproducts: cartItems,
        });
        if (callback != null)
            callback(cartItemsIn);
    }, [cartItems, state.i18ntranslation, onProductSelect, addtoShoppingCartVGS, dispatch, props.navigation]);

    // ─── Action: removeItemfromCart ───────────────────────────────────────────────
    // Wrapper used by CartPage. Dispatches update_Cart then calls removeShoppingCartVGS.

    const removeItemfromCart = useCallback((_cartIn, _shopCartInfo, _producttoRemove) => {
        dispatch({
            type: 'update_Cart',
            stateIn: _shopCartInfo
        });
        removeShoppingCartVGS(_cartIn, _shopCartInfo, _producttoRemove);
    }, [dispatch, removeShoppingCartVGS]);

    // ─── Action: ModifyItemfromCart ───────────────────────────────────────────────
    // Wrapper used by CartPage.

    const ModifyItemfromCart = useCallback((_shopCartInfo, _producttoModify, _countIn) => {
        modifyShoppingCartVGS(_shopCartInfo, _producttoModify, _countIn);
    }, [modifyShoppingCartVGS]);

    // ─── Action: openCart ────────────────────────────────────────────────────────
    // Navigates to CartPage via StackActions.replace.

    const openCart = useCallback((_loading = true) => {
        console.log('[STORE-DEBUG-10] Opening cart', cartItems.length);
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
    }, [props.navigation, props.accessToken, profile, cartItems, shopCartInfo, AddCoupontoShoppingCartVGS, removeItemfromCart, ModifyItemfromCart]);

    // ─── Action: onCheckOut ──────────────────────────────────────────────────────
    // Checks seat availability then navigates to CheckOutPage.

    const onCheckOut = useCallback((_shopCartInfo) => {
        console.log('[STORE-DEBUG-11] Checkout initiated');
        checkSeatOfPerformance(_shopCartInfo, () => {
            props.navigation.navigate('CheckOutPage', {
                onDoneCart: onDoneCart,
                allproducts: cartItems,
                shopCartInfo: _shopCartInfo,
                mediaInfo: state.mediaInfo
            });

            DeviceEventEmitter.emit("setLoadingCart", { p1: false });
        });
    }, [checkSeatOfPerformance, props.navigation, cartItems, state.mediaInfo]);

    // ─── Action: onDoneCart ──────────────────────────────────────────────────────
    // Called after checkout completes. Clears all cart state.

    const onDoneCart = useCallback(() => {
        setTimeout(() => {
            setShopCartInfo(undefined);
            setCartItems([]);
            setTotalItems(0);
            dispatch({
                type: 'update_CartItems',
                stateIn: []
            });
            dispatch({
                type: 'update_Cart',
                stateIn: undefined
            });
            props.navigation.setParams({
                allproducts: [],
            });
        }, 500);
    }, [dispatch, props.navigation]);

    // ─── ShowInfo ref (wired by main orchestrator via bindSetShowInfo) ────────────
    // Uses useRef so the reference survives re-renders and is captured correctly
    // by useCallback closures.
    const showInfoRef = useRef(() => {});

    const bindSetShowInfo = useCallback((fn) => {
        showInfoRef.current = fn;
    }, []);

    // ─── Return ──────────────────────────────────────────────────────────────────

    return {
        // State
        cartItems,
        totalItems,
        shopCartInfo,

        // Actions
        onProductAdd,
        onProductAddFolder,
        removeItemfromCart,
        ModifyItemfromCart,
        openCart,
        onCheckOut,
        onDoneCart,
        AddCoupontoShoppingCartVGS,
        updateProducts,
        bindSetShowInfo,

        // Direct setters (needed by DeviceEventEmitter listener in main orchestrator)
        setCartItems,
        setTotalItems,
    };
}