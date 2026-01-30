import React, { memo } from 'react'
import { StyleSheet, Text, View, Image, FlatList, SafeAreaView } from 'react-native';
import { Image as RNImage } from 'react-native-elements';
import HorizontalFeed from './HorizontalFeed';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import VerticalFeed from './VerticalFeed';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as Tools from './Tools';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';
// import Colors from '../constants/Colors';




const NewsFeed = ({ news,profile }) => {
    // useEffect(()=>{
    //     console.log("News : "+JSON.stringify(news));
    // },[])
    const Colors = useTheme(); // Get the current color scheme's colors
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const styles = StyleSheet.create({
        container: {
            flex:1
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
            includeFontPadding: false,
            flexWrap: 'wrap',
            textAlign:'left',
            textTransform:'uppercase',
            fontFamily:'Cairo-SemiBold',
            color:Colors.inputfontColor,
            fontSize:widthPercentageToDP(4.5),
            lineHeight:widthPercentageToDP(4.5)*1.4,
            marginHorizontal: widthPercentageToDP(3),
        }
    });
    return (
        <SafeAreaView style={{flex:1}}>
        {!Tools.IsNull(news.Settings)&&!Tools.IsNull(news.Settings.title_en)&&<Text style={styles.title}>{Tools.stringIsContains(i18n.locale,'en')?news.Settings.title_en:news.Settings.title_ar}</Text>}
        <VerticalFeed profile={profile} news={news.ContentItems} settings={news.Settings}/>
        </SafeAreaView>
        )
    }
    
    export default memo(NewsFeed)
    