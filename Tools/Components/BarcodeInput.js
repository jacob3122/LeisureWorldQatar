// import I18n from 'i18n-js';
import React, { Component } from 'react'
import { PureComponent } from 'react';
import { StyleSheet,Modal, View,Text,Dimensions,Image} from 'react-native';
import Colors from '../constants/Colors';

import * as tools from '../../Tools/Components/Tools.js';
import BarcodeScan from './BarcodeScan';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');



export default class BarcodeInput extends Component {
    _isMounted=false;
    constructor (props){
        super(props);
        
        this.state={
        }
        this.updateInput=this.updateInput.bind(this)
    }
    
    componentDidMount(){
        this._isMounted=true;
    }
    componentWillUnmount(){
        this._isMounted=false;
    }
    
    updateInput(value){
        var ondone=this.props.onDone;
        ondone(value)
    }
    
    render() {
            return (
                <Modal  statusBarTranslucent={true} animationType='none' transparent={true} visible={this.props.visible}>
                <View style={styles.loading} >
                <BarcodeScan navigation={this.props.navigation} onScanDone={this.updateInput}/>
                </View>
                </Modal>
                )
            }
    }
    const styles = StyleSheet.create({
        
        loading: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:Colors.transparentBlack,
           
            zIndex:10,
        }
    });