import React, { Component, useContext, useEffect } from 'react'
import BackgroundWall from './BackgroundWall';
import { View,StyleSheet } from 'react-native';
import NotificationPop from './NotificationPop';
import { StateContext } from '../context/ContextState';
import NotificationPopFCM from './NotificationPopFCM';


function OpenFullScreen({navigation})
{
    const {pageContent, setPageContent} = useContext(StateContext);

    // useEffect(()=>{
    //     // console.log("PC :"+pageContent);
    //     if(pageContent!=undefined)
    //     console.log(pageContent.type);
    // },[pageContent])
    const onDone=()=>{
        setPageContent(undefined);
    }

    if(pageContent==undefined){
        return(<></>)
    }else{
        return(
            <View style={styles.loading} >
            {(pageContent.type=='notificationApp')&&<NotificationPop navigation={navigation} onDone={onDone} notification={pageContent}/>}
            {(pageContent.type=='notification')&&<NotificationPopFCM navigation={navigation} onDone={onDone} notification={pageContent}/>}
            </View>
            );
        }
    }
    
    export default OpenFullScreen;
    const styles = StyleSheet.create({
        
        loading: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex:10,
        }
    });