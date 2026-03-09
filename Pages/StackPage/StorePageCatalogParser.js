/**
 * StorePageCatalogParser.js
 * 
 * Catalog tree → flat product list parser.
 * Extracted from StorePage.js getProductnItems() function.
 * 
 * The catalog is a 3-level tree:
 *   storeCatalog.Nodes (stores/venues)
 *     → Nodes (categories)
 *       → Nodes (products)
 * 
 * This module flattens it into a renderable array for the FlatList,
 * applying store filter, category filter, search text filter,
 * product classification, category-order sorting, and initial shuffle.
 */

import * as Tools from '../../Tools/Components/Tools.js';
import WebServices from '../../Tools/constants/WebServices';
import { getTranslatedProductName } from './StorePageHelpers';

/**
 * Fisher-Yates (Knuth) in-place shuffle. Mutates the array.
 */
export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

/**
 * Extracts the list of store/venue nodes from the catalog root.
 * Used to populate the top-level store filter pills.
 * 
 * @param {object} storeCatalog - The full catalog object from props.storeCatalog
 * @returns {Array} Array of store/venue node objects
 */
export const extractStores = (storeCatalog) => {
    let allStoresIn = [];
    if (Tools.IsNull(storeCatalog) || Tools.IsNull(storeCatalog.Nodes)) {
        return allStoresIn;
    }
    storeCatalog.Nodes.map((itemIn, index) => {
        allStoresIn.push(itemIn);
    });
    return allStoresIn;
};

/**
 * Flattens the 3-level catalog tree into a product array for the FlatList.
 * 
 * Behavior preserved exactly from original StorePage.getProductnItems():
 * 1. Iterates stores, filters by selectedStore
 * 2. Iterates categories, collects unique categories (TemplateCode contains "category")
 * 3. Filters by filterProductCategory if set
 * 4. Iterates products, filters by sorttext (search)
 * 5. Classifies products:
 *    - CatalogType 3 + ProductStatus 2 → regular product (CatalogType stays 3)
 *    - CatalogType 3 + EntityType 5 → event (CatalogType set to 2)
 *    - CatalogType 2 → folder/package (CatalogType stays 2)
 * 6. Sorts by category order
 * 7. On first load (not shuffled, no category filter): shuffles via Fisher-Yates
 * 8. When shuffled + no category filter + no store selected: uses preserved random order
 * 9. Resets filterProductCategory if selected category no longer exists
 * 10. Prepends undefined at index 0 (renders as description header in FlatList)
 * 
 * @param {object} params
 * @param {object} params.storeCatalog - Full catalog from props.storeCatalog
 * @param {string|undefined} params.selectedStore - Selected store CatalogId, or '' for all
 * @param {object|undefined} params.filterProductCategory - Selected category filter object
 * @param {string} params.sorttext - Search text
 * @param {boolean} params.shuffled - Whether initial shuffle has already occurred
 * @param {Array} params.allProductsRandom - Previously shuffled product array (preserved across filters)
 * @param {string} params.locale - Current locale for translations used in search matching
 * 
 * @returns {object} {
 *   allProducts: Array,           - Flat product list with undefined at [0]
 *   allProductCategory: Array,    - Unique category objects for sub-filter chips
 *   allProductsRandom: Array,     - Shuffled product array (updated on first shuffle)
 *   shouldResetFilter: boolean    - True if filterProductCategory should be reset to undefined
 * }
 */
export const parseProductCatalog = ({
    storeCatalog,
    selectedStore,
    filterProductCategory,
    sorttext,
    shuffled,
    allProductsRandom,
    locale,
}) => {
    console.log('[STORE-DEBUG-01] parseProductCatalog', {selectedStore, filterCat: filterProductCategory?.CatalogName, sorttext, shuffled});
    let allProductsIn = [];
    let allProductCat = [];
    let allProductCatVal = [];

    if (storeCatalog.Nodes != null) {
        storeCatalog.Nodes.map((itemIn, index) => {
            if ((selectedStore == '' || itemIn.CatalogId == selectedStore)) {
                itemIn.Nodes.map((_productIn, pindex) => {
                    let CanProcced = false;

                    const isElementInArray = allProductCat.includes(_productIn.CatalogName);
                    if (!isElementInArray && Tools.stringIsContains(_productIn.TemplateCode, WebServices.category)) {
                        allProductCat.push(_productIn.CatalogName);
                        allProductCatVal.push(_productIn);
                    }
                    CanProcced = filterProductCategory == undefined || (filterProductCategory != undefined && (filterProductCategory.CatalogName == _productIn.CatalogName));

                    if (CanProcced) {
                        _productIn.Nodes.map((productIn, pindex) => {
                            if (Tools.stringIsEmpty(sorttext) || Tools.stringIsContains(getTranslatedProductName(productIn, locale), sorttext)) {
                                productIn.parkType = itemIn.CatalogName;
                                if (productIn.CatalogType == 3 && productIn.Entity.ProductStatus == 2) {
                                    // On sale products only
                                    var productT = productIn;
                                    productT.productTitle = _productIn.CatalogName;
                                    productT.CatalogType = 3;
                                    allProductsIn.push(productT);
                                } else if (productIn.CatalogType == 3 && productIn.EntityType == 5) {
                                    // Event product
                                    var productT = productIn;
                                    productT.productTitle = _productIn.CatalogName;
                                    productT.CatalogType = 2;
                                    allProductsIn.push(productT);
                                } else if (productIn.CatalogType == 2) {
                                    // Folder/package
                                    var productT = productIn;
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

    // Sort by category order
    let allProductsInSort = [];
    for (let index = 0; index < allProductCatVal.length; index++) {
        const element = allProductsIn.filter((_itemInCheck) => _itemInCheck.productTitle == allProductCatVal[index].CatalogName);
        for (let index = 0; index < element.length; index++) {
            const elementIn = element[index];
            allProductsInSort.push(elementIn);
        }
    }

    // Shuffle logic
    let newAllProductsRandom = allProductsRandom;
    if (!shuffled && (filterProductCategory == undefined)) {
        shuffleArray(allProductsInSort);
        newAllProductsRandom = allProductsInSort;
    }
    if (shuffled && (filterProductCategory == undefined) && Tools.IsNull(selectedStore)) {
        allProductsInSort = (allProductsRandom);
    }

    // Check if selected category still exists in results
    let shouldResetFilter = false;
    if (filterProductCategory != undefined) {
        let allcat = allProductCatVal.filter((_itemcheck) => _itemcheck.CatalogName == filterProductCategory.CatalogName);
        if (allcat == null || allcat == undefined || allcat.length == 0) {
            shouldResetFilter = true;
        }
    }

    // Prepend undefined for description header
    allProductsInSort = [undefined, ...allProductsInSort];

    console.log('[STORE-DEBUG-02] parseProductCatalog result', {productsCount: allProductsInSort.length, categoriesCount: allProductCatVal.length});
    return {
        allProducts: allProductsInSort,
        allProductCategory: allProductCatVal,
        allProductsRandom: newAllProductsRandom,
        shouldResetFilter: shouldResetFilter,
    };
};