import React, { PureComponent, useEffect, useReducer, useState } from 'react';
import { SafeAreaView, Text, Dimensions, StyleSheet } from 'react-native';
import NetInfo, { addEventListener } from "@react-native-community/netinfo";
const { width } = Dimensions.get('window');
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import {connect} from 'react-redux';
import {updateNetwork} from '../../src/js/actions/profileActions';
import { heightPercentageToDP } from 'react-native-responsive-screen';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { StatusBar } from 'react-native';
import AppReducer, { initialState, useAppContext } from '../../src/js/reducers/AppReducer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MiniOfflineSign() {
  return (
    <SafeAreaView style={styles.offlineContainer}>
      <Text allowFontScaling={false} style={styles.offlineText}>{i18n.t('nointernet')}</Text>
    </SafeAreaView>
  );
}

export default function OfflineNotice(props){
  const { state, dispatch } = useAppContext();
  i18n.translations = state.i18ntranslation;

  const[isConnected,setIsConnected]=useState(true);
  const[canshow,setcanshow]=useState(false);

  useEffect(()=>{
    addEventListener(stateNet => {
      // console.log(JSON.stringify(stateNet))
      handleConnectivityChange(stateNet.isConnected);
  });

  return()=>{
  //  removeev(stateNet => {
  //     handleConnectivityChange(stateNet.isInternetReachable);
  // });
  }
  },[])


  handleConnectivityChange = isConnected => {
    setcanshow(!isConnected);
    console.log('dispatch : update_Network'+isConnected)
      dispatch({
        type: 'update_Network',
        stateIn: isConnected
    });
  };

  // render() {
    if (!state.isConnected)
    //&&this.state.canshow) 
    {
      return <MiniOfflineSign/>;
    }
    return <></>;
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: StatusBar.currentHeight==null?useSafeAreaInsets.top:StatusBar.currentHeight+ heightPercentageToDP(.7),
    zIndex:10,
  },
  offlineText: { color: '#fff',fontFamily:'Cairo-Regular'}
});

// const mapStateToProps = state=>{
//     return {
//       isConnected:state.profileReducer.isConnected,
//     }                
//   };
  
//   const mapDispatchToProps = (dispatch) => {
//     return{
//       updateNetwork:(nData)=> dispatch(updateNetwork(nData)),
//     };
//   }
  
//   export default connect(
//     mapStateToProps,
//     mapDispatchToProps
    // )(OfflineNotice)

// export default OfflineNotice;