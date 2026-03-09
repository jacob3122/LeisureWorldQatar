/**
 * StorePageProductList.js
 *
 * FlatList wrapper for the Store page product list.
 * Renders products using StorePageProductCard, with RefreshControl for pull-to-refresh.
 *
 * Improvements over original:
 * - Proper keyExtractor (original had none)
 * - Memoized renderItem via StorePageProductCard (React.memo)
 * - removeClippedSubviews left as default (true) instead of forced false
 *
 * Description header (folderDesc or i18n "storedesc") is rendered inline
 * as the first item (item=undefined at index 0) by StorePageProductCard.
 */

import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import StorePageProductCard from './StorePageProductCard';

/**
 * @param {object} props
 * @param {Array} props.allProducts - Flat product array (undefined at [0] for description)
 * @param {number} props.viewType - 0 = list, 1 = grid
 * @param {string} props.locale - Current locale
 * @param {object} props.Colors - Theme colors from useTheme()
 * @param {string|undefined} props.folderDesc - Rich description for selected category
 * @param {string} props.defaultDesc - i18n.t("storedesc") default description text
 * @param {boolean} props.refreshing - Pull-to-refresh state
 * @param {function} props.onRefresh - Pull-to-refresh handler
 * @param {function} props.onProductSelect - Navigate to ProductPage (regular product)
 * @param {function} props.onProductSelectFolder - Navigate to ProductPage (folder/event)
 * @param {function} props.onProductSelectEvent - Navigate to ProductPage (event)
 * @param {function} props.onProductAdd - Add product to cart
 * @param {object|undefined} props.shopCartInfo - Current shopping cart info
 * @param {number} props.totalItems - Cart item count (for memo comparison in cards)
 * @param {object|undefined} props.profile - Current user profile
 * @param {object} props.mainScrollRef - React ref for FlatList (used by filters for scrollToOffset)
 */
const StorePageProductList = ({
    allProducts,
    viewType,
    locale,
    Colors,
    folderDesc,
    defaultDesc,
    refreshing,
    onRefresh,
    onProductSelect,
    onProductSelectFolder,
    onProductSelectEvent,
    onProductAdd,
    shopCartInfo,
    totalItems,
    profile,
    mainScrollRef,
}) => {

    // ─── keyExtractor ────────────────────────────────────────────────────────────
    // Original had no keyExtractor. We add one for performance.
    // Index 0 is the description header (item=undefined), rest use EntityId or CatalogId.

    const keyExtractor = useCallback((item, index) => {
        if (item == undefined) return 'desc_header';
        if (item.EntityId) return 'product_' + item.EntityId + '_' + index;
        if (item.CatalogId) return 'catalog_' + item.CatalogId + '_' + index;
        return 'item_' + index;
    }, []);

    // ─── renderItem ──────────────────────────────────────────────────────────────

    const renderItem = useCallback(({ item, index }) => {
        if (index <= 1) console.log('[STORE-DEBUG-16] Rendering item', index, item?.CatalogType);
        return (
            <StorePageProductCard
                item={item}
                index={index}
                viewType={viewType}
                locale={locale}
                Colors={Colors}
                folderDesc={folderDesc}
                defaultDesc={defaultDesc}
                onProductSelect={onProductSelect}
                onProductSelectFolder={onProductSelectFolder}
                onProductSelectEvent={onProductSelectEvent}
                onProductAdd={onProductAdd}
                shopCartInfo={shopCartInfo}
                totalItems={totalItems}
                profile={profile}
            />
        );
    }, [viewType, locale, Colors, folderDesc, defaultDesc, onProductSelect,
        onProductSelectFolder, onProductSelectEvent, onProductAdd,
        shopCartInfo, totalItems, profile]);

    // ─── RefreshControl ──────────────────────────────────────────────────────────

    const refreshControl = (
        <RefreshControl
            tintColor={Colors.orangeShadeColor}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    );

    // ─── Render ──────────────────────────────────────────────────────────────────

    return (
        <View style={styles.productView}>
            <FlatList
                ref={mainScrollRef}
                showsVerticalScrollIndicator={false}
                initialNumToRender={3}
                data={allProducts}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.productContain}
                refreshControl={refreshControl}
                style={styles.productsView}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    productView: {
        height: heightPercentageToDP(100),
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    productsView: {
        alignSelf: 'center',
        width: '100%'
    },
    productContain: {
        paddingBottom: heightPercentageToDP(35),
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
});

export default React.memo(StorePageProductList);