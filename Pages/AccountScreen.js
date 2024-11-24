import React from 'react';
import {  StyleSheet, View,Dimensions,ImageBackground } from 'react-native';
import  ProfileData from '../Tools/Components/ProfileData.js';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
export default class AccountScreen extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <View style={styles.container}>
      <ProfileData pagetogo="account" navigation={this.props.navigation}/>
      </View>
      );
    }
  }
  
  
  const styles = StyleSheet.create({
    bgImage:{
      position:'absolute',
      alignSelf:'center',
      width:'100%',
      height:height,
      resizeMode:'contain'
    },
    gradStyle:{
      position:'absolute',
      width:width,
      height:height,
      zIndex:-1,
    },
    container: {
      flex: 1,
      // paddingTop:50,
      flexDirection: 'column',
      backgroundColor: '#fff',
    }
  });
  