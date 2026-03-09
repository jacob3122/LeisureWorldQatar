/**
 * StorePageDeepLink.js
 *
 * Custom hook: useDeepLinkProduct
 *
 * Handles the deep link product opening flow from StorePage.js.
 *
 * Original flow (complex chain of useEffects + flags):
 *   1. openProductCode arrives from StateContext (deep link parsed in AppNavigation)
 *   2. [openProductCode] effect → checks SecureStore for accessToken
 *      - If logged in: calls OpenProductPageWeb directly
 *      - If not logged in: stores code in OpenProduct for later
 *   3. [OpenProduct] effect → calls OpenProductPageWeb if not empty
 *   4. [allProducts] effect → calls openProductInit which:
 *      - If openProductCode exists + changeRequired + logged in: opens product
 *      - Else if OpenProduct exists: opens product
 *   5. OpenProductPageWeb → iterates allProductsRandom, matches by EntityId or share URL
 *      → calls onProductSelect → clears OpenProduct
 *
 * The changeRequired flag handles the case where a deep link arrives
 * while the user is not logged in, then they log in (profile changes),
 * catalog re-fetches, allProducts updates, and THEN the product opens.
 *
 * This hook consolidates the 3 deep link useEffects into cleaner logic
 * while preserving the exact same behavior.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useContext } from 'react';
import * as Tools from '../../Tools/Components/Tools.js';
import SecureStore from '../../Tools/Components/SecureStore';
import { checkProductUrl } from './StorePageHelpers';
import { StateContext } from '../../Tools/context/ContextState';

/**
 * @param {object} params
 * @param {Array} params.allProducts - Current flat product list (from useStoreProducts)
 * @param {Array} params.allProductsRandom - Shuffled product list (from useStoreProducts)
 * @param {function} params.onProductSelect - Navigate to ProductPage for a product
 * @param {object} params.stateProfile - state.profile from AppReducer
 */
export default function useDeepLinkProduct({
    allProducts,
    allProductsRandom,
    onProductSelect,
    stateProfile,
}) {
    const { openProductCode, setOpenProductCode } = useContext(StateContext);

    const [OpenProduct, setOpenProduct] = useState('');
    const [changeRequired, setChangeRequired] = useState(false);

    // Refs to avoid stale closures in effects
    const allProductsRandomRef = useRef(allProductsRandom);
    allProductsRandomRef.current = allProductsRandom;

    const changeRequiredRef = useRef(changeRequired);
    changeRequiredRef.current = changeRequired;

    const openProductCodeRef = useRef(openProductCode);
    openProductCodeRef.current = openProductCode;

    const OpenProductRef = useRef(OpenProduct);
    OpenProductRef.current = OpenProduct;

    // ─── Core matching function ──────────────────────────────────────────────────
    // Iterates allProductsRandom to find a product matching by EntityId or share URL.
    // Calls onProductSelect and clears OpenProduct on match.
    // Exact same logic as original OpenProductPageWeb.

    const OpenProductPageWeb = useCallback((_OpenProduct) => {
        console.log('[STORE-DEBUG-15] Searching for product', _OpenProduct, allProductsRandomRef.current.length);
        let openItem = !Tools.stringIsEmpty(_OpenProduct) ? _OpenProduct.replaceAll('"', '') : '';
        if ((!Tools.stringIsEmpty(openItem))) {
            console.log(allProductsRandomRef.current.length + 'Open' + openItem);
            if (allProductsRandomRef.current != undefined && allProductsRandomRef.current.length > 0) {
                allProductsRandomRef.current.map((productIn, index) => {
                    if (!Tools.IsNull(productIn)) {
                        if ((!Tools.stringIsEmpty(openItem) && (openItem == productIn.EntityId || (!Tools.IsNull(productIn.Entity) && (checkProductUrl(productIn, openItem)))))) {
                            onProductSelect(productIn);
                            setOpenProduct('');
                            return;
                        }
                    }
                });
            }
        }
    }, [onProductSelect]);

    // ─── openProductInit ─────────────────────────────────────────────────────────
    // Called when allProducts changes. Checks conditions and opens product if ready.
    // Exact same logic as original openProductInit.

    const openProductInit = useCallback((_stateIn) => {
        console.log("_stateIn:" + _stateIn + "changeRequired" + changeRequiredRef.current);
        if (openProductCodeRef.current.length > 0 && changeRequiredRef.current && _stateIn) {
            OpenProductPageWeb(openProductCodeRef.current);
            setChangeRequired(false);
        } else if (!Tools.stringIsEmpty(OpenProductRef.current)) {
            OpenProductPageWeb(OpenProductRef.current);
        }
    }, [OpenProductPageWeb]);

    // ─── Effect: Set changeRequired when profile changes ─────────────────────────
    // Original [state.profile] effect sets changeRequired=true when profile exists.
    // This is separate from the catalog re-fetch (handled in useStoreProducts).

    useEffect(() => {
        if (!Tools.IsNull(stateProfile)) {
            console.log("Profile store" + stateProfile.Id);
            setChangeRequired(true);
        }
    }, [stateProfile]);

    // ─── Effect: Handle allProducts change ───────────────────────────────────────
    // Replaces original [allProducts] useEffect.
    // Checks SecureStore for accessToken, then calls openProductInit.

    useEffect(() => {
        SecureStore.getItemAsync('accessToken').then(savedPass => {
            if (savedPass != undefined && savedPass != null && savedPass.length > 0) {
                openProductInit(true);
            } else {
                openProductInit(false);
            }
        }).catch(error => {
            openProductInit(false);
        });
    }, [allProducts, openProductInit]);

    // ─── Effect: Handle openProductCode change (from deep link) ──────────────────
    // Replaces original [openProductCode] useEffect.
    // If logged in (accessToken in SecureStore): opens product directly.
    // If not logged in: stores code in OpenProduct for later opening.

    useEffect(() => {
        console.log('[STORE-DEBUG-14] Deep link code received', openProductCode);
        console.log(changeRequired + "//" + OpenProduct + "//" + openProductCode);
        SecureStore.getItemAsync('accessToken').then(savedPass => {
            console.log("save /" + savedPass);
            if (savedPass != undefined && savedPass != null && savedPass.length > 0) {
                OpenProductPageWeb(openProductCode);
            } else {
                if (Tools.stringIsEmpty(OpenProduct)) {
                    setOpenProduct(openProductCode);
                }
            }
        }).catch(error => {
            if (Tools.stringIsEmpty(OpenProduct)) {
                setOpenProduct(openProductCode);
            }
        });
    }, [openProductCode]);

    // ─── Effect: Handle OpenProduct change ───────────────────────────────────────
    // Replaces original [OpenProduct] useEffect.
    // When OpenProduct is set (from openProductCode when not logged in),
    // attempts to open the product.

    useEffect(() => {
        console.log(OpenProduct + "//OPEN");
        if (!Tools.stringIsEmpty(OpenProduct)) {
            console.log(OpenProduct + "//OPENIn");
            OpenProductPageWeb(OpenProduct);
        }
    }, [OpenProduct, OpenProductPageWeb]);

    // ─── Return ──────────────────────────────────────────────────────────────────

    return {
        OpenProduct,
        changeRequired,
        setOpenProduct,
        setChangeRequired,
    };
}