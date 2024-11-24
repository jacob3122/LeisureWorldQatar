import React, { Component } from 'react'
import  ProfileData  from '../../Tools/Components/ProfileData';

export default class VoucherComponent extends Component {
    
    
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
            <ProfileData pagetogo="voucherPage" navigation={this.props.navigation} pagefrom={this.props.navigation.state.params.pagefrom}/>
            )
        }
    }
    