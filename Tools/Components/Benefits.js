import React from 'react';
import { StyleSheet, View,Text,TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {Slider} from 'react-native';
import i18n from 'i18n-js';
import ProfileData from './ProfileData';
export default class Benefits extends React.Component {

  static navigationOptions = ({navigation}) => {
    return{
        header:null,
        headerVisible:false
    };
};
  constructor(props) {
    super(props);
  };
  
  render(){
    return (
      <ProfileData pagetogo="benefits" navigation={this.props.navigation}/>
      );
    }
  }
  
  
  