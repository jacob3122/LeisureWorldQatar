import React, { Component } from 'react'
import {Button} from 'react-native'
import  ProfileData  from '../../Tools/Components/ProfileData';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);

export default class Points extends Component {
    
    
    static navigationOptions = ({navigation}) => {
        return{
            title: navigation.getParam('otherParam'),
            headerTintColor: '#rgba(1,0,0,1)',
            headerTitleStyle:{textAlign:'center',
            fontWeight: '200',flex:1},
            headerLeft: null,
            headerRight:(
                <Button
                onPress={()=>{
                    navigation.goBack()
                }
            }
            title={i18n.t('close')}
            color='#0079d4'
            />
            )
        };
    };
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <ProfileData pagetogo="points" navigation={this.props.navigation}/>
            )
        }
    }
    