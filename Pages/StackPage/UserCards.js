import React, { Component } from 'react'
import { Image,StyleSheet, SafeAreaView,ScrollView, View,Text, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import cartIcon from '../../assets/Icons/cart.png'
import squareIcon from '../../assets/Icons/square.png'
import gridIcon from '../../assets/Icons/grid.png'


import addcartIcon from '../../assets/Icons/add-to-cart.png'
import i18n from 'i18n-js';
import * as Tools from '../../Tools/Components/Tools.js';

import Colors from '../../Tools/constants/Colors';
import productsData from '../../Data/products.json'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import WebServices from '../../Tools/constants/WebServices';

export default class UserCards extends Component {
    
    static navigationOptions = ({navigation}) => {
        return{
            header:null,
            headerVisible:false
        };
    };
    constructor(props){
        super(props);
        this.state={
       
        }
   
    }
    render(){
        return({
            
        })
    }
}
    
    
    