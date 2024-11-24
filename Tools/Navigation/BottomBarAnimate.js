import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated, Image, Easing } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import Colors from '../constants/Colors';
import AppIcon from '../Components/AppIcon';
import AppText from '../Components/AppText';
import barsvgbg from '../../assets/Icons/bottomsvg.png';
import iconBg from '../../assets/Icons/iconbg.png';
const TAB_BAR_WIDTH = widthPercentageToDP(100) / 5;
const ANIMATED_PART_HEIGHT = 5;
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import * as Tools from '../../Tools/Components/Tools'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';

const BottomBarAnimate = ({ state, descriptors, navigation }) => {
    const Colors=useTheme();
    const [currentTextIndex,setCurrentTextIndex]=useState(0);
    const [textArray,setTextArray]=useState([]);
    const translateY = new Animated.Value(0);
    const opacity = new Animated.Value(1);
    const { state: stateIn, dispatch } = useAppContext();
    i18n.translations = stateIn.i18ntranslation;
    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
        bumpImg:{
            overflow:'visible',
            shadowOffset: { width: 0, height: -10 },
            shadowRadius: 6,
            shadowOpacity:0.5,
            elevation: 3,
            shadowColor:'rgba(255,203,62,1)',
            tintColor:Colors.whiteColor,
            width:widthPercentageToDP(39),
            height:widthPercentageToDP(5.85),resizeMode:'contain',position:'absolute',
            transform:[{translateY:-widthPercentageToDP(5.5)},{translateX:((Tools.stringIsContains(i18n.locale,'en')?-1:1)*TAB_BAR_WIDTH/2.15)},{scaleX:0.8}]},
            container: {
                overflow:'visible',
                shadowOffset: { width: 0, height: -10 },
                shadowRadius: 6,
                shadowOpacity:0.5,
                elevation: 3,
                shadowColor:'rgba(255,203,62,1)',
                flexDirection: 'column',
                backgroundColor:Colors.whiteColor,
                height:insets.bottom+heightPercentageToDP(insets.bottom==0?9:7.5),
            },
            shadow:{
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 3,
                shadowOpacity: 0.12,
                elevation:3
            },
            tabButton: {
                flex: 1,
            },
            innerView: {
                justifyContent: 'center',
                alignItems: 'center',
            },
            iconText: {
                width: TAB_BAR_WIDTH,
                textAlign: 'center',
                fontSize:heightPercentageToDP(1.65),
            },
            animatedView: {
                width: TAB_BAR_WIDTH,
                height: ANIMATED_PART_HEIGHT,
            },
            animatedWrapper: { width: TAB_BAR_WIDTH, alignItems: 'center', justifyContent: 'center' },
        });
        
        
        const animationHorizontalValue = useRef(new Animated.Value(0)).current;
        
        const animate = (index) => {
            Animated.spring(animationHorizontalValue, {
                toValue:(Tools.stringIsContains(i18n.locale,'en')?1:-1) * index *TAB_BAR_WIDTH,
                useNativeDriver: true,
            }).start();
        };
        
        useEffect(() => {
            animate(state.index);
        }, [state.index]);
        
        const valueX=(Tools.stringIsContains(i18n.locale,'en')?1:1);
        return (
            <>
            <View style={[styles.container]}>
            
            <Animated.View style={styles.animatedWrapper}>
            <Animated.View
            style={[
                styles.animatedView,
                {
                    transform: [{translateX: (animationHorizontalValue) }],
                },
            ]}>
            <Image
            style={styles.bumpImg}
            source={barsvgbg}
            
            />
            <View style={{position:'absolute',alignSelf:'center',transform:[{translateY:-heightPercentageToDP(1.5)}],
            borderRadius:widthPercentageToDP(15.5),height:widthPercentageToDP(15.5),
            width:widthPercentageToDP(15.5),justifyContent:'center',alignItems:'center'}}>
            <Image resizeMethod='resize' resizeMode='contain' style={{height:widthPercentageToDP(15.5),
                width:widthPercentageToDP(15.5),}} source={iconBg}></Image>
                </View></Animated.View>
                </Animated.View>
                
                <View style={{ flexDirection: 'row' }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel || route.name;
                    
                    if(label!=textArray&&label.length>1){
                        setTextArray(label);
                    }
                    const isFocused = state.index === index;
                    
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };
                    
                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    
                    return (
                        <TouchableWithoutFeedback
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabButton}
                        key={`${index}--${route.key}`}
                        >
                        <View style={styles.innerView}>
                        <AppIcon name={route.name} style={[{
                            marginTop:heightPercentageToDP(1),
                        },isFocused?{transform:[{translateY:-heightPercentageToDP(1.2)}]}:{}]} color={isFocused ? Colors.whiteColor : Colors.inputfontColor} />
                        
                     
                        <AppText numberofWords={label.length} numberOfLines={1} type="heavy" style={[styles.iconText, { color: isFocused ? Colors.inputfontColor : Colors.inputfontColor }]}>
                        {label}
                        </AppText>
                        
                        </View>
                        </TouchableWithoutFeedback>
                        );
                    })}
                    </View>
                    </View>
                    </>);
                };
                
                
                export default BottomBarAnimate;
                
                