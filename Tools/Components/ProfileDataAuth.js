/**
 * ProfileDataAuth.js
 * 
 * All authentication, API, and profile management functions extracted from ProfileData.js.
 * Each function receives a `deps` object containing the dependencies it needs
 * (state, dispatch, navigation, setters, refs, etc.) instead of relying on closure scope.
 * 
 * Location: Tools/Components/ProfileDataAuth.js
 */

import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import SecureStore from './SecureStore';
import WebServices from '../constants/WebServices';
import * as Tools from './Tools';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
import { logClaimEvent, logLoginEvent, logLogoutEvent } from '../Analytics/AppAnalytics';
import ReactMoE from 'react-native-moengage';

const i18n = new I18n(translations);

// ─────────────────────────────────────────────
// Helper: show alert from FeedBack array
// ─────────────────────────────────────────────
function showAlert(feedInfo) {
    if (feedInfo && feedInfo.length > 0 && feedInfo[0] != undefined) {
        Alert.alert(feedInfo[0], (feedInfo[1] == undefined ? '' : feedInfo[1]));
    }
}

// ─────────────────────────────────────────────
// resetData
// ─────────────────────────────────────────────
export function resetData(deps) {
    const { dispatch, navigation } = deps;
    global.profileUpdate = false;
    navigation.navigate('Homescreen');
    SecureStore.setItemAsync('accessToken', '');
    SecureStore.setItemAsync('profile', '');
    dispatch({ type: 'update_Profile', payload: undefined });
    dispatch({ type: 'update_AccessToken', payload: undefined });
    dispatch({ type: 'update_Cart', stateIn: undefined });
}

// ─────────────────────────────────────────────
// updateMobileToken
// ─────────────────────────────────────────────
export async function updateMobileToken(deps, LaccessToken = null, biotoken = null, profile = null) {
    const { state, dispatch, setloading, bioKey } = deps;
    i18n.translations = state.i18ntranslation;

    const _profileIn = profile != null ? profile : state.profile != undefined ? state.profile : undefined;
    if (!_profileIn) return;

    const verifyurl = WebServices.mobileToken;

    const details = {
        'Token': global.mobileToken,
        'DeviceName': Platform.Version,
        'DeviceType': Platform.OS,
        'DeviceAppVersion': Platform.OS == 'ios' ? global.CurrentiOSversion : global.CurrentAndroidversion,
        'DeviceAppLanguage': i18n.locale,
        'MemberID': Tools.stringIsEmpty(_profileIn.Id) ? '' : _profileIn.Id,
        "BiometricToken": biotoken == null ? (Tools.stringIsEmpty(bioKey) ? "" : bioKey) : biotoken,
        "MemberNotifications": {
            "app": Tools.IsNull(_profileIn.TokenInfo) ? true : Tools.IsNull(_profileIn.TokenInfo.MemberNotifications.app) ? true : _profileIn.TokenInfo.MemberNotifications.app,
            "email": Tools.IsNull(_profileIn.TokenInfo) ? true : Tools.IsNull(_profileIn.TokenInfo.MemberNotifications.email) ? true : _profileIn.TokenInfo.MemberNotifications.email,
            "sms": Tools.IsNull(_profileIn.TokenInfo) ? true : Tools.IsNull(_profileIn.TokenInfo.MemberNotifications.sms) ? true : _profileIn.TokenInfo.MemberNotifications.sms
        },
        "MemberLocations": {
            "country": Tools.IsNull(_profileIn.TokenInfo) ? true : Tools.IsNull(_profileIn.TokenInfo.MemberLocations.country) ? '' : _profileIn.TokenInfo.MemberLocations.country,
            "city": Tools.IsNull(_profileIn.TokenInfo) ? true : Tools.IsNull(_profileIn.TokenInfo.MemberLocations.city) ? '' : _profileIn.TokenInfo.MemberLocations.city
        }
    };

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details)
        }, WebServices.timeout);

        const responseJson = await response.text();
        let dataGot;
        try {
            dataGot = JSON.parse(responseJson);
        } catch (e) {
            dataGot = undefined;
        }
        if (dataGot != undefined) {
            dispatch({ type: 'update_Profile', payload: dataGot });
            SecureStore.setItemAsync('profile', JSON.stringify(dataGot));
        }
    } catch (error) {
        if (setloading) setloading(false);
    }
}

// ─────────────────────────────────────────────
// updateProfilewithMobileToken
// ─────────────────────────────────────────────
export async function updateProfilewithMobileToken(deps, LaccessToken) {
    const { state, setloading } = deps;

    const verifyurl = WebServices.profilewithToken
        .replace('{MemberID}', state.accessToken.MemberID)
        .replace('{TokenID}', global.mobileToken);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + LaccessToken,
                'Content-Type': 'application/json',
            },
        }, WebServices.timeout);

        const responseJson = await response.text();
        // Response not used, matching original behavior
    } catch (error) {
        console.error("MT" + error);
        if (setloading) setloading(false);
    }
}

