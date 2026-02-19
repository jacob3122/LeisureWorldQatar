import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated, Easing } from 'react-native';
import * as tools from '../../Tools/Components/Tools.js';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';

const { height } = Dimensions.get('window');

export default function InfoBar(props) {
    const { state, dispatch } = useAppContext();
    const Colors = useTheme();
    const translateY = useRef(new Animated.Value(-100)).current;
    const topValueInPixels = (9 / 100) * height;
    const topValueInPixelstoGoBack = (-9 / 100) * height;

    // FIX: was useEffect() with NO dependency array — ran every render,
    // creating infinite animation loops and piling up setTimeout calls
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: topValueInPixels,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        const stayTimer = setTimeout(() => {
            Animated.timing(translateY, {
                toValue: topValueInPixelstoGoBack,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }, 3000);

        const dismissTimer = setTimeout(() => {
            if (!tools.IsNull(props.onDone)) {
                props.onDone();
            }
            dispatch({
                type: 'update_ShowInfo',
                payload: undefined,
            });
        }, 3200);

        return () => {
            clearTimeout(stayTimer);
            clearTimeout(dismissTimer);
        };
    }, []); // FIX: empty deps — run once on mount

    const styles = useMemo(() => StyleSheet.create({
        loading: {
            width: '100%',
            height: '5%',
            position: 'absolute',
            alignItems: 'center',
            // FIX: was `top: -'5%'` which is NaN (negating a string)
            top: '-5%',
            justifyContent: 'center',
            zIndex: 10,
        },
    }), []);

    return (
        <Animated.View style={[styles.loading, { top: translateY }]} pointerEvents={'box-none'}>
            <View style={{
                backgroundColor: Colors.whiteColor, borderRadius: 20,
                width: '100%', height: '100%', justifyContent: 'center', alignSelf: 'center',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}>
                <Text allowFontScaling={false} style={{
                    width: '100%', color: Colors.inputfontColor,
                    fontFamily: 'Cairo-Bold', fontSize: 18, textAlign: 'center'
                }}>
                    {props.textToDisplay}
                </Text>
            </View>
        </Animated.View>
    );
}