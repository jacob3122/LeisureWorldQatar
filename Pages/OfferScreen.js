import React from 'react';
import { StyleSheet, View } from 'react-native';
import ProfileData  from '../Tools/Components/ProfileData.js';

export default class OfferScreen extends React.Component {

  
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View style={Offerstyles.container}>
        <ProfileData pagetogo="offer" navigation={this.props.navigation} />
      </View>
    );
  }
}


const Offerstyles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop:20,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  }
  });