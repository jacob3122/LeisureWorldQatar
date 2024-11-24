import React, { Component } from 'react'
import  ProfileData  from '../../Tools/Components/ProfileData';
import Colors from '../../Tools/constants/Colors';

export default class Password extends Component {
    
    
    static navigationOptions = ({navigation}) => {
        return{
            header:null,
            headerVisible:false,
            // title: navigation.getParam('otherParam'),
            // headerTintColor: Colors.darkfontColor,
            // headerStyle: {
            //     backgroundColor: Colors.yellowColor
            // },
            // headerTitleStyle:{textAlign:'center',
            // fontWeight: 'bold',flex:1},
            // headerLeft:(
            //     <HeaderBackButton 
            //     titleStyle={{fontWeight:'bold',
            //     fontSize:15}}
            //     title={navigation.getParam('backParam')}
            //     backTitleVisible={true}
            //     onPress={() => navigation.goBack()} />
            //     )
        };
    };
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <ProfileData pagetogo="changepassword" navigation={this.props.navigation} />
            )
        }
    }
    