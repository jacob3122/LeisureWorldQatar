import { useRoute } from '@react-navigation/native';
import React, { Component } from 'react'
import  ProfileData  from '../../Tools/Components/ProfileData';
export default function(props){
    const route=useRoute();
    return <RedeemVenuPage {...props} route={route}/>
}
class RedeemVenuPage extends Component {
    
    
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
        const {route}=this.props;
        return (
            <ProfileData pagetogo="redeemVenu" navigation={this.props.navigation} selectedVoucher={route.params.selectedVoucher} pagefrom={route.params.pagefrom}/>
            )
        }
    }
    