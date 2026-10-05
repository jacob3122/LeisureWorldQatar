/**
 * ProfileDataRouter.js
 * 
 * Screen routing extracted from ProfileData.js.
 * Routes to the correct page component based on props.pagetogo.
 * All child components receive identical props as the original.
 * 
 * Location: Tools/Components/ProfileDataRouter.js
 */

import React from 'react';
import { AccountHandle } from './AccountHandle';
import CardHandle from './CardHandle';
import { OfferHandle } from './OfferHandle';
import AccountEditor from '../../Pages/StackPage/AccountEditor';
import ReciptsHandle from '../../Pages/StackPage/ReciptsHandle';
import ClaimsHandle from '../../Pages/StackPage/ClaimsHandle';
import RedeemHandle from '../../Pages/StackPage/RedeemHandle';
import PasswordHandle from '../../Pages/StackPage/PasswordHandle';
import SettingsHandle from '../../Pages/StackPage/SettingsHandle';
import ReferFriendHandle from '../../Pages/StackPage/ReferFriendHandle';
import RedeemVoucher from '../../Pages/StackPage/RedeemVoucher';
import RedeemVenu from '../../Pages/StackPage/RedeemVenu';
import PointsHandle from '../../Pages/StackPage/PointsHandle';
import RegisterUser from './RegisterUser';
import SigninUser from './SigninUser';
import AdnHome from './AdnHome';
import CardsPage from '../../Pages/StackPage/CardsPage';
import AddCardsPage from '../../Pages/StackPage/AddCardsPage';
import OrdersPage from '../../Pages/StackPage/OrdersPage';
import EventsPage from '../../Pages/StackPage/EventsPage';
import StorePage from '../../Pages/StackPage/StorePage';
import NotificationPage from './NotificationPage';
import PointsSystemPage from '../../Pages/StackPage/PointsSystemPage';
import BenefitsHandle from '../../Pages/StackPage/BenefitsHandle';
import RulesPage from './RulesPage';
import VoucherPage from './VoucherPage';

/**
 * ProfileDataRouter
 * 
 * Props:
 * - pagetogo: string key for which page to render
 * - wrapPage: function that wraps the page component with ProfileDataWrapper
 * - All the shared deps/props that child components need (navigation, profile, accessToken, etc.)
 */
