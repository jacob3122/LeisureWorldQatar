import React, { useState, useRef, useMemo } from 'react';
import {
    StyleSheet, View, Text, Image, TouchableOpacity, TextInput, SafeAreaView
} from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import cameraIcon from '../../assets/Icons/camera.png';
import * as tools from '../../Tools/Components/Tools.js';
import GestureFlipView from 'react-native-gesture-flip-card';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import WebServices from '../constants/WebServices';
import BarcodeInput from './BarcodeInput';
import { useTheme } from '../context/ThemeProvider';
import Barcode from './Barcode.js';

export default function AddPlayCard(props) {
    const Colors = useTheme();

    // FIX: use const refs instead of polluting global scope
    const cardsViewRef = useRef(null);
    const textRef = useRef(null);

    const [cameraView, setCameraView] = useState(false);
    const [valueText, setValueText] = useState("");
    const [card] = useState({
        verify: false,
        CardNo: "0000000000*000"
    });

    const getColor = (_parkType) => {
        if (_parkType === "AB") return Colors.abColor;
        if (_parkType === "VC") return Colors.vcColor;
        if (_parkType === "SD") return Colors.sdColor;
        return Colors.inactiveTab;
    };

    const getCardNo = (_card) => _card.CardNo;

    const updateInput = (_output) => {
        setValueText(_output);
        setCameraView(false);
    };

    const renderBack = (card) => {
        return (
            <View style={{
                justifyContent: 'center', borderRadius: 20, overflow: 'hidden',
                alignSelf: 'center', width: widthPercentageToDP(79),
                height: heightPercentageToDP(25), backgroundColor: getColor(card.ParkName)
            }}>
                {!card.verify && (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{
                                width: '35%', alignSelf: 'center', justifyContent: 'center',
                                backgroundColor: Colors.blueColor, borderRadius: 20, height: '20%'
                            }}
                            onPress={() => {
                                cardsViewRef.current?.flipRight?.();
                            }}>
                            <Text allowFontScaling={false} style={styles.buttonTxt}>{i18n.t('add')}</Text>
                        </TouchableOpacity>
                        <View style={{ position: 'absolute', bottom: '2%', width: '100%' }} />
                    </View>
                )}
                {card.verify && (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                        <View style={{
                            position: 'absolute', top: '5%', right: '5%',
                            backgroundColor: Colors.whiteColor, borderRadius: 15, overflow: 'hidden'
                        }}>
                            <Barcode value={card.CardNo}
                                viewStyle={{ marginTop: heightPercentageToDP(1), marginBottom: heightPercentageToDP(1) }}
                                width={widthPercentageToDP('.32%')} height={heightPercentageToDP('4%')}
                                format="CODE128" />
                            <Text allowFontScaling={false}
                                style={[styles.cardno, { fontSize: 14, marginTop: -12, color: Colors.black }]}>
                                {card.CardNo}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const renderFront = (card) => {
        return (
            <View style={{
                justifyContent: 'center', borderRadius: 20,
                alignContent: 'center', alignItems: 'center',
                alignSelf: 'center', width: widthPercentageToDP(79),
                height: heightPercentageToDP(25), backgroundColor: getColor(card.ParkName)
            }}>
                {card.verify && (
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ flexDirection: 'row', flex: 1, alignSelf: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    width: '35%', alignSelf: 'center', justifyContent: 'center',
                                    backgroundColor: Colors.whiteColor, borderRadius: 10, height: '20%'
                                }}
                                onPress={() => { }}>
                                <Text allowFontScaling={false} style={styles.buttonTxt}>{i18n.t('topup')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            position: 'absolute', flexDirection: 'row', justifyContent: 'center',
                            right: '5%', bottom: '2%', alignItems: 'center'
                        }}>
                            <Text style={styles.balanceTxt}>{i18n.t("yourbalance")}</Text>
                            <Text allowFontScaling={false} style={styles.balanceVal}>{card.Balance}</Text>
                        </View>
                    </View>
                )}
                {!card.verify && (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                        {/* Input + camera row */}
                        <View style={{ flexDirection: 'row', width: '70%', height: '20%', alignSelf: 'center' }}>
                            <TextInput
                                ref={ref => { textRef.current = ref; }}
                                value={valueText}
                                allowFontScaling={false}
                                maxLength={14}
                                placeholder={getCardNo(card)}
                                onChangeText={(textIn) => { setValueText(textIn); }}
                                onEndEditing={(textIn) => { setValueText(textIn.nativeEvent.text); }}
                                style={[{
                                    fontFamily: 'Cairo-Regular', backgroundColor: Colors.whiteColor,
                                    includeFontPadding: false, width: '100%', alignSelf: 'center',
                                    height: heightPercentageToDP(4.75),
                                    borderRadius: heightPercentageToDP(4.75),
                                    padding: 5, fontSize: widthPercentageToDP(4.5), textAlign: 'center'
                                }, styles.shadow]}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute', alignSelf: 'center', end: '5%' }}
                                onPress={() => { setCameraView(true); }}>
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
                                let textVal = valueText;
                                if (textVal.length === 0) return;

                                if (tools.stringIsContains(valueText, "*")) {
                                    textVal = valueText.substring(0, valueText.indexOf('*'));
                                }

                                if (props.searchMedia) {
                                    props.searchMedia(textVal, props.accessToken);
                                }
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text allowFontScaling={false} style={styles.buttonTxt}>{i18n.t('confirmcard')}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Camera barcode scanner */}
                        {cameraView && <BarcodeInput visible={cameraView} onDone={updateInput} />}
                    </View>
                )}
            </View>
        );
    };

    const getEmptyCard = () => (
        <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => {
                cardsViewRef.current?.flipLeft?.();
            }} style={styles.container}>
                <GestureFlipView
                    ref={ref => { cardsViewRef.current = ref; }}
                    width={widthPercentageToDP(79)}
                    height={heightPercentageToDP(25)}
                    renderFront={() => renderFront(card)}
                    renderBack={() => renderBack(card)}
                />
            </TouchableOpacity>
        </View>
    );

    // Styles memoized
    const styles = useMemo(() => StyleSheet.create({
        container: {
            width: '90%',
            alignSelf: 'center',
        },
        buttonTxt: {
            includeFontPadding: false,
            paddingHorizontal: widthPercentageToDP(4),
            alignSelf: 'center',
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            fontSize: widthPercentageToDP(4.2),
            color: Colors.whiteColor,
        },
        cardno: {
            includeFontPadding: false,
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
            includeFontPadding: false,
            textAlignVertical: 'center',
            color: Colors.whiteColor,
            fontWeight: '100',
            fontFamily: 'Cairo-Regular',
            fontSize: 30,
            paddingStart: 10,
        },
        loading: {
            left: 0, right: 0, bottom: 0,
            zIndex: 10,
        },
        tagline: {
            includeFontPadding: false,
            fontFamily: 'Cairo-Bold',
            fontSize: widthPercentageToDP(7),
            alignSelf: 'flex-start',
            color: Colors.inputfontColor,
        },
        shadow: {
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 3,
            shadowOpacity: 0.12,
        },
    }), [Colors]);

    return (
        <View>
            <View style={styles.loading}>
                <SafeAreaView style={{ width: widthPercentageToDP(93), alignSelf: 'center' }}>
                    <Text allowFontScaling={false} style={styles.tagline}>
                        {i18n.t('manualaddcards')}
                    </Text>
                    {getEmptyCard()}
                </SafeAreaView>
            </View>
        </View>
    );
}