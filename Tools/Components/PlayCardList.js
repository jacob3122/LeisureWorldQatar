import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    StyleSheet, Modal, View, Text, Dimensions, Image, TouchableOpacity,
    TextInput, FlatList, RefreshControl, TouchableWithoutFeedback,
    ScrollView, SafeAreaView, Alert
} from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import backButton from '../../assets/Icons/back.png';
import * as tools from '../../Tools/Components/Tools.js';
import GestureFlipView from 'react-native-gesture-flip-card';
import cameraIcon from '../../assets/Icons/camera.png';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import WebServices from '../constants/WebServices';
import FastImage from '@d11/react-native-fast-image';
import BarcodeInput from './BarcodeInput';
import LoadingLine from './LoadingLine';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
import Barcode from './Barcode.js';

export default function PlayCardList(props) {
    console.log('🟣 [PlayCardList] rendered', {
        unregcardLists: props.unregcardLists?.length ?? 'null',
        unregcardListsData: props.unregcardLists,
        cardLists: props.cardLists?.length ?? 'null',
        unregcardNumber: props.unregcardNumber,
        loadedUnreg: props.loadedUnreg,
        isLoading: props.isLoading,
        isopen: props.isopen
    }, new Date().toLocaleTimeString());
    const Colors = useTheme();
    const isMounted = useRef(true);

    // ---- State ----
    const [isLoading, setIsLoading] = useState(true);
    const [refreshingUR, setRefreshingUR] = useState(false);
    const [cameraView, setCameraView] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [valuesText, setValuesText] = useState([]);
    const [showNoItems, setShowNoItems] = useState(false);

    // ---- Refs for unregistered card flip views ----
    const unregViewRefs = useRef([]);

    // ========================================
    // EFFECTS
    // ========================================

    // Mount: call findPlayCard, setup valuesText, cleanup on unmount
    useEffect(() => {
        isMounted.current = true;

        // Initialize text input values array
        const initialValues = (props.unregcardLists || []).map(() => '');
        setValuesText(initialValues);

        // Check if all unregistered cards are already registered
        checkAllRegistered(props.unregcardLists, props.cardLists);

        // Fetch unregistered cards
        setIsLoading(true);
        const timer = setTimeout(() => {
            if (props.findPlayCard) {
                props.findPlayCard(null, null, () => {
                    if (isMounted.current) {
                        setIsLoading(false);
                    }
                });
            }
        }, 100);

        return () => {
            isMounted.current = false;
            clearTimeout(timer);
        };
    }, []);

    // When loadedUnreg changes to 1 (FindPlayCard completed), stop loading
    useEffect(() => {
        if (props.loadedUnreg === 1) {
            console.log('🟣 [PlayCardList] loadedUnreg changed to 1 — unregcardLists:', JSON.stringify(props.unregcardLists), new Date().toLocaleTimeString());
            setIsLoading(false);

            // Re-initialize text values for new unregcardLists
            const newValues = (props.unregcardLists || []).map(() => '');
            setValuesText(newValues);

            // Re-check if all cards are registered
            checkAllRegistered(props.unregcardLists, props.cardLists);
        }
    }, [props.loadedUnreg]);

    // ========================================
    // HELPERS
    // ========================================

    const checkAllRegistered = useCallback((unregList, regList) => {
        if (!unregList || unregList.length === 0) {
            setShowNoItems(true);
            return;
        }
        let matchCount = 0;
        for (let i = 0; i < unregList.length; i++) {
            if (checkCard(unregList[i], regList)) {
                matchCount++;
            }
        }
        setShowNoItems(matchCount > 0 && matchCount === unregList.length);
    }, []);

    const checkCard = (item, list) => {
        if (!list) return false;
        for (let i = 0; i < list.length; i++) {
            if (tools.stringIsContains(item.MediaId, list[i].MediaId)) {
                return true;
            }
        }
        return false;
    };

    const getColor = (parkType) => {
        if (parkType === "Angry Birds World") return Colors.abColor;
        if (parkType === "Virtuocity") return Colors.vcColor;
        if (parkType === "Snow Dunes") return Colors.sdColor;
        return Colors.bgColor;
    };

    const getbgImage = (parkType) => {
        if (parkType === "Angry Birds World") return WebServices.abcard;
        if (parkType === "Virtuocity") return WebServices.vccard;
        if (parkType === "Snow Dunes") return WebServices.sdcard;
        return WebServices.generalcard;
    };

    // ========================================
    // CAMERA / BARCODE INPUT
    // ========================================

    const updateInput = useCallback((output) => {
        if (currentIndex !== -1) {
            setValuesText(prev => {
                const updated = [...prev];
                updated[currentIndex] = output;
                return updated;
            });
        }
        setCameraView(false);
    }, [currentIndex]);

    // ========================================
    // PULL TO REFRESH
    // ========================================

    const refreshListView = useCallback(() => {
        setRefreshingUR(true);
        if (props.findPlayCard) {
            props.findPlayCard(null, null, () => {
                if (isMounted.current) {
                    setRefreshingUR(false);
                }
            });
        }
    }, [props.findPlayCard]);

    const refreshControl = () => (
        <RefreshControl
            tintColor={Colors.orangeShadeColor}
            refreshing={refreshingUR}
            onRefresh={refreshListView}
        />
    );

    // ========================================
    // RENDER: Unregistered card — FRONT (card info + verify button)
    // ========================================

    const renderunRegFront = (card, index) => {
        return (
            <View style={{
                justifyContent: 'center', borderRadius: 20,
                alignContent: 'center', alignItems: 'center',
                alignSelf: 'center', width: widthPercentageToDP(79),
                height: (widthPercentageToDP(79) / 1.58),
                backgroundColor: getColor(card.Location)
            }}>
                <FastImage
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    source={{
                        uri: getbgImage(card.Location),
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={[
                        { position: 'absolute', flex: 1, alignSelf: 'flex-end', bottom: '4%' },
                        i18n.locale === 'ar' ? { start: '3%' } : { end: '3%' }
                    ]}>
                        <Text allowFontScaling={false} style={{
                            fontSize: widthPercentageToDP(3.7), fontFamily: 'Cairo-Regular',
                            color: Colors.whiteColor, alignSelf: 'flex-start'
                        }}>
                            {i18n.t("playcardNumber")}
                        </Text>
                        <Text allowFontScaling={false} style={{
                            fontSize: widthPercentageToDP(4.5), fontFamily: 'Cairo-Regular',
                            color: Colors.whiteColor, alignSelf: 'flex-start', marginBottom: '2%'
                        }}>
                            {props.unregcardNumber?.[index] + "*XXX"}
                        </Text>
                        <TouchableOpacity
                            style={{
                                marginTop: '1%', backgroundColor: Colors.blueColor,
                                justifyContent: 'center', alignSelf: 'flex-start',
                                borderRadius: heightPercentageToDP(4.75),
                                height: heightPercentageToDP(4.75),
                                paddingLeft: '7%', paddingRight: '3%'
                            }}
                            onPress={() => {
                                unregViewRefs.current[index]?.flipLeft?.();
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text allowFontScaling={false} style={styles.buttonText}>
                                    {i18n.t('verifycard')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    // ========================================
    // RENDER: Unregistered card — BACK (input + confirm)
    // ========================================

    const renderunRegBack = (card, index) => {
        return (
            <View style={{
                justifyContent: 'center', borderRadius: 20,
                alignSelf: 'center', width: widthPercentageToDP(79),
                height: (widthPercentageToDP(79) / 1.58),
                backgroundColor: getColor(card.Location)
            }}>
                <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                    {/* Input + camera row */}
                    <View style={{ flexDirection: 'row', width: '70%', alignSelf: 'center' }}>
                        <TextInput
                            value={valuesText[index] || ''}
                            allowFontScaling={false}
                            maxLength={14}
                            placeholder={props.unregcardNumber?.[index] + "*XXX"}
                            placeholderTextColor={Colors.inputfontColor}
                            onChangeText={(text) => {
                                setValuesText(prev => {
                                    const updated = [...prev];
                                    updated[index] = text;
                                    return updated;
                                });
                            }}
                            style={[{
                                fontFamily: 'Cairo-Regular', backgroundColor: Colors.whiteColor,
                                width: '100%', alignSelf: 'center',
                                height: heightPercentageToDP(4.75),
                                borderRadius: heightPercentageToDP(4.75),
                                padding: 5, fontSize: widthPercentageToDP(4.5),
                                textAlign: 'center'
                            }, styles.shadow]}
                        />
                        <TouchableOpacity
                            style={{ position: 'absolute', alignSelf: 'center', end: '5%' }}
                            onPress={() => {
                                setCurrentIndex(index);
                                setCameraView(true);
                            }}>
                            <Image style={{ tintColor: Colors.blueColor }} source={cameraIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm button */}
                    <TouchableOpacity
                        style={{
                            marginTop: '5%', backgroundColor: Colors.blueColor,
                            justifyContent: 'center', alignSelf: 'center',
                            borderRadius: heightPercentageToDP(4.75),
                            height: heightPercentageToDP(4.75),
                            paddingLeft: '5%', paddingRight: '2%'
                        }}
                        onPress={() => {
                            let textVal = valuesText[index] || '';

                            if (tools.stringIsContains(textVal, "*")) {
                                textVal = textVal.substring(0, textVal.indexOf('*'));
                            }

                            if (!tools.stringIsContains(props.unregcardFullNumber?.[index], textVal)) {
                                Alert.alert(i18n.t("invalidplaycard"));
                                return;
                            }

                            if (props.checkandRegister) {
                                props.checkandRegister(index);
                            }
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text allowFontScaling={false} style={styles.buttonTxt}>
                                {i18n.t('confirmcard')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // ========================================
    // RENDER: FlatList item
    // ========================================

    const _renderunRegItem = useCallback(({ item, index }) => {
        // Skip cards that are already registered
        if (checkCard(item, props.cardLists)) {
            return null;
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                unregViewRefs.current[index]?.flipLeft?.();
            }}>
                <View>
                    <GestureFlipView
                        key={index}
                        ref={ref => {
                            unregViewRefs.current[index] = ref;
                        }}
                        width={widthPercentageToDP(79)}
                        height={widthPercentageToDP(79) / 1.58}
                        renderFront={() => renderunRegFront(item, index)}
                        renderBack={() => renderunRegBack(item, index)}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }, [props.cardLists, props.unregcardNumber, props.unregcardFullNumber, valuesText]);

    // ========================================
    // STYLES (memoized — NOT inside render)
    // ========================================

    const styles = useMemo(() => StyleSheet.create({
        container: {
            width: '100%', alignItems: 'center', flex: 1,
        },
        nocards: {
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            fontSize: widthPercentageToDP(4.2),
        },
        buttonText: {
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            color: Colors.whiteColor,
            fontSize: widthPercentageToDP(4.2),
            paddingHorizontal: widthPercentageToDP(4),
        },
        buttonView: {
            position: 'absolute',
            bottom: '6%',
            backgroundColor: Colors.blueColor,
            height: heightPercentageToDP(4.75),
            borderRadius: heightPercentageToDP(4.75),
            alignSelf: 'center',
            justifyContent: 'center',
            paddingLeft: '2%', paddingRight: '2%',
        },
        buttonTxt: {
            paddingHorizontal: widthPercentageToDP(4),
            alignSelf: 'center',
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            fontSize: widthPercentageToDP(4.2),
            color: Colors.whiteColor,
        },
        cardno: {
            alignSelf: 'center',
            fontFamily: 'Cairo-Regular',
            fontSize: 30,
            textAlign: 'center',
            color: Colors.whiteColor,
        },
        balanceTxt: {
            color: Colors.inputfontColor,
            fontFamily: 'Cairo-Regular',
            fontSize: 25,
            textAlignVertical: 'center',
        },
        balanceVal: {
            textAlignVertical: 'center',
            color: Colors.whiteColor,
            fontWeight: '100',
            fontFamily: 'Cairo-Regular',
            fontSize: 30,
            paddingStart: 10,
        },
        loading: {
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
        },
        tagline: {
            fontFamily: 'Cairo-Bold',
            fontSize: widthPercentageToDP(7),
            alignSelf: 'flex-start',
            color: Colors.inputfontColor,
        },
        storedesc: {
            textAlign: 'left',
            fontFamily: 'Cairo-Regular',
            fontSize: widthPercentageToDP(4),
            lineHeight: widthPercentageToDP(4) * 1.5,
            flexWrap: 'wrap',
            alignSelf: 'flex-start',
            color: Colors.inputfontColor,
            marginBottom: '5%',
        },
        shadow: {
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 3,
            shadowOpacity: 0.12,
        },
    }), [Colors]);

    // ========================================
    // JSX
    // ========================================

    const hasUnregCards = props.unregcardLists && props.unregcardLists.length > 0;
    const showList = !showNoItems && props.loadedUnreg === 1 && hasUnregCards;
    const showEmpty = showNoItems || !hasUnregCards;

    return (
        <Modal statusBarTranslucent={true} animationType='none' visible={props.isopen}>
            <BackgroundWall />
            <View style={styles.loading}>
                <SafeAreaView style={{ width: widthPercentageToDP(93), alignSelf: 'center' }}>

                    {/* Back button */}
                    <TouchableOpacity
                        style={{ marginTop: heightPercentageToDP(1) }}
                        onPress={() => {
                            if (props.onDone) props.onDone();
                        }}>
                        <Image style={{
                            tintColor: Colors.blueColor, width: 25, height: 25,
                            transform: [{ scaleX: tools.stringIsContains(i18n.locale, 'en') ? 1 : -1 }]
                        }} source={backButton} />
                    </TouchableOpacity>

                    <Text allowFontScaling={false} style={styles.tagline}>
                        {i18n.t('lockedcards')}
                    </Text>

                    <View style={{ height: '82%', justifyContent: "center", alignItems: 'center', alignSelf: 'center' }}>

                        {/* Empty state */}
                        {showEmpty && (
                            <ScrollView
                                style={{
                                    alignSelf: 'center', height: '100%',
                                    width: widthPercentageToDP(100),
                                    alignContent: 'center', position: 'absolute'
                                }}
                                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                refreshControl={refreshControl()}>
                                <View style={{ width: '90%' }}>
                                    <Text allowFontScaling={false} style={styles.storedesc}>
                                        {i18n.t("nocardsavailableplayingcards")}
                                    </Text>
                                    {(!isLoading && !refreshingUR) && (
                                        <Text allowFontScaling={false} style={styles.nocards}>
                                            {i18n.t("nocardsavailable")}
                                        </Text>
                                    )}
                                </View>
                                {(isLoading || refreshingUR) && (
                                    <LoadingLine loadBar={Colors.orangeShadeColor} />
                                )}
                            </ScrollView>
                        )}

                        {/* Card list */}
                        {showList && (
                            <View style={{ flex: 1, width: widthPercentageToDP(90), alignSelf: 'center' }}>
                                <Text allowFontScaling={false} style={styles.storedesc}>
                                    {i18n.t("nocardsavailableplayingcards")}
                                </Text>
                                <Text allowFontScaling={false} style={styles.storedesc}>
                                    {i18n.t("moredetailsplayingcards")}
                                </Text>
                                {(isLoading || refreshingUR) && (
                                    <LoadingLine loadBar={Colors.blueColor} />
                                )}
                                <View style={styles.container}>
                                    <FlatList
                                        removeClippedSubviews={false}
                                        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                                        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                                        initialNumToRender={5}
                                        showsVerticalScrollIndicator={false}
                                        refreshControl={refreshControl()}
                                        data={props.unregcardLists}
                                        contentContainerStyle={{
                                            paddingTop: '5%', paddingBottom: '15%',
                                            justifyContent: 'center', alignItems: 'center'
                                        }}
                                        keyExtractor={(item, idx) => item.MediaId?.toString() || idx.toString()}
                                        renderItem={_renderunRegItem}
                                        extraData={valuesText}
                                    />
                                </View>
                            </View>
                        )}

                    </View>
                </SafeAreaView>
            </View>

            {/* Barcode camera modal */}
            {cameraView && (
                <BarcodeInput visible={cameraView} onDone={updateInput} />
            )}
        </Modal>
    );
}