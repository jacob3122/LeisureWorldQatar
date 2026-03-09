/**
 * StorePageHelpers.js
 * 
 * Utility functions extracted from StorePage.js:
 * - Translation helpers (product name, catalog name, generic translation)
 * - Price helpers (getPriceInfo, getItemCost, getInitCost, getPriceToShow)
 * - Badge rendering (getAllBadges)
 * - Product type checks (variable, informative, addon, date, URL)
 * 
 * All functions preserve the exact logic from the original StorePage.js.
 */

import React from 'react';
import { View } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import FastImage from '@d11/react-native-fast-image';
import * as Tools from '../../Tools/Components/Tools.js';
import WebServices from '../../Tools/constants/WebServices';

// ─── Translation Helpers ────────────────────────────────────────────────────────

/**
 * Generic translation lookup. Searches _Node array for matching LangISO.
 * Falls back to _default if provided, otherwise returns first translation.
 */
export const getTranslation = (_Node, _code, _default = null) => {
    if (Tools.IsNull(_Node)) {
        return "";
    }
    for (let t = 0; t < _Node.length; t++) {
        if (Tools.IsNull(_Node[t].LangISO)) {
            // skip entries without LangISO
        } else {
            if (Tools.stringIsContains(_code, _Node[t].LangISO)) {
                return _Node[t].Translation;
            }
        }
    }
    if (_default != null)
        return _default;
    return _Node[0].Translation;
};

/**
 * Returns translated catalog name based on current locale.
 */
export const getTranslatedCatalogName = (_Node, locale) => {
    return (Tools.stringIsContains(locale, 'ar')
        ? getTranslation(_Node.ITL_CatalogName, 'ar')
        : getTranslation(_Node.ITL_CatalogName, 'en', _Node.CatalogName));
};

/**
 * Returns translated product name. Uses Entity.ITL_ProductName if Entity exists,
 * otherwise falls back to catalog name translation.
 */
export const getTranslatedProductName = (_Node, locale) => {
    var name = Tools.IsNull(_Node.Entity)
        ? getTranslatedCatalogName(_Node, locale)
        : (Tools.stringIsContains(locale, 'ar')
            ? getTranslation(_Node.Entity.ITL_ProductName, 'ar')
            : getTranslation(_Node.Entity.ITL_ProductName, 'en', _Node.Entity.ProductName));
    return name;
};

/**
 * Returns translated product catalog name. Used for category chips.
 * Checks Entity first, then falls back to catalog name.
 */
export const getTranslatedProductCatalog = (_Node, locale) => {
    var name = Tools.IsNull(_Node.Entity)
        ? getTranslatedCatalogName(_Node, locale)
        : (Tools.stringIsContains(locale, 'ar')
            ? getTranslation(_Node.Entity.ITL_ProductName, 'ar')
            : getTranslation(_Node.Entity.ITL_ProductName, 'en'));
    return name;
};

/**
 * Returns translated event name from Entity.ITL_ProductName.
 */
export const getTranslatedEventName = (_Node, locale) => {
    var name = (Tools.stringIsContains(locale, 'ar')
        ? getTranslation(_Node.Entity.ITL_ProductName, 'ar')
        : getTranslation(_Node.Entity.ITL_ProductName, 'en', _Node.Entity.ProductName));
    return name;
};

/**
 * Checks if a translation exists for the given language code.
 */
export const getTranslationAvailable = (_Node, _code) => {
    if (Tools.IsNull(_Node)) {
        return false;
    }
    for (let t = 0; t < _Node.length; t++) {
        if (Tools.IsNull(_Node[t].LangISO)) {
            // skip
        } else {
            if (Tools.stringIsContains(_code, _Node[t].LangISO)) {
                return true;
            }
        }
    }
    return false;
};

// ─── Price Helpers ───────────────────────────────────────────────────────────────

/**
 * Extracts price info from product MetaDataList.
 * Checks for MultiLanguageText first (locale-aware), then falls back to PriceInfo MetaFieldCode.
 * Returns undefined if no price info found.
 */
export const getPriceInfo = (_product, locale) => {
    if (!Tools.IsNull(_product) && !Tools.IsNull(_product.Entity) && !Tools.IsNull(_product.Entity.MetaDataList)) {
        const metaData = _product.Entity.MetaDataList;
        for (let index = 0; index < metaData.length; index++) {
            const element = metaData[index];
            if (!Tools.IsNull(element.MultiLanguageText) && !Tools.IsNull(element.MultiLanguageText.TransList)) {
                var localeIn = Tools.stringIsContains(locale, "ar") ? "ar" : "en";
                return element.MultiLanguageText.TransList.filter((item) => item.LangISO == localeIn)[0].Translation;
            }
            if (Tools.stringIsContains(element.MetaFieldCode, WebServices.priceInfo)) {
                return element.Value;
            }
        }
    }
    return undefined;
};

/**
 * Returns the initial cost for variable products (products with SelectionType==3 attribute).
 * Adds base price + first option's OptionalPrice.
 */
