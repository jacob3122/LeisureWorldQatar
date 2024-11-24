import React from 'react';
import {View,StyleSheet } from 'react-native';
import  ProfileData  from '../Tools/Components/ProfileData.js'

export default class UserCardsScreen extends React.Component {
  
  constructor(props) {
    super(props);
  }
  render(){
  return (
    <View style={styles.container}>
    <ProfileData pagetogo="usercard" navigation={this.props.navigation}/>
    </View>
  );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
  });

