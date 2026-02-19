import React, { useRef, useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';
import VisionCamera from './VisionCamera';

export default function BarcodeScan(props) {
    const Colors = useTheme();
    const hasScanned = useRef(false);

    const handleBarCodeScanned = (edata) => {
        // Guard: prevent multiple scan callbacks
        if (hasScanned.current) return;
        hasScanned.current = true;

        const assignValue = props.onScanDone;
        if (edata === undefined) {
            assignValue('');
        } else {
            assignValue(edata);
        }
    };

    const styles = useMemo(() => StyleSheet.create({
        buttonText: {
            fontFamily: 'Cairo-Regular',
            textAlign: 'center',
            color: Colors.whiteColor,
            fontSize: widthPercentageToDP(4),
            textTransform: 'uppercase',
        },
        buttonView: {
            position: 'absolute',
            bottom: '2%',
            backgroundColor: Colors.blueColor,
            width: widthPercentageToDP(35),
            alignSelf: 'center',
            justifyContent: 'center',
            height: heightPercentageToDP(4.75),
            borderRadius: heightPercentageToDP(4.75),
        },
    }), [Colors]);

    return (
        <SafeAreaView style={{
            height: heightPercentageToDP(60), borderWidth: 0,
            width: widthPercentageToDP(100), alignSelf: 'center', justifyContent: 'center'
        }}>
            <View style={{
                position: 'absolute', width: '100%', height: '90%',
                flexDirection: 'column', justifyContent: 'center'
            }}>
                <VisionCamera onBarCodeScanGotData={handleBarCodeScanned} />
            </View>

            <TouchableOpacity
                style={styles.buttonView}
                onPress={() => {
                    if (props.onScanDone) {
                        props.onScanDone();
                    }
                }}>
                <Text allowFontScaling={false} style={styles.buttonText}>{i18n.t('close')}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}