// ─────────────────────────────────────────────
// updateProfileWs
// ─────────────────────────────────────────────
export async function updateProfileWs(deps, someValue) {
    const { state, setloading } = deps;
    i18n.translations = state.i18ntranslation;
    let FeedBack = [];

    setloading(true);

    const details = {
        'FirstName': someValue.FirstName,
        'FullName': someValue.FirstName,
        'LastName': someValue.LastName,
        'Mobile': someValue.Mobile,
        'Email': someValue.Email,
    };

    const verifyurl = WebServices.UpdateProfile.replace('{MemberID}', state.accessToken.MemberID);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + state.accessToken.access_token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(details)
        }, WebServices.timeout);

        const responseJson = await response.text();

        if (!Tools.stringIsContains(responseJson, 'error')) {
            if (Tools.stringIsContains(responseJson, 'success')) {
                FeedBack = [(i18n.t('updatesuccess')), i18n.t('profileupdated')];
            } else {
                FeedBack = [(i18n.t('updatefail')), i18n.t('profilenotupdated')];
            }
        } else {
            FeedBack = [(i18n.t('updatefail')), responseJson];
        }
        showAlert(FeedBack);
        setloading(false);
    } catch (error) {
        console.error("updateProfileWs" + error);
        setloading(false);
    }
}

// ─────────────────────────────────────────────
// fetchUserProfile
// ─────────────────────────────────────────────
export async function fetchUserProfile(deps, LmemberID, LaccessToken, functionToBindOnFinish = null, _accessData = null) {
    const { state, dispatch, setloading, setsetpass, setloginOpen, _isMounted, bioKey } = deps;
    i18n.translations = state.i18ntranslation;

    const verifyurl = WebServices.ProfileDetails.replace('{MemberID}', LmemberID);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + LaccessToken,
            },
        }, WebServices.timeout);

        if (response.ok) {
            const responseJson = await response.text();
            setloading(false);

            if (responseJson == null) return;

            if (_isMounted.current) setsetpass(undefined);

            if (Tools.stringIsEmpty(responseJson)) {
                setloading(false);
                return;
            }

            if (Tools.stringIsContains(responseJson, 'denied')) {
                refreshAccesstoken(deps, functionToBindOnFinish, _accessData);
                return;
            } else if (!Tools.stringIsContains(responseJson, 'error')) {
                const dataGot = JSON.parse(responseJson);

                // Token mismatch check
                if (state.profile != undefined && state.profile.TokenInfo != undefined &&
                    state.profile.TokenInfo.Token != undefined && dataGot.TokenInfo != undefined &&
                    dataGot.TokenInfo.Token != state.profile.TokenInfo.Token) {
                    setloading(false);
                    dispatch({ type: 'update_Profile', payload: undefined });
                    resetData(deps);
                    return;
                }

                setloading(false);

                // Biometric check
                if (Tools.IsNull(dataGot.TokenInfo) && Tools.IsNull(dataGot.TokenInfo.BiometricToken)) {
                    SecureStore.setItemAsync('useBiometric', 'N');
                } else {
                    global.checkBio = true;
                }

                global.bgColor = Tools.hextorgb(dataGot.TierInfo.Current_TierTheme.Background);
                dispatch({ type: 'update_Profile', payload: dataGot });
                SecureStore.setItemAsync('profile', JSON.stringify(dataGot));

                // Update mobile token if needed
                const appversion = (Platform.OS == 'ios' ? global.CurrentiOSversion : global.CurrentAndroidversion);
                if (dataGot.TokenInfo == null || (dataGot.TokenInfo.Token != global.mobileToken) ||
                    (dataGot.TokenInfo.AppVersion != appversion) || (dataGot.TokenInfo.AppLanguage != i18n.locale)) {
                    updateMobileToken(deps, global.mobileToken, null, dataGot);
                }

                if (functionToBindOnFinish != null) {
                    functionToBindOnFinish(LmemberID, LaccessToken);
                }
            } else {
                const dataGot = JSON.parse(responseJson);
                setloading(false);
                dispatch({ type: 'update_Profile', payload: undefined });
                let FeedBack = ['Login Error', dataGot.Message];
                showAlert(FeedBack);
                resetData(deps);
            }

            if (_isMounted.current) setloginOpen(false);
        } else if (response.status == 401) {
            refreshAccesstoken(deps, functionToBindOnFinish, _accessData);
            return;
        }
    } catch (error) {
        setloading(false);
        resetData(deps);
        if (_isMounted.current) setsetpass(undefined);
        console.error("login - " + error);
        let FeedBack = ['Login Error', ''];
        showAlert(FeedBack);
        SecureStore.setItemAsync('accessToken', '');
    }
}

