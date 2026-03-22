/**
 * StorePageFilters.js
 *
 * Two horizontal filter rows for the Store page:
 * 1. Store/venue pills — "All" + each venue from allStoresIn
 * 2. Category sub-filter chips — from allProductCategory
 *
 * Extracted from original StorePage.js: getStores(), addstoreItem(),
 * getProductCategory(), addproductCategoryItem() and their ScrollView wrappers.
 *
 * All styles, dimensions, selection states, and behavior preserved exactly.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { getTranslatedProductName, getTranslatedProductCatalog } from './StorePageHelpers';

/**
 * @param {object} props
 * @param {Array} props.allStoresIn - Array of store/venue node objects
 * @param {string|undefined} props.selectedStore - Selected store CatalogId, or '' for all
 * @param {Array} props.allProductCategory - Array of category node objects
 * @param {object|undefined} props.filterProductCategory - Selected category object
 * @param {string} props.locale - Current locale
 * @param {object} props.Colors - Theme colors from useTheme()
 * @param {string} props.allLabel - i18n.t('all') text
 * @param {function} props.onStoreSelect - Called with (itemIn, index) for store pill tap
 * @param {function} props.onCategorySelect - Called with (itemIn) for category chip tap
 * @param {object} props.mainScrollRef - Ref to FlatList for scrollToOffset on filter change
 */
