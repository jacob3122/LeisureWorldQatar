import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import cameraIcon from '../../assets/Icons/camera.png';
import * as tools from '../../Tools/Components/Tools.js';
import GestureFlipView from 'react-native-gesture-flip-card';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import WebServices from '../constants/WebServices';
import BarcodeInput from './BarcodeInput';
import {useTheme} from '../context/ThemeProvider';
import Barcode from './Barcode.js';
import {useAppContext} from '../../src/js/reducers/AppReducer';

export default function AddPlayCard(props) {
  const Colors = useTheme();
  const {state} = useAppContext();
  i18n.translations = state.i18ntranslation;

  // --- Refs (fixed: no longer global scope) ---
  const cardsViewRef = useRef(null);
  const textRef = useRef(null);

  // --- State ---
  const [cameraView, setCameraView] = useState(0);
  const [valueText, setValueText] = useState('');
  const [card, setCard] = useState({
    verify: false,
    CardNo: '0000000000*000',
  });

  // --- Set locale ---
  useEffect(() => {
    i18n.locale = global.locale;
  }, [global.locale]);

  // --- UI Helper: Get color by park abbreviation ---
  const getColor = _parkType => {
    if (_parkType == 'AB') {
      return Colors.abColor;
    } else if (_parkType == 'VC') {
      return Colors.vcColor;
    } else if (_parkType == 'SD') {
      return Colors.sdColor;
    } else {
      return Colors.inactiveTab;
    }
  };

  // --- Get card number display ---
  const getCardNo = _card => {
    return _card.CardNo;
  };

  // --- Camera ---
  const openCamera = () => {
    setCameraView(1);
  };

  const updateInput = _output => {
    setValueText(_output);
    setCameraView(0);
  };

  // --- Render card back ---
  const renderBack = cardData => {
    return (
      <View
        style={{
          justifyContent: 'center',
          borderRadius: 20,
          overflow: 'hidden',
          alignSelf: 'center',
          width: widthPercentageToDP(79),
          height: heightPercentageToDP(25),
          backgroundColor: getColor(cardData.ParkName),
        }}>
        {!cardData.verify && (
          <View
            style={{width: '100%', height: '100%', justifyContent: 'center'}}>
            <TouchableOpacity
              style={{
                width: '35%',
                alignSelf: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.blueColor,
                borderRadius: 20,
                height: '20%',
              }}
              onPress={() => {
                if (cardsViewRef.current) {
                  cardsViewRef.current.flipRight();
                }
              }}>
              <Text allowFontScaling={false} style={styles.buttonTxt}>
                {i18n.t('add')}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                bottom: '2%',
                width: '100%',
              }}></View>
          </View>
        )}
        {cardData.verify && (
          <View
            style={{width: '100%', height: '100%', justifyContent: 'center'}}>
            <View
              style={{
                position: 'absolute',
                top: '5%',
                right: '5%',
                backgroundColor: Colors.whiteColor,
                borderRadius: 15,
                overflow: 'hidden',
              }}>
              <Barcode
                value={cardData.CardNo}
                viewStyle={{
                  marginTop: heightPercentageToDP(1),
                  marginBottom: heightPercentageToDP(1),
                }}
                width={widthPercentageToDP('.32%')}
                height={heightPercentageToDP('4%')}
                format="CODE128"
              />
              <Text
                allowFontScaling={false}
                style={[
                  styles.cardno,
                  {fontSize: 14, marginTop: -12, color: Colors.black},
                ]}>
                {cardData.CardNo}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // --- Render card front ---
  const renderFront = cardData => {
    return (
      <View
        style={{
          justifyContent: 'center',
          borderRadius: 20,
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          width: widthPercentageToDP(79),
          height: heightPercentageToDP(25),
          backgroundColor: getColor(cardData.ParkName),
        }}>
        {cardData.verify && (
          <View style={{width: '100%', height: '100%'}}>
            <View style={{flexDirection: 'row', flex: 1, alignSelf: 'center'}}>
              <TouchableOpacity
                style={{
                  width: '35%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.whiteColor,
                  borderRadius: 10,
                  height: '20%',
                }}
                onPress={() => {}}>
                <Text allowFontScaling={false} style={styles.buttonTxt}>
                  {i18n.t('topup')}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                justifyContent: 'center',
                right: '5%',
                bottom: '2%',
                alignItems: 'center',
              }}>
              <Text style={styles.balanceTxt}>{i18n.t('yourbalance')}</Text>
              <Text allowFontScaling={false} style={styles.balanceVal}>
                {cardData.Balance}
              </Text>
            </View>
          </View>
        )}
        {!cardData.verify && (
          <View
            style={{width: '100%', height: '100%', justifyContent: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                width: '70%',
                height: '20%',
                alignSelf: 'center',
              }}>
              <TextInput
                ref={ref => {
                  textRef.current = ref;
                }}
                value={valueText}
                allowFontScaling={false}
                maxLength={14}
                placeholder={getCardNo(cardData)}
                onChangeText={textIn => {
                  setValueText(textIn);
                }}
                onEndEditing={textIn => {
                  setValueText(textIn.nativeEvent.text);
                }}
                style={[
                  {
                    fontFamily: 'Cairo-Regular',
                    backgroundColor: Colors.whiteColor,
                    includeFontPadding: false,
                    width: '100%',
                    alignSelf: 'center',
                    height: heightPercentageToDP(4.75),
                    borderRadius: heightPercentageToDP(4.75),
                    padding: 5,
                    fontSize: widthPercentageToDP(4.5),
                    textAlign: 'center',
                  },
                  styles.shadow,
                ]}
              />
              <TouchableOpacity
                style={{position: 'absolute', alignSelf: 'center', end: '5%'}}
                onPress={() => {
                  openCamera();
                }}>
                <Image
                  style={{tintColor: Colors.blueColor}}
                  source={cameraIcon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                marginTop: '5%',
                backgroundColor: Colors.blueColor,
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: heightPercentageToDP(4.75),
                height: heightPercentageToDP(4.75),
                paddingLeft: '5%',
                paddingRight: '2%',
              }}
              onPress={() => {
                if (!valueText || valueText.length == 0) {
                  return;
                }
                let textVal = valueText.trim();
                if (textVal.length == 0) {
                  return;
                }
                if (tools.stringIsContains(textVal, '*')) {
                  textVal = textVal.substring(0, textVal.indexOf('*'));
                }
                if (textVal.length == 0) {
                  return;
                }
                console.log(
                  '[AddPlayCard] Confirm card pressed, code:',
                  textVal,
                );
                props.searchMedia(textVal, props.onDone);
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text allowFontScaling={false} style={styles.buttonTxt}>
                  {i18n.t('confirmcard')}
                </Text>
              </View>
            </TouchableOpacity>
            {cameraView == 1 && (
              <BarcodeInput visible={cameraView == 1} onDone={updateInput} />
            )}
          </View>
        )}
      </View>
    );
  };

  // --- Empty card flip view ---
  const getEmptyCard = () => {
    return (
      <View style={{alignSelf: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            if (cardsViewRef.current != undefined) {
              cardsViewRef.current.flipLeft();
            }
          }}
          style={styles.container}>
          <GestureFlipView
            ref={ref => {
              cardsViewRef.current = ref;
            }}
            width={widthPercentageToDP(79)}
            height={heightPercentageToDP(25)}
            renderFront={() => renderFront(card)}
            renderBack={() => renderBack(card)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // --- Styles ---
  const styles = StyleSheet.create({
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
      fontFamily: 'Cairo-Bold',
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
    tagline: {
      includeFontPadding: false,
      fontFamily: 'Cairo-Bold',
      fontSize: widthPercentageToDP(7),
      alignSelf: 'flex-start',
      color: Colors.inputfontColor,
    },
    shadow: {
      shadowOffset: {width: 0, height: 3},
      shadowRadius: 3,
      shadowOpacity: 0.12,
    },
  });

  // --- JSX ---
  return (
    <View>
      <View style={{left: 0, right: 0, bottom: 0, zIndex: 10}}>
        <SafeAreaView
          style={{width: widthPercentageToDP(93), alignSelf: 'center'}}>
          <Text allowFontScaling={false} style={styles.tagline}>
            {i18n.t('manualaddcards')}
          </Text>
          {getEmptyCard()}
        </SafeAreaView>
      </View>
    </View>
  );
}
