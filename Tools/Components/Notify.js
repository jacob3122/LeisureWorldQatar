import React, { Component } from 'react'
import  ProfileData  from '../../Tools/Components/ProfileData';
import Colors from '../../Tools/constants/Colors';

export default class Notify extends Component {
    
    
    static navigationOptions = ({navigation}) => {
        return{
            header:null,
            headerVisible:false,
        };
    };
    constructor(props){
        super(props);
    }
    
    render() {
        // console.log("Notify :"+JSON.stringify(this.props.route));
        const {params}=this.props.route;
        return (
            <ProfileData pagetogo="notify" navigation={this.props.navigation} updateUnread={params.updateUnread} />
            )
        }
    }
    