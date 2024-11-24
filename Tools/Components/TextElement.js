// CustomText.js
import React from 'react';
import { Text } from 'react-native';

const TextElement = (props) => {
  const { style, ...otherProps } = props;
  const modifiedStyle = Array.isArray(style) ? [...style, { includeFontPadding: false }] : [{ includeFontPadding: false }];

  return <Text style={modifiedStyle} {...otherProps} />;
};

export default TextElement;