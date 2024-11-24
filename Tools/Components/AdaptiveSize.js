import React from 'react';
import {Dimensions} from 'react-native'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

module.exports={
    AdaptiveWidth:function (valueGap){
        // console.log('W '+width);
        return(
            width/(((width>375)?((width>700)?1.5:1):1)* valueGap)
            );
        }, 
        AdaptiveOffsetWidth:function (Offset,valueGap){
            return(
                height/(((width>375)?Offset:1)* valueGap)
            )
            }, 
        
        AdaptiveHeight:function (valueGap){

            return(
                height/(((width>375)?.99:1)* valueGap)
                );
            },
            
                AdaptiveOffsetHeight:function (Offset,valueGap){
                    return(
                        height/(((width>375)?(width>700?Offset:Offset*2):1)* valueGap)
                    )
                    },
            }
            