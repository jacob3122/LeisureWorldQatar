import React, { useEffect, useState, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image, Modal, ScrollView } from 'react-native';
import dropIcon from '../../assets/Icons/caret-down.png';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import WebServices from '../constants/WebServices';
import tools from '../Components/Tools';
import FastImage from '@d11/react-native-fast-image';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function CountryDropDown({ defaultValue, textStyle, updateData, ItemSelectedStyle, editable = true }) {
    const Colors = useTheme();
    const { state } = useAppContext();
    i18n.translations = state.i18ntranslation;

    const [open, setOpen] = useState(false);
    const [countryCode, setCountryCode] = useState([]);
    const [datafromDropDown, setDatafromDropDown] = useState(-1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCountryInUseData();
    }, []);

    const getCountryInUseData = () => {
        if (global.countryCode != undefined && global.countryCode != null) {
            const json = global.countryCode;
            setCountryCode(json);
            setLoading(false);
            for (let index = 0; index < json.length; index++) {
                if (json[index].code === defaultValue) {
                    setDatafromDropDown(index);
                    return;
                }
            }
            // FIX: was `loaded=0` — missing const/let, polluted global scope
            return;
        }

        return fetch(WebServices.MainURL + WebServices.countryinUseData.replace('{Localize}', tools.stringIsContains(i18n.locale, 'ar') ? 'ar' : 'en'))
            .then(response => response.text())
            .then((findresponse) => {
                const json = JSON.parse(findresponse);
                const countrycodes = json.countrycodes;
                setCountryCode(countrycodes);
                setLoading(false);
                global.countryCode = countrycodes;
                for (let index = 0; index < countrycodes.length; index++) {
                    if (countrycodes[index].code === defaultValue) {
                        setDatafromDropDown(index);
                        return;
                    }
                }
            }).catch(function (error) {
                setCountryCode([
                    { "name": "Qatar", "dial_code": "+974", "code": "QA" }
                ]);
                setLoading(false);
            });
    };

    const getallItems = () => {
        if (countryCode.length > 0) {
            // FIX: was `allLines=[]` — missing const, polluted global scope
            const allLines = [];
            for (let index = 0; index < countryCode.length; index++) {
                const inValue = index;
                allLines.push(
                    // FIX: added key prop
                    <View key={"country_" + inValue}>
                        <TouchableOpacity
                            onPress={() => {
                                setOpen(false);
                                setDatafromDropDown(inValue);
                                if (updateData) updateData(countryCode[inValue].code);
                            }}
                            style={[styles.ItemStyle, defaultValue === inValue ? { backgroundColor: Colors.bgColor } : {}]}
                        >
                            <FastImage
                                resizeMode='stretch'
                                style={{ width: widthPercentageToDP(9), height: widthPercentageToDP(6.5), alignSelf: 'center' }}
                                source={{
                                    uri: WebServices.flagUrl.replace('{Code}', countryCode[inValue].code.toLowerCase())
                                }}
                            />
                            <Text allowFontScaling={false} style={[styles.textStyle]}>
                                {countryCode[inValue].code}
                            </Text>
                            <Text allowFontScaling={false} style={[styles.textStyle]}>
                                {countryCode[inValue].name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            }
            return allLines;
        }
        return <View />;
    };

    const styles = useMemo(() => StyleSheet.create({
        shadow: {
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 3,
            shadowOpacity: 0.12,
        },
        textStyle: {
            color: Colors.black,
            alignSelf: 'center',
            marginStart: 10,
            fontSize: 17,
            fontFamily: 'Cairo-Regular',
            fontWeight: '200',
        },
        titleStyle: {
            padding: 10, fontSize: 18, fontFamily: 'Cairo-Bold',
            color: Colors.whiteColor, alignSelf: 'center', textAlign: 'center',
        },
        ItemStyle: {
            marginLeft: -10, marginRight: -10, paddingLeft: 10, paddingRight: 10,
            flexDirection: 'row',
            height: 50,
        },
    }), [Colors]);

    return (
        <View style={{ zIndex: 2 }}>
            <TouchableOpacity
                disabled={!editable}
                style={ItemSelectedStyle}
                onPress={() => { setOpen(!open); }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', width: '80%' }}>
                    <Text allowFontScaling={false} style={[
                        { width: '100%', color: Colors.inputfontColor },
                        textStyle,
                        { opacity: (countryCode.length > 0 && datafromDropDown !== -1) ? 1 : 0.6 }
                    ]}>
                        {(countryCode.length > 0 && datafromDropDown !== -1)
                            ? countryCode[datafromDropDown].name
                            : ("*" + i18n.t('country'))}
                    </Text>
                    <Image style={{ width: 12, height: 12, alignSelf: 'center', tintColor: Colors.blueColor }} source={dropIcon} />
                </View>
            </TouchableOpacity>

            <Modal statusBarTranslucent={true} transparent={true} visible={open}>
                <View style={{ justifyContent: 'center', height: '100%' }}>
                    <TouchableOpacity
                        onPress={() => { setOpen(false); }}
                        style={{
                            width: widthPercentageToDP(100), height: heightPercentageToDP(100),
                            justifyContent: 'center', backgroundColor: Colors.tabBarbg
                        }}
                    />
                    <View style={{
                        position: 'absolute', borderRadius: 15, overflow: 'hidden',
                        backgroundColor: Colors.whiteColor,
                        width: widthPercentageToDP(80), height: heightPercentageToDP(80),
                        alignSelf: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: Colors.blueColor }}>
                            <Text allowFontScaling={false} style={styles.titleStyle}>
                                {i18n.t('choosecountrycode')}
                            </Text>
                        </View>
                        <ScrollView style={{ backgroundColor: Colors.bgColor, paddingLeft: 10, paddingRight: 10 }}>
                            {getallItems()}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}