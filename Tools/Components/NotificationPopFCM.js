import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import React, { Component } from 'react'
import { PureComponent } from 'react';
import { StyleSheet,Modal, View,Text,Dimensions,Image,TouchableOpacity} from 'react-native';
// import Colors from '../constants/Colors';

import * as tools from '../../Tools/Components/Tools.js';
import BackgroundWall from './BackgroundWall';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider.js';
import { logScreenViewEvent } from '../Analytics/AppAnalytics';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function NotificationPopFCM(props){
    const Colors =useTheme();
    return <NotificationPopFCMC {...props} Colors={Colors}/>
}
class NotificationPopFCMC extends Component {
    constructor (props){
        super(props);
        
        this.state={
            notification:this.props.notification
        }
        
        // console.log(this.props.notification);
    }
    
    
    componentDidMount(){
        logScreenViewEvent('Notification','NotificationPopFCM');
    }
    componentWillUnmount(){
        
    }
    onDone(stateIn){
        // console.log("onDone :"+JSON.stringify(this.state.notification));
        if(!tools.IsNull(this.state.notification.data)&&this.state.notification.data.nav_type=='viewurl')
        {
            if(this.state.notification.data.nav_prmtr.length>0){
                this.props.navigation.navigate('Adpage',{
                    url:this.state.notification.data.nav_prmtr
                })
            }
        }else if(!tools.IsNull(this.state.notification.data)&&this.state.notification.data.nav_type=='url')
        {
            if(this.state.notification.data.nav_url.length>0){
                Linking.openURL(this.state.notification.data.nav_url);
                // this.props.navigation.navigate('Adpage',{
                //     url:pageData.Additional.NavParameter
                // })
            }
        }else if(!tools.IsNull(this.state.notification.data)&&!tools.IsNull(this.state.notification.data.data.nav_url)){
            this.props.navigation.navigate(tools.getAppNames(this.state.notification.data.data.nav_url),tools.getScreen(this.state.notification.data.data.nav_prmtr));
        }
        if(this.props.onDone!=null){
            ondone=this.props.onDone;
            ondone(stateIn);
        }
    }
    
    render() {
        const {Colors}=this.props;
        const styles = StyleSheet.create({
            button:{
                alignSelf:'center',
                backgroundColor:Colors.blueColor,
                justifyContent:'center',
                width:widthPercentageToDP(30),
                height:heightPercentageToDP(4.75),
                borderRadius:heightPercentageToDP(4.75)
            },
            buttontext:{
                includeFontPadding:false,

                textAlign:'center',
                fontFamily:'Cairo-Regular',
                fontSize:18,
                color:Colors.whiteColor
            },
            title:{
                includeFontPadding:false,

                fontFamily:'Cairo-Bold',
                fontSize:widthPercentageToDP(4.5),
                alignSelf:'center',
                textAlign:'center',
                
            },
            body:{
                includeFontPadding:false,

                fontFamily:'Cairo-Regular',
                fontSize:widthPercentageToDP(3.5),
                alignSelf:'center',
                textAlign:'center',
            },
            loading: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor:Colors.transparentBlack,
                
                zIndex:10,
            }
        });
        return (
            <View style={styles.loading} >
            <BackgroundWall blur opacity={this.state.notification.backgroundWallOpacity}/>
            <View style={{width:'80%',backgroundColor:Colors.whiteColor,padding:widthPercentageToDP(3),alignSelf:'center',borderRadius:widthPercentageToDP(3)}}>
            <Text style={styles.title}>{this.state.notification.data.notification.title}</Text>
            <Text style={styles.body}>{this.state.notification.data.notification.body}</Text>
            <View style={{flexDirection:'row',width:'90%',alignSelf:'center',justifyContent:'center',marginTop:heightPercentageToDP(2)}}>
            <TouchableOpacity
            onPress={()=>{
                this.onDone(true);
            }} style={styles.button}>
            <Text style={styles.buttontext}>{i18n.t('proceed')}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity 
            onPress={()=>{
                this.onDone(false);
            }}
            style={styles.button}>
            <Text style={styles.buttontext}>{i18n.t('cancel')}</Text>
        </TouchableOpacity> */}
        
        </View>
        </View>
        </View>
        )
    }
}
