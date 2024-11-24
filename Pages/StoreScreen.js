import React from 'react';
import {View,StyleSheet } from 'react-native';
import  ProfileData  from '../Tools/Components/ProfileData.js'

export default class StoreScreen extends React.Component {
  
  constructor(props) {
    super(props);
  }


  render(){
    // console.log('StoreScreen'+this.props.route.params.OpenProduct)
  return (
    <View style={styles.container}>
    <ProfileData pagetogo="store" navigation={this.props.navigation}/>
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

