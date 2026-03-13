import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  Dimensions,
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  AppState,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import GestureFlipView from 'react-native-gesture-flip-card';
import * as Tools from '../../Tools/Components/Tools';
import WebServices from '../../Tools/constants/WebServices';
import FastImage from '@d11/react-native-fast-image';
import deleteButton from '../../assets/Icons/delete.png';
import ProfileData from '../../Tools/Components/ProfileData';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import {useTheme} from '../../Tools/context/ThemeProvider';
import {logScreenViewEvent} from '../../Tools/Analytics/AppAnalytics';
import {useFocusEffect} from '@react-navigation/native';
import {useAppContext} from '../../src/js/reducers/AppReducer';
import Barcode from '../../Tools/Components/Barcode';
import usePlayCardAPI from '../../Tools/hooks/usePlayCardAPI';

const {width} = Dimensions.get('window');

export default function CardsPage(props) {
  const Colors = useTheme();
  const {state} = useAppContext();
  i18n.translations = state.i18ntranslation;

  // --- Play Card API hook ---
  const {
    cardLists,
    setCardLists,
    cardNumbers,
    loaded,
    setLoaded,
    isLoading,
    error,
    fetchMedias,
    fetchMediaDetail,
    unregisterPlayCard,
  } = usePlayCardAPI({assignProfile: props.assignProfile});

  // --- Set locale ---
  useEffect(() => {
    i18n.locale = global.locale;
  }, [global.locale]);

  // --- Local state ---
  const [refreshing, setRefreshing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [alreadyIn, setAlreadyIn] = useState(false);

  // --- Refs: Map of card index → GestureFlipView ref ---
  const cardsViewRef = useRef({});

  // --- AppState listener: flip cards back to front on app resume ---
  const handleAppStateChange = useCallback(
    nextAppState => {
      console.log('[CardsPage] handleAppStateChange:', nextAppState);
      if (nextAppState === 'active') {
        if (state.profile != undefined) {
          setCardLists(prevCardLists => {
            const updatedList = [...prevCardLists];
            for (let index = 0; index < updatedList.length; index++) {
              updatedList[index] = {...updatedList[index], hasData: false};
              if (updatedList[index].rotate == 1) {
                const ref = cardsViewRef.current[index];
                if (ref) {
                  ref.flipLeft();
                }
              }
            }
            return updatedList;
          });
          setLoaded(1);
        }
      }
    },
    [state.profile, setCardLists, setLoaded],
  );

  // --- Mount effect: AppState listener + initial fetch ---
  useEffect(() => {
    console.log('[CardsPage] mount effect');
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    if (!Tools.IsNull(state.profile)) {
      fetchMedias();
    }

    return () => {
      subscription.remove();
    };
  }, []);

  // --- Focus effect: re-fetch on tab focus, login check ---
  useFocusEffect(
    useCallback(() => {
      console.log(
        '[CardsPage] useFocusEffect triggered, alreadyIn:',
        alreadyIn,
      );
      onNavigatorEvent();

      if (alreadyIn) {
        if (state.profile != undefined) {
          fetchMedias();
        }
      }

      return () => {
        setAlreadyIn(true);
      };
    }, [alreadyIn]),
  );

  // --- Profile change effect: hide login if profile loaded ---
  useEffect(() => {
    if (state.profile !== undefined && state.profile.FirstName !== undefined) {
      setShowLogin(false);
    }
  }, [state.profile]);

  // --- Analytics + login check on focus ---
  const onNavigatorEvent = () => {
    logScreenViewEvent('CardsPage', 'My Cards');
    const profileIn = Tools.IsNull(state.profile);
    if (profileIn) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  };

  // --- UI Helper: Get color by park location ---
  const getColor = _parkType => {
    if (_parkType == 'Angry Birds World') {
      return Colors.abColor;
    } else if (_parkType == 'Virtuocity') {
      return Colors.vcColor;
    } else if (_parkType == 'Snow Dunes') {
      return Colors.sdColor;
    } else {
      return Colors.bgColor;
    }
  };

  // --- UI Helper: Get background image by park location ---
  // NOTE: Snow Dunes uses vccard in CardsPage (preserved as-is per refinements)
  const getbgImage = _parkType => {
    if (_parkType == 'Angry Birds World') {
      return WebServices.abcard;
    } else if (_parkType == 'Virtuocity') {
      return WebServices.vccard;
    } else if (_parkType == 'Snow Dunes') {
      return WebServices.vccard;
    }
    return WebServices.generalcard;
  };

  // --- UI Helper: Format date to DD-MM-YYYY ---
  const formatDateToLocalString = dateString => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    const formattedDate = date
      .toLocaleDateString('en-GB', options)
      .split('/')
      .reverse()
      .join('-');
    return formattedDate;
  };

  // --- UI Helper: Get wallet slot display name ---
  const getName = _cardType => {
    if (Tools.stringIsContains(_cardType, 'wallet')) {
      return i18n.t('cardbalance');
    } else if (Tools.stringIsContains(_cardType, 'etickets')) {
      return i18n.t('redemptionbalance');
    } else {
      return i18n.t('bonusbalance');
    }
  };

  // --- UI Helper: Render primary balance (first wallet slot) ---
  const getCardBalance = (_card, _number) => {
    if (_card.WalletSlots.length == 0) {
      return;
    }
    const element = _card.WalletSlots[_number];
    return (
      <View
        style={{
          flexDirection: _number == 0 ? 'column' : 'row',
          paddingRight: '2%',
          justifyContent: 'center',
          alignSelf: 'center',
          width: '40%',
        }}>
        <Text allowFontScaling={false} style={styles.balanceTxt}>
          {getName(element.Name)}
        </Text>
        <Text
          allowFontScaling={false}
          style={[styles.balanceVal, {alignSelf: 'flex-start'}]}>
          {element.Balance} QAR
        </Text>
      </View>
    );
  };

  // --- UI Helper: Render secondary balances (wallet slots 1+) ---
  const getCardBalances = _card => {
    var cards = [];
    for (let index = 1; index < _card.WalletSlots.length; index++) {
      const element = _card.WalletSlots[index];
      cards.push(
        <View
          key={index}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            borderLeftWidth: 2,
            paddingLeft: '4%',
          }}>
          <Text
            allowFontScaling={false}
            style={[
              styles.balanceTxt,
              {
                fontSize: widthPercentageToDP('3.5%'),
                lineHeight: widthPercentageToDP('5%'),
                textAlign: 'right',
                alignSelf: 'flex-end',
              },
            ]}>
            {getName(element.Name)}
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.balanceVal,
              {
                textAlign: 'right',
                alignSelf: 'flex-end',
                fontSize: widthPercentageToDP('4.25%'),
                lineHeight: widthPercentageToDP('5.75%'),
              },
            ]}>
            {element.Balance +
              '' +
              (Tools.stringIsContains(element.Name, 'etickets')
                ? ' ' +
                  (element.Balance == 1 ? i18n.t('ticket') : i18n.t('tickets'))
                : ' QAR')}
          </Text>
        </View>,
      );
    }
    return cards;
  };

  // --- Card flip handler ---
  const onCardPress = (item, index) => {
    const ref = cardsViewRef.current[index];
    if (ref != undefined) {
      item.rotate = item.rotate == undefined ? 1 : item.rotate == 1 ? 0 : 1;
      ref.flipLeft();
      if (!item.hasData) {
        fetchMediaDetail(item);
      }
    }
  };

  // --- Render card front ---
  const renderFront = (card, index) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          borderRadius: widthPercentageToDP(7),
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: getColor(card.Location),
          alignSelf: 'center',
          width: widthPercentageToDP(79),
          height: widthPercentageToDP(79) / 1.6,
        }}>
        <FastImage
          style={{
            position: 'absolute',
            width: widthPercentageToDP(79),
            height: widthPercentageToDP(79) / 1.5779,
            alignSelf: 'center',
            color: getColor(card.Location),
          }}
          source={{
            uri: getbgImage(card.Location),
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{width: '100%', height: '100%'}}>
          <View
            style={[
              {
                position: 'absolute',
                flex: 1,
                alignSelf: 'flex-end',
                bottom: '25%',
              },
              global.locale == 'ar' ? {start: '4%'} : {end: '4%'},
            ]}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: widthPercentageToDP(3.7),
                includeFontPadding: false,
                fontFamily: 'Cairo-Bold',
                color: Colors.whiteAlways,
              }}>
              {i18n.t('playcardNumber')}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: widthPercentageToDP(5.2),
                fontFamily: 'Cairo-Regular',
                color: Colors.whiteAlways,
                includeFontPadding: false,
              }}>
              {cardNumbers[index]}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // --- Render card back ---
  const renderBack = (card, index) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          borderRadius: widthPercentageToDP(7),
          alignSelf: 'center',
          width: widthPercentageToDP(79),
          height: widthPercentageToDP(79) / 1.58,
          backgroundColor: getColor(card.Location),
        }}>
        <View style={{width: '100%', height: '100%'}}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              justifyContent: 'center',
              right: '3%',
              bottom: '4%',
            }}
            onPress={() => {
              Alert.alert(
                i18n.t('surewanttounregister'),
                '',
                [
                  {
                    text: i18n.t('proceed'),
                    onPress: () => {
                      unregisterPlayCard(cardLists[index].MediaId);
                    },
                  },
                  {
                    text: i18n.t('cancel'),
                    onPress: () =>
                      console.log('[CardsPage] Unregister cancelled'),
                  },
                ],
                {cancelable: true},
              );
            }}>
            <Image
              source={deleteButton}
              style={{
                width: 20,
                resizeMode: 'contain',
                tintColor: Colors.whiteColor,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: 'white',
              borderRadius: 5,
              overflow: 'hidden',
              width: '85%',
              marginBottom: '2%',
              marginTop: '5%',
            }}>
            {!Tools.stringIsEmpty(cardNumbers[index]) && (
              <Barcode
                value={cardNumbers[index]}
                viewStyle={{
                  marginTop: heightPercentageToDP(1),
                  marginBottom: heightPercentageToDP(1),
                }}
                width={widthPercentageToDP('.32%')}
                height={heightPercentageToDP('4%')}
                format="CODE128"
              />
            )}
            <Text
              allowFontScaling={false}
              style={[
                styles.cardno,
                {fontSize: 14, marginTop: -12, color: 'black'},
              ]}>
              {cardNumbers[index]}*XXX
            </Text>
          </View>
          {card.hasData && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: '88%',
                  bottom: 0,
                  alignItems: 'flex-start',
                }}>
                {getCardBalance(card, 0)}
                <View style={{flexDirection: 'column'}}>
                  {getCardBalances(card)}
                </View>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: '2%',
                  right: '10%',
                  alignItems: 'flex-end',
                  alignContent: 'flex-end',
                  alignSelf: 'flex-end',
                  flexDirection: 'row',
                }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.balanceTxt,
                    {
                      fontSize: widthPercentageToDP('3.5%'),
                      lineHeight: widthPercentageToDP('5%'),
                      textAlign: 'right',
                    },
                  ]}>
                  {Tools.stringIsContains(card.WalletExpiry, '000')
                    ? i18n.t('expired')
                    : i18n.t('expireson') + ': '}
                </Text>
                {!Tools.stringIsContains(card.WalletExpiry, '000') && (
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.balanceTxt,
                      {
                        fontWeight: '100',
                        color: Colors.whiteColor,
                        fontSize: widthPercentageToDP('3.5%'),
                        lineHeight: widthPercentageToDP('5%'),
                        textAlign: 'right',
                      },
                    ]}>
                    {' ' + formatDateToLocalString(card.WalletExpiry)}
                  </Text>
                )}
              </View>
            </>
          )}
          {!card.hasData && (
            <ActivityIndicator size="large" color={Colors.whiteColor} />
          )}
        </View>
      </View>
    );
  };

  // --- FlatList renderItem ---
  const _renderItem = ({item, index}) => {
    if (loaded == 0) {
      return <></>;
    }
    return (
      <TouchableWithoutFeedback
        key={index + 'twf'}
        onPress={() => onCardPress(item, index)}
        style={styles.container}>
        <View>
          <GestureFlipView
            key={index}
            ref={ref => {
              cardsViewRef.current[index] = ref;
            }}
            width={widthPercentageToDP(79)}
            height={widthPercentageToDP(79) / 1.58}
            renderFront={() => renderFront(item, index)}
            renderBack={() => renderBack(item, index)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // --- Pull-to-refresh ---
  const refreshControl = () => {
    return (
      <RefreshControl
        tintColor={Colors.blueColor}
        refreshing={refreshing}
        onRefresh={() => {
          console.log('[CardsPage] refreshListView: pull to refresh');
          fetchMedias();
        }}
      />
    );
  };

  // --- Styles ---
  const styles = StyleSheet.create({
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
  });

  // --- JSX ---
  return (
    <View behavior="padding" style={{flex: 1, backgroundColor: Colors.bgColor}}>
      <BackgroundWall />
      <SafeAreaView style={{flex: 1, marginTop: StatusBar.currentHeight}}>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            marginTop: heightPercentageToDP(3),
          }}>
          <View style={{width: widthPercentageToDP(93), alignSelf: 'center'}}>
            <Text allowFontScaling={false} style={styles.tagline}>
              {i18n.t('mycards')}
            </Text>
            <View
              style={{
                height: '94%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              {cardLists.length == 0 && (
                <ScrollView
                  style={{
                    alignSelf: 'center',
                    height: '100%',
                    width: widthPercentageToDP(100),
                    alignContent: 'center',
                  }}
                  contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  refreshControl={refreshControl()}>
                  {error ? (
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.storedesc,
                        {color: Colors.orangeShadeColor},
                      ]}>
                      {error}
                    </Text>
                  ) : (
                    <>
                      <Text allowFontScaling={false} style={styles.storedesc}>
                        {i18n.t('nocardsavailablemycards')}
                      </Text>
                      <Text allowFontScaling={false} style={styles.storedesc}>
                        {i18n.t('moredetailsmycards')}
                      </Text>
                    </>
                  )}
                </ScrollView>
              )}
              {error && cardLists.length > 0 && (
                <View style={{padding: 10, alignItems: 'center'}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'Cairo-Regular',
                      fontSize: widthPercentageToDP(3.5),
                      color: Colors.orangeShadeColor,
                      textAlign: 'center',
                    }}>
                    {error}
                  </Text>
                </View>
              )}
              {loaded == 1 && cardLists.length > 0 && (
                <View style={{flex: 1}}>
                  <FlatList
                    removeClippedSubviews={false}
                    data={cardLists}
                    keyExtractor={item => item.Id.toString()}
                    initialNumToRender={5}
                    ItemSeparatorComponent={() => (
                      <View style={{height: 20}}></View>
                    )}
                    showsVerticalScrollIndicator={false}
                    refreshControl={refreshControl()}
                    contentContainerStyle={{paddingBottom: '25%'}}
                    style={{width: '100%'}}
                    renderItem={_renderItem}
                  />
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.buttonView}
            onPress={() => {
              props.navigation.navigate('AddCards');
            }}>
            <Text style={styles.buttonText} allowFontScaling={false}>
              {i18n.t('registercard')}{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {showLogin && (
        <ProfileData
          pagetogo="signinuser"
          showsignin="1"
          navigation={props.navigation}
          onDismiss={() => {
            props.navigation.navigate('Homescreen');
            setShowLogin(false);
          }}
        />
      )}
    </View>
  );
}
