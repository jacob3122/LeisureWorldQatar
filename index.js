/**
 * @format
 */

// import 'react-native-gesture-handler';
import React from 'react';
import {Platform,AppRegistry,StatusBar} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import { store } from './src/ProfileStore';
import Colors from './Tools/constants/Colors';

import { StateProvider } from './Tools/context/ContextState';

const wrapApp = () =>{
    return(
        <StateProvider>
        <Provider store = {store} >
            <App/>
        </Provider>
        </StateProvider>
    )
};

AppRegistry.registerComponent(appName, () => wrapApp);
