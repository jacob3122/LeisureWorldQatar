import React, { Component } from 'react';
import  ProfileData  from '../Tools/Components/ProfileData.js'


export default class AddCardScreen extends Component {
  
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({navigation}) => {
    return{
        header:null,
        headerVisible:false
    };
};

  render(){
    return (
      <ProfileData pagetogo="addcards" navigation={this.props.navigation}/>
      );
    }
  }
  
  