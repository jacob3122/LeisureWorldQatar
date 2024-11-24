import React from 'react';
import { View } from 'react-native';
import { BarcodeCreatorView, BarcodeFormat } from 'react-native-barcode-creator';
import { Svg, Rect } from 'react-native-svg';

// Barcode Component
const Barcode = ({ value,width,height,viewStyle }) => {
    // Adjust the bar width and height for better readability
    
    return (
        <BarcodeCreatorView
        value={value}
        background={'#FFFFFF'}
        foregroundColor={'#000000'}
        format={BarcodeFormat.CODE128}
        style={[{ width:width*160,height:height, padding: 20, alignSelf: 'center', justifyContent: 'center' }, viewStyle]}
        />
    );
};

export default Barcode;