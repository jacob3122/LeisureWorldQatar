import React, { Component } from 'react';
import {View,TouchableOpacity,StyleSheet,Text} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
export default class ButtonGroup extends Component {

    constructor(props){
        super(props);
        this.state={
            selectedButton:0
        };

    }
    updateIndex (index) {
        this.setState({selectedButton:index});
        this.props.selectedButton=index;
        var handleToUpdate  =   this.props.handler;
        handleToUpdate(index);
    }
    

    // componentWillReceiveProps(){
    //     this.setState({selectedButton:this.props.selectedButton});
    // }

    getButtons(){
        var AllButtons=[];
        for(let t=0;t<this.props.ButtonNames.length;t++){
        
        AllButtons.push(<TouchableOpacity key={t} style={[this.props.ContentStyle,t==this.props.selectedButton?[ButtonGroupStyles.activeButton,{backgroundColor:this.props.navigation.getParam('color')}]:ButtonGroupStyles.inactiveButton]}
            onPress={()=>this.updateIndex(t)}>
                <Text allowFontScaling={false} style={ButtonGroupStyles.textItem}>{this.props.ButtonNames[t]}</Text>
            </TouchableOpacity>);
        }
        return AllButtons;
    }

    render() {
        return (
            <View style={this.props.ContainerStyle}>
                {this.getButtons()}
                {UIElements.drawGap(15)}
            </View>
        )
    }
}

const ButtonGroupStyles = StyleSheet.create({
    activeButton:{
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },inactiveButton:{
        backgroundColor:Colors.inactiveTab,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },
    textItem:{
        alignSelf:'center',
        fontSize:15,
        // paddingTop:15,
        color:Colors.whiteColor,fontFamily:'Cairo-Bold'

        // paddingTop:(Platform.OS==='ios'?10:0)
    },
});

ButtonGroup.propTypes = {
    ButtonNames: PropTypes.array.isRequired,
    selectedButton:PropTypes.number,
    handler:PropTypes.func.isRequired,
    // ContainerStyle:PropTypes.style,
    // ContentStyle:PropTypes.style,
}