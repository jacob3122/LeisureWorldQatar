import React, { useContext, useEffect, useState } from 'react';
import {  StyleSheet,Text, View,Dimensions,ImageBackground, TouchableOpacity} from 'react-native';
import ProfileData from '../Tools/Components/ProfileData';
import * as Tools from '../Tools/Components/Tools'
import SecureStore from '../Tools/Components/SecureStore';
import { StateContext } from '../Tools/context/ContextState';
import { Colors } from 'react-native/Libraries/NewAppScreen';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


export default function HomeScreen (props) {
  
  const {pageToGo, setPageToGo} = useContext(StateContext);
  
  const[topage,setToPage] =useState('home')
  useEffect(()=>{
    setPageToGo(topage)
  },[])
  
  assignPage=(pagetogo)=>{
    SecureStore.getItemAsync('accessToken').then(accessToken=>{
      if(Tools.stringIsEmpty(accessToken))
      return;
      global.selectedPage=1;
      props.navigation.navigate(pagetogo,{pagefrom:'card'});
    });
  }

    
    return (
      <View style={styles.container}>
      <ProfileData pagetogo={topage} navigation={props.navigation} />
      </View>
      );
      
    }
    
    const styles = StyleSheet.create({
      bgImage:{
        position:'absolute',
        alignSelf:'center',
        width:'100%',
        height:height,
        resizeMode:'contain'
      },
      gradStyle:{
        position:'absolute',
        width:width,
        height:height,
        zIndex:-1,
      },
      container: {
        flex: 1,
      }
    });
    
    
    