// ─────────────────────────────────────────────
// refreshAccesstoken
// ─────────────────────────────────────────────
export async function refreshAccesstoken(deps, functionToBindOnFinish = null, LaccessToken = null) {
    const { state, dispatch, navigation, setloading } = deps;
    i18n.translations = state.i18ntranslation;
    let FeedBack = [];

    const _accessToken = (LaccessToken == null ? state.accessToken : LaccessToken);

    const details = {
        'refresh_token': _accessToken.refresh_token,
        'grant_type': 'refresh_token'
    };

    let formBody = [];
    for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    try {
        const response = await fetch(WebServices.MainURL + WebServices.RefreshToken, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + ((Platform.OS === 'ios') ? WebServices.base64Ios : WebServices.base64And),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        }, WebServices.timeout);

        setloading(false);

        if (response.status == 200) {
            const responseJson = await response.text();

            if (responseJson != null) {
                const dataGot = JSON.parse(responseJson);

                if (!Tools.stringIsContains(responseJson, 'error')) {
                    if (Tools.stringIsContains(responseJson, "denied")) {
                        resetData(deps);
                        FeedBack = [i18n.t('loginfail'), i18n.t('pleasecheckcred')];
                    } else if (dataGot == "Failed") {
                        resetData(deps);
                        FeedBack = [i18n.t('loginfail'), i18n.t('pleasecheckcred')];
                    } else if (dataGot == "NotVerified") {
                        resetData(deps);
                        FeedBack = [i18n.t('loginfail'), i18n.t('pleaseverify')];
                    } else {
                        SecureStore.setItemAsync('accessToken', responseJson);
                        dispatch({ type: "update_AccessToken", payload: dataGot });
                        fetchUserProfile(deps, dataGot.MemberID, dataGot.access_token, functionToBindOnFinish, dataGot);
                    }
                } else {
                    AssignProfile(deps, '', '', '');
                    navigation.navigate('Homescreen');
                    resetData(deps);
                    global.initProfile = undefined;
                }
                showAlert(FeedBack);
                setloading(false);
            }
        } else {
            AssignProfile(deps, '', '', '');
            navigation.navigate('Homescreen');
            resetData(deps);
            FeedBack = [i18n.t('loginfail'), i18n.t('pleasecheckcred')];
            global.initProfile = undefined;
        }
    } catch (error) {
        setloading(false);
    }
}

// ─────────────────────────────────────────────
// VerifyLogin (password-based)
// ─────────────────────────────────────────────
export async function VerifyLogin(deps, Lusername, Lpassword, Lismobile, callbackOnSuccess = null) {
    const { state, dispatch, setloading } = deps;
    i18n.translations = state.i18ntranslation;
    let FeedBack = [];

    console.log('verify' + Lusername);
    setloading(true);

    const details = {
        'username': Lusername,
        'password': Lpassword,
        'grant_type': 'password'
    };

    let formBody = [];
    for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    try {
        const response = await fetch(WebServices.MainURL + WebServices.Login, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + ((Platform.OS === 'ios') ? WebServices.base64Ios : WebServices.base64And),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        }, WebServices.timeout);

        const responseJson = await response.text();
        global.checkBio = true;

        const dataGot = JSON.parse(responseJson);

        if (!Tools.stringIsContains(responseJson, 'error')) {
            if (dataGot == "Failed") {
                FeedBack = [i18n.t('loginfail'), i18n.t('pleasecheckcred')];
            } else if (dataGot == "NotVerified") {
                FeedBack = [i18n.t('loginfail'), i18n.t('pleaseverify')];
            } else {
                dispatch({ type: 'update_Cart', stateIn: undefined });
                dispatch({ type: "update_AccessToken", payload: dataGot });
                SecureStore.setItemAsync('accessToken', responseJson);
                fetchUserProfile(deps, dataGot.MemberID, dataGot.access_token, callbackOnSuccess, dataGot);
            }
            showAlert(FeedBack);
        } else {
            setloading(false);
            if (Tools.stringIsContains(dataGot.error_description, 'incorrect')) {
                FeedBack = [i18n.t('loginfail'), i18n.t('usernamepasswrong')];
            } else if (Tools.stringIsContains(dataGot.error_description, 'mobile number not verified')) {
                FeedBack = [i18n.t('loginfail'), i18n.t('mobilenotverify')];
            } else if (Tools.stringIsContains(dataGot.error_description, 'email not verified')) {
                FeedBack = [i18n.t('loginfail'), i18n.t('emailnotverify')];
            }
            showAlert(FeedBack);
            setloading(false);
        }
    } catch (error) {
        FeedBack = [i18n.t('loginfail'), ''];
        showAlert(FeedBack);
        setTimeout(() => setloading(false), 500);
    }
}

