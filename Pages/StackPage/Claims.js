import React, { Component } from 'react'
import {Button} from 'react-native'
import  ProfileData  from '../../Tools/Components/ProfileData';
import i18n from 'i18n-js';
import Colors from '../../Tools/constants/Colors';

export default class Claims extends Component {
    
    
    static navigationOptions = ({navigation}) => {
        return{
            header:null,
            headerVisible:false
            // title: navigation.getParam('otherParam'),
            // headerTintColor: Colors.darkfontColor,
            // headerStyle: {
            //     backgroundColor:  navigation.getParam('color')
            // },
            // headerTitleStyle:{textAlign:'center',
            // fontWeight: 'bold',flex:1,fontFamily:'Cairo-Bold'},
            // headerLeft: null,
            // headerRight:(
            //     <Button
            //     onPress={()=>{
            //         navigation.goBack()
            //     }
            // }
            // title={i18n.t('close')}
            // color={Colors.darkfontColor}
            // style={{fontFamily:'Cairo-Bold'}}
            // />
            // )
        };
    };
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <ProfileData pagetogo="claims" navigation={this.props.navigation}/>
            )
        }
    }
    