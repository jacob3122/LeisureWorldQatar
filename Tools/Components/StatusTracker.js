import React from 'react'
import {View,StyleSheet,Text,Dimensions} from 'react-native'

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
import * as UiElements from './UIElements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP} from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';

export default function (props){

    const Colors=useTheme();
    return <StatusTracker {...props} Colors={Colors}/>
}
class StatusTracker extends React.Component {
    
    constructor(props){
        super(props);
    }
    
    render(){
        const {Colors}=this.props;
        const styles = StyleSheet.create({
            roundView:{
                borderRadius:hp('3.2%'),
                width:hp(2),
                height:hp(2),
                justifyContent:'center',
                backgroundColor:Colors.inputfontColor
            },
            stageNo:{
                fontFamily:'Cairo-Regular',
                fontSize:hp('2.1%'),
                lineHeight:hp('3.7%'),
                height:hp('3.7%'),
                textAlign:'center',
                alignSelf:'center'
            },
        })
        return (
            <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'space-around',width:wp('50%'),overflow:'visible'}} >
            <View style={[styles.roundView,this.props.selected>=0? {backgroundColor:Colors.blueColor}:{backgroundColor:Colors.inputfontColor}] }>
            </View>
            <View style={[styles.roundView,this.props.selected>=1? {backgroundColor:Colors.blueColor}:{backgroundColor:Colors.inputfontColor}] }>
            </View>
            <View style={[styles.roundView,this.props.selected>=2? {backgroundColor:Colors.blueColor}:{backgroundColor:Colors.inputfontColor}] }>
            </View>
            <View style={[styles.roundView,this.props.selected==3? {backgroundColor:Colors.blueColor}:{backgroundColor:Colors.inputfontColor}] }>
            </View>
            </View>
            );
        }
    }
    
    
  
    
    