export default function ProfileDataRouter({
    pagetogo,
    wrapPage,
    // Navigation
    navigation,
    // Auth functions
    assignProfile,
    sendOTP,
    verifyOTP,
    submitChangePassRequest,
    submitDeleteRequest,
    // Profile & state
    profile,
    accessToken,
    isLoading,
    // Claims & Redeem
    claims,
    redeem,
    claimProfile,
    claimCheck,
    claimPoint,
    redeemProfile,
    redeemPoint,
    // Store
    storeCatalog,
    fetchCatalog,
    // Loading
    updateLoading,
    // Handler
    handler,
    // Signin-specific
    useBiometric,
    bioKey,
    setpass,
    showOtpError,
    showOtp,
    forgetPassRequest,
    showForgetPass,
    forgetPassData,
    closeOtp,
    loginOpen,
    onShowForgetPassDismiss,
    // Other
    pagefrom,
    pagetodivert,
    setSignOff,
    lookStored,
    onDismiss,
    showsignin,
    // Events
    OpenEvent,
    eventObjs,
    updateUnread,
    // Biometric
    biometry,
    updateSettings,
    // Voucher
    selectedVoucher,
    // Setup biometric trigger
    setupBiometric,
}) {
    if (pagetogo === "home") {
        setupBiometric();
        return wrapPage(
            <AdnHome
                setSignOff={setSignOff}
                accessToken={accessToken}
                lookStored={lookStored}
                updateLoading={updateLoading}
                profile={profile}
                submitChangePassRequest={submitChangePassRequest}
                navigation={navigation}
                assignProfile={assignProfile}
                sendOTP={sendOTP}
                verifyOTP={verifyOTP}
                isLoading={isLoading}
                redeem={redeem}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "points") {
        return wrapPage(
            <PointsSystemPage
                assignProfile={assignProfile}
                profile={profile}
                pagefrom={pagefrom}
                claimprofile={claimProfile}
                claimCheck={claimCheck}
                claimpoint={claimPoint}
                redeem={redeem}
                navigation={navigation}
                claims={claims}
                isLoading={isLoading}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "referafriend") {
        return wrapPage(
            <ReferFriendHandle
                assignProfile={assignProfile}
                accessToken={accessToken}
                profile={profile}
                navigation={navigation}
            />
        );
    } else if (pagetogo === "addcards") {
        return wrapPage(
            <AddCardsPage
                updateLoading={updateLoading}
                accessToken={accessToken}
                profile={profile}
                navigation={navigation}
                assignProfile={assignProfile}
            />
        );
    } else if (pagetogo === "mycards") {
        return wrapPage(
            <CardsPage
                updateLoading={updateLoading}
                accessToken={accessToken}
                profile={profile}
                navigation={navigation}
                assignProfile={assignProfile}
            />
        );
    } else if (pagetogo === "notify") {
        return wrapPage(
            <NotificationPage
                accessToken={accessToken}
                profile={profile}
                updateUnread={updateUnread}
                navigation={navigation}
                assignProfile={assignProfile}
            />
        );
    } else if (pagetogo === "myevents") {
        return wrapPage(
            <EventsPage
                OpenEvent={OpenEvent}
                eventObjs={eventObjs}
                updateLoading={updateLoading}
                accessToken={accessToken}
                profile={profile}
                navigation={navigation}
                assignProfile={assignProfile}
            />
        );
    } else if (pagetogo === "myorders") {
        return wrapPage(
            <OrdersPage
                updateLoading={updateLoading}
                accessToken={accessToken}
                profile={profile}
                navigation={navigation}
                assignProfile={assignProfile}
            />
        );
    } else if (pagetogo === "store") {
        return wrapPage(
            <StorePage
                profile={profile}
                navigation={navigation}
                assignProfile={assignProfile}
                updateLoading={updateLoading}
                accessToken={accessToken}
                isLoading={isLoading}
                fetchCatalog={fetchCatalog}
                storeCatalog={storeCatalog}
            />
        );
    } else if (pagetogo === "register") {
        return wrapPage(
            <RegisterUser
                profile={profile}
                onDismiss={onDismiss}
                pagefrom={pagefrom}
                closeOtpModal={closeOtp}
                navigation={navigation}
                assignProfile={assignProfile}
                sendOTP={sendOTP}
                verifyOTP={verifyOTP}
            />
        );
    } else if (pagetogo === "signinuser") {
        return wrapPage(
            <SigninUser
                useBiometric={useBiometric}
                bioKey={bioKey}
                showsignin={showsignin}
                setpassmodal={setpass}
                showOtpError={showOtpError}
                onChangePassDismiss={onShowForgetPassDismiss}
                showOtpprop={showOtp}
                forgetPassRequest={forgetPassRequest}
                showForgetPass={showForgetPass}
                forgetPassData={forgetPassData}
                closeOtpModal={closeOtp}
                visible={loginOpen}
                isLoading={isLoading}
                assignProfile={assignProfile}
                sendOTP={sendOTP}
                verifyOTP={verifyOTP}
                onDismiss={onDismiss}
                pagefrom={pagefrom}
                navigation={navigation}
            />
        );
    } else if (pagetogo === "account") {
        return wrapPage(
            <AccountHandle
                accessToken={accessToken}
                submitChangePassRequest={submitChangePassRequest}
                submitDeleteRequest={submitDeleteRequest}
                profile={profile}
                navigation={navigation}
                assignProfile={assignProfile}
                isLoading={isLoading}
                redeem={redeem}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "card") {
        return wrapPage(
            <CardHandle
                submitChangePassRequest={submitChangePassRequest}
                pagetodivert={pagetodivert}
                profile={profile}
                navigation={navigation}
                isLoading={isLoading}
                assignProfile={assignProfile}
                redeem={redeem}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "offer") {
        return wrapPage(
            <OfferHandle
                profile={profile}
                navigation={navigation}
            />
        );
    } else if (pagetogo === "accountEdit") {
        return wrapPage(
            <AccountEditor
                submitDeleteRequest={submitDeleteRequest}
                submitChangePassRequest={submitChangePassRequest}
                navigation={navigation}
                profile={profile}
                assignProfile={assignProfile}
                handler={handler}
            />
        );
    } else if (pagetogo === "receipts") {
        return wrapPage(
            <ReciptsHandle
                profile={profile}
            />
        );
    } else if (pagetogo === "benefits") {
        return wrapPage(
            <BenefitsHandle
                assignProfile={assignProfile}
                pagefrom={pagefrom}
                claimprofile={claimProfile}
                claimCheck={claimCheck}
                claimpoint={claimPoint}
                redeem={redeem}
                navigation={navigation}
                claims={claims}
                isLoading={isLoading}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "claims") {
        return wrapPage(
            <ClaimsHandle
                profile={profile}
                pagefrom={pagefrom}
                navigation={navigation}
                claims={claims}
                claimprofile={claimProfile}
                claimCheck={claimCheck}
                claimpoint={claimPoint}
                isLoading={isLoading}
                redeem={redeem}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "redeems") {
        return wrapPage(
            <RedeemHandle
                profile={profile}
                pagefrom={pagefrom}
                redeem={redeem}
                navigation={navigation}
                claims={claims}
                claimprofile={claimProfile}
                claimCheck={claimCheck}
                claimpoint={claimPoint}
                isLoading={isLoading}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "rules") {
        return wrapPage(
            <RulesPage
                profile={profile}
                pagefrom={pagefrom}
                redeem={redeem}
                navigation={navigation}
                claims={claims}
                claimprofile={claimProfile}
                claimCheck={claimCheck}
                claimpoint={claimPoint}
                isLoading={isLoading}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "voucherPage") {
        return wrapPage(
            <VoucherPage
                assignProfile={assignProfile}
                accessToken={accessToken}
                profile={profile}
                pagefrom={pagefrom}
                redeem={redeem}
                navigation={navigation}
                claims={claims}
                claimprofile={claimProfile}
                claimCheck={claimCheck}
                claimpoint={claimPoint}
                isLoading={isLoading}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "redeemVoucher") {
        return wrapPage(
            <RedeemVoucher
                profile={profile}
                pagefrom={pagefrom}
                redeem={redeem}
                navigation={navigation}
                claims={claims}
                claimprofile={claimProfile}
                claimCheck={claimCheck}
                claimpoint={claimPoint}
                isLoading={isLoading}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "redeemVenu") {
        return wrapPage(
            <RedeemVenu
                selectedVoucher={selectedVoucher}
                assignProfile={assignProfile}
                profile={profile}
                pagefrom={pagefrom}
                redeem={redeem}
                navigation={navigation}
                claims={claims}
                claimprofile={claimProfile}
                claimCheck={claimCheck}
                claimpoint={claimPoint}
                isLoading={isLoading}
                redeemProfile={redeemProfile}
                redeemPoint={redeemPoint}
            />
        );
    } else if (pagetogo === "changepassword") {
        return wrapPage(
            <PasswordHandle
                profile={profile}
                navigation={navigation}
            />
        );
    } else if (pagetogo === "settings") {
        return wrapPage(
            <SettingsHandle
                biometry={biometry}
                updateSettings={updateSettings}
                profile={profile}
                defaultValue={'QA'}
                navigation={navigation}
            />
        );
    }

    // Fallback - should never reach here
    return null;
}