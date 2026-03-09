/**
 * StorePage.js
 *
 * Main orchestrator for the Store page.
 * Wires together:
 * - useStoreProducts (product list, filters, search, catalog sync)
 * - useCartOperations (cart state, VGS API calls)
 * - useDeepLinkProduct (deep link product opening)
 * - StorePageHeader (search bar + cart icon)
 * - StorePageFilters (venue pills + category chips)
 * - StorePageProductList (FlatList with product cards)
 * - StorePageSkeleton (loading state)
 *
 * Owns:
 * - ShowInfo state (InfoBar toast)
 * - showLogin state (login modal)
 * - viewType state (list/grid, default 0, no toggle UI)
 * - Navigation functions (onProductSelect, onProductSelectEvent, onProductSelectFolder)
 * - DeviceEventEmitter listeners (updateProfile, updateProducts)
 * - useFocusEffect (screen view analytics)
 * - i18n locale sync
 *
 * Props interface from ProfileData (unchanged):
 * - profile, navigation, assignProfile, updateLoading,
 *   accessToken, isLoading, fetchCatalog, storeCatalog
 */

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
    View,
    SafeAreaView,
    Platform,
    StatusBar,
    DeviceEventEmitter,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';

import * as Tools from '../../Tools/Components/Tools.js';
import WebServices from '../../Tools/constants/WebServices';
import ProfileData from '../../Tools/Components/ProfileData';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';
import { StateContext } from '../../Tools/context/ContextState';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';

import useStoreProducts from './StorePageProducts';
import useCartOperations from './StorePageCartOps';
import useDeepLinkProduct from './StorePageDeepLink';
import { getCatalogName } from './StorePageHelpers';

import StorePageHeader from './StorePageHeader';
import StorePageFilters from './StorePageFilters';
import StorePageProductList from './StorePageProductList';
import StorePageSkeleton from './StorePageSkeleton';

const i18n = new I18n(translations);

