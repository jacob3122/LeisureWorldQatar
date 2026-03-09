/**
 * StorePageProductCard.js
 *
 * Memoized product card component for the Store page FlatList.
 * Renders all 3 product card types + the description header.
 *
 * Card types (determined by CatalogType and EntityType):
 * - undefined (index 0) → Description text (folderDesc or i18n "storedesc")
 * - CatalogType 2 + EntityType 5 → Event card
 * - CatalogType 3 → Regular product card
 * - CatalogType 2 → Folder/package card
 *
 * Supports both viewType 0 (list) and viewType 1 (grid).
 *
 * All styles, dimensions, and layout preserved exactly from original
 * StorePage.js: addproductItem, addproductFolderItem, addproductEventItem.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import FastImage from '@d11/react-native-fast-image';
import WebServices from '../../Tools/constants/WebServices';
import {
    getTranslatedProductName,
    getTranslatedEventName,
    getItemCost,
    getPriceToShow,
    getPriceInfo,
    getAllBadges,
} from './StorePageHelpers';
import addcartIcon from '../../assets/Icons/cart.png';

/**
 * @param {object} props
 * @param {object|undefined} props.item - Product node, or undefined for description header
 * @param {number} props.index - FlatList index
 * @param {number} props.viewType - 0 = list, 1 = grid
 * @param {string} props.locale - Current locale (e.g. 'en', 'ar')
 * @param {object} props.Colors - Theme colors from useTheme()
 * @param {string|undefined} props.folderDesc - Rich description for selected category
 * @param {string} props.defaultDesc - Default description from i18n.t("storedesc")
 * @param {function} props.onProductSelect - Navigate to ProductPage (regular product)
 * @param {function} props.onProductSelectFolder - Navigate to ProductPage (folder/event)
 * @param {function} props.onProductSelectEvent - Navigate to ProductPage (event)
 * @param {function} props.onProductAdd - Add product to cart (regular product cart icon tap)
 * @param {object|undefined} props.shopCartInfo - Current shopping cart info
 * @param {object|undefined} props.profile - Current user profile
 */
