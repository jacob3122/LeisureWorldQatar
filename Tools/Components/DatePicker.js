import React, { Component } from 'react';
import  { DatePickerIOS,DatePickerAndroid,View,Text,StyleSheet,Dimensions,TouchableOpacity,Platform } from 'react-native';
import i18n from 'i18n-js';
import * as UIElements from './UIElements'
import * as Tools from './Tools'

import Colors from '../constants/Colors';
// import Gradient from 'react-native-css-gradient';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class DatePicker extends Component {
    
    
    constructor(props){
        super(props);
        this.state={
            chosendate:new Date(),
            proceed:false
        }
    }
    getDate(){
        if(this.props.showDate)
        return(
            <View style={{flex: 1,
                justifyContent: 'center',}}>
                    {this.state.proceed&&(<TouchableOpacity style ={{flex:1,justifyContent:"center",backgroundColor:this.props.backgroundColor,borderRadius:5,paddingTop:15,paddingBottom:15}}
                onPress={()=>{{
                        var assignValue  =   this.props.onDone;
                        assignValue();}}}>
                <Text allowFontScaling={false} style ={{fontSize:16,fontFamily:'Cairo-Bold',alignSelf:'center',color:this.props.textColor}}>Done</Text>
                </TouchableOpacity>)}
                
                {Platform.OS=='ios'&&(
                    <DatePickerIOS
                    mode='date'
                    date={this.state.chosendate}
                    onDateChange={(date)=>{
                        this.setState({chosendate:date,proceed:true});
                        var assignValue  =   this.props.onDateChange;
                        assignValue(date);
                    }}/>)}
                    
                    {Platform.OS=='android' &&(
                        <DatePickerAndroid
                        mode='date'
                        date={this.state.chosendate}
                        onDateChange={(date)=>{
                            this.setState({chosendate:date,proceed:true});
                            var assignValue  =   this.props.onDateChange;
                        assignValue(date);
                        }}/>)}
                        
                        </View>
                        );
                    }
                    
                    render() {
                        return (
                            <View>
                            {this.getDate()}
                            </View>
                            )
                        }
                    }
                    
                    const styles = StyleSheet.create({
                        dateValue:{
                            fontSize: 16,
                            fontFamily:'Cairo-Bold',
                            width:'100%',
                            
                            // borderWidth:2,
                        },
                        inputView:{
                            flex:1,
                            // borderWidth:1,
                            flexDirection:'column',
                            alignItems:'flex-start',
                            alignContent:'flex-start',
                        }
                        ,
                        detailstitle:{
                            // width:150,
                            fontSize: 18,
                            fontFamily:'Cairo-Bold',
                            textAlign:'left',
                            paddingTop:15,
                            paddingBottom:15,
                            flex:0.5,
                            color:Colors.darkfontColor
                        },
                        rowView:{
                            // flex:1,
                            flexDirection:'row',
                        },
                        inputtext:{
                            letterSpacing:width/4.5,
                            fontSize: 20,
                            textAlign:'left',
                            fontFamily:'Cairo-Bold',
                            height:45,
                            color: 'black',
                        },
                        heading: {
                            fontSize: 30,
                            fontFamily:'Cairo-Bold',
                            paddingBottom:15,
                            alignSelf:'center'
                        }
                    });