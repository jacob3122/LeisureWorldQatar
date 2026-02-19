import React, { useEffect, useState, useMemo } from 'react';
import {
    TouchableWithoutFeedback, Image, SafeAreaView, Dimensions, View, Text,
    StyleSheet, Alert, FlatList, RefreshControl, TouchableOpacity, ScrollView,
    StatusBar, ActivityIndicator
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
import AddPlayCard from '../../Tools/Components/AddPlayCard';
import PlayCardList from '../../Tools/Components/PlayCardList';
import ProfileData from '../../Tools/Components/ProfileData';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import OverlayLoad from '../../Tools/Components/OverlayLoad';
import { useTheme } from '../../Tools/context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import Barcode from '../../Tools/Components/Barcode';
import backButton from '../../assets/Icons/back.png';
import * as UIElements from '../../Tools/Components/UIElements';
import useCardServices from '../../Tools/hooks/useCardServices';

export default function AddCardsPage(props) {
    const Colors = useTheme();
    const { state } = useAppContext();
    i18n.translations = state.i18ntranslation;

    // ---- Hook: all card data & API functions ----
    const {
        cardLists, cardNumber, loaded, loadedUnreg, isLoadingCards,
        unregcardLists, unregcardNumber, unregcardFullNumber,
        cardsViewRef, unregcardsViewRef, unregcardsInputRef,
        fetchMedias, fetchMediaDetail, searchPlayCard, findPlayCards,
        registerPlayCard, unregisterPlayCard, checkandRegister,
        getColor, getbgImage, cleanup
    } = useCardServices(props.assignProfile);

    console.log('🟣 [AddCardsPage] rendered', {
        cardLists: cardLists?.length ?? 'null',
        unregcardLists: unregcardLists?.length ?? 'null',
        loaded: loaded,
        loadedUnreg: loadedUnreg,
        isLoadingCards: isLoadingCards
    }, new Date().toLocaleTimeString());

    // ---- Local UI state only ----
    const [addPlayCardView, setAddPlayCardView] = useState(false);
    const [addCardView, setAddCardView] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    // ---- Single effect: cleanup on unmount ----
    useEffect(() => {
        return cleanup;
    }, []);

    // ========================================
    // RENDER HELPERS (UI-specific)
    // ========================================

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
                        <View style={{ flexDirection: 'row', alignSelf: 'center', width: '88%', bottom: 0, alignItems: 'flex-start' }}>
                            {getCardBalance(card, 0)}
                            <View style={{ flexDirection: 'column' }}>
                                {getCardBalances(card)}
                            </View>
                        </View>
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
                        i18n.locale === 'ar' ? { start: '4%' } : { end: '4%' }
                    ]}>
                        <Text allowFontScaling={false} style={{
                            fontSize: widthPercentageToDP(3.7), fontFamily: 'Cairo-Regular', color: Colors.whiteColor
                        }}>{i18n.t("playcardNumber")}</Text>
                        <Text allowFontScaling={false} style={{
                            fontSize: widthPercentageToDP(5.2), fontFamily: 'Cairo-Regular', color: Colors.whiteColor
                        }}>{cardNumber[index]}</Text>
                    </View>
                </View>
            </View>
        );
    };

    // ========================================
    // CALLBACKS
    // ========================================

    const OnDone = () => {
        setAddCardView(false);
        setAddPlayCardView(false);
        props.navigation.goBack();
    };

    const OnDonePL = (_doneVal = false, callback = null) => {
        setAddPlayCardView(false);
        if (_doneVal) {
            setAddCardView(true);
        }
    };

    // ========================================
    // STYLES (memoized)
    // ========================================

    const styles = useMemo(() => StyleSheet.create({
        buttonText: {
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            color: Colors.whiteColor,
            fontSize: widthPercentageToDP(4.2),
            paddingHorizontal: widthPercentageToDP(3),
        },
        buttonView: {
            backgroundColor: Colors.blueColor,
            height: heightPercentageToDP(4.75),
            borderRadius: heightPercentageToDP(4.75),
            alignSelf: 'center',
            justifyContent: 'center',
            paddingLeft: '4%',
            paddingRight: '4%',
        },
        cardno: {
            alignSelf: 'center',
            textTransform: 'uppercase',
            fontFamily: 'Cairo-Regular',
            fontSize: 30,
            textAlign: 'center',
            color: Colors.whiteColor,
        },
        balanceTxt: {
            color: Colors.black,
            alignSelf: 'flex-start',
            fontFamily: 'Cairo-Bold',
            fontSize: heightPercentageToDP(2),
            lineHeight: heightPercentageToDP(3),
            textAlign: 'left',
        },
        balanceVal: {
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
            <SafeAreaView style={{ marginTop: StatusBar.currentHeight, width: widthPercentageToDP(93), alignSelf: 'center' }}>

                {/* Back button */}
                <TouchableOpacity style={{}} onPress={() => { props.navigation.goBack(); }}>
                    <Image style={{
                        tintColor: Colors.blueColor, width: 25, height: 25,
                        transform: [{ scaleX: Tools.stringIsContains(i18n.locale, 'en') ? 1 : -1 }]
                    }} source={backButton} />
                </TouchableOpacity>

                <View style={{ width: '100%' }}>
                    {/* Manual card entry component */}
                    <AddPlayCard
                        accessToken={props.accessToken}
                        searchMedia={searchPlayCard}
                        onDone={OnDone}
                    />

                    {UIElements.drawGap(heightPercentageToDP(2))}
                    <Text style={{ color: Colors.blueColor, alignSelf: 'center', fontFamily: 'Cairo-Regular', fontSize: widthPercentageToDP(4) }}>
                        {i18n.t('or')}
                    </Text>
                    {UIElements.drawGap(heightPercentageToDP(2))}

                    {/* Register from unregistered cards list */}
                    <TouchableOpacity
                        style={styles.buttonView}
                        onPress={() => { setAddPlayCardView(true); }}>
                        <Text style={styles.buttonText} allowFontScaling={false}>{i18n.t('registercard')} </Text>
                    </TouchableOpacity>
                </View>

                {/* PlayCardList modal */}
                {addPlayCardView && (
                    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        <PlayCardList
                            unregcardsViewRef={unregcardsViewRef.current}
                            cardLists={cardLists}
                            updateLoad={() => {}}
                            unregcardsInputRef={unregcardsInputRef.current}
                            unregcardFullNumber={unregcardFullNumber}
                            checkandRegister={checkandRegister}
                            unregcardNumber={unregcardNumber}
                            loadedUnreg={loadedUnreg}
                            searchMedia={searchPlayCard}
                            unregcardLists={unregcardLists}
                            accessToken={props.accessToken}
                            findPlayCard={findPlayCards}
                            isopen={addPlayCardView}
                            isLoading={isLoadingCards}
                            onDone={OnDonePL}
                        />
                    </View>
                )}

            </SafeAreaView>

            {/* Login modal */}
            {showLogin && (
                <ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation}
                    onDismiss={() => {
                        props.navigation.navigate('Homescreen');
                        setShowLogin(false);
                    }} />
            )}

            {/* Loading overlay */}
            {isLoadingCards && <OverlayLoad isopen={isLoadingCards} />}
        </View>
    );
}