import React, { useState, useCallback, memo } from 'react'
import { StyleSheet, Text, View, Image, FlatList, Platform, TouchableOpacity,Linking } from 'react-native';
import { Image as RNImage } from 'react-native-elements';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Colors from '../constants/Colors';
import FastImage from '@d11/react-native-fast-image';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';
import AppIcon from './AppIcon';
import * as UIElements from '../../Tools/Components/UIElements'
import LayoutView from '../Components/LayoutView'
import * as Tools from '../Components/Tools';

//ContentTypeId 1 - open content in app
//2- website
const styles = StyleSheet.create({
    container: {
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8,
        backgroundColor: 'white',
        borderRadius: widthPercentageToDP(3),
        flexDirection: 'row',
        alignSelf:'center',
        overflow:'hidden'
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        flexWrap: 'wrap',
        marginHorizontal: 10,
    }
});


const VerticalFeed = ({ news,settings,profile }) => {

    const [imageAspect, setImageAspect] = useState(1);

    const navigationIn = useNavigation();

    onImageIn=(evt)=>{
        setImageAspect(evt.nativeEvent.width / evt.nativeEvent.height);
    }

    // Memoized renderItem to prevent unnecessary re-renders
    const renderLayoutItem = useCallback(({ item, index }) => (
        <LayoutView item={item} index={index} news={news} profile={profile} settings={settings}/>
    ), [news, profile, settings]);

    // Memoized keyExtractor
    const keyExtractor = useCallback((item, index) =>
        item.Id ? `layout-${item.Id}` : `layout-${index}`,
    []);

    return (
        <View 
        style={{marginBottom:heightPercentageToDP(2),justifyContent:'center',width:widthPercentageToDP(100),
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3,elevation:3,
        shadowOpacity: 0.12, overflow:'visible'}}
        >
        {news!=undefined&&
            <FlatList
            removeClippedSubviews={Platform.OS === 'ios'}
            decelerationRate="fast"
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={5}
            onEndReachedThreshold={0.1}
            showsHorizontalScrollIndicator={false}
            data={news}
            keyExtractor={keyExtractor}
            horizontal={Tools.stringIsContains(settings.orientation,'horizontal')}
            snapToInterval={widthPercentageToDP((settings.itemwidth/100)*94)}
            pagingEnabled
            extraData={profile}
            renderItem={renderLayoutItem}
            />}
                            </View>
                            )
                        }
                        
                        export default memo(VerticalFeed)