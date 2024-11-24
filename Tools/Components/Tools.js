// import React from 'react';
// import Rate, { AndroidMarket } from 'react-native-rate';
import SecureStore from '../../Tools/Components/SecureStore';
import moment from 'moment';

module.exports={
    getAppNames(_code){
        if(_code=='home'){
            return 'Homescreen'
        }else if(_code=='wallet'){
            return 'Walletscreen'
        }else if(_code=='rewards'){
            return 'Cardscreen'
        }else if(_code=='partners'){
            return 'Parkscreen'
        }else if(_code=='store'){
            return 'Storescreen'
        }
        
    },
    getScreenName(_code){
        return _code;
        
    },
    getScreen(_code){
        if(!this.stringIsEmpty(_code)){
            return {screen:this.getScreenName(_code)}
        }else{
            return {}
        }
    },
    darkenColor(hexColor, factor) {
        // Parse the hex color to extract RGB components
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
      
        // Calculate the darker RGB components
        const darkerR = Math.max(0, r - factor * 255);
        const darkerG = Math.max(0, g - factor * 255);
        const darkerB = Math.max(0, b - factor * 255);
      
        // Convert the darker RGB components back to hex
        const darkerHexColor =
          '#' +
          Math.round(darkerR).toString(16).padStart(2, '0') +
          Math.round(darkerG).toString(16).padStart(2, '0') +
          Math.round(darkerB).toString(16).padStart(2, '0');
      
        return darkerHexColor;
      },
    hextorgb(hex) {
        // console.log("hexToRgbNew:"+hex);
        const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (normal) return "rgba("+normal.slice(1).map(e => parseInt(e, 16))+",0.2)";
        
        const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (shorthand) return "rgba("+shorthand.slice(1).map(e => 0x11 * parseInt(e, 16))+",0.25)";
        
        return null;
    },
    randomNumberInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    stringIsEmpty(value){
        return (value===undefined|| value === null || (value.length === 0));
    },
    IsNull(value){
        return (value ==null||value==undefined||value=={}||JSON.stringify(value)=={}|| (value.length == 0));
    },
    stringIsContains(inputValue,checkValue){
        if(!this.stringIsEmpty(inputValue)&&!this.stringIsEmpty(checkValue))
        return (inputValue.toLowerCase().indexOf(checkValue.toLowerCase()) > -1);

        return false;
    },
    stringsIsEqual(inputValue,checkValue,seprator){
        var inputValues=inputValue.split(seprator);
        var returnvalue=false;
        for(let t=0;t<inputValues.length;t++){
            if(!this.stringIsEmpty(inputValues[t])&&(inputValues[t].toLowerCase()==checkValue.toLowerCase())){
                returnvalue=true;
            }
        }
        return returnvalue;
    },
    getTimefromString(_datetime,format="DD-MM-YYYY"){
        return moment(_datetime).format(format);
    },
    updateRatePoints(count){
        // SecureStore.setItemAsync('appRated','false');
        SecureStore.getItemAsync('ratePoints').then(val=>{
            // console.log("Count :"+val);
            if(this.stringIsEmpty(val)){
                val='0';
            }
            currentVal=parseInt(val)+count;
            SecureStore.setItemAsync('ratePoints',''+currentVal)
            // console.log("Count :"+currentVal);
            if(global.rateVisible&&currentVal>100){
                this.rateApp(true);
                global.rateVisible=true;
            }
        });
    },
    
    async rateApp(checkapp){
        const result = await RateApp.openStoreForReview({
            iOSAppId: "1483032774", // Required on iOS, macOS
            androidPackageName: "com.leisureloyalty", // Required on Android
            androidMarket: AndroidMarket.GOOGLE, // Optional, defaults to GOOGLE
        });
        
        // const options = {
        //     AppleAppID:"1483032774",
        //     GooglePackageName:"com.leisureloyalty",
        //     preferredAndroidMarket: AndroidMarket.Google,
        //     preferInApp:true,
        //     openAppStoreIfInAppFails:false,
        //     // fallbackPlatformURL:"http://www.leisure.qa/app/",
        // }
        // if(result){
        //     SecureStore.getItemAsync('appRated').then(val=>{
        //         // console.log("Count :"+val);
        //         if(!this.stringIsContains(val,'true')){
        //             Rate.rate(options, success=>{
        //                 // console.log("Rate Succ :"+success);
        //                 if (success) {
        //                     SecureStore.setItemAsync('appRated','true');
        //                 }else{
        //                     SecureStore.setItemAsync('ratePoints',''+0);
        //                 }
        //             })
        //         }
        //     })
        // }else{
        //     Rate.rate(options, success=>{
                // console.log("Rate Succ :"+success);
                if (result) {
                    SecureStore.setItemAsync('appRated','true');
                }else{
                    SecureStore.setItemAsync('ratePoints',''+0);
                }
            // })
        // }
    }
}