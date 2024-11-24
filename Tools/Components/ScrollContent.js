import React, { Component } from 'react';
import {Image, View,ScrollView,StyleSheet,Dimensions,Text,Platform,TouchableOpacity} from 'react-native';
import AdBlock from './AdBlock';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const smallerWidth = width * .9346;

export default class ScrollContent extends Component {
    
    constructor(props){
        super(props);
    }
    
    
    render() {
        return (
            <View style = {{backgroundColor:this.props.color}} >
                <Text style={styles.title}> {this.props.title}</Text>
            <ScrollView 
            ref='scrollview'
            style={styles.container}
            // onMomentumScrollEnd={this._contentViewScroll}
            pagingEnabled={true}
            horizontal= {true}
            decelerationRate='fast'
            showsHorizontalScrollIndicator={false}
            // snapToInterval={(width*.9)-((Platform.OS==='ios')? width *.035:width*.025)+(((Platform.OS==='ios')? width *.008:width*.01)/2)}//{(Platform.OS==='ios')? width *.9616:width*.9346}
            snapToInterval ={width-20}
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={16} 
            snapToAlignment={"center"}
            contentInset={{
                top: 0,
                left: 5,
                bottom: 0,
                right: 5,
            }}>
            {this.getListOfView()}
            </ScrollView>
            <View style={{padding:15}}/>
            </View>
            )
        }
       

        getListOfView(){
            lines=[];
            for(let t=0;t<this.props.noofViews;t++){
                lines.push(<View key={"v"+t} style={{flex:1,margin:5}} ><AdBlock key={"t"+t} navigation={this.props.navigation} ></AdBlock></View>);

            }
            return lines;
        }
    }

    const styles = StyleSheet.create({
        // title:{
        //     padding:10,
        //     fontSize:25,
        //     textAlign:'left',
        //     fontFamily:'Cairo-Bold'
        // },
        container: {
            // alignContent:'space-between'
        },
        title:{
            margin: 10,
            fontSize:20,
            textAlign:'left',
            fontFamily:'Cairo-Bold'
        },
        duration:{
            marginLeft: 10,
            fontSize:15,
            fontWeight:'400'
        },
        view: {
            margin: 5,
          //   marginTop: 10,
            backgroundColor: 'lightblue',
            width: width -30,
            height: height/4,
            borderRadius: 10,
          }
    });
    