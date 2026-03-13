import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function PlayCardList(props) {
    const Colors = useTheme();
    const { state } = useAppContext();
    i18n.translations = state.i18ntranslation;

    // --- State ---
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [localIsLoading, setLocalIsLoading] = useState(true);
    const [cameraView, setCameraView] = useState(0);
    const [valuesText, setValuesText] = useState([]);
    const [isVisible, setIsVisible] = useState(props.isopen);
    const [showNoItems, setShowNoItems] = useState(false);
    const [refreshingUR, setRefreshingUR] = useState(false);

    // --- Track mount status ---
    const isMounted = useRef(true);

    // --- Set locale ---
    useEffect(() => {
        i18n.locale = global.locale;
    }, [global.locale]);

    // --- Mount: fetch unregistered cards ---
    useEffect(() => {
        isMounted.current = true;
        setLocalIsLoading(true);

        const timer = setTimeout(() => {
            props.findPlayCard(null, null, () => {
                if (isMounted.current) {
                    setLocalIsLoading(false);
                }
            });
        }, 100);

        // Initialize valuesText for existing unregcardLists
        if (props.unregcardLists && props.unregcardLists.length > 0) {
            const initialValues = [];
            let alreadyRegisteredCount = 0;
            for (let index = 0; index < props.unregcardLists.length; index++) {
                initialValues.push("");
                if (checkCard(props.unregcardLists[index], props.cardLists)) {
                    alreadyRegisteredCount += 1;
                }
            }
            setValuesText(initialValues);
            if (alreadyRegisteredCount > 0 && alreadyRegisteredCount === props.unregcardLists.length) {
                setShowNoItems(true);
            } else {
                setShowNoItems(false);
            }
        }

        return () => {
            isMounted.current = false;
            clearTimeout(timer);
        };
    }, []);

    // --- When loadedUnreg changes to 1, stop loading + recheck showNoItems ---
    useEffect(() => {
        if (props.loadedUnreg === 1) {
            if (isMounted.current) {
                setLocalIsLoading(false);
            }
            // Reinitialize valuesText and check showNoItems with fresh data
            if (props.unregcardLists && props.unregcardLists.length > 0) {
                const newValues = [];
                let alreadyRegisteredCount = 0;
                for (let index = 0; index < props.unregcardLists.length; index++) {
                    // Preserve existing input values if available
                    newValues.push(valuesText[index] || "");
                    if (checkCard(props.unregcardLists[index], props.cardLists)) {
                        alreadyRegisteredCount += 1;
                    }
                }
                setValuesText(newValues);
                if (alreadyRegisteredCount > 0 && alreadyRegisteredCount === props.unregcardLists.length) {
                    setShowNoItems(true);
                } else {
                    setShowNoItems(false);
                }
            }
        }
    }, [props.loadedUnreg]);

    // --- Check if unregistered card is already in registered list ---
    const checkCard = (_item, _List) => {
        for (let index = 0; index < _List.length; index++) {
            if (tools.stringIsContains(_item.MediaId, _List[index].MediaId)) {
                return true;
            }
        }
        return false;
    };

    // --- UI Helper: Get color by park location ---
    const getColor = (_parkType) => {
        if (_parkType == "Angry Birds World") {
            return Colors.abColor;
        } else if (_parkType == "Virtuocity") {
            return Colors.vcColor;
        } else if (_parkType == "Snow Dunes") {
            return Colors.sdColor;
        } else {
            return Colors.bgColor;
        }
    };

    // --- UI Helper: Get background image by park location ---
    // NOTE: Snow Dunes uses sdcard in PlayCardList (preserved as-is per refinements)
    const getbgImage = (_parkType) => {
        if (_parkType == "Angry Birds World") {
            return WebServices.abcard;
        } else if (_parkType == "Virtuocity") {
            return WebServices.vccard;
        } else if (_parkType == "Snow Dunes") {
            return WebServices.sdcard;
        }
        return WebServices.generalcard;
    };

    // --- Camera ---
    const openCamera = () => {
        setCameraView(1);
    };

    const updateInput = (_output) => {
        if (currentIndex !== -1) {
            const newValues = [...valuesText];
            newValues[currentIndex] = _output;
            setValuesText(newValues);
        }
        setCameraView(0);
    };

    // --- Pull to refresh ---
    const refreshControlUnReg = () => {
        return (
            <RefreshControl
                tintColor={Colors.orangeShadeColor}
                refreshing={refreshingUR}
                onRefresh={() => {
                    setRefreshingUR(true);
                    props.findPlayCard(null, null, () => {
                        setRefreshingUR(false);
                    });
                }}
            />
        );
    };

    // --- Render unregistered card front ---
    const renderunRegFront = (card, index) => {
        return (
            <View style={{
                justifyContent: 'center', borderRadius: 20, alignContent: 'center', alignItems: 'center',
                alignSelf: 'center', width: widthPercentageToDP(79), height: (widthPercentageToDP(79) / 1.58),
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
                        i18n.locale == 'ar' ? { start: '3%' } : { end: '3%' }
                    ]}>
                        <Text allowFontScaling={false} style={{
                            fontSize: widthPercentageToDP(3.7), fontFamily: 'Cairo-Regular',
                            color: Colors.whiteColor, alignSelf: 'flex-start'
                        }}>{i18n.t("playcardNumber")}</Text>
                        <Text allowFontScaling={false} style={{
                            fontSize: widthPercentageToDP(4.5), fontFamily: 'Cairo-Regular',
                            color: Colors.whiteColor, alignSelf: 'flex-start', marginBottom: '2%'
                        }}>{props.unregcardNumber[index] + "*XXX"}</Text>
                        <TouchableOpacity
                            style={{
                                marginTop: '1%', backgroundColor: Colors.blueColor,
                                justifyContent: 'center', alignSelf: 'flex-start',
                                borderRadius: heightPercentageToDP(4.75),
                                height: heightPercentageToDP(4.75),
                                paddingLeft: '7%', paddingRight: '3%'
                            }}
                            onPress={() => {
                                if (props.unregcardsViewRef[index] != undefined) {
                                    props.unregcardsViewRef[index].current.flipLeft();
                                }
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text allowFontScaling={false} style={styles.buttonText}>{i18n.t('verifycard')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    // --- Render unregistered card back ---
    const renderunRegBack = (card, index) => {
        return (
            <View style={{
                justifyContent: 'center', borderRadius: 20,
                alignSelf: 'center', width: widthPercentageToDP(79),
                height: (widthPercentageToDP(79) / 1.58), backgroundColor: getColor(card.Location)
            }}>
                <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', width: '70%', alignSelf: 'center' }}>
                        <TextInput
                            ref={ref => {
                                if (props.unregcardsInputRef[index] != undefined) {
                                    props.unregcardsInputRef[index].current = ref;
                                }
                            }}
                            value={valuesText[index] || ""}
                            allowFontScaling={false}
                            maxLength={14}
                            placeholder={props.unregcardNumber[index] + "*XXX"}
                            placeholderTextColor={Colors.inputfontColor}
                            onChangeText={(textIn) => {
                                const newValues = [...valuesText];
                                newValues[index] = textIn;
                                setValuesText(newValues);
                            }}
                            onEndEditing={(textIn) => {
                                const newValues = [...valuesText];
                                newValues[index] = textIn.nativeEvent.text;
                                setValuesText(newValues);
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
                                openCamera();
                            }}>
                            <Image style={{ tintColor: Colors.blueColor }} source={cameraIcon} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={{
                            marginTop: '5%', backgroundColor: Colors.blueColor,
                            justifyContent: 'center', alignSelf: 'center',
                            borderRadius: heightPercentageToDP(4.75),
                            height: heightPercentageToDP(4.75),
                            paddingLeft: '5%', paddingRight: '2%'
                        }}
                        onPress={() => {
                            let textVal = valuesText[index] || "";

                            if (tools.stringIsContains(textVal, "*")) {
                                textVal = textVal.substring(0, textVal.indexOf('*'));
                            }

                            if (!tools.stringIsContains(props.unregcardFullNumber[index], textVal)) {
                                Alert.alert(i18n.t("invalidplaycard"));
                                return;
                            }

                            props.checkandRegister(index);
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text allowFontScaling={false} style={styles.buttonTxt}>{i18n.t('confirmcard')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // --- FlatList renderItem for unregistered cards ---
    const _renderunRegItem = ({ item, index }) => {
        if (checkCard(item, props.cardLists)) {
            return (<></>);
        }
        return (
            <TouchableWithoutFeedback onPress={() => {
                if (props.unregcardsViewRef[index] != undefined) {
                    props.unregcardsViewRef[index].current.flipLeft();
                }
            }}>
                <View>
                    <GestureFlipView
                        key={index}
                        ref={ref => {
                            if (props.unregcardsViewRef[index] != undefined) {
                                props.unregcardsViewRef[index].current = ref;
                            }
                        }}
                        width={widthPercentageToDP(79)}
                        height={(widthPercentageToDP(79) / 1.58)}
                        renderFront={() => renderunRegFront(item, index)}
                        renderBack={() => renderunRegBack(item, index)}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    // --- Styles ---
    const styles = StyleSheet.create({
        container: {
            width: '100%', alignItems: 'center', flex: 1
        },
        buttonText: {
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            color: Colors.whiteColor,
            fontSize: widthPercentageToDP(4.2),
            paddingHorizontal: widthPercentageToDP(4)
        },
        buttonTxt: {
            paddingHorizontal: widthPercentageToDP(4),
            alignSelf: 'center',
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            fontSize: widthPercentageToDP(4.2),
            color: Colors.whiteColor
        },
        tagline: {
            fontFamily: 'Cairo-Bold',
            fontSize: widthPercentageToDP(7),
            alignSelf: 'flex-start',
            color: Colors.inputfontColor
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
        nocards: {
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            fontSize: widthPercentageToDP(4.2),
        },
        loading: {
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
        },
        shadow: {
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 3,
            shadowOpacity: 0.12,
        },
    });

    // --- JSX ---
    return (
        <Modal statusBarTranslucent={true} animationType='none' visible={isVisible}>
            <BackgroundWall />
            <View style={styles.loading}>
                <SafeAreaView style={{ width: widthPercentageToDP(93), alignSelf: 'center' }}>
                    <TouchableOpacity style={{ marginTop: heightPercentageToDP(1) }} onPress={() => {
                        console.log('[PlayCardList] Back button pressed');
                        props.onDone();
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

                        {(showNoItems || (props.unregcardLists.length == 0)) &&
                            <ScrollView
                                style={{
                                    alignSelf: 'center', height: '100%',
                                    width: widthPercentageToDP(100), alignContent: 'center', position: 'absolute'
                                }}
                                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                refreshControl={refreshControlUnReg()}>
                                <View style={{ width: '90%' }}>
                                    <Text allowFontScaling={false} style={styles.storedesc}>{i18n.t("nocardsavailableplayingcards")}</Text>
                                    {(!localIsLoading && !refreshingUR) &&
                                        <Text allowFontScaling={false} style={styles.nocards}>{i18n.t("nocardsavailable")}</Text>
                                    }
                                </View>
                                {(localIsLoading || refreshingUR) && <LoadingLine loadBar={Colors.orangeShadeColor} />}
                            </ScrollView>
                        }

                        {(!showNoItems) && props.loadedUnreg == 1 && props.unregcardLists.length > 0 &&
                            <View style={{ flex: 1, width: widthPercentageToDP(90), alignSelf: 'center' }}>
                                <Text allowFontScaling={false} style={styles.storedesc}>{i18n.t("nocardsavailableplayingcards")}</Text>
                                <Text allowFontScaling={false} style={styles.storedesc}>{i18n.t("moredetailsplayingcards")}</Text>
                                {(localIsLoading || refreshingUR) && <LoadingLine loadBar={Colors.blueColor} />}

                                <View style={styles.container}>
                                    <FlatList
                                        removeClippedSubviews={false}
                                        viewabilityConfig={{
                                            itemVisiblePercentThreshold: 50
                                        }}
                                        ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
                                        initialNumToRender={5}
                                        showsVerticalScrollIndicator={false}
                                        refreshControl={refreshControlUnReg()}
                                        data={props.unregcardLists}
                                        contentContainerStyle={{
                                            paddingTop: '5%', paddingBottom: '15%',
                                            justifyContent: 'center', alignItems: 'center'
                                        }}
                                        renderItem={_renderunRegItem}
                                    />
                                </View>
                            </View>}
                    </View>
                </SafeAreaView>
            </View>
            {cameraView == 1 && <BarcodeInput visible={cameraView == 1} onDone={updateInput} />}
        </Modal>
    );
}