// ─────────────────────────────────────────────
// VerifyMobileLoginOTP (send OTP)
// ─────────────────────────────────────────────
export async function VerifyMobileLoginOTP(deps, MobileNo, token = null) {
    const { state, setloading, setshowOtp, setshowOtpError, googleToken } = deps;
    i18n.translations = state.i18ntranslation;
    let FeedBack = [];

    setloading(true);

    try {
        const response = await fetch(WebServices.MainURL + WebServices.VerifyLoginOTP, {
            method: 'GET',
            headers: {
                'MobileNo': MobileNo,
                'RecToken': (Tools.IsNull(token) ? googleToken : token)
            },
        }, WebServices.timeout);

        const responseJson = await response.text();

        if (!Tools.stringIsContains(responseJson, 'error')) {
            if (Tools.stringIsContains(responseJson, "notexist")) {
                FeedBack = [i18n.t('loginfail'), i18n.t('pleasecheckmobileno')];
                setshowOtpError(true);
            } else if (Tools.stringIsContains(responseJson, "failed")) {
                FeedBack = [i18n.t('loginfail'), ""];
                setshowOtpError(true);
            } else if (parseInt(responseJson) == 0) {
                FeedBack = [i18n.t('loginfail'), ""];
                setshowOtpError(true);
            } else {
                const remain = moment(new Date()).add(parseInt(responseJson), "seconds");
                try {
                    await AsyncStorage.multiSet([
                        ['remaintime', ("" + remain)],
                        ['mobileno', "" + MobileNo]
                    ]);
                } catch (storageError) {
                    // Storage error, continue
                }
                setTimeout(() => {
                    setshowOtp(true);
                }, 100);
            }
        }

        showAlert(FeedBack);
        setloading(false);
    } catch (error) {
        console.error("VerifyMobileLoginOTP" + error);
        FeedBack = [i18n.t('loginfail'), ""];
        showAlert(FeedBack);
        setshowOtpError(true);
        setloading(false);
    }
}

// ─────────────────────────────────────────────
// VerifyLoginwithOTP (verify OTP and login)
// ─────────────────────────────────────────────
export async function VerifyLoginwithOTP(deps, Lusername, LOTP, callback = null, _token = null) {
    const { state, dispatch, setloading, setshowOtp, setshowOtpError, setsetpass, _isMounted } = deps;
    i18n.translations = state.i18ntranslation;
    let FeedBack = [];

    if (_isMounted.current) setshowOtp(false);
    setshowOtpError(false);
    setloading(true);

    const details = {
        'mobile': Lusername,
        'otp': LOTP,
        'grant_type': 'MobileOTP'
    };

    let formBody = [];
    for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    try {
        const response = await fetch(WebServices.MainURL + WebServices.Login, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + ((Platform.OS === 'ios') ? WebServices.base64Ios : WebServices.base64And),
                'Content-Type': 'text/plain',
            },
            body: formBody
        }, WebServices.timeout);

        const responseJson = await response.text();
        const dataGot = JSON.parse(responseJson);

        if (!Tools.stringIsContains(responseJson, 'error')) {
            if (_isMounted.current && deps.showOtp) setshowOtp(false);

            if (dataGot == "Failed") {
                setloading(false);
                FeedBack = [i18n.t('loginfail'), i18n.t('pleasecheckcred')];
            } else if (dataGot == "NotVerified") {
                setloading(false);
                FeedBack = [i18n.t('loginfail'), i18n.t('pleaseverify')];
            } else {
                if (dataGot.HasPassword === '1') {
                    dispatch({ type: 'update_Cart', stateIn: undefined });
                    dispatch({ type: "update_AccessToken", payload: dataGot });
                    SecureStore.setItemAsync('accessToken', responseJson);
                    fetchUserProfile(deps, dataGot.MemberID, dataGot.access_token, () => {
                        callback();
                    }, dataGot);

                    const remain = moment(new Date()).add(0, "seconds");
                    try {
                        await AsyncStorage.multiSet([
                            ['remaintime', ("" + remain)],
                            ['mobileno', '']
                        ]);
                    } catch (storageError) {
                        // Storage error, continue
                    }
                } else {
                    setloading(false);
                    if (_isMounted.current) {
                        setsetpass(dataGot);
                    }
                }
            }
            showAlert(FeedBack);
        } else {
            FeedBack = [i18n.t('loginfail'), dataGot.error_description];
            showAlert(FeedBack);
            setTimeout(() => {
                setloading(false);
                if (_isMounted.current) setshowOtp(true);
            }, 500);
        }
    } catch (error) {
        if (_isMounted.current) setshowOtp(false);
        console.error("VerifyLoginwithOTP" + error);
        FeedBack = [i18n.t('loginfail'), ""];
        showAlert(FeedBack);
        setTimeout(() => {
            setloading(false);
        }, 500);
    }
}