const StorePageFilters = ({
    allStoresIn,
    selectedStore,
    allProductCategory,
    filterProductCategory,
    locale,
    Colors,
    allLabel,
    onStoreSelect,
    onCategorySelect,
    mainScrollRef,
    viewType,
    onToggleView,
}) => {

    // ─── Store pill renderer ─────────────────────────────────────────────────────

    const renderStorePill = (itemIn, index) => {
        let indexIn = itemIn != null ? itemIn.CatalogId : '';
        return (
            <TouchableOpacity
                key={itemIn != null ? itemIn.CatalogId : 'all'}
                style={[filterStyles(Colors).stores,
                    indexIn == selectedStore
                        ? {
                            borderColor: Colors.whiteColor,
                            backgroundColor: Colors.blueColor,
                            borderRadius: 40,
                            paddingHorizontal: widthPercentageToDP(3)
                        }
                        : { borderColor: Colors.inputfontColor }
                ]}
                onPress={() => {
                    onStoreSelect(itemIn, index);
                    mainScrollRef.current?.scrollToOffset({
                        y: 0, animated: true
                    });
                }}
            >
                <Text
                    allowFontScaling={false}
                    style={[filterStyles(Colors).storetitle,
                        (indexIn == selectedStore)
                            ? { color: Colors.whiteColor }
                            : { color: Colors.black }
                    ]}
                >
                    {itemIn == null ? allLabel : getTranslatedProductName(itemIn, locale)}
                </Text>
            </TouchableOpacity>
        );
    };

    // ─── Category chip renderer ──────────────────────────────────────────────────

    const renderCategoryChip = (itemIn, index) => {
        let CheckBool = filterProductCategory != undefined &&
            (itemIn.CatalogName == filterProductCategory.CatalogName);
        return (
            <TouchableOpacity
                key={itemIn.CatalogId || itemIn.CatalogName + '_' + index}
                style={[{ margin: 5 },
                    CheckBool
                        ? {
                            borderColor: Colors.whiteColor,
                            backgroundColor: Colors.blueColor,
                            borderRadius: 40,
                            paddingHorizontal: widthPercentageToDP(2)
                        }
                        : {
                            borderColor: Colors.inputfontColor,
                            borderWidth: 1,
                            borderRadius: 40,
                            paddingHorizontal: widthPercentageToDP(2)
                        }
                ]}
                onPress={() => {
                    onCategorySelect(itemIn);
                    mainScrollRef.current?.scrollToOffset({
                        y: 0, animated: true
                    });
                }}
            >
                <Text
                    allowFontScaling={false}
                    style={[filterStyles(Colors).storetitle,
                        { fontSize: widthPercentageToDP(3.25) },
                        (CheckBool)
                            ? { color: Colors.whiteColor }
                            : { color: Colors.black }
                    ]}
                >
                    {itemIn == null ? allLabel : getTranslatedProductCatalog(itemIn, locale)}
                </Text>
            </TouchableOpacity>
        );
    };

    // ─── Build store pills array ─────────────────────────────────────────────────

    const getStores = () => {
        let allStores = [];
        allStoresIn.map((itemIn, index) => {
            if (index == 0) {
                allStores.push(renderStorePill(null, null));
            }
            allStores.push(renderStorePill(itemIn, itemIn.CatalogId));
        });
        return allStores;
    };

    // ─── Build category chips array ──────────────────────────────────────────────

    const getProductCategory = () => {
        let allCategories = [];
        allProductCategory.map((itemIn, index) => {
            allCategories.push(renderCategoryChip(itemIn, index));
        });
        return allCategories;
    };

    // ─── Render ──────────────────────────────────────────────────────────────────

    return (
        <View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={filterStyles(Colors).homeView}
            >
                <View style={filterStyles(Colors).inner}>
                    {getStores()}
                </View>
            </ScrollView>
            <ScrollView
                pagingEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingEnd: widthPercentageToDP(2) }}
                style={[filterStyles(Colors).homeView, {
                    paddingStart: widthPercentageToDP(2),
                    paddingEnd: widthPercentageToDP(5),
                    marginTop: -heightPercentageToDP(1)
                }]}
            >
                {getProductCategory()}
            </ScrollView>
            <View style={filterStyles(Colors).toggleRow}>
                <TouchableOpacity onPress={onToggleView} style={filterStyles(Colors).toggleButton}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[filterStyles(Colors).toggleIcon, viewType === 0 && { backgroundColor: Colors.blueColor }]}>
                            <View style={filterStyles(Colors).listIconInner}>
                                <View style={[filterStyles(Colors).listLine, viewType === 0 && { backgroundColor: Colors.whiteColor }]} />
                                <View style={[filterStyles(Colors).listLine, viewType === 0 && { backgroundColor: Colors.whiteColor }]} />
                                <View style={[filterStyles(Colors).listLine, viewType === 0 && { backgroundColor: Colors.whiteColor }]} />
                            </View>
                        </View>
                        <View style={[filterStyles(Colors).toggleIcon, { marginStart: 6 }, viewType === 1 && { backgroundColor: Colors.blueColor }]}>
                            <View style={filterStyles(Colors).gridIconInner}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[filterStyles(Colors).gridBox, viewType === 1 && { backgroundColor: Colors.whiteColor }]} />
                                    <View style={[filterStyles(Colors).gridBox, { marginStart: 3 }, viewType === 1 && { backgroundColor: Colors.whiteColor }]} />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                    <View style={[filterStyles(Colors).gridBox, viewType === 1 && { backgroundColor: Colors.whiteColor }]} />
                                    <View style={[filterStyles(Colors).gridBox, { marginStart: 3 }, viewType === 1 && { backgroundColor: Colors.whiteColor }]} />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const filterStyles = (Colors) => StyleSheet.create({
    stores: {
        margin: 10,
        justifyContent: 'center'
    },
    storetitle: {
        fontFamily: 'Cairo-Regular',
        fontSize: 18,
        color: Colors.black,
        alignSelf: 'center',
        includeFontPadding: false
    },
    homeView: {
    },
    inner: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        alignContent: 'space-between'
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingEnd: widthPercentageToDP(4),
        marginTop: heightPercentageToDP(0.5),
        marginBottom: heightPercentageToDP(0.5),
    },
    toggleButton: {
        padding: 4,
    },
    toggleIcon: {
        width: 28,
        height: 28,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.blueColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listIconInner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listLine: {
        width: 14,
        height: 2.5,
        backgroundColor: Colors.blueColor,
        borderRadius: 1,
        marginVertical: 1.5,
    },
    gridIconInner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridBox: {
        width: 8,
        height: 8,
        backgroundColor: Colors.blueColor,
        borderRadius: 2,
    },
});

export default React.memo(StorePageFilters);