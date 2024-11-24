import React, { Component } from 'react'
import  ProfileData  from '../../Tools/Components/ProfileData';

export default class PointsSystem extends Component {
    
    
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
            <ProfileData pagetogo="points" navigation={this.props.navigation} />
            )
        }
    }
    