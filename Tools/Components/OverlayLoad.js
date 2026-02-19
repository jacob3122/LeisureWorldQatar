import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StyleSheet, Modal, View, Text, Image } from 'react-native';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';

const loadGif = require('../../assets/load/load.gif');

export default function OverlayLoad(props) {
    const Colors = useTheme();
    const { state } = useAppContext();
    i18n.translations = state.i18ntranslation;

    // FIX: was `let myinterval=undefined` and `let _isMounted=false` — local vars
    // that reset every render. Use refs instead.
    const intervalRef = useRef(null);

    const [loading, setLoading] = useState('loading');
    // FIX: loadNo was stale in setInterval closure — use ref
    const loadNoRef = useRef(2);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const next = loadNoRef.current === 3 ? 2 : loadNoRef.current + 1;
            loadNoRef.current = next;
            setLoading('loading' + next);
        }, 5000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    const styles = useMemo(() => StyleSheet.create({
        loading: {
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.transparentBlack,
            zIndex: 10,
        },
    }), [Colors]);

    return (
        <Modal
            statusBarTranslucent={true}
            animationType='none'
            transparent={true}
            visible={props.isopen}
            onRequestClose={() => { /* Android back button */ }}
        >
            <View style={styles.loading}>
                <BackgroundWall opacity={0.5} />
                <View style={{
                    borderRadius: 75, width: '100%', height: 200,
                    justifyContent: 'center', alignSelf: 'center'
                }}>
                    <Text allowFontScaling={false} style={{
                        width: '100%', color: Colors.black, includeFontPadding: false,
                        fontFamily: 'Cairo-Bold', fontSize: 18, textAlign: 'center'
                    }}>
                        {i18n.t(loading)}
                    </Text>
                    <Image source={loadGif} style={{
                        resizeMode: 'contain', alignSelf: 'center', width: 150, height: 61
                    }} />
                </View>
            </View>
        </Modal>
    );
}