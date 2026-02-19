import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function LoadingLine(props) {
    const Colors = useTheme();
    const { state } = useAppContext();
    i18n.translations = state.i18ntranslation;

    const [visibleText] = useState(props.visibleText === undefined ? true : false);
    const [loading, setLoading] = useState('loading');

    // FIX: was `let myinterval=undefined` — local var, lost every render
    const intervalRef = useRef(null);
    // FIX: loadNo was stale in closure — use ref
    const loadNoRef = useRef(1);
    // FIX: was useState(new Animated.Value(0)) — Animated.Value should be a ref, not state
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
        })).start();

        intervalRef.current = setInterval(() => {
            const next = loadNoRef.current === 3 ? 1 : loadNoRef.current + 1;
            loadNoRef.current = next;
            setLoading('loading' + next);
        }, 5000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden',
            marginBottom: 5,
        },
        LoadBar: {
            backgroundColor: Colors.blueColor,
            width: widthPercentageToDP(40),
            height: 5,
            borderRadius: 10,
        },
    }), [Colors]);

    const tonfro = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-250, 250],
    });

    return (
        <View style={[styles.container, props.container]}>
            {visibleText && (
                <Text allowFontScaling={false} style={{
                    width: '100%', color: Colors.black,
                    fontFamily: 'Cairo-Bold', fontSize: widthPercentageToDP(4.5),
                    textAlign: 'center'
                }}>
                    {i18n.t(loading)}
                </Text>
            )}
            <Animated.View style={[styles.LoadBar, { transform: [{ translateX: tonfro }] }, props.loadBar]} />
        </View>
    );
}