// ─────────────────────────────────────────────
// forgetPassRequest
// ─────────────────────────────────────────────
export async function forgetPassRequest(deps, para1 = null, para2 = null, callback = null, MobileNo = null, _token = null) {
    const { state, setloading, setforgetPassData, setshowForgetPass, setshowOtpError, googleToken } = deps;
    i18n.translations = state.i18ntranslation;
    let FeedBack = [];

    const userData = await AsyncStorage.getItem('remaintimecp');
    if (!Tools.IsNull(userData)) {
        const dateVal = parseInt(JSON.stringify(userData).replace('"', ''));
        const remain = moment(dateVal).diff(moment(new Date()), "seconds");
        if (remain > 0) {
            setforgetPassData(remain);
            setshowForgetPass(true);
            return;
        }
    }

    setloading(true);

    try {
        const response = await fetch(WebServices.MainURL + WebServices.forgetPass, {
            method: 'GET',
            headers: {
                'MobileNo': MobileNo,
                'RecToken': _token
            },
        }, WebServices.timeout);

        const responseJson = await response.text();

        if (!Tools.stringIsContains(responseJson, 'error')) {
            if (Tools.stringIsContains(responseJson, "notexist")) {
                FeedBack = [i18n.t('loginfail'), i18n.t('pleasecheckmobileno')];
                setshowOtpError(true);
            } else if (Tools.stringIsContains(responseJson, "failed")) {
                FeedBack = [i18n.t('loginfail'), ""];
                setshowOtpError(true);
            } else if (parseInt(responseJson) == 0) {
                FeedBack = [i18n.t('loginfail'), ""];
                setshowOtpError(true);
            } else {
                const remain = moment(new Date()).add(parseInt(responseJson), "seconds");
                if (callback != null) {
                    callback(remain);
                }
                try {
                    await AsyncStorage.multiSet([
                        ['remaintimecp', ("" + remain)],
                        ['mobilenocp', "" + MobileNo]
                    ]);
                } catch (storageError) {
                    // Storage error, continue
                }
                setTimeout(() => {
                    setforgetPassData(remain);
                    setshowForgetPass(true);
                }, 100);
            }
        }

        showAlert(FeedBack);
        setloading(false);
    } catch (error) {
        console.error("VerifyMobileLoginOTP" + error);
        FeedBack = [i18n.t('loginfail'), ""];
        showAlert(FeedBack);
        setshowOtpError(true);
        setloading(false);
    }
}

// ─────────────────────────────────────────────
// fetchClaimsProfile
// ─────────────────────────────────────────────
export async function fetchClaimsProfile(deps, LmemberID, LaccessToken) {
    const { dispatch, setloading } = deps;

    const verifyurl = WebServices.ClaimsProfile.replace('{MemberID}', LmemberID);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + LaccessToken,
            },
        }, WebServices.timeout);

        const responseJson = await response.text();
        const dataGot = JSON.parse(responseJson);

        if (!Tools.stringIsContains(responseJson, 'denied') && !Tools.stringIsContains(responseJson, 'error')) {
            dispatch({ type: "update_Claims", payload: dataGot });
        } else {
            if (Tools.stringIsContains(responseJson, 'denied')) {
                refreshAccesstoken(deps, (mid, a_token) => { fetchClaimsProfile(deps, mid, a_token); });
            }
        }
        setloading(false);
    } catch (error) {
        setloading(false);
    }
}

// ─────────────────────────────────────────────
// fetchClaimPoints
// ─────────────────────────────────────────────
export async function fetchClaimPoints(deps, LmemberID, LaccessToken, tokenId) {
    const { state, setloading, setclaimCheck } = deps;
    i18n.translations = state.i18ntranslation;
    let FeedBack = [];

    setclaimCheck(true);

    const verifyurl = WebServices.ClaimPoints.replace('{MemberID}', LmemberID).replace('{InvoiceCode}', tokenId);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + LaccessToken,
            },
        }, WebServices.timeout);

        const responseJson = await response.text();
        setclaimCheck(false);

        if (Tools.stringIsContains(responseJson, 'denied')) {
            refreshAccesstoken(deps, (mid, a_token) => { fetchClaimPoints(deps, mid, a_token, tokenId); });
        } else if (Tools.stringIsContains(responseJson, 'already')) {
            FeedBack = [i18n.t('claimfail'), i18n.t('alreadyclaimed') + tokenId];
        } else if (Tools.stringIsContains(responseJson, 'notfound') || Tools.stringIsContains(responseJson, 'error') || Tools.stringIsContains(responseJson, 'invalid')) {
            FeedBack = [i18n.t('claimfail'), i18n.t('failclaimed') + tokenId];
        } else if (Tools.stringIsContains(responseJson, 'success')) {
            FeedBack = [i18n.t('claimsuccess'), i18n.t('successclaimed') + tokenId];
        } else {
            FeedBack = [i18n.t('claimfail'), i18n.t('failclaimed') + tokenId];
        }

        logClaimEvent(FeedBack);
        showAlert(FeedBack);
    } catch (error) {
        setclaimCheck(false);
        FeedBack = [i18n.t('claimfail'), error];
        showAlert(FeedBack);
    }
}

