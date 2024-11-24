import React, { Component } from 'react'
import  {StyleSheet,Dimensions,Image,SafeAreaView ,TouchableOpacity } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import proceedB from '../../assets/Icons/back.png'
import * as Tools from './Tools';
import SecureStore from '../../Tools/Components/SecureStore';

export default class BackButton extends Component {
    
    constructor(props){
        super(props);
        this.state={
            language:'',
        }
    }
    componentDidMount(){
        SecureStore.getItemAsync('languageENAR').then(languagecheck=>{
            this.setState({language:languagecheck})
        });
    }
    
    render() {
        return (
            <SafeAreaView style={styles.backView}>
            <TouchableOpacity onPress={()=>{
                var onpress= this.props.onpress;
                onpress();
            }}>
            <Image source={proceedB} style={[styles.backbut,(Tools.stringIsContains(this.state.language,'en'))?{transform:[{rotateZ:'0deg'}]}:{transform:[{rotateZ:'-180deg'}]}]} ></Image>
            </TouchableOpacity>
            </SafeAreaView >
            );
        }
    }
    
    const styles = StyleSheet.create({
        backView:{
            position:'absolute',
            bottom:0,
            alignSelf:'center',
            width:50,
            height:50,
        },
        backbut:{
            alignSelf:'center',
            width:25,
            height:25,
        },
        
    });
    





