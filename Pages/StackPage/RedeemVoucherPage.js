import React, { Component } from 'react'
import  ProfileData  from '../../Tools/Components/ProfileData';

export default class RedeemVoucherPage extends Component {
    
    
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
            <ProfileData pagetogo="redeemVoucher" navigation={this.props.navigation} />
            )
        }
    }
    