// ─────────────────────────────────────────────
// fetchRedeemProfile
// ─────────────────────────────────────────────
export async function fetchRedeemProfile(deps, LmemberID, LaccessToken, callback = null) {
    const { dispatch, setloading } = deps;

    const verifyurl = WebServices.RedeemDetails.replace('{MemberID}', LmemberID);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + LaccessToken,
            },
        }, WebServices.timeout);

        const responseJson = await response.text();
        const dataGot = JSON.parse(responseJson);

        if (!Tools.stringIsContains(responseJson, 'denied') || !Tools.stringIsContains(responseJson, 'error')) {
            dispatch({ type: "update_Redeem", payload: dataGot });
            if (callback) {
                callback(dataGot);
            }
        } else {
            if (Tools.stringIsContains(responseJson, 'denied')) {
                refreshAccesstoken(deps, (mid, a_token) => { fetchRedeemProfile(deps, mid, a_token); });
            }
        }
        setloading(false);
    } catch (error) {
        if (callback) {
            callback(undefined);
        }
        setloading(false);
    }
}

// ─────────────────────────────────────────────
// fetchRedeemPoints
// ─────────────────────────────────────────────
export async function fetchRedeemPoints(deps, LmemberID, LaccessToken, tokenId, passcode, _callback = null) {
    const { state, setloading, setshowPop, PopupInfo } = deps;
    i18n.translations = state.i18ntranslation;
    let FeedBack = [];

    setloading(true);

    const verifyurl = WebServices.RedeemPoints
        .replace('{MemberID}', LmemberID)
        .replace('{VoucherId}', tokenId)
        .replace('{PassCode}', passcode);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + LaccessToken,
            },
        }, WebServices.timeout);

        const responseJson = await response.text();

        if (responseJson === 'InvalidPointsActivity') {
            FeedBack = [i18n.t('redeemfail'), i18n.t('invalidpointsactivity')];
        } else if (responseJson === 'InvalidPasscode' || responseJson === 'InvalidPassCode') {
            FeedBack = [i18n.t('redeemfail'), i18n.t('invalidpass')];
        } else if (responseJson === 'NotEnoughPoints') {
            FeedBack = [i18n.t('redeemfail'), i18n.t('notenough')];
        } else if (Tools.stringIsContains(responseJson, 'denied')) {
            refreshAccesstoken(deps, (mid, a_token) => { fetchRedeemPoints(deps, mid, a_token, tokenId, passcode, _callback); });
            return;
        } else if (Tools.stringIsContains(responseJson, 'already')) {
            FeedBack = [i18n.t('redeemfail'), i18n.t('alreadyredeemed') + tokenId];
        } else if (Tools.stringIsContains(responseJson, 'notenoughpoints')) {
            FeedBack = [i18n.t('redeemfail'), i18n.t('notenough')];
        } else if (!Tools.stringIsContains(responseJson, 'invalid') && !Tools.stringIsContains(responseJson, 'error') && !Tools.stringIsContains(responseJson, 'authorization')) {
            // Success
            PopupInfo.current.Title = i18n.t('congrats');
            PopupInfo.current.SubHeading = i18n.t('yourvoucherno');
            PopupInfo.current.ContentCode = responseJson;
            if (_callback) {
                _callback();
            }
            setshowPop(true);
            setloading(false);
            return;
        } else if (Tools.stringIsContains(responseJson, 'invalid')) {
            FeedBack = [i18n.t('redeemfail'), i18n.t('invalidpass')];
        } else {
            FeedBack = [i18n.t('redeemfail'), i18n.t('failredeemed') + tokenId];
        }

        showAlert(FeedBack);
        setloading(false);
    } catch (error) {
        setloading(false);
    }
}

// ─────────────────────────────────────────────
// submitChangePassRequest
// ─────────────────────────────────────────────
export async function submitChangePassRequest(deps, _memberId = null, _a_token = null, callback = null, MobileNo = null, repactcha = null) {
    const { state, setloading, setotpChangePassModal } = deps;

    const userData = await AsyncStorage.getItem('remaintimecp');
    if (!Tools.IsNull(userData)) {
        const dateVal = parseInt(JSON.stringify(userData).replace('"', ''));
        const remain = moment(dateVal).diff(moment(new Date()), "seconds");
        if (remain > 0) {
            setotpChangePassModal(true);
            return;
        }
    }

    // Store timer data
    try {
        const remain = moment(new Date()).add(3, 'minutes');
        if (callback != null) {
            callback(remain);
        }
        await AsyncStorage.multiSet([
            ['remaintimecp', ("" + remain)]
        ]);
    } catch (storageError) {
        // Storage error, continue
    }

    setloading(true);

    const verifyurl = WebServices.changePass.replace('{MemberID}', state.accessToken.MemberID);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + state.accessToken.access_token,
                'Content-Type': 'application/json',
                'RecToken': repactcha
            },
        }, WebServices.timeout);

        const responseJson = await response.text();

        if (Tools.stringIsContains(responseJson, 'denied')) {
            refreshAccesstoken(deps, (mid, a_token) => {
                submitChangePassRequest(deps, mid, a_token, callback);
            });
            return;
        } else {
            setloading(false);
            setotpChangePassModal(true);
        }
    } catch (error) {
        setloading(false);
        console.error("submitChangePassRequest" + error);
    }
}

