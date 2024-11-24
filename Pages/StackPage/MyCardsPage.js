import React, { Component } from 'react'
import {Button} from 'react-native'
import  ProfileData  from '../../Tools/Components/ProfileData';
import i18n from 'i18n-js';
import Colors from '../../Tools/constants/Colors';

export default class MyCardsPage extends Component {
    
    
    static navigationOptions = ({navigation}) => {
        return{
            header:null,
            headerVisible:false
        };
    };
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <ProfileData pagetogo="mycards" navigation={this.props.navigation}/>
            )
        }
    }
    