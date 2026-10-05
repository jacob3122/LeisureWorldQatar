/**
 * ProfileData.js (Rewritten)
 * 
 * Slim orchestrator that wires together:
 * - ProfileDataAuth.js (all auth/API functions)
 * - ProfileDataWrapper.js (shared UI wrapper)
 * - ProfileDataRouter.js (screen routing)
 * 
 * Location: Tools/Components/ProfileData.js
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, DeviceEventEmitter, Platform, View } from 'react-native';
import SecureStore from './SecureStore';
import * as Tools from './Tools';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import ReactNativeBiometrics from 'react-native-biometrics';
import ReactMoE from 'react-native-moengage';

import ProfileDataWrapper from './ProfileDataWrapper';
import ProfileDataRouter from './ProfileDataRouter';
import * as Auth from './ProfileDataAuth';

const i18n = new I18n(translations);

export default function ProfileData(props) {
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;

    // ─────────────────────────────────────────
    // Refs
    // ─────────────────────────────────────────
    const _isMounted = useRef(false);
    const recaptchaRef = useRef(null);
    const hasExecuted = useRef(false);
    const PopupInfo = useRef({
        Title: '',
        SubHeading: '',
        ContentCode: '',
        Buttons: [],
    });

    // ─────────────────────────────────────────
    // State
    // ─────────────────────────────────────────
    const [isLoading, setIsLoading] = useState(false);
    const [showPop, setshowPop] = useState(false);
    const [showOtp, setshowOtp] = useState(false);
    const [reload, setreload] = useState(false);
    const [rated, setrated] = useState(false);
    const [useBiometric, setuseBiometric] = useState(false);
    const [showForgetPass, setshowForgetPass] = useState(false);
    const [forgetPassData, setforgetPassData] = useState(undefined);
    const [storeCatalog, setstoreCatalog] = useState([]);
    const [showBiometricPermission, setshowBiometricPermission] = useState(false);
    const [biometricCheck, setbiometricCheck] = useState(false);
    const [dontShowBioAgain, setdontShowBioAgain] = useState(false);
    const [biometryIn, setbiometryIn] = useState({ available: false });
    const [otpVerifyModal, setotpVerifyModal] = useState(false);
    const [loginOpen, setloginOpen] = useState(true);
    const [setpass, setsetpass] = useState(undefined);
    const [otpChangePassModal, setotpChangePassModal] = useState(false);
    const [claimCheck, setclaimCheck] = useState(false);
    const [bioKey, setBioKey] = useState(undefined);
    const [showOtpError, setshowOtpError] = useState(false);
    const [rnBiometrics, setrnBiometrics] = useState(undefined);
    const [googleToken, setgoogleToken] = useState('');

    // loaded tracker (non-state to match original behavior)
    const loadedRef = useRef(0);

    // ─────────────────────────────────────────
    // Deps object: passed to all Auth functions
    // ─────────────────────────────────────────
    const deps = {
        state,
        dispatch,
        navigation: props.navigation,
        setloading: setIsLoading,
        setshowOtp,
        setshowOtpError,
        setsetpass,
        setloginOpen,
        setshowPop,
        setotpVerifyModal,
        setotpChangePassModal,
        setclaimCheck,
        setforgetPassData,
        setshowForgetPass,
        setstoreCatalog,
        _isMounted,
        bioKey,
        googleToken,
        showOtp,
        PopupInfo,
    };

    // ─────────────────────────────────────────
    // Setters for biometric
    // ─────────────────────────────────────────
    const setDontShowBio = (stateIn) => {
        SecureStore.setItemAsync('dontshowAgain', stateIn);
        setdontShowBioAgain(stateIn);
    };

    const createBioKey = async () => {
        if (!rnBiometrics) return;
        try {
            const resultObject = await rnBiometrics.createKeys();
            const { publicKey } = resultObject;
            SecureStore.setItemAsync('biokey', publicKey);
            setBioKey(publicKey);
        } catch (error) {
            console.error('createBioKey error:', error);
        }
    };

    // ─────────────────────────────────────────
    // setloading wrapper
    // ─────────────────────────────────────────
    const setloading = (loadstate) => {
        setIsLoading(loadstate);
    };

    // ─────────────────────────────────────────
    // useEffect: Initial setup (biometric, appRated, signout listener)
    // ─────────────────────────────────────────
    useEffect(() => {
        const asyncProcess = async () => {
            SecureStore.getItemAsync('useBiometric').then(valIn => {
                if (valIn == 'Y') {
                    setuseBiometric(true);
                } else {
                    if (valIn == 'N') setshowBiometricPermission(true);
                    setuseBiometric(false);
                }
            });
            SecureStore.getItemAsync('dontshowAgain').then(valIn => {
                setdontShowBioAgain((valIn == "Y") ? true : false);
            });
            setrnBiometrics(new ReactNativeBiometrics({ allowDeviceCredentials: true }));
        };

        asyncProcess();

        return () => {
            DeviceEventEmitter.removeAllListeners("signout", () => {
                Auth.SignOut(deps);
            });
            _isMounted.current = false;
        };
    }, []);

    // ─────────────────────────────────────────
    // useEffect: rnBiometrics ready → sensor check, key setup, listeners
    // ─────────────────────────────────────────
    useEffect(() => {
        if (rnBiometrics == undefined) return;

        const asyncProcess = async () => {
            const biometry = await rnBiometrics.isSensorAvailable();
            setbiometryIn(biometry);

            if (biometry.available) {
                const resultObject = await rnBiometrics.biometricKeysExist();
                const { keysExist } = resultObject;
                if (keysExist) {
                    SecureStore.getItemAsync('biokey').then(publicKey => {
                        if (Tools.IsNull(publicKey)) {
                            createBioKey();
                        } else {
                            setBioKey(publicKey);
                        }
                    });
                } else {
                    createBioKey();
                }
            }

            _isMounted.current = true;

            SecureStore.getItemAsync('appRated').then(appRate => {
                if (_isMounted.current) {
                    if (Tools.stringIsContains(appRate, 'true'))
                        setrated(true);
                    else
                        setrated(false);
                }
            });

            DeviceEventEmitter.addListener("signout", () => {
                Auth.SignOut(deps);
            });
        };

        asyncProcess();
    }, [rnBiometrics]);

    // ─────────────────────────────────────────
    // useEffect: OTP modal debug log
    // ─────────────────────────────────────────
    useEffect(() => {
        console.log("OTP : " + otpVerifyModal);
    }, [otpVerifyModal]);

    // ─────────────────────────────────────────
    // useEffect: Network reconnect → reload profile
    // ─────────────────────────────────────────
    useEffect(() => {
        if (state.isConnected === true) {
            setreload(state.isConnected);
        }
    }, [state]);

    // ─────────────────────────────────────────
    // useEffect: MoEngage profile sync
    // ─────────────────────────────────────────
    const memoizedProfileData = useMemo(() => state.profile, [JSON.stringify(state.profile)]);

    useEffect(() => {
        if (global.profileUpdate) return;

        if (!Tools.IsNull(state.profile) && !hasExecuted.current) {
            hasExecuted.current = true;
            global.profileUpdate = true;

            const dataGot = state.profile;
            ReactMoE.setUserUniqueID(dataGot.Mobile);
            setTimeout(() => {
                ReactMoE.setUserName(dataGot.Mobile);
                ReactMoE.setUserFirstName(dataGot.FirstName);
                ReactMoE.setUserLastName(dataGot.LastName);
                ReactMoE.setUserEmailID(dataGot.Email);
                ReactMoE.setUserContactNumber(dataGot.Mobile);
                ReactMoE.setUserAttribute("leisurepoints", dataGot.Points);
                ReactMoE.setUserAttribute("leisurecardno", dataGot.CardNo);
                ReactMoE.setUserAttribute("mediaId", Auth.GetMediaIDs(dataGot));
                const mediaBalance = Auth.GetMediaBalanceIDs(dataGot).walletBalance;
                ReactMoE.setUserAttribute("mediaBalance", mediaBalance);
            }, 1500);
        }
    }, [memoizedProfileData]);

    // ─────────────────────────────────────────
    // onloadEnd (OverlayLoad dismiss callback)
    // ─────────────────────────────────────────
    const onloadEnd = () => {
        if (state.onExitDismiss && state.onExitDismiss.FeedBack != undefined && state.onExitDismiss.FeedBack.length > 0) {
            const FeedBack = state.onExitDismiss.FeedBack;
            if (FeedBack != undefined && FeedBack.length > 0) {
                Auth.showAlert ? Auth.showAlert(FeedBack) : null;
            }
        }
    };

    // ─────────────────────────────────────────
    // Biometric permission handler
    // ─────────────────────────────────────────
    const onSetBio = (_stateIn, _dontshowAgain) => {
        if (!_stateIn) {
            setDontShowBio(_dontshowAgain ? "Y" : "N");
            setshowBiometricPermission(false);
            return;
        }
        if (!rnBiometrics) return;

        rnBiometrics.simplePrompt({ promptMessage: 'Confirm BioMetric' })
            .then((resultObject) => {
                const { success } = resultObject;
                if (success) {
                    SecureStore.setItemAsync('useBiometric', 'Y').then(() => {
                        setDontShowBio(_dontshowAgain ? "Y" : "N");
                        setshowBiometricPermission(false);
                        Auth.updateMobileToken(deps, null, null, state.profile);
                    });
                }
            })
            .catch(() => {
                // Biometrics failed
            });
    };

    // ─────────────────────────────────────────
    // Setup biometric (called from home page route)
    // ─────────────────────────────────────────
    const setupBiometric = () => {
        if (rnBiometrics != undefined && biometryIn.available && global.checkBio &&
            (!Tools.IsNull(state.profile) && !Tools.IsNull(state.profile.FirstName)) &&
            !dontShowBioAgain && !biometricCheck) {
            SecureStore.getItemAsync('useBiometric').then(valIn => {
                if (valIn != 'Y') {
                    setTimeout(() => {
                        setshowBiometricPermission(true);
                        setbiometricCheck(true);
                    }, 500);
                }
            });
        }
    };

    // ─────────────────────────────────────────
    // PopUpVoucher done handler
    // ─────────────────────────────────────────
    const OnVerifyDone = (Vstate) => {
        if (_isMounted.current) setshowPop(false);
        if (Vstate) {
            Auth.AssignProfile(deps, 'user', '', '');
            props.navigation.navigate('Cardscreen', { screen: 'Home' }, { pagetodivert: undefined });
        }
    };

    // ─────────────────────────────────────────
    // OTP verification done handler (delete account)
    // ─────────────────────────────────────────
    const OnVerificationDone = (_otp, _state) => {
        console.log(_otp, _state);
        if (_state) {
            Auth.completeDeleteRequest(deps, _otp);
        }
        setotpVerifyModal(false);
    };

    // ─────────────────────────────────────────
    // Change password dismiss
    // ─────────────────────────────────────────
    const OnDismissPass = () => {
        setotpChangePassModal(false);
    };

    // ─────────────────────────────────────────
    // Close OTP modal
    // ─────────────────────────────────────────
    const closeOtp = () => {
        setshowOtp(false);
    };

    // ─────────────────────────────────────────
    // Signin dismiss handler
    // ─────────────────────────────────────────
    const signinDismiss = (_memberID) => {
        if (props.onDismiss != null) {
            props.onDismiss(_memberID);
        }
    };

    // ─────────────────────────────────────────
    // Bound auth functions (bind deps so children get simple signatures)
    // ─────────────────────────────────────────
    const boundAssignProfile = (_profileIn, profilePass, isMobile, callbackOnSuccess, callbackOnFail) => {
        Auth.AssignProfile(deps, _profileIn, profilePass, isMobile, callbackOnSuccess, callbackOnFail);
    };

    const boundSendOTP = (MobileNo, token) => {
        Auth.SendMobileOTP(deps, MobileNo, token);
    };

    const boundVerifyOTP = (MobileNo, otp, callback, _token) => {
        Auth.VerifyOTP(deps, MobileNo, otp, callback, _token);
    };

    const boundSubmitChangePassRequest = (_memberId, _a_token, callback, MobileNo, repactcha) => {
        Auth.submitChangePassRequest(deps, _memberId, _a_token, callback, MobileNo, repactcha);
    };

    const boundSubmitDeleteRequest = (_memberId, _a_token, onDone, repactcha) => {
        Auth.submitDeleteRequest(deps, _memberId, _a_token, onDone, repactcha);
    };

    const boundForgetPassRequest = (para1, para2, callback, MobileNo, _token) => {
        Auth.forgetPassRequest(deps, para1, para2, callback, MobileNo, _token);
    };

    const boundHandler = (someValue) => {
        Auth.handler(deps, someValue);
    };

    const boundClaimProfile = () => Auth.ClaimProfile(deps);
    const boundClaimPoints = (tokenCode) => Auth.ClaimPoints(deps, tokenCode);
    const boundRedeemProfile = (callback) => Auth.RedeemProfile(deps, callback);
    const boundRedeemPoints = (tokenCode, tokenPass, callback) => Auth.RedeemPoints(deps, tokenCode, tokenPass, callback);
    const boundFetchCatalog = () => Auth.fetchCatalogFull(deps);
    const boundLookStored = () => Auth.LookStored(deps);

    // ─────────────────────────────────────────
    // Network reconnect check
    // ─────────────────────────────────────────
    if (reload && loadedRef.current !== 0) {
        loadedRef.current = 0;
        boundAssignProfile('user', '', '');
    }

    // ─────────────────────────────────────────
    // wrapPage: wraps child page with ProfileDataWrapper
    // ─────────────────────────────────────────
    const wrapPage = (children) => {
        return (
            <ProfileDataWrapper
                navigation={props.navigation}
                recaptchaRef={recaptchaRef}
                // PopUpVoucher
                showPop={showPop}
                onVerifyDone={OnVerifyDone}
                popupInfo={PopupInfo.current}
                // OtpVerify
                otpVerifyModal={otpVerifyModal}
                profile={state.profile}
                submitDeleteRequest={boundSubmitDeleteRequest}
                onVerificationDone={OnVerificationDone}
                // ChangePassword
                otpChangePassModal={otpChangePassModal}
                submitChangePassRequest={boundSubmitChangePassRequest}
                accessToken={state.accessToken}
                assignProfile={boundAssignProfile}
                onDismissPass={OnDismissPass}
                // OverlayLoad
                isLoading={isLoading}
                onloadEnd={onloadEnd}
                // BiometricRequest
                dontShowBioAgain={dontShowBioAgain}
                showBiometricPermission={showBiometricPermission}
                onSetBio={onSetBio}
                // i18n
                i18ntranslation={state.i18ntranslation}
            >
                {children}
            </ProfileDataWrapper>
        );
    };

    // ─────────────────────────────────────────
    // Render via Router
    // ─────────────────────────────────────────
    return (
        <ProfileDataRouter
            pagetogo={props.pagetogo}
            wrapPage={wrapPage}
            // Navigation
            navigation={props.navigation}
            // Auth functions (bound)
            assignProfile={boundAssignProfile}
            sendOTP={boundSendOTP}
            verifyOTP={boundVerifyOTP}
            submitChangePassRequest={boundSubmitChangePassRequest}
            submitDeleteRequest={boundSubmitDeleteRequest}
            forgetPassRequest={boundForgetPassRequest}
            // Profile & state
            profile={state.profile}
            accessToken={state.accessToken}
            isLoading={isLoading}
            // Claims & Redeem
            claims={state.claims}
            redeem={state.redeem}
            claimProfile={boundClaimProfile}
            claimCheck={claimCheck}
            claimPoint={boundClaimPoints}
            redeemProfile={boundRedeemProfile}
            redeemPoint={boundRedeemPoints}
            // Store
            storeCatalog={storeCatalog}
            fetchCatalog={boundFetchCatalog}
            // Loading
            updateLoading={setloading}
            // Handler
            handler={boundHandler}
            // Signin-specific
            useBiometric={useBiometric}
            bioKey={bioKey}
            setpass={setpass}
            showOtpError={showOtpError}
            showOtp={showOtp}
            showForgetPass={showForgetPass}
            forgetPassData={forgetPassData}
            closeOtp={closeOtp}
            loginOpen={loginOpen}
            onShowForgetPassDismiss={() => { setshowForgetPass(false); }}
            // Other props passed through
            pagefrom={props.pagefrom}
            pagetodivert={props.pagetodivert}
            setSignOff={props.setSignOff}
            lookStored={boundLookStored}
            onDismiss={props.pagetogo === "signinuser" ? signinDismiss : props.onDismiss}
            showsignin={props.showsignin}
            // Events
            OpenEvent={props.OpenEvent}
            eventObjs={props.eventObjs}
            updateUnread={props.updateUnread}
            // Biometric
            biometry={biometryIn}
            updateSettings={(LaccessToken, biotoken, profile) => Auth.updateMobileToken(deps, LaccessToken, biotoken, profile)}
            // Voucher
            selectedVoucher={props.selectedVoucher}
            // Setup biometric trigger
            setupBiometric={setupBiometric}
        />
    );
}