// ─────────────────────────────────────────────
// submitforgetPassRequest (kept & fixed - was dead code with setState bug)
// ─────────────────────────────────────────────
export async function submitforgetPassRequest(deps) {
    const { state, setloading, setotpChangePassModal } = deps;

    setloading(true);

    const verifyurl = WebServices.changePass.replace('{MemberID}', state.accessToken.MemberID);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + state.accessToken.access_token,
                'Content-Type': 'application/json',
            },
        }, WebServices.timeout);

        const responseJson = await response.text();

        if (Tools.stringIsContains(responseJson, 'denied')) {
            refreshAccesstoken(deps, (mid, a_token) => {
                submitChangePassRequest(deps, mid, a_token);
            });
            return;
        } else {
            setloading(false);
            setotpChangePassModal(true);
        }
    } catch (error) {
        setloading(false);
        console.error("submitforgetPassRequest" + error);
    }
}

// ─────────────────────────────────────────────
// submitDeleteRequest
// ─────────────────────────────────────────────
export async function submitDeleteRequest(deps, _memberId = null, _a_token = null, onDone = null, repactcha = null) {
    const { state, setotpVerifyModal } = deps;

    const verifyurl = WebServices.deleteAccount.replace('{MemberID}', state.accessToken.MemberID);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + state.accessToken.access_token,
                'Content-Type': 'application/json',
                'RecToken': repactcha
            },
        }, WebServices.timeout);

        const responseJson = await response.text();

        if (Tools.stringIsContains(responseJson, 'denied')) {
            refreshAccesstoken(deps, (mid, a_token, onDone, repactcha) => {
                submitDeleteRequest(deps, mid, a_token, onDone, repactcha);
            });
            return;
        } else {
            setotpVerifyModal(true);
        }
    } catch (error) {
        console.error("submitDeleteRequest" + error);
    }
}

// ─────────────────────────────────────────────
// completeDeleteRequest
// ─────────────────────────────────────────────
export async function completeDeleteRequest(deps, _otp) {
    const { state, setloading, setotpVerifyModal, navigation } = deps;
    i18n.translations = state.i18ntranslation;

    const verifyurl = WebServices.deleteAccountOTP
        .replace('{MemberID}', state.accessToken.MemberID)
        .replace('{OTPCode}', _otp);

    try {
        const response = await fetch(WebServices.MainURL + verifyurl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + state.accessToken.access_token,
                'Content-Type': 'application/json',
            },
        }, WebServices.timeout);

        const responseJson = await response.text();

        if (Tools.stringIsContains(responseJson, 'denied')) {
            refreshAccesstoken(deps, (otp) => { completeDeleteRequest(deps, otp); });
            return;
        } else {
            SignOut(deps);
            const userDeletionData = await ReactMoE.deleteUser();
            Alert.alert(i18n.t('successdelete'), "");
            setotpVerifyModal(false);
            navigation.popToTop();
        }
    } catch (error) {
        setloading(false);
        console.log(error);
    }
}

// ─────────────────────────────────────────────
// SignOut
// ─────────────────────────────────────────────
export function SignOut(deps) {
    const { state, dispatch, navigation } = deps;
    logLogoutEvent(state.profile.Mobile, state.accessToken.MemberID);
    SecureStore.setItemAsync('loginRequested', 'N');
    dispatch({ type: 'update_Cart', stateIn: undefined });
    AssignProfile(deps, '', '', '');
    navigation.navigate('Homescreen');
    resetData(deps);
}

// ─────────────────────────────────────────────
// fetchCatalogFull
// ─────────────────────────────────────────────
export async function fetchCatalogFull(deps) {
    const { state, setloading, setstoreCatalog } = deps;

    const verifyurl = WebServices.catalogUrl;

    try {
        const response = await fetch(WebServices.CatalogMainUrl + verifyurl, {
            method: 'GET',
        }, WebServices.timeout);

        if (response.status == 200) {
            const responseJson = await response.text();

            if (Tools.stringIsEmpty(responseJson)) return;

            const dataGot = JSON.parse(responseJson);

            const dataGots = dataGot.Nodes.filter((dataIn) => {
                return ((!Tools.IsNull(state.profile) && dataIn.TemplateCode == "Tejory") ||
                    (Tools.IsNull(state.profile) && dataIn.TemplateCode == "NonTejory"));
            });

            dataGot.Nodes = dataGots[0].Nodes;
            setstoreCatalog(dataGot);
        }
    } catch (error) {
        if (setloading) setloading(false);
    }
}

