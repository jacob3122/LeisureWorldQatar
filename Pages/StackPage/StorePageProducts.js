/**
 * StorePageProducts.js
 * 
 * Custom hook: useStoreProducts
 * 
 * Owns all product-listing state and logic extracted from StorePage.js:
 * - Product list (allProducts, allProductsRandom, allProductCategory)
 * - Store filter (selectedStore, allStoresIn)
 * - Category filter (filterProductCategory, folderDesc)
 * - Search (sorttext, sortVisible)
 * - Catalog syncing from props (storeCatalog, isLoading, refreshing)
 * - Shuffle tracking (shuffled)
 * 
 * Consolidates the following original useEffects into fewer, clearer effects:
 * - [sorttext] → reparse
 * - [storeCatalog] → reparse
 * - [filterProductCategory, selectedStore] → reparse
 * - [props] → sync storeCatalog from props, trigger re-fetch on profile change
 * - [state.profile] → trigger catalog re-fetch
 * 
 * Does NOT own: cart state, deep link state, or navigation.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Keyboard } from 'react-native';
import * as Tools from '../../Tools/Components/Tools.js';
import { parseProductCatalog, extractStores } from './StorePageCatalogParser';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';

const i18n = new I18n(translations);

/**
 * @param {object} params
 * @param {object} params.props - Props from ProfileData (storeCatalog, fetchCatalog, profile)
 * @param {object} params.stateProfile - state.profile from AppReducer
 * @param {object} params.i18ntranslation - state.i18ntranslation from AppReducer
 */
