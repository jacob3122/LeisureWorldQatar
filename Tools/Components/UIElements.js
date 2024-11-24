import React from 'react';
import { StyleSheet, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';



module.exports={
        formatDate:function (timeStamp){
                const options = { year: "numeric", month: "long", day: "numeric" }
                return new Date(timeStamp).toLocaleDateString(undefined, options);
        },
        drawGap:function (valueGap){
            return(
                <View
                style={{paddingTop:((valueGap===undefined)?0:heightPercentageToDP(valueGap/10))}}/>
                );
            }, 
            drawRGap:function (valueGap){
                return(
                    <View
                    style={{paddingRight:((valueGap===undefined)?0:valueGap)}}/>
                    );
                }, 
                drawLGap:function (valueGap){
                    return(
                        <View
                        style={{paddingLeft:((valueGap===undefined)?0:valueGap)}}/>
                        );
                    }, 
            
            drawLine:function (colorstr){
                return(
                    <View
                    style={{
                        borderBottomColor: colorstr,
                        borderBottomWidth: 1,
                    }}
                    />
                    );
                },
                drawLine:function (colorstr,boxWidth,width,styles={}){
                    return(
                        <View
                        style={[{
                            alignSelf:'center',
                            width:boxWidth,
                            borderBottomColor: colorstr,
                            borderBottomWidth: width,
                        },styles]}
                        />
                        );
                    }
            
        }
        