// ─────────────────────────────────────────────
// AssignProfile (main entry point for auth)
// ─────────────────────────────────────────────
export function AssignProfile(deps, _profileIn, profilePass, isMobile, callbackOnSuccess = null, callbackOnFail = null) {
    const { state, dispatch } = deps;

    if (!state.isConnected) {
        return;
    }

    if (_profileIn.length == 0) {
        resetData(deps);
        return;
    } else {
        if (profilePass.length > 0) {
            VerifyLogin(deps, _profileIn, profilePass, isMobile, callbackOnSuccess);
            logLoginEvent("password", _profileIn);
        } else if (_profileIn == "user") {
            SecureStore.getItemAsync('accessToken').then(accessToken => {
                if (accessToken) {
                    const dataGot = JSON.parse(accessToken);
                    dispatch({ type: "update_AccessToken", payload: dataGot });
                    fetchUserProfile(deps, dataGot.MemberID, dataGot.access_token, callbackOnSuccess, dataGot);
                } else {
                    resetData(deps);
                    return;
                }
            });
        } else {
            const dataGot = JSON.parse(_profileIn);
            dispatch({ type: "update_AccessToken", payload: dataGot });
            fetchUserProfile(deps, dataGot.MemberID, dataGot.access_token, callbackOnSuccess, dataGot);
        }
    }
}

// ─────────────────────────────────────────────
// SendMobileOTP (wrapper)
// ─────────────────────────────────────────────
export function SendMobileOTP(deps, MobileNo, token = null) {
    VerifyMobileLoginOTP(deps, MobileNo, token);
}

// ─────────────────────────────────────────────
// VerifyOTP (wrapper)
// ─────────────────────────────────────────────
export function VerifyOTP(deps, MobileNo, otp, callback = null, _token = null) {
    VerifyLoginwithOTP(deps, MobileNo, otp, callback, _token);
    logLoginEvent("mobileotp", MobileNo);
}

// ─────────────────────────────────────────────
// handler (profile update handler)
// ─────────────────────────────────────────────
export function handler(deps, someValue) {
    const { dispatch } = deps;
    dispatch({ type: 'update_Profile', payload: someValue });
    updateProfileWs(deps, someValue);
}

// ─────────────────────────────────────────────
// ClaimProfile
// ─────────────────────────────────────────────
export function ClaimProfile(deps) {
    const { state } = deps;
    fetchClaimsProfile(deps, state.accessToken.MemberID, state.accessToken.access_token);
}

// ─────────────────────────────────────────────
// ClaimPoints
// ─────────────────────────────────────────────
export function ClaimPoints(deps, tokenCode) {
    const { state } = deps;
    fetchClaimPoints(deps, state.accessToken.MemberID, state.accessToken.access_token, tokenCode);
}

// ─────────────────────────────────────────────
// RedeemProfile
// ─────────────────────────────────────────────
export function RedeemProfile(deps, callback = null) {
    const { state } = deps;
    fetchRedeemProfile(deps, state.accessToken.MemberID, state.accessToken.access_token, callback);
}

// ─────────────────────────────────────────────
// RedeemPoints
// ─────────────────────────────────────────────
export function RedeemPoints(deps, tokenCode, tokenPass, callback) {
    const { state } = deps;
    fetchRedeemPoints(deps, state.accessToken.MemberID, state.accessToken.access_token, tokenCode, tokenPass, callback);
}

// ─────────────────────────────────────────────
// GetMediaIDs
// ─────────────────────────────────────────────
export function GetMediaIDs(_userIn) {
    const mediaIds = [];
    if (!Tools.IsNull(_userIn) && !Tools.IsNull(_userIn.Medias)) {
        for (let index = 0; index < _userIn.Medias.length; index++) {
            const element = _userIn.Medias[index];
            mediaIds.push(element.MediaId);
        }
    }
    return mediaIds;
}

// ─────────────────────────────────────────────
// GetMediaBalanceIDs
// ─────────────────────────────────────────────
export function GetMediaBalanceIDs(_userIn) {
    const mediaIn = {};
    if (!Tools.IsNull(_userIn) && !Tools.IsNull(_userIn.Medias)) {
        const walletBalance = [];
        for (let index = 0; index < _userIn.Medias.length; index++) {
            walletBalance.push(_userIn.Medias[index].Wallet);
        }
        mediaIn.walletBalance = JSON.stringify(walletBalance);
    }
    return mediaIn;
}

// ─────────────────────────────────────────────
// LookStored
// ─────────────────────────────────────────────
export function LookStored(deps) {
    const { dispatch } = deps;
    SecureStore.getItemAsync('profile').then(profile => {
        if (profile && profile != {}) {
            dispatch({ type: 'update_Profile', payload: JSON.parse(profile) });
        }
    });
}