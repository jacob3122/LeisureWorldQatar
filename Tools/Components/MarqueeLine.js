import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
import * as UIElements from './UIElements'
import Colors from '../constants/Colors';
import { RefreshControl,StyleSheet, View,Text,Image,Linking,Animated,Easing, TouchableOpacity,TouchableHighlight,ScrollView} from 'react-native';



// let oneView = new Animated.Value(0); // declare an animated value
// let twoView = new Animated.Value(1); // declare an animated value


export default class MarqueeLine extends React.Component {
    startEndVal=widthPercentageToDP(51);
    totalBars=14;

    constructor(props) {
        super(props);
        this.state={
            start:[],
            oneTime:false,
        }
        this.setMarqueeInit=this.setMarqueeInit.bind(this);
       
    }
    IntervalMarq;
    componentDidMount(){
        this.setMarqueeInitVal();
        this.setMarqueeInit();
    }
    componentWillUnmount(){
    }
    setMarqueeInitVal(){
        
        if(this.state.start==[]||this.state.start.length==0){
            var _start=[];
            var init=-1*this.startEndVal;
            for (let index = 0; index < this.totalBars; index++) {
                _start.push(init+(index*30))
            }
            this.setState({start:_start})
            return;
        }
    }
    setMarqueeInit(){
        setInterval(()=>{
        this.setState({oneTime:true});
        var _startAnim=this.state.start;
        for (let index = 0; index < this.totalBars; index++) {
            _startAnim[index]=_startAnim[index]+1;
            if(_startAnim[index]>200){
                _startAnim[index]=-1*this.startEndVal;
            }
        }
        this.setState({start:_startAnim})
         
    },50)
    }
    getAllViews(){
        var allItems=[];
        for (let index = 0; index < this.totalBars; index++) {
            // console.log(index+"//"+(index*30)+this.state.start);
            if(this.state.start.length>0){
            allItems.push(
                <View key={"V1"+index} style={{position:'absolute', backgroundColor:this.props.bgColor,width:25,height:5,transform:[{translateX:this.state.start[index]}]}}>
                </View>
                )
            }
        }
            return allItems;
        }
        
        render(){
            return(
                <View style={[{flexDirection:'row',overflow:'hidden',alignSelf:'center',justifyContent:'center',height:3,marginBottom:widthPercentageToDP(3)},this.props.style]}>
                {this.getAllViews()}
                </View>
                )
            }
            
        }