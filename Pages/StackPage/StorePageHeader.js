/**
 * StorePageHeader.js
 *
 * Top bar component for the Store page.
 * Contains: search input (hidden via opacity), search icon, clear button, cart icon with badge.
 *
 * Extracted from original StorePage.js top bar JSX section.
 * All styles, dimensions, and behavior preserved exactly.
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import searchIcon from '../../assets/Icons/search.png';
import cartIcon from '../../assets/Icons/cart.png';

/**
 * @param {object} props
 * @param {string} props.sorttext - Current search text
 * @param {number} props.sortVisible - 0 = hidden, 1 = visible (controls opacity)
 * @param {number} props.totalItems - Cart badge count
 * @param {object} props.Colors - Theme colors from useTheme()
 * @param {object} props.searchInputRef - React ref for the TextInput
 * @param {function} props.onSearchTextChange - Called with text on input change
 * @param {function} props.onShowSearch - Called when search icon tapped
 * @param {function} props.onClearSearch - Called when clear (X) button tapped
 * @param {function} props.onCartPress - Called when cart icon tapped
 */
const StorePageHeader = ({
    sorttext,
    sortVisible,
    totalItems,
    Colors,
    searchInputRef,
    onSearchTextChange,
    onShowSearch,
    onClearSearch,
    onCartPress,
}) => {
    return (
        <View style={styles(Colors).topBar}>
            <TextInput
                ref={searchInputRef}
                value={sorttext}
                numberOfLines={1}
                allowFontScaling={false}
                onChangeText={(text) => {
                    onSearchTextChange(text);
                }}
                style={[{
                    includeFontPadding: false,
                    alignContent: 'center',
                    opacity: sortVisible,
                    marginTop: heightPercentageToDP(0.5),
                    paddingVertical: heightPercentageToDP(0.1),
                    paddingHorizontal: widthPercentageToDP(3),
                    borderWidth: 1,
                    borderColor: Colors.blueColor,
                    color: Colors.blueColor,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: heightPercentageToDP(4),
                    backgroundColor: Colors.bgColor,
                    fontFamily: 'Cairo-Regular',
                    fontSize: widthPercentageToDP(4.5),
                    width: '70%',
                    height: heightPercentageToDP(4)
                }, styles(Colors).shadow]}
            />
            {sorttext.length > 0 && <TouchableOpacity
                onPress={() => { onClearSearch(); }}
                style={{
                    height: heightPercentageToDP(3),
                    backgroundColor: Colors.blueColor,
                    marginTop: heightPercentageToDP(1),
                    position: 'absolute',
                    start: widthPercentageToDP(48),
                    justifyContent: 'center',
                    width: heightPercentageToDP(3),
                    borderRadius: heightPercentageToDP(3)
                }}
            >
                <Text style={{
                    color: Colors.bgColor,
                    includeFontPadding: false,
                    fontFamily: 'Cairo-Bold',
                    alignSelf: 'center'
                }}>X</Text>
            </TouchableOpacity>}
            <TouchableOpacity
                style={{}}
                onPress={() => { onShowSearch(); }}
            >
                <Image style={styles(Colors).cartIconStyle} resizeMode='contain' source={searchIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { onCartPress(); }}>
                <Image style={styles(Colors).cartIconStyle} resizeMode='contain' source={cartIcon} />
                {totalItems > 0 && <View style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    backgroundColor: Colors.inputfontColor,
                    alignSelf: 'flex-end',
                    borderRadius: 15,
                    height: 14,
                    width: 14,
                    top: 3,
                    end: -5
                }}>
                    <Text allowFontScaling={false} style={{
                        includeFontPadding: false,
                        alignSelf: 'center',
                        textAlign: 'center',
                        color: Colors.whiteColor,
                        fontSize: widthPercentageToDP(2.5)
                    }}>{totalItems}</Text>
                </View>}
            </TouchableOpacity>
        </View>
    );
};

const styles = (Colors) => StyleSheet.create({
    topBar: {
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        width: '80%',
        flexDirection: 'row',
        marginEnd: widthPercentageToDP(4)
    },
    cartIconStyle: {
        marginTop: heightPercentageToDP(1),
        tintColor: Colors.blueColor,
        height: 28,
        width: 28,
    },
    shadow: {
        shadowColor: "#ffffff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default React.memo(StorePageHeader);