export const getInitCost = (_product) => {
    if (_product != null && _product.Entity != null)
        for (let index = 0; index < _product.Entity.AttributeItemList.length; index++) {
            const element = _product.Entity.AttributeItemList[index];
            if (element.Active && element.SelectionType == 3) {
                return (_product.Entity.PriceDateList[0].PriceList[0].Value + element.OptionList[0].OptionalPrice);
            }
        }
    return 0;
};

/**
 * Returns the display cost for a regular product item.
 * Priority: PriceInfo metadata → variable product init cost → base PriceDateList value.
 */
export const getItemCost = (_itemIn, locale) => {
    let ValueIn = getPriceInfo(_itemIn, locale);
    let costIn = ValueIn != undefined
        ? ValueIn
        : (checkIsVariable(_itemIn) != -1
            ? getInitCost(_itemIn) + " QAR"
            : _itemIn.Entity.PriceDateList[0].PriceList[0].Value + " QAR");
    return costIn;
};

/**
 * Returns the display price for a folder/package item.
 * Uses PriceInfo of first child node, or falls back to first child's PriceDateList.
 */
export const getPriceToShow = (_Node, locale) => {
    let ValueIn = getPriceInfo(_Node.Nodes[0], locale);
    var name = ValueIn == undefined
        ? _Node.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value + " QAR"
        : ValueIn;
    return name;
};

// ─── Badge Helpers ───────────────────────────────────────────────────────────────

/**
 * Builds badge icon views from product's TagNames.
 * Tags containing "AppIcon-" are rendered as FastImage icons.
 * Position: top-right for LTR, top-left for RTL.
 * 
 * @param {object} _product - Product node with Entity.TagNames
 * @param {string} locale - Current locale string (e.g. 'en', 'ar')
 * @param {object} styles - StyleSheet containing productImage style
 * @returns {React.Element} Positioned View containing badge images
 */
export const getAllBadges = (_product, locale, styles) => {
    var localCheck = Tools.stringIsContains(locale, "ar") ? false : true;

    let allImages = [];
    let alltags = _product.Entity.TagNames.split(',');

    for (let index = 0; index < alltags.length; index++) {
        const element = alltags[index];
        if (Tools.stringIsContains(element, WebServices.AppIcon)) {
            allImages.push(
                <View key={`badge_${index}`}>
                    <FastImage
                        style={[styles.productImage, Tools.stringIsContains(locale, 'ar') ? {
                            left: widthPercentageToDP(-72),
                        } : {
                            right: 0,
                        }, {
                            width: widthPercentageToDP(25),
                            height: widthPercentageToDP(9),
                        }]}
                        source={{
                            uri: WebServices.MainURL + WebServices.AppIconUrl.replace("{file}", element.replace(WebServices.AppIcon, "") + "_" + (Tools.stringIsContains(locale, 'ar') ? 'ar' : 'en')),
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
            );
        }
    }
    return (
        <View style={[{ position: 'absolute', top: heightPercentageToDP(1) },
            localCheck ? { right: widthPercentageToDP(-1) } : { left: widthPercentageToDP(-1) }]}>
            {allImages}
        </View>
    );
};

// ─── Product Type Checks ─────────────────────────────────────────────────────────

/**
 * Checks if product is a variable product (has active AttributeItem with SelectionType==3).
 * Returns the index of the variable attribute, or -1 if not variable.
 */
export const checkIsVariable = (_productIn) => {
    if (_productIn != null && _productIn.Entity != null && _productIn.Entity.AttributeItemList != null)
        for (let index = 0; index < _productIn.Entity.AttributeItemList.length; index++) {
            const element = _productIn.Entity.AttributeItemList[index];
            if (element.Active && element.SelectionType == 3) {
                return index;
            }
        }
    return -1;
};

/**
 * Checks if product is informative-only (MetaData "infobol" == 1).
 * These products open ProductPage instead of adding to cart directly.
 */
export const checkInformativeProduct = (_product) => {
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

/**
 * Checks if product has add-on events (MetaData "AddOnEvents" not empty).
 */
export const checkAddonProduct = (_product) => {
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

/**
 * Checks if product requires a date selection (MetaData "onlnclndrrqrd" == 1).
 */
export const checkDateProduct = (_product) => {
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

/**
 * Checks if a product's share URL metadata contains the given URL.
 */
export const checkProductUrl = (_product, _url) => {
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

// ─── Catalog Lookup ──────────────────────────────────────────────────────────────

/**
 * Finds a store/venue node by CatalogId from the catalog root.
 * Used to pass catalogName when navigating to ProductPage.
 */
export const getCatalogName = (_productCatId, storeCatalog) => {
    if (Tools.IsNull(storeCatalog) || Tools.IsNull(storeCatalog.Nodes)) {
        return '';
    }
    for (let index = 0; index < storeCatalog.Nodes.length; index++) {
        const element = storeCatalog.Nodes[index];
        if (element.CatalogId == _productCatId) {
            return element;
        }
    }
    return '';
};