export default function useStoreProducts({ props, stateProfile, i18ntranslation }) {

    // ─── State ───────────────────────────────────────────────────────────────────

    const [shuffled, setShuffled] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [allProductsRandom, setAllProductsRandom] = useState([]);
    const [allProductCategory, setAllProductCategory] = useState([]);
    const [filterProductCategory, setFilterProductCategory] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [sortVisible, setSortVisible] = useState(0);
    const [sorttext, setSorttext] = useState('');
    const [selectedStore, setSelectedStore] = useState(undefined);
    const [allStoresIn, setAllStoresIn] = useState([]);
    const [storeCatalog, setStoreCatalog] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [folderDesc, setFolderDesc] = useState(undefined);
    const [profile, setProfile] = useState(props.profile);

    // Ref to hold allProductsRandom for parseProductCatalog without stale closures
    const allProductsRandomRef = useRef(allProductsRandom);
    allProductsRandomRef.current = allProductsRandom;

    // Ref to hold shuffled for parseProductCatalog
    const shuffledRef = useRef(shuffled);
    shuffledRef.current = shuffled;

    // ─── Core reparse function ───────────────────────────────────────────────────

    const runParse = useCallback((_storeCatalog, _selectedStore, _filterProductCategory, _sorttext) => {
        console.log('[STORE-DEBUG-03] runParse called');
        i18n.translations = i18ntranslation;
        i18n.locale = global.locale;

        const result = parseProductCatalog({
            storeCatalog: _storeCatalog,
            selectedStore: _selectedStore == undefined ? '' : _selectedStore,
            filterProductCategory: _filterProductCategory,
            sorttext: _sorttext,
            shuffled: shuffledRef.current,
            allProductsRandom: allProductsRandomRef.current,
            locale: i18n.locale,
        });

        setAllProducts(result.allProducts);
        setAllProductCategory(result.allProductCategory);

        if (result.allProductsRandom !== allProductsRandomRef.current) {
            setAllProductsRandom(result.allProductsRandom);
        }

        if (result.shouldResetFilter) {
            setFilterProductCategory(undefined);
        }
    }, [i18ntranslation]);

    // ─── Effect 1: Sync catalog from props + extract stores ──────────────────────
    // Replaces the [props] useEffect's catalog-syncing portion and the
    // [props] profile-change detection.

    useEffect(() => {
        // Sync storeCatalog from props when it changes
        if (!Tools.IsNull(props.storeCatalog) && props.storeCatalog !== storeCatalog) {
            setIsLoading(false);
            setRefreshing(false);
            setStoreCatalog(props.storeCatalog);
            setSelectedStore('');

            // Extract stores for filter pills
            const stores = extractStores(props.storeCatalog);
            setAllStoresIn(stores);
            console.log('[STORE-DEBUG-04] Catalog synced from props, nodes:', props.storeCatalog?.Nodes?.length);
        }

        // If profile changed in props, re-fetch catalog
        if (props.profile !== profile && props.profile != undefined) {
            let getCatalog = props.fetchCatalog;
            getCatalog();
            setIsLoading(true);
            setRefreshing(true);
            setProfile(props.profile);
        }
    }, [props.storeCatalog, props.profile]);

    // ─── Effect 2: Re-fetch catalog when AppReducer profile changes ──────────────
    // Replaces the [state.profile] useEffect.

    useEffect(() => {
        console.log('[STORE-DEBUG-05] Profile change - refetching catalog');
        if (!Tools.IsNull(stateProfile)) {
            console.log("Profile store" + stateProfile.Id);
        }
        var getCatalog = props.fetchCatalog;
        setIsLoading(true);
        setRefreshing(true);
        getCatalog();
    }, [stateProfile]);

    // ─── Effect 3: Reparse products when catalog or filters change ───────────────
    // Consolidates [storeCatalog], [sorttext], [filterProductCategory, selectedStore]
    // into a single effect.

    useEffect(() => {
        if (!Tools.IsNull(storeCatalog) && !Tools.IsNull(storeCatalog.Nodes)) {
            console.log('[STORE-DEBUG-06] Reparse triggered');
            runParse(storeCatalog, selectedStore, filterProductCategory, sorttext);
        }
    }, [storeCatalog, selectedStore, filterProductCategory, sorttext, runParse]);

    // ─── Actions ─────────────────────────────────────────────────────────────────

    /**
     * Select a store filter pill.
     * @param {object|null} itemIn - Store node, or null for "All"
     * @param {string|null} index - CatalogId, or null for "All"
     */
    const onStoreSelect = useCallback((itemIn, index) => {
        setShuffled(true);
        setSelectedStore((index == null) ? '' : itemIn.CatalogId);
    }, []);

    /**
     * Toggle a category chip filter.
     * Also sets folderDesc from the category's RichDescList.
     * @param {object} itemIn - Category node object
     */
    const onCategorySelect = useCallback((itemIn) => {
        i18n.translations = i18ntranslation;
        i18n.locale = global.locale;

        const isSelected = filterProductCategory != undefined &&
            (itemIn.CatalogName == filterProductCategory.CatalogName);

        if (isSelected) {
            setFolderDesc(undefined);
        } else {
            var richtext = itemIn.RichDescList.filter((itemLang) =>
                (itemLang.LangISO === (Tools.stringIsContains(i18n.locale, "ar") ? "ar" : "en")));
            setFolderDesc(
                Tools.IsNull(itemIn.RichDescList)
                    ? undefined
                    : (richtext.length > 0 ? richtext[0].Description : undefined)
            );
        }

        setFilterProductCategory(
            (filterProductCategory != undefined && filterProductCategory.CatalogName == itemIn.CatalogName)
                ? undefined
                : itemIn
        );
    }, [filterProductCategory, i18ntranslation]);

    /**
     * Show search input and focus it.
     */
    const showSearch = useCallback((searchInputRef) => {
        if (searchInputRef && searchInputRef.current) {
            searchInputRef.current.focus();
        }
        setSortVisible(1);
    }, []);

    /**
     * Clear search input and hide it.
     */
    const clearSearch = useCallback(() => {
        Keyboard.dismiss();
        setTimeout(() => {
            setSortVisible(0);
            setSorttext('');
        }, 100);
    }, []);

    /**
     * Update search text.
     */
    const onSearchTextChange = useCallback((text) => {
        setSorttext(text);
    }, []);

    /**
     * Pull-to-refresh handler. Sets shuffled=true so next parse won't re-shuffle,
     * then triggers catalog re-fetch via props.fetchCatalog.
     */
    const refreshListView = useCallback(() => {
        setShuffled(true);
        var fetchCatalog = props.fetchCatalog;
        setIsLoading(true);
        setRefreshing(true);
        fetchCatalog();
    }, [props.fetchCatalog]);

    // ─── Return ──────────────────────────────────────────────────────────────────

    return {
        // State
        allProducts,
        allProductsRandom,
        allProductCategory,
        filterProductCategory,
        isLoading,
        sortVisible,
        sorttext,
        selectedStore,
        allStoresIn,
        storeCatalog,
        refreshing,
        folderDesc,
        profile,
        shuffled,

        // Actions
        onStoreSelect,
        onCategorySelect,
        showSearch,
        clearSearch,
        onSearchTextChange,
        refreshListView,

        // Direct setters (needed by deep link hook and main orchestrator)
        setIsLoading,
        setRefreshing,
        setShuffled,
        setProfile,
    };
}