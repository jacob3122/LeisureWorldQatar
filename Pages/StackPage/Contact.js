import React, { Component } from 'react'
import {StyleSheet,View,Text,Button,TouchableOpacity,Platform,Dimensions,Linking} from 'react-native'
import TabBarIcon from '../../Tools/Components/TabBarIcon';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import Colors from '../../Tools/constants/Colors';

import * as UIElements from '../../Tools/Components/UIElements'
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class Contact extends Component {
    
    
    static navigationOptions = ({navigation}) => {
        return{
            title: navigation.getParam('otherParam'),

            headerTintColor: Colors.darkfontColor,
            headerStyle: {
                backgroundColor: Colors.yellowColor
            },
            headerTitleStyle:{textAlign:'center',
            flex:1,fontFamily:'Cairo-Bold'},
            // headerLeft: null,
            // headerRight:(
            //     <Button
            //     onPress={()=>{
            //         navigation.goBack()
            //     }
            // }
            
            // title={navigation.getParam('backParam')}
            // color='#0079d4'
            // />
            // )
        };
    };
    constructor(props){
        super(props);
    }

    reDirect(url){
        Linking.openURL(url);
    }
    
    drawGap=(valueGap)=>{
        return(
            <View
            style={{paddingTop:valueGap}}/>
            );
        }
        
        render() {
            return (
                <View style={styles.homeView}>

                {UIElements.drawGap(10)}
                <Text allowFontScaling={false} style={styles.detailstitle}>{i18n.t('contactinfo')}</Text>
                {/* {this.drawGap(20)} */}
                
                <View style={styles.rowView}>
                <TouchableOpacity
                onPress={()=>this.reDirect('tel:119')}
                style={styles.buttonS}>
                <TabBarIcon
                size={40}
                name={
                    Platform.OS === 'ios'
                    ? 'ios-call': 'md-call'}/>
                    <Text  allowFontScaling={false} style={{paddingTop:15,textAlign:'center'}}>{i18n.t('contactinfo1')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>this.reDirect('mailto:support@trimooparks.com')}
                    style={styles.buttonS}>
                    <TabBarIcon
                    size={40}
                    name={
                        Platform.OS === 'ios'
                        ? 'ios-mail': 'md-mail'}/>
                        <Text allowFontScaling={false} style={{paddingTop:15,textAlign:'center'}}>{i18n.t('emailsupport')}</Text>
                        </TouchableOpacity>
                        </View>
                        {UIElements.drawGap(20)}
                        <Text allowFontScaling={false} style={styles.detailstitle}>{i18n.t('timeweekday')}</Text>
                        <Text allowFontScaling={false} style={styles.detailstitle}>{i18n.t('timeweekend')}</Text>
                        
                        </View>
                        )
                    }
                }
                
                const styles = StyleSheet.create({
                    gradStyle:{
                        position:'absolute',
                        width:width,
                        height:height,
                        zIndex:-1,
                        // borderRadius:15,
                    },
                    rowView:{
                        marginLeft:width/10,
                        marginRight:width/10,
                        flexDirection: 'row',
                        padding:10,
                        // borderWidth:1,
                        justifyContent:'space-between'
                    },
                    buttonS:{
                        borderRadius:10,
                        // backgroundColor:'gray',
                        alignItems:'center',
                        alignContent:'center',
                        height:height/10,
                        width:width/3.5,
                        // shadowColor: "#000",
                        // shadowOffset: {
                        //     width: 0,
                        //     height: 2,
                        // },
                        // shadowOpacity: 0.25,
                        // shadowRadius: 3.84,
                        justifyContent:'center',
                        // elevation:5,
                    },
                    heading: {
                        fontSize: 40,
                        paddingBottom:5,
                        fontFamily:'Cairo-Bold'
                    }
                    ,
                    homeView: {
                        padding:15,
                        flex: 1,
                        backgroundColor:'#fff',
                       
                    },detailstitle:{
                        fontSize: 20,
                        fontWeight: '200',
                        textAlign:'left',
                        paddingBottom:15,
                        fontFamily:'Cairo-Regular'
                    },
                });
                