const StorePageProductCard = ({
    item,
    index,
    viewType,
    locale,
    Colors,
    folderDesc,
    defaultDesc,
    onProductSelect,
    onProductSelectFolder,
    onProductSelectEvent,
    onProductAdd,
    shopCartInfo,
    profile,
}) => {
    // ─── Description header (index 0, item is undefined) ─────────────────────────

    if (item == undefined) {
        return (
            <View>
                <Text allowFontScaling={false} style={descStyles(Colors).storedesc}>
                    {folderDesc != undefined ? folderDesc : defaultDesc}
                </Text>
            </View>
        );
    }

    // ─── Event card (CatalogType 2 + EntityType 5) ───────────────────────────────

    if (item.CatalogType == 2 && item.EntityType == 5) {
        let priceInfo = getPriceInfo(item.Nodes[0], locale);
        return (
            <View>
                <TouchableOpacity
                    style={[cardStyles(Colors).products, viewType == 0 ? {
                        width: widthPercentageToDP(95),
                        margin: 10,
                    } : {
                        width: widthPercentageToDP(37),
                        margin: 10,
                    }]}
                    onPress={() => { onProductSelectEvent(item); }}
                >
                    <View style={[cardStyles(Colors).productImage, {
                        width: widthPercentageToDP(viewType == 0 ? 95 : 37),
                        height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37),
                    }]}>
                        {item.Entity.ProfilePictureId != null && <FastImage
                            style={[cardStyles(Colors).productImage, {
                                width: widthPercentageToDP(viewType == 0 ? 95 : 37),
                                height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37),
                            }]}
                            source={{
                                uri: WebServices.MainURL + item.Entity.ProfilePictureId,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />}
                    </View>

                    <View style={[{
                        flexDirection: 'row',
                        backgroundColor: Colors.whiteColor,
                        height: widthPercentageToDP(viewType == 0 ? 15.5 : 9.5),
                        width: '100%',
                        borderBottomLeftRadius: widthPercentageToDP(3),
                        borderBottomRightRadius: widthPercentageToDP(3),
                        overflow: 'hidden'
                    }]}>
                        <View style={{ flexDirection: 'row', width: '80%' }}>
                            <View style={{ flexDirection: 'column', width: '100%' }}>
                                <Text allowFontScaling={false} numberOfLines={1} style={[cardStyles(Colors).productText, {
                                    fontSize: (viewType == 0 ? widthPercentageToDP(4) : widthPercentageToDP(3.5)),
                                }]}>
                                    {getTranslatedEventName(item, locale)}
                                </Text>
                                <Text allowFontScaling={false} style={[cardStyles(Colors).productText, {
                                    fontSize: (viewType == 0 ? widthPercentageToDP(4.5) : widthPercentageToDP(3.5)),
                                }]}>
                                    {priceInfo == undefined
                                        ? item.Nodes[0].Entity.PriceDateList[0].PriceList[0].Value + " QAR"
                                        : priceInfo}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[cardStyles(Colors).cartButtonwithIcon, { end: 0 }]}
                            onPress={() => { onProductSelectFolder(item); }}
                        >
                            <Image
                                style={[cardStyles(Colors).addtoCart, {
                                    height: (viewType == 0 ? 30 : 25),
                                    width: (viewType == 0 ? 30 : 25),
                                }]}
                                resizeMode='contain'
                                source={addcartIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // ─── Regular product card (CatalogType 3) ────────────────────────────────────

    if (item.CatalogType == 3) {
        return (
            <View>
                <TouchableOpacity
                    style={[cardStyles(Colors).products, viewType == 0 ? {
                        width: widthPercentageToDP(95),
                        margin: 10,
                    } : {
                        width: widthPercentageToDP(37),
                        margin: 10,
                    }]}
                    onPress={() => { onProductSelect(item); }}
                >
                    <View style={[cardStyles(Colors).productImage, {
                        width: widthPercentageToDP(viewType == 0 ? 95 : 37),
                        height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37),
                    }]}>
                        {item.ProfilePictureId != null && <FastImage
                            style={[cardStyles(Colors).productImage, {
                                width: widthPercentageToDP(viewType == 0 ? 95 : 37),
                                height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37),
                            }]}
                            source={{
                                uri: WebServices.MainURL + item.Entity.ProfilePictureId,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />}
                        {getAllBadges(item, locale, cardStyles(Colors))}
                    </View>

                    <View style={[{
                        flexDirection: 'row',
                        backgroundColor: Colors.whiteColor,
                        height: widthPercentageToDP(viewType == 0 ? 15.5 : 9.5),
                        width: '100%',
                        overflow: 'hidden',
                        borderBottomLeftRadius: widthPercentageToDP(3),
                        borderBottomRightRadius: widthPercentageToDP(3)
                    }]}>
                        <View style={{ flexDirection: 'row', width: '80%', height: '100%' }}>
                            <View style={{ flexDirection: 'column', width: '100%', height: '100%' }}>
                                <Text allowFontScaling={false} numberOfLines={1} style={[cardStyles(Colors).productText, {
                                    fontSize: (viewType == 0 ? widthPercentageToDP(4) : widthPercentageToDP(3.5)),
                                }]}>
                                    {getTranslatedProductName(item, locale)}
                                </Text>
                                <Text allowFontScaling={false} style={[cardStyles(Colors).productText, {
                                    fontSize: widthPercentageToDP(viewType == 0 ? 4.5 : 3.5),
                                }]}>
                                    {getItemCost(item, locale)}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[cardStyles(Colors).cartButtonwithIcon, { end: 0 }]}
                            onPress={() => {
                                onProductAdd(shopCartInfo, item, getItemCost(item, locale), 1, true, null, profile);
                            }}
                        >
                            <Image
                                style={[cardStyles(Colors).addtoCart, {
                                    height: (viewType == 0 ? 30 : 25),
                                    width: (viewType == 0 ? 30 : 25),
                                }]}
                                resizeMode='contain'
                                source={addcartIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // ─── Folder/package card (CatalogType 2) ─────────────────────────────────────

    if (item.CatalogType == 2) {
        return (
            <View>
                <TouchableOpacity
                    style={[cardStyles(Colors).products, viewType == 0 ? {
                        width: widthPercentageToDP(95),
                        margin: 10,
                    } : {
                        width: widthPercentageToDP(37),
                        margin: 10,
                    }]}
                    onPress={() => { onProductSelectFolder(item); }}
                >
                    <View style={[cardStyles(Colors).productImage, {
                        width: widthPercentageToDP(viewType == 0 ? 95 : 37),
                        height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37),
                    }]}>
                        {item.ProfilePictureId != null && <FastImage
                            style={[cardStyles(Colors).productImage, {
                                width: widthPercentageToDP(viewType == 0 ? 95 : 37),
                                height: viewType == 0 ? (widthPercentageToDP(95) / 1.69) : heightPercentageToDP(37),
                            }]}
                            source={{
                                uri: WebServices.MainURL + item.ProfilePictureId,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />}
                    </View>

                    <View style={[{
                        flexDirection: 'row',
                        backgroundColor: Colors.whiteColor,
                        height: widthPercentageToDP(viewType == 0 ? 15.5 : 9.5),
                        width: '100%',
                        borderBottomLeftRadius: widthPercentageToDP(3),
                        borderBottomRightRadius: widthPercentageToDP(3),
                        overflow: 'hidden'
                    }]}>
                        <View style={{ flexDirection: 'row', width: '80%' }}>
                            <View style={{ flexDirection: 'column', width: '100%' }}>
                                <Text allowFontScaling={false} numberOfLines={1} style={[cardStyles(Colors).productText, {
                                    fontSize: (viewType == 0 ? widthPercentageToDP(4) : widthPercentageToDP(3.5)),
                                }]}>
                                    {getTranslatedProductName(item, locale)}
                                </Text>
                                <Text allowFontScaling={false} style={[cardStyles(Colors).productText, {
                                    fontSize: (viewType == 0 ? widthPercentageToDP(4.5) : widthPercentageToDP(3.5)),
                                }]}>
                                    {getPriceToShow(item, locale)}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[cardStyles(Colors).cartButtonwithIcon, { end: 0 }]}
                            onPress={() => { onProductSelectFolder(item); }}
                        >
                            <Image
                                style={[cardStyles(Colors).addtoCart, {
                                    height: (viewType == 0 ? 30 : 25),
                                    width: (viewType == 0 ? 30 : 25),
                                }]}
                                resizeMode='contain'
                                source={addcartIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // Fallback — should not reach here
    return null;
};

// ─── Styles ──────────────────────────────────────────────────────────────────────
// Extracted from original StorePage StyleSheet.create, scoped to card rendering.
// Takes Colors as parameter since useTheme() can't be called outside a component.

const cardStyles = (Colors) => StyleSheet.create({
    products: {
        backgroundColor: Colors.bgColor,
        borderRadius: widthPercentageToDP(3),
    },
    productImage: {
        height: widthPercentageToDP(90),
        width: widthPercentageToDP(90),
        resizeMode: 'contain',
        bottom: 0,
        borderTopLeftRadius: widthPercentageToDP(3),
        borderTopRightRadius: widthPercentageToDP(3),
    },
    productText: {
        includeFontPadding: false,
        width: '95%',
        color: Colors.black,
        textAlign: 'left',
        marginStart: widthPercentageToDP(3),
        marginTop: widthPercentageToDP(0.5),
        fontFamily: 'Cairo-SemiBold',
        fontSize: widthPercentageToDP(5),
        lineHeight: widthPercentageToDP(7),
        flexWrap: 'wrap',
    },
    addtoCart: {
        position: 'absolute',
        tintColor: Colors.blueColor,
        alignSelf: 'center',
        height: 35,
        width: 35,
    },
    cartButtonwithIcon: {
        flex: 1,
        borderBottomRightRadius: widthPercentageToDP(3),
        justifyContent: 'center',
    },
});

const descStyles = (Colors) => StyleSheet.create({
    storedesc: {
        includeFontPadding: false,
        color: Colors.black,
        width: widthPercentageToDP(92),
        textAlign: 'left',
        fontFamily: 'Cairo-Regular',
        fontSize: widthPercentageToDP(3.75),
        lineHeight: widthPercentageToDP(3.75) * 1.5,
        flexWrap: 'wrap',
        alignSelf: 'center',
    },
});

// ─── Memoization ─────────────────────────────────────────────────────────────────
// Memoize to prevent unnecessary re-renders in FlatList.
// Compares by item reference, viewType, locale, and folderDesc.

export default React.memo(StorePageProductCard, (prevProps, nextProps) => {
    return (
        prevProps.item === nextProps.item &&
        prevProps.viewType === nextProps.viewType &&
        prevProps.locale === nextProps.locale &&
        prevProps.folderDesc === nextProps.folderDesc &&
        prevProps.totalItems === nextProps.totalItems &&
        prevProps.shopCartInfo === nextProps.shopCartInfo
    );
});