export default function StorePage(props) {
    console.log('[STORE-DEBUG-17] StorePage render');

    const { bottomBar, setBottomBar } = useContext(StateContext);
    const Colors = useTheme();
    const { state, dispatch } = useAppContext();

    // ─── i18n sync ───────────────────────────────────────────────────────────────

    i18n.translations = state.i18ntranslation;

    useEffect(() => {
        i18n.locale = global.locale;
    }, [global.locale]);

    // ─── Own state ───────────────────────────────────────────────────────────────

    const [ShowInfo, setShowInfo] = useState(undefined);
    const [showLogin, setShowLogin] = useState(false);
    const [viewType, setViewType] = useState(0);

    // ─── Refs ────────────────────────────────────────────────────────────────────

    const mainScrollRef = useRef(null);
    const searchInputRef = useRef(null);

    // Refs for cart operations — needed by navigation functions to avoid
    // circular dependency (onProductSelect needs cartOps, cartOps needs onProductSelect).
    // Refs are updated in an effect after cartOps is created.
    const cartOpsRef = useRef({
        onProductAdd: () => {},
        openCart: () => {},
        cartItems: [],
    });

    // ─── Hook: useStoreProducts ──────────────────────────────────────────────────

    const products = useStoreProducts({
        props,
        stateProfile: state.profile,
        i18ntranslation: state.i18ntranslation,
    });

    // ─── Navigation functions ────────────────────────────────────────────────────
    // Defined here because they need products.allProductsRandom, products.profile,
    // products.storeCatalog, and are passed to both useCartOperations and components.

    const onProductSelect = useCallback((itemIn) => {
        var selectedProduct = itemIn;
        var filteredProducts = [];
        for (let index = 0; index < products.allProductsRandom.length; index++) {
            const element = products.allProductsRandom[index];
            if (!Tools.IsNull(element) && !Tools.IsNull(element.Entity)) {
                var elements = [];
                elements = selectedProduct.Entity.MetaDataList.filter((meteD) =>
                    (meteD.MetaFieldCode === WebServices.relatedProduct));
                if (elements.length > 0) {
                    const elementsValue = elements[0].Value.split(',');
                    filteredProducts = products.allProductsRandom.filter(itemIn1 =>
                        elementsValue.some(element => !Tools.IsNull(itemIn1) && !Tools.IsNull(itemIn1.Entity) && itemIn1.Entity.ProductId === element)
                    );
                }
            }
        }

        props.navigation.navigate('ProductPage', {
            screen: "",
            accessToken: props.accessToken,
            profile: products.profile,
            addtoCart: cartOpsRef.current.onProductAdd,
            product: selectedProduct,
            catalogName: getCatalogName(selectedProduct.ParentCatalogId, products.storeCatalog),
            allproducts: cartOpsRef.current.cartItems,
            openProductIn: onProductSelect,
            catalogProducts: filteredProducts,
            gotoCart: cartOpsRef.current.openCart
        });
    }, [products.allProductsRandom, products.profile, products.storeCatalog, props.navigation, props.accessToken]);

    const onProductSelectEvent = useCallback((itemIn) => {
        var selectedProduct = itemIn;
        var filteredProducts = [];

        props.navigation.navigate('ProductPage', {
            screen: "",
            accessToken: props.accessToken,
            profile: products.profile,
            addtoCart: cartOpsRef.current.onProductAdd,
            product: selectedProduct,
            openProductIn: onProductSelect,
            catalogName: getCatalogName(selectedProduct.ParentCatalogId, products.storeCatalog),
            allproducts: cartOpsRef.current.cartItems,
            catalogProducts: filteredProducts,
            gotoCart: cartOpsRef.current.openCart
        });
    }, [products.profile, products.storeCatalog, props.navigation, props.accessToken]);

    const onProductSelectFolder = useCallback((itemIn) => {
        var selectedProduct = itemIn;
        var filteredProducts = [];

        props.navigation.navigate('ProductPage', {
            screen: "",
            accessToken: props.accessToken,
            profile: products.profile,
            addtoCart: cartOpsRef.current.onProductAdd,
            product: selectedProduct,
            openProductIn: onProductSelect,
            catalogName: getCatalogName(selectedProduct.ParentCatalogId, products.storeCatalog),
            allproducts: cartOpsRef.current.cartItems,
            catalogProducts: filteredProducts,
            gotoCart: cartOpsRef.current.openCart
        });
    }, [products.profile, products.storeCatalog, props.navigation, props.accessToken]);

    // ─── Hook: useCartOperations ─────────────────────────────────────────────────

    const cartOps = useCartOperations({
        props,
        state,
        dispatch,
        onProductSelect,
        profile: products.profile,
    });

    // Keep cartOpsRef in sync so navigation functions always have latest cart values
    cartOpsRef.current = {
        onProductAdd: cartOps.onProductAdd,
        openCart: cartOps.openCart,
        cartItems: cartOps.cartItems,
    };

    // Wire up ShowInfo toast
    useEffect(() => {
        cartOps.bindSetShowInfo(setShowInfo);
    }, [cartOps.bindSetShowInfo]);

    // ─── Hook: useDeepLinkProduct ────────────────────────────────────────────────

    const deepLink = useDeepLinkProduct({
        allProducts: products.allProducts,
        allProductsRandom: products.allProductsRandom,
        onProductSelect,
        stateProfile: state.profile,
    });

    // ─── DeviceEventEmitter listeners ────────────────────────────────────────────
    // Replaces original [] mount effect.

    useEffect(() => {
        console.log('[STORE-DEBUG-18] Event listeners mounted');
        const updateProfileListener = DeviceEventEmitter.addListener("updateProfile", () => {
            if (props != undefined) {
                props.navigation.setParams({
                    profile: products.profile,
                });
            }
        });

        const updateProductsListener = DeviceEventEmitter.addListener("updateProducts", ({ p1 }) => {
            cartOps.updateProducts(p1);
        });

        return () => {
            updateProfileListener.remove();
            updateProductsListener.remove();
        };
    }, []);

    // ─── useFocusEffect — screen view analytics ─────────────────────────────────

    useFocusEffect(
        useCallback(() => {
            console.log('[STORE-DEBUG-19] StorePage focused');
            console.log("Rest");
            logScreenViewEvent('StorePage', 'Store');
        }, [])
    );

    // ─── ShowInfo auto-clear ─────────────────────────────────────────────────────
    // InfoBar component handles its own dismissal, but we need to clear state.

    const onDoneInfo = useCallback(() => {
        setShowInfo(undefined);
    }, []);

    // ─── Search action wrappers (pass ref) ───────────────────────────────────────

    const handleShowSearch = useCallback(() => {
        products.showSearch(searchInputRef);
    }, [products.showSearch]);

    // ─── Cart press wrapper ──────────────────────────────────────────────────────

    const handleCartPress = useCallback(() => {
        cartOps.openCart(false);
    }, [cartOps.openCart]);

    // ─── Render ──────────────────────────────────────────────────────────────────

    console.log('[STORE-DEBUG-20] StorePage rendering JSX', {isLoading: products.isLoading, productsCount: products.allProducts.length, totalItems: cartOps.totalItems});
    return (
        <SafeAreaView style={{
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : '11%',
            backgroundColor: Colors.bgColor
        }}>
            {showLogin && (
                <ProfileData
                    pagetogo='signinuser'
                    showsignin='1'
                    navigation={props.navigation}
                    onDismiss={() => setShowLogin(false)}
                />
            )}
            <BackgroundWall />

            {products.isLoading && <StorePageSkeleton Colors={Colors} />}

            {!products.isLoading && <>
                <StorePageHeader
                    sorttext={products.sorttext}
                    sortVisible={products.sortVisible}
                    totalItems={cartOps.totalItems}
                    Colors={Colors}
                    searchInputRef={searchInputRef}
                    onSearchTextChange={products.onSearchTextChange}
                    onShowSearch={handleShowSearch}
                    onClearSearch={products.clearSearch}
                    onCartPress={handleCartPress}
                />

                <StorePageFilters
                    allStoresIn={products.allStoresIn}
                    selectedStore={products.selectedStore}
                    allProductCategory={products.allProductCategory}
                    filterProductCategory={products.filterProductCategory}
                    locale={global.locale}
                    Colors={Colors}
                    allLabel={i18n.t('all')}
                    onStoreSelect={products.onStoreSelect}
                    onCategorySelect={products.onCategorySelect}
                    mainScrollRef={mainScrollRef}
                />

                <StorePageProductList
                    allProducts={products.allProducts}
                    viewType={viewType}
                    locale={global.locale}
                    Colors={Colors}
                    folderDesc={products.folderDesc}
                    defaultDesc={i18n.t("storedesc")}
                    refreshing={products.refreshing}
                    onRefresh={products.refreshListView}
                    onProductSelect={onProductSelect}
                    onProductSelectFolder={onProductSelectFolder}
                    onProductSelectEvent={onProductSelectEvent}
                    onProductAdd={cartOps.onProductAdd}
                    shopCartInfo={cartOps.shopCartInfo}
                    totalItems={cartOps.totalItems}
                    profile={products.profile}
                    mainScrollRef={mainScrollRef}
                />
            </>}
        </SafeAreaView>
    );
}