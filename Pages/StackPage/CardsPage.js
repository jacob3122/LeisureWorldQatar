import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
    TouchableWithoutFeedback, Image, SafeAreaView, Dimensions, View, Text,
    StyleSheet, Alert, FlatList, RefreshControl, TouchableOpacity, ScrollView,
    AppState, StatusBar, ActivityIndicator
} from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import GestureFlipView from 'react-native-gesture-flip-card';
import * as Tools from '../../Tools/Components/Tools';
import WebServices from '../../Tools/constants/WebServices';
import FastImage from '@d11/react-native-fast-image';
import deleteButton from '../../assets/Icons/delete.png';
import ProfileData from '../../Tools/Components/ProfileData';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import Barcode from '../../Tools/Components/Barcode';
import useCardServices from '../../Tools/hooks/useCardServices';

export default function CardsPage(props) {
    const Colors = useTheme();
    const { state } = useAppContext();
    i18n.translations = state.i18ntranslation;

    // ---- Hook: all card data & API functions ----
    const {
        cardLists, cardNumber, loaded, isLoadingCards,
        cardsViewRef, fetchMedias, fetchMediaDetail,
        unregisterPlayCard, getColor, getbgImage,
        setCardLists, cleanup
    } = useCardServices(props.assignProfile);

    // ---- Local UI state (only what this screen needs) ----
    // FIX: initial value checks current profile immediately
    const [showLogin, setShowLogin] = useState(Tools.IsNull(state.profile));
    const [alreadyIn, setAlreadyIn] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    console.log('🟣 [CardsPage] rendered', {
        cardLists: cardLists?.length ?? 'null',
        cardListsData: cardLists,
        cardNumber: cardNumber,
        loaded: loaded,
        isLoadingCards: isLoadingCards,
        profileExists: !!state.profile,
        showLogin: showLogin
    }, new Date().toLocaleTimeString());

    // ---- AppState handler via ref (avoids stale closures) ----
    const appStateHandlerRef = useRef();
    appStateHandlerRef.current = (nextAppState) => {
        if (nextAppState === 'active' && !Tools.IsNull(state.profile)) {
            cardsViewRef.current.forEach((ref) => {
                ref?.current?.flipLeft?.();
            });
            setCardLists(prev => prev.map(card => ({ ...card, hasData: false, rotate: 0 })));
        }
    };

    // ========================================
    // EFFECTS
    // ========================================

    // 1. Mount: fetch cards + register AppState listener + cleanup
    useEffect(() => {
        const listener = AppState.addEventListener('change', (nextState) => {
            appStateHandlerRef.current?.(nextState);
        });

        if (!Tools.IsNull(state.profile)) {
            fetchMedias();
        }

        return () => {
            listener?.remove?.();
            cleanup();
        };
    }, []);

    // 2. Focus: refresh when returning — includes state.profile to avoid stale closure
    useFocusEffect(
        useCallback(() => {
            logScreenViewEvent("CardsPage", "My Cards");

            // FIX: check login with CURRENT profile (not stale closure)
            if (Tools.IsNull(state.profile)) {
                setShowLogin(true);
            } else {
                setShowLogin(false);
                // Only fetch if we've been here before (not first mount)
                if (alreadyIn) {
                    fetchMedias();
                }
            }

            return () => {
                setAlreadyIn(true);
            };
        }, [alreadyIn, state.profile]) // FIX: was [alreadyIn] — stale closure on state.profile
    );

    // 3. Profile change: show/hide login + fetch cards after sign-in
    useEffect(() => {
        if (!Tools.IsNull(state.profile)) {
            setShowLogin(false);
            // Profile just appeared (user signed in) — fetch cards
            fetchMedias();
        } else {
            setShowLogin(true);
        }
    }, [state.profile?.Id]);

    // ========================================
    // FUNCTIONS
    // ========================================

    const formatDateToLocalString = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).split('/').reverse().join('-');
    };

    const getName = (_cardType) => {
        if (Tools.stringIsContains(_cardType, "wallet")) return i18n.t("cardbalance");
        if (Tools.stringIsContains(_cardType, "etickets")) return i18n.t('redemptionbalance');
        return i18n.t("bonusbalance");
    };

    const getCardBalance = (_card, _number) => {
        if (_card.WalletSlots.length === 0) return;
        const element = _card.WalletSlots[_number];
        return (
            <View style={{ flexDirection: _number === 0 ? 'column' : 'row', paddingRight: '2%', justifyContent: 'center', alignSelf: 'center', width: '40%' }}>
                <Text allowFontScaling={false} style={styles.balanceTxt}>{getName(element.Name)}</Text>
                <Text allowFontScaling={false} style={[styles.balanceVal, { alignSelf: 'flex-start' }]}>{element.Balance} QAR</Text>
            </View>
        );
    };

    const getCardBalances = (_card) => {
        var cards = [];
        for (let index = 1; index < _card.WalletSlots.length; index++) {
            const element = _card.WalletSlots[index];
            cards.push(
                <View key={'wallet-' + index} style={{ flexDirection: 'column', justifyContent: 'center', width: '100%', borderLeftWidth: 2, paddingLeft: '4%' }}>
                    <Text allowFontScaling={false} style={[styles.balanceTxt, {
                        fontSize: widthPercentageToDP('3.5%'),
                        lineHeight: widthPercentageToDP('5%'), textAlign: 'right', alignSelf: 'flex-end'
                    }]}>{getName(element.Name)}</Text>
                    <Text allowFontScaling={false} style={[styles.balanceVal, {
                        textAlign: 'right', alignSelf: 'flex-end',
                        fontSize: widthPercentageToDP('4.25%'), lineHeight: widthPercentageToDP('5.75%')
                    }]}>
                        {element.Balance + '' + (Tools.stringIsContains(element.Name, "etickets") ? (' ' + (element.Balance == 1 ? i18n.t('ticket') : i18n.t('tickets'))) : ' QAR')}
                    </Text>
                </View>
            );
        }
        return cards;
    };

    // ========================================
    // RENDER FUNCTIONS
    // ========================================

    const renderBack = (card, index) => {
        return (
            <View style={{
                justifyContent: 'center', borderRadius: widthPercentageToDP(7),
                alignSelf: 'center', width: widthPercentageToDP(79),
                height: (widthPercentageToDP(79) / 1.58),
                backgroundColor: getColor(card.Location)
            }}>
                <View style={{ width: '100%', height: '100%' }}>
                    <TouchableOpacity
                        style={{ position: 'absolute', justifyContent: 'center', right: '3%', bottom: '4%' }}
                        onPress={() => {
                            Alert.alert(i18n.t('surewanttounregister'), "",
                                [
                                    {
                                        text: i18n.t('proceed'), onPress: () => {
                                            unregisterPlayCard(cardLists[index].MediaId);
                                        }
                                    },
                                    { text: i18n.t('cancel'), onPress: () => { } },
                                ],
                                { cancelable: true }
                            );
                        }}>
                        <Image source={deleteButton} style={{ width: 20, resizeMode: 'contain', tintColor: Colors.whiteColor, alignSelf: 'center' }} />
                    </TouchableOpacity>

                    <View style={{ alignSelf: 'center', backgroundColor: 'white', borderRadius: 5, overflow: 'hidden', width: '85%', marginBottom: '2%', marginTop: '5%' }}>
                        {!Tools.stringIsEmpty(cardNumber[index]) &&
                            <Barcode value={cardNumber[index]}
                                viewStyle={{ marginTop: heightPercentageToDP(1), marginBottom: heightPercentageToDP(1) }}
                                width={widthPercentageToDP('.32%')} height={heightPercentageToDP('4%')}
                                format="CODE128" />}
                        <Text allowFontScaling={false} style={[styles.cardno, { fontSize: 14, marginTop: -12, color: 'black' }]}>
                            {cardNumber[index]}*XXX
                        </Text>
                    </View>

                    {card.hasData && (
                        <>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', width: '88%', bottom: 0, alignItems: 'flex-start' }}>
                                {getCardBalance(card, 0)}
                                <View style={{ flexDirection: 'column' }}>
                                    {getCardBalances(card)}
                                </View>
                            </View>
                            <View style={{
                                position: 'absolute', bottom: '2%', right: '10%',
                                alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row'
                            }}>
                                <Text allowFontScaling={false} style={[styles.balanceTxt, {
                                    fontSize: widthPercentageToDP('3.5%'),
                                    lineHeight: widthPercentageToDP('5%'), textAlign: 'right'
                                }]}>
                                    {Tools.stringIsContains(card.WalletExpiry, "000") ? i18n.t('expired') : i18n.t('expireson') + ": "}
                                </Text>
                                {!Tools.stringIsContains(card.WalletExpiry, "000") &&
                                    <Text allowFontScaling={false} style={[styles.balanceTxt, {
                                        fontWeight: '100', color: Colors.whiteColor,
                                        fontSize: widthPercentageToDP('3.5%'),
                                        lineHeight: widthPercentageToDP('5%'), textAlign: 'right'
                                    }]}>
                                        {" " + formatDateToLocalString(card.WalletExpiry)}
                                    </Text>}
                            </View>
                        </>
                    )}

                    {!card.hasData && <ActivityIndicator size='large' color={Colors.whiteColor} />}
                </View>
            </View>
        );
    };

    const renderFront = (card, index) => {
        return (
            <View style={{
                justifyContent: 'center', borderRadius: widthPercentageToDP(7),
                alignContent: 'center', alignItems: 'center',
                backgroundColor: getColor(card.Location),
                alignSelf: 'center', width: widthPercentageToDP(79),
                height: (widthPercentageToDP(79) / 1.6)
            }}>
                <FastImage
                    style={{
                        position: 'absolute', width: widthPercentageToDP(79),
                        height: (widthPercentageToDP(79) / 1.5779), alignSelf: 'center',
                        color: getColor(card.Location)
                    }}
                    source={{
                        uri: getbgImage(card.Location),
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={[
                        { position: 'absolute', flex: 1, alignSelf: 'flex-end', bottom: '25%' },
                        global.locale === 'ar' ? { start: '4%' } : { end: '4%' }
                    ]}>
                        <Text allowFontScaling={false} style={{
                            fontSize: widthPercentageToDP(3.7), includeFontPadding: false,
                            fontFamily: 'Cairo-Bold', color: Colors.whiteAlways
                        }}>
                            {i18n.t("playcardNumber")}
                        </Text>
                        <Text allowFontScaling={false} style={{
                            fontSize: widthPercentageToDP(5.2), fontFamily: 'Cairo-Regular',
                            color: Colors.whiteAlways, includeFontPadding: false
                        }}>
                            {cardNumber[index]}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const _renderItem = ({ item, index }) => {
        if (loaded === 0) return (<></>);

        const localItem = item;
        const localIndex = index;

        return (
            <TouchableWithoutFeedback
                key={index + "twf"}
                onPress={() => {
                    const ref = cardsViewRef.current[localIndex]?.current;
                    if (ref) {
                        localItem.rotate = (localItem.rotate == undefined) ? 1 : (localItem.rotate == 1 ? 0 : 1);
                        ref.flipLeft();
                        if (!localItem.hasData) {
                            fetchMediaDetail(localItem);
                        }
                    }
                }}
                style={styles.container}>
                <View>
                    <GestureFlipView
                        key={localIndex}
                        ref={ref => {
                            if (cardsViewRef.current[localIndex]) {
                                cardsViewRef.current[localIndex].current = ref;
                            }
                        }}
                        width={widthPercentageToDP(79)}
                        height={widthPercentageToDP(79) / 1.58}
                        renderFront={() => renderFront(localItem, localIndex)}
                        renderBack={() => renderBack(localItem, localIndex)}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const refreshControl = () => (
        <RefreshControl
            tintColor={Colors.blueColor}
            refreshing={refreshing}
            onRefresh={() => fetchMedias()}
        />
    );

    // ========================================
    // STYLES (memoized)
    // ========================================

    const styles = useMemo(() => StyleSheet.create({
        buttonText: {
            includeFontPadding: false,
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            color: Colors.whiteColor,
            fontSize: widthPercentageToDP(4.2),
            paddingHorizontal: widthPercentageToDP(3),
        },
        buttonView: {
            position: 'absolute',
            bottom: '3%',
            backgroundColor: Colors.blueColor,
            height: heightPercentageToDP(4.75),
            borderRadius: heightPercentageToDP(4.75),
            alignSelf: 'center',
            justifyContent: 'center',
            paddingLeft: '4%',
            paddingRight: '4%',
        },
        cardno: {
            includeFontPadding: false,
            alignSelf: 'center',
            textTransform: 'uppercase',
            fontFamily: 'Cairo-Regular',
            fontSize: 30,
            textAlign: 'center',
            color: Colors.whiteColor,
        },
        balanceTxt: {
            includeFontPadding: false,
            color: Colors.black,
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            fontFamily: 'Cairo-Regular',
            fontSize: heightPercentageToDP(2),
            lineHeight: heightPercentageToDP(3),
            textAlign: 'left',
        },
        balanceVal: {
            includeFontPadding: false,
            alignSelf: 'flex-start',
            textAlign: 'left',
            color: Colors.whiteColor,
            fontWeight: '100',
            fontFamily: 'Cairo-Regular',
            fontSize: heightPercentageToDP(2.25),
            lineHeight: heightPercentageToDP(3.25),
        },
        container: {
            borderRadius: 20,
        },
        tagline: {
            fontFamily: 'Cairo-Bold',
            fontSize: widthPercentageToDP(7),
            alignSelf: 'flex-start',
            color: Colors.inputfontColor,
        },
        storedesc: {
            width: '90%',
            textAlign: 'left',
            fontFamily: 'Cairo-Regular',
            fontSize: widthPercentageToDP(4),
            lineHeight: widthPercentageToDP(4) * 1.5,
            flexWrap: 'wrap',
            alignSelf: 'center',
            marginBottom: '5%',
            color: Colors.inputfontColor,
        },
    }), [Colors]);

    // ========================================
    // JSX
    // ========================================

    return (
        <View behavior="padding" style={{ flex: 1, backgroundColor: Colors.bgColor }}>
            <BackgroundWall />
            <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
                <View style={{ width: '100%', alignSelf: 'center', marginTop: heightPercentageToDP(3) }}>
                    <View style={{ width: widthPercentageToDP(93), alignSelf: 'center' }}>
                        <Text allowFontScaling={false} style={styles.tagline}>
                            {i18n.t('mycards')}
                        </Text>
                        <View style={{ height: '94%', justifyContent: "center", alignItems: 'center', alignSelf: 'center' }}>

                            {/* Empty state */}
                            {cardLists.length === 0 && (
                                <ScrollView
                                    style={{ alignSelf: 'center', height: '100%', width: widthPercentageToDP(100), alignContent: 'center' }}
                                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                    refreshControl={refreshControl()}>
                                    <Text allowFontScaling={false} style={styles.storedesc}>{i18n.t("nocardsavailablemycards")}</Text>
                                    <Text allowFontScaling={false} style={styles.storedesc}>{i18n.t("moredetailsmycards")}</Text>
                                </ScrollView>
                            )}

                            {/* Card list */}
                            {loaded === 1 && cardLists.length > 0 && (
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        removeClippedSubviews={false}
                                        data={cardLists}
                                        keyExtractor={(item) => item.Id.toString()}
                                        initialNumToRender={5}
                                        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                                        showsVerticalScrollIndicator={false}
                                        refreshControl={refreshControl()}
                                        contentContainerStyle={{ paddingBottom: '25%' }}
                                        style={{ width: '100%' }}
                                        renderItem={_renderItem}
                                        extraData={cardLists}
                                    />
                                </View>
                            )}

                        </View>
                    </View>

                    {/* Register card button */}
                    <TouchableOpacity
                        style={styles.buttonView}
                        onPress={() => {
                            props.navigation.navigate('AddCards', {
                                navigation: props.navigation,
                                fetchmedia: fetchMediaDetail
                            });
                        }}>
                        <Text style={styles.buttonText} allowFontScaling={false}>{i18n.t('registercard')} </Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>

            {/* Login modal when not signed in */}
            {showLogin && (
                <ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation}
                    onDismiss={() => {
                        props.navigation.navigate('Homescreen');
                        setShowLogin(false);
                    }} />
            )}
        </View>
    );
}