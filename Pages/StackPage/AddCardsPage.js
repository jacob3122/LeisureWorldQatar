import React, { useEffect, useState, useRef, createRef } from 'react';
import {
    Image, SafeAreaView, View, Text, StyleSheet,
    TouchableOpacity, StatusBar
} from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import * as Tools from '../../Tools/Components/Tools';
import AddPlayCard from '../../Tools/Components/AddPlayCard';
import PlayCardList from '../../Tools/Components/PlayCardList';
import ProfileData from '../../Tools/Components/ProfileData';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';
import * as UIElements from '../../Tools/Components/UIElements';
import OverlayLoad from '../../Tools/Components/OverlayLoad';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import usePlayCardAPI from '../../Tools/hooks/usePlayCardAPI';
import backButton from '../../assets/Icons/back.png';

export default function AddCardsPage(props) {
    const Colors = useTheme();
    const { state } = useAppContext();
    i18n.translations = state.i18ntranslation;

    // --- Play Card API hook ---
    const {
        cardLists,
        unregcardLists,
        unregcardNumbers,
        unregcardFullNumbers,
        loadedUnreg,
        isLoading,
        setIsLoading,
        searchPlayCard,
        findPlayCard,
        checkandRegister,
        initCards,
    } = usePlayCardAPI({ assignProfile: props.assignProfile });

    // --- Local state ---
    const [addPlayCardView, setAddPlayCardView] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    // --- Refs for unregistered cards (passed to PlayCardList) ---
    const unregcardsViewRef = useRef([]);
    const unregcardsInputRef = useRef([]);

    // --- Set locale ---
    useEffect(() => {
        i18n.locale = global.locale;
    }, [global.locale]);

    // --- Ensure refs arrays grow with unregcardLists ---
    useEffect(() => {
        if (unregcardLists && unregcardLists.length > 0) {
            while (unregcardsViewRef.current.length < unregcardLists.length) {
                unregcardsViewRef.current.push(createRef());
            }
            while (unregcardsInputRef.current.length < unregcardLists.length) {
                unregcardsInputRef.current.push(createRef());
            }
        }
    }, [unregcardLists]);

    // --- Callback: manual card entry done (searchPlayCard → registerPlayCard chain completed) ---
    const OnDone = () => {
        console.log('[AddCardsPage] OnDone: registration complete, navigating back');
        setAddPlayCardView(false);
        props.navigation.goBack();
    };

    // --- Callback: PlayCardList done/dismissed ---
    const OnDonePL = (_doneVal = false, callback = null) => {
        console.log('[AddCardsPage] OnDonePL: closing PlayCardList, _doneVal:', _doneVal);
        setAddPlayCardView(false);
    };

    // --- Styles ---
    const styles = StyleSheet.create({
        buttonText: {
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            color: Colors.whiteColor,
            fontSize: widthPercentageToDP(4.2),
            paddingHorizontal: widthPercentageToDP(3)
        },
        buttonView: {
            backgroundColor: Colors.blueColor,
            height: heightPercentageToDP(4.75),
            borderRadius: heightPercentageToDP(4.75),
            alignSelf: 'center',
            justifyContent: 'center',
            paddingLeft: '4%',
            paddingRight: '4%'
        },
    });

    // --- JSX ---
    return (
        <View behavior="padding" style={{ flex: 1, backgroundColor: Colors.bgColor }}>
            <BackgroundWall />
            <SafeAreaView style={{ marginTop: StatusBar.currentHeight, width: widthPercentageToDP(93), alignSelf: 'center' }}>
                <TouchableOpacity style={{}} onPress={() => {
                    props.navigation.goBack();
                }}>
                    <Image style={{
                        tintColor: Colors.blueColor, width: 25, height: 25,
                        transform: [{ scaleX: Tools.stringIsContains(i18n.locale, 'en') ? 1 : -1 }]
                    }} source={backButton} />
                </TouchableOpacity>
                <View style={{ width: '100%' }}>
                    <AddPlayCard
                        searchMedia={searchPlayCard}
                        onDone={OnDone}
                    />
                    {UIElements.drawGap(heightPercentageToDP(2))}
                    <Text style={{
                        color: Colors.blueColor, alignSelf: 'center',
                        fontFamily: 'Cairo-Regular', fontSize: widthPercentageToDP(4)
                    }}>{i18n.t('or')}</Text>
                    {UIElements.drawGap(heightPercentageToDP(2))}
                    <TouchableOpacity style={styles.buttonView}
                        onPress={() => {
                            setAddPlayCardView(true);
                        }}>
                        <Text style={styles.buttonText} allowFontScaling={false}>{i18n.t('registercard')} </Text>
                    </TouchableOpacity>
                </View>
                {addPlayCardView &&
                    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        <PlayCardList
                            unregcardsViewRef={unregcardsViewRef.current}
                            cardLists={cardLists}
                            updateLoad={setIsLoading}
                            unregcardsInputRef={unregcardsInputRef.current}
                            unregcardFullNumber={unregcardFullNumbers}
                            checkandRegister={(index) => {
                                checkandRegister(index, OnDone);
                            }}
                            unregcardNumber={unregcardNumbers}
                            loadedUnreg={loadedUnreg}
                            searchMedia={searchPlayCard}
                            unregcardLists={unregcardLists}
                            findPlayCard={findPlayCard}
                            isopen={addPlayCardView}
                            isLoading={isLoading}
                            onDone={OnDonePL}
                        />
                    </View>
                }
            </SafeAreaView>
            {showLogin && (
                <ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation} onDismiss={() => {
                    props.navigation.navigate('Homescreen');
                    setShowLogin(false);
                }} />
            )}
            {isLoading && <OverlayLoad isopen={isLoading} />}
        </View>
    );
}