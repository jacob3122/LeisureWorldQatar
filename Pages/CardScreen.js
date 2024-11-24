import React from 'react';
import { StyleSheet, View } from 'react-native';
import  ProfileData  from '../Tools/Components/ProfileData.js'


export default class CardScreen extends React.Component {
  
  constructor(props) {
    super(props);
  }
  

  render(){
    return (
      <View style={styles.container}>
      <ProfileData pagetogo="card" pagetodivert={''} navigation={this.props.navigation}/>
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