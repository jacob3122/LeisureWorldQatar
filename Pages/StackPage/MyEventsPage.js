import React, { Component } from 'react'
import  ProfileData  from '../../Tools/Components/ProfileData';

export default class MyEventsPage extends Component {
    
    
    static navigationOptions = ({navigation}) => {
        return{
            header:null,
            headerVisible:false
        };
    };
    constructor(props){
        super(props);
        this.state={
            eventObjs:{}
        }
    }
    
    render() {
        return (
            <ProfileData pagetogo="myevents" navigation={this.props.navigation} eventObjs={this.state.eventObjs} OpenEvent={this.props.OpenEvent}/>
            )
        }
    }
    