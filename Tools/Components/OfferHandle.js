import { Text } from 'react-native';
import { RefreshControl,ScrollView,Dimensions} from 'react-native';
// import {ButtonGroup} from 'react-native-b'
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import ButtonGroup from './ButtonGroup';
import * as UiElements from './UIElements.js';
import AdBlock from './AdBlock';

import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);



const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


export class OfferHandle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            selectedPage:0
        };
        this.handler = this.handler.bind(this);
    }

    
    refreshListView () {
        this.setState({refreshing: false});
       
    }
    
    handler(someValue) {
        this.setState({
            selectedPage: someValue
        });
        this.refs.scrollview.scrollTo({x: someValue*(width-30), y: 0, animated: true});
    }
    
    refreshControl(){
        return (
            <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={()=>this.refreshListView()} />
            )
        }
        
        
        
        
        _contentViewScroll = (e) => {
            const scrolled =(e.nativeEvent.contentOffset.x);
            const position = (scrolled > 0) ? scrolled / width : 0;
            this.setState({selectedPage:Math.round(position)});
        }
        
        render() {
            
            const buttonsInit = ['All', 'Angry Birds', 'Virtuocity','SnowDunes'];
            
            return (
                <View style={OfferHandlestyles.homeView}>
                {/* {UiElements.drawGap(30)} */}
                <Text allowFontScaling={false} style={OfferHandlestyles.heading}>{i18n.t('offer')}</Text>
                <Text allowFontScaling={false} style={OfferHandlestyles.detailstitle}>{i18n.t('greatdeals')}</Text>
                <ButtonGroup 
                ButtonNames={buttonsInit} 
                ContentStyle={OfferHandlestyles.tabItem}
                ContainerStyle={OfferHandlestyles.rowView} 
                selectedButton={this.state.selectedPage} 
                handler = {this.handler}/>
                {UiElements.drawGap(10)}
                {/* <ScrollView style={OfferHandlestyles.homeScrollView}
                refreshControl={this.refreshControl()}
            showsVerticalScrollIndicator={false}> */}
            
            <ScrollView 
            ref='scrollview'
            style={OfferHandlestyles.container}
            onMomentumScrollEnd={this._contentViewScroll}
            pagingEnabled={true}
            horizontal= {true}
            vertical= {false}
            
            decelerationRate='fast'
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 30}
            snapToAlignment={"center"}
            contentInset={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            }}>
            <ScrollView style={OfferHandlestyles.view}
            showsVerticalScrollIndicator={false}>
            {this.getListOfView(4)}
            </ScrollView>
            <ScrollView style={OfferHandlestyles.view1}
            showsVerticalScrollIndicator={false}>
            {this.getListOfView(4)}
            </ScrollView>
            <ScrollView style={OfferHandlestyles.view2}
            showsVerticalScrollIndicator={false} >
            {this.getListOfView(4)}
            </ScrollView>
            <ScrollView style={OfferHandlestyles.view3}
            showsVerticalScrollIndicator={false} >
            {this.getListOfView(4)}
            </ScrollView>
            </ScrollView>
            {/* </ScrollView> */}
            </View>
            );
        }
        
        getListOfView(noofViews){
            lines=[];
            for(let t=0;t<noofViews;t++){
                lines.push(<AdBlock key={"t"+t} navigation={this.props.navigation} ></AdBlock>);
            }
            return lines;
        }
    }
    
    const OfferHandlestyles = StyleSheet.create({
        rowView:{
            flexDirection: 'row',
        }, 
        tabItem:{
            flex:1,
            height:(height/20),
        },
        heading: {
            fontSize: 40,
            fontFamily:'Cairo-Bold',
            paddingBottom:5,
            textAlign:'left',
            
        },
        homeScrollView: {
            flex: 1,
            backgroundColor:'#fff',
        }
        ,
        homeView: {
            marginTop:30,
            padding:15,
            flex: 1,
            backgroundColor:'#fff',
        },detailstitle:{
            fontSize: 20,
            fontWeight: '200',
            textAlign:'left',
            paddingBottom:15,
        },
        container: {},
        view: {
            marginTop: 10,
            //   backgroundColor: 'blue',
            width: width - 30,
            //   height: height-250,
            borderRadius: 10,
        },
        view1: {
            marginTop: 10,
            // backgroundColor: 'gray',
            width: width - 30,
            height: height-250,
            borderRadius: 10,
        },
        view2: {
            marginTop: 10,
            //   backgroundColor: 'red',
            width: width - 30,
            height: height-250,
            borderRadius: 10,
        }, view3: {
            marginTop: 10,
            // backgroundColor: 'yellow',
            width: width - 30,
            height: height-250,
            borderRadius: 10,
        }
        
    });
    
    