import { Animated, Easing, StyleSheet, Text, View } from "react-native";
// import Colors from "../constants/Colors";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeProvider";
import * as Tools from './Tools';
import { useEffect, useState } from "react";
export default function AppText (props) {
    const Colors=useTheme();
    const textArray = props.children; // Add your text values here
    const [translateY,setTranslateY]=useState(new Animated.Value(1));
    const [opacity,setopacity]=useState(new Animated.Value(1));
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const styles = StyleSheet.create({
        container: {
            // justifyContent: 'center',
            // alignItems: 'center',
        },
        
        textStyle:{
            includeFontPadding: false,
            color:Colors.inputfontColor,fontSize:widthPercentageToDP(3.5),
            fontFamily:'Cairo-Regular'},
            heading:{
                includeFontPadding: false,
                fontFamily:'Cairo-Bold',fontFamily:'Cairo-Bold',fontSize:widthPercentageToDP(5.5),flexWrap:'wrap',lineHeight:widthPercentageToDP(5.5)*1.35,color:Colors.inputfontColor,
            },
            subheading:{
                includeFontPadding: false,

                fontFamily:'Cairo-SemiBold',fontSize:widthPercentageToDP(4.5),flexWrap:'wrap',lineHeight:widthPercentageToDP(4.5)*1.35,color:Colors.inputfontColor,
            },
            paragraph:{
                includeFontPadding: false,

                fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5),flexWrap:'wrap',lineHeight:widthPercentageToDP(3.5)*1.35,color:Colors.inputfontColor,
            }
        })
        textStyleIn={};
        switch (props.type) {
            case 'h1':
            textStyleIn=styles.heading;
            break;
            case 'h2':
            textStyleIn=styles.subheading;
            break;
            case 'p':
            textStyleIn=styles.paragraph;
            break;
            
            default:
            textStyleIn=styles.textStyle;
            break;
        }
        
        
        
        useEffect(() => {
            const startTextSwapAnimation = () => {
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: false,
                    easing: Easing.ease,
                }).start(() => {
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration:150,
                        useNativeDriver: false,
                    }).start(() => {
                        // Wait for 250ms
                            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textArray.length);
                            Animated.timing(opacity, {
                                toValue: 1,
                                duration: 100,
                                useNativeDriver: false,
                            }).start(() => {
                                Animated.timing(translateY, {
                                    toValue: 1,
                                    duration: 100,
                                    useNativeDriver: false,
                                    easing: Easing.ease,
                                }).start(() => {
                                    // Wait for 5 seconds before repeating the animation
                                    setTimeout(startTextSwapAnimation, 5000);
                                });
                            });
                    });
                });
            };
            if(!Tools.IsNull(props.numberofWords)&&props.numberofWords>1){
                // Start the animation
                setTimeout(() => {
                    startTextSwapAnimation();
                }, 5000); // Initial 5-second delay before starting the animation
            }else{
                setTranslateY(1);
            }
        }, []);
        
        let labelVal=(!Tools.IsNull(props.numberofWords)&&props.numberofWords>1)?props.children[currentTextIndex]:props.children;
        return(
            <View style={[styles.container]}>
            <Animated.View
            style={{
                opacity,
                transform: [{scaleY:translateY }],
            }}
            >
            <Text {...props} allowFontScaling={false} style={[textStyleIn,props.style,]}>{labelVal}</Text>
            </Animated.View>
            </View>
            )
        }
        
        