import React, { Component } from 'react';
import {Image, View,ScrollView,StyleSheet,Dimensions,Text,Platform,TouchableOpacity} from 'react-native';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import {AdaptiveWidth,AdaptiveHeight} from '../Components/AdaptiveSize'
// import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const smallerWidth = width * .9346;

export default class AdBlock extends Component {
    
    constructor(props){
        super(props);
        this.OnPressAd = this.OnPressAd.bind(this);
    }
    
   
    render() {
        return (
            <View>
            <TouchableOpacity onPress={()=>{this.OnPressAd()}}>
            <View style={styles.view}>
            {/* <CacheImage
            bg={true}
            onDone={this.BannerCame}
            style={styles.image}
            uri={this.props.parkInfo.banner}
            /> */}
            <FastImage
             style={styles.image}
            source={{
                uri: this.props.parkInfo.banner,
                // headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
            />
            </View>
            {/* <Text style={styles.title} >{this.props.parkInfo.title}</Text> */}
            {/* <Text style={styles.duration}>{i18n.t('adduration')}</Text> */}
            {UIElements.drawGap(15)}
            </TouchableOpacity>
            </View>
            )
        }
        OnPressAd(){
            // firebase.notifications
//      const notification = new firebase.notifications.Notification()
//     .setNotificationId(identifier)
//     .setTitle("Leisure")
//     .setBody("Local Notification")
//     .setData(userInfo)
//     .android.setAutoCancel(true)
//     .android.setPriority(firebase.notifications.Android.Priority.Max)
//     .android.setChannelId(activitiesChannel ? activitiesChannel.channelId : null);
//      firebase.notifications().displayNotification(notification);
            this.props.navigation.navigate('Adpage',{
                parkInfo: this.props.parkInfo
            });
        }
    }
    
    const styles = StyleSheet.create({
        image:{
            flex:1,
            width: '100%',
            height: AdaptiveHeight(4),
            resizeMode:'contain',
            borderRadius: 10,
            // position:'absolute'
            // transform:[{translateY:-width/4.8}]
        },
        title:{
            padding:15,
            fontSize:20,
            textAlign:'left',
            fontFamily:'Cairo-Bold',color:Colors.darkfontColor
        },
        duration:{
            marginLeft: 10,
            fontSize:15,
            textAlign:'left',
            fontWeight:'400'
        },
        view: {
            // margin: 5,
            marginTop: 10,
            backgroundColor: 'lightblue',
            width: width -30,
            height: height/4,
            borderRadius: 10,
            alignSelf:'center',
            alignItems:'center',
            justifyContent:'center',
            flex:1,
            // borderWidth:1,
        }
    });
    