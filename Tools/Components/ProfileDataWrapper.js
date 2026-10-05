/**
 * ProfileDataWrapper.js
 * 
 * Shared UI wrapper extracted from ProfileData.js.
 * Wraps every page with: AppVersionChecker, OfflineNotice, GoogleRecaptcha,
 * PopUpVoucher, OtpVerify, ChangePassword, OverlayLoad, BiometricRequest, Banner.
 * 
 * Location: Tools/Components/ProfileDataWrapper.js
 */

import React from 'react';
import { View } from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
import Colors from '../constants/Colors';
import OverlayLoad from './OverlayLoad';
import PopUpVoucher from './PopUpVoucher';
import OtpVerify from './OtpVerify';
import ChangePassword from './ChangePassword';
import BiometricRequest from './BiometricRequest';
import Banner from './Banner';
import AppVersionChecker from './AppVersionChecker';
import OfflineNotice from './OfflineNotice';
import GoogleRecaptcha, {
    GoogleRecaptchaSize,
} from 'react-native-google-recaptcha';
import WebServices from '../constants/WebServices';

const i18n = new I18n(translations);

/**
 * ProfileDataWrapper
 * 
 * Props:
 * - children: the page component to wrap
 * - navigation
 * - recaptchaRef
 * - showPop, onVerifyDone (PopUpVoucher)
 * - popupInfo (PopUpVoucher content)
 * - otpVerifyModal, profile, submitDeleteRequest, onVerificationDone (OtpVerify)
 * - otpChangePassModal, submitChangePassRequest, accessToken, assignProfile, onDismissPass (ChangePassword)
 * - isLoading, onloadEnd (OverlayLoad)
 * - dontShowBioAgain, showBiometricPermission, onSetBio (BiometricRequest)
 * - i18ntranslation
 */
export default function ProfileDataWrapper(props) {
    const {
        children,
        navigation,
        recaptchaRef,
        // PopUpVoucher
        showPop,
        onVerifyDone,
        popupInfo,
        // OtpVerify
        otpVerifyModal,
        profile,
        submitDeleteRequest,
        onVerificationDone,
        // ChangePassword
        otpChangePassModal,
        submitChangePassRequest,
        accessToken,
        assignProfile,
        onDismissPass,
        // OverlayLoad
        isLoading,
        onloadEnd,
        // BiometricRequest
        dontShowBioAgain,
        showBiometricPermission,
        onSetBio,
        // i18n
        i18ntranslation,
    } = props;

    i18n.translations = i18ntranslation;

    return (
        <View style={{ flex: 1 }}>
            <AppVersionChecker />
            <OfflineNotice />
            <GoogleRecaptcha
                ref={(ref) => { if (recaptchaRef) recaptchaRef.current = ref; }}
                size={GoogleRecaptchaSize.INVISIBLE}
                baseUrl={WebServices.googleRecaptchaSiteURL}
                siteKey={WebServices.googleRecaptchaSiteKey}
            />
            {children}
            {showPop && (
                <PopUpVoucher onDone={onVerifyDone} content={popupInfo} />
            )}
            {otpVerifyModal && (
                <OtpVerify
                    title={i18n.t('wesentyouotptomobile') + " " + (profile ? profile.Mobile : '')}
                    sendOTP={submitDeleteRequest}
                    onDone={onVerificationDone}
                />
            )}
            {otpChangePassModal && (
                <ChangePassword
                    sendOTP={submitChangePassRequest}
                    accessToken={accessToken}
                    assignProfile={assignProfile}
                    onDismiss={onDismissPass}
                />
            )}
            {isLoading && (
                <OverlayLoad
                    size='small'
                    color={Colors.whiteColor}
                    isopen={isLoading}
                    onDismiss={onloadEnd}
                />
            )}
            {!dontShowBioAgain && showBiometricPermission && (
                <BiometricRequest
                    visible={showBiometricPermission}
                    onSetBio={onSetBio}
                />
            )}
            <Banner navigation={navigation} />
        </View>
    );
}