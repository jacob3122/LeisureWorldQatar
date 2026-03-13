import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
import WebServices from '../constants/WebServices';
import * as Tools from '../Components/Tools';
import { useAppContext } from '../../src/js/reducers/AppReducer';

const i18n = new I18n(translations);

/**
 * usePlayCardAPI — shared hook for all Play Cards API operations.
 *
 * @param {Object} params
 * @param {Function} params.assignProfile — from ProfileData props, used for token refresh on 'denied' responses
 *
 * @returns {Object} API state and functions
 */
export default function usePlayCardAPI({ assignProfile }) {
    
    const { state } = useAppContext();
    i18n.translations = state.i18ntranslation;

    // --- State ---
    const [cardLists, setCardLists] = useState([]);
    const [unregcardLists, setUnregcardLists] = useState([]);
    const [cardNumbers, setCardNumbers] = useState([]);
    const [unregcardNumbers, setUnregcardNumbers] = useState([]);
    const [unregcardFullNumbers, setUnregcardFullNumbers] = useState([]);
    const [loaded, setLoaded] = useState(0);
    const [loadedUnreg, setLoadedUnreg] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    

    // --- Helper: Extract card number from registered card ---
    const getcardNumber = useCallback((_cardIn) => {
        if (_cardIn.MediaCodes != null && _cardIn.MediaCodes.length > 0) {
            for (let t = 0; t < _cardIn.MediaCodes.length; t++) {
                if (_cardIn.MediaCodes[t].Type == "Default") {
                    return _cardIn.MediaCodes[t].Code;
                }
            }
        }
        return '';
    }, []);

    // --- Helper: Extract masked card number from unregistered card ---
    const getcardNumberUnReg = useCallback((_cardIn) => {
        if (_cardIn.MediaCodes != null && _cardIn.MediaCodes.length > 0) {
            for (let t = 0; t < _cardIn.MediaCodes.length; t++) {
                if (_cardIn.MediaCodes[t].MediaCodeTypeDesc == "Default") {
                    const code = _cardIn.MediaCodes[t].MediaCode;
                    return getX(code.length - 4) + code.substring(code.length - 4);
                }
            }
        }
        return '';
    }, []);

    // --- Helper: Extract full card number from unregistered card ---
    const getcardFullNumberUnReg = useCallback((_cardIn) => {
        if (_cardIn.MediaCodes != null && _cardIn.MediaCodes.length > 0) {
            for (let t = 0; t < _cardIn.MediaCodes.length; t++) {
                if (_cardIn.MediaCodes[t].MediaCodeTypeDesc == "Default") {
                    return _cardIn.MediaCodes[t].MediaCode;
                }
            }
        }
        return '';
    }, []);

    // --- Helper: Generate X mask string ---
    const getX = (_len) => {
        let data = "";
        for (let index = 0; index < _len; index++) {
            data += 'X';
        }
        return data;
    };

    // --- Process registered cards response ---
    const initCards = useCallback((_CardsObj) => {
        console.log('[usePlayCardAPI] initCards: processing, count:', _CardsObj?.length);
        let cardsObj = _CardsObj;
        setLoaded(0);

        if (cardsObj === undefined) {
            cardsObj = [];
        }

        const numbers = [];
        for (let t = 0; t < cardsObj.length; t++) {
            cardsObj[t].hasData = false;
            numbers.push(getcardNumber(cardsObj[t]));
        }

        setCardNumbers(numbers);
        setCardLists([...cardsObj]);
        setLoaded(1);

        return cardsObj;
    }, [getcardNumber]);

    // --- Process unregistered cards response ---
    const initUnregister = useCallback((_cards) => {
        console.log('[usePlayCardAPI] initUnregister: processing, count:', _cards?.length);
        let unregCards = _cards;
        setLoadedUnreg(0);

        if (unregCards === undefined) {
            unregCards = [];
        }

        const maskedNumbers = [];
        const fullNumbers = [];

        for (let t = 0; t < unregCards.length; t++) {
            maskedNumbers.push(getcardNumberUnReg(unregCards[t]));
            fullNumbers.push(getcardFullNumberUnReg(unregCards[t]));
        }

        setUnregcardLists([...unregCards]);
        setUnregcardNumbers(maskedNumbers);
        setUnregcardFullNumbers(fullNumbers);
        setLoadedUnreg(1);
    }, [getcardNumberUnReg, getcardFullNumberUnReg]);

    // --- API: Fetch registered cards summary ---
    const fetchMedias = useCallback((onSuccess, retryCount = 0) => {
    console.log('[usePlayCardAPI] fetchMedias: starting request');
    setIsLoading(true);
    setError(null);

    const url = WebServices.mediaSummary.replace("{MemberID}", state.accessToken.MemberID);

    fetch(WebServices.MainURL + url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + state.accessToken.access_token,
            'Content-Type': 'application/json',
        },
    }, 5000)
        .then((response) => response.text())
       .then((responseJson) => {
    if (Tools.stringIsContains(responseJson, 'denied')) {
        console.log('[usePlayCardAPI] fetchMedias: denied, retry:', retryCount);
        if (retryCount >= 2) {
            setIsLoading(false);
            setError('Session expired. Please login again.');
            return;
        }
        if (assignProfile != null) {
            assignProfile("user", '', '', (_memberID, _access) => {
                fetchMedias(onSuccess, retryCount + 1);
            });
        }
        return;
    }

    setIsLoading(false);

    let responseObj;
    try {
        responseObj = JSON.parse(responseJson);
    } catch (parseError) {
        console.log('[usePlayCardAPI] fetchMedias: JSON parse error:', parseError.message, 'raw (first 100):', responseJson?.substring(0, 100));
        setError('Server returned an invalid response. Pull to refresh.');
        return;
    }

    if (Tools.stringIsEmpty(responseObj.Error)) {
        console.log('[usePlayCardAPI] fetchMedias: success, cards count:', responseObj.Medias?.length);
        const processedCards = initCards(responseObj.Medias);
        if (onSuccess) {
            onSuccess(processedCards);
        }
    } else {
        console.log('[usePlayCardAPI] fetchMedias: API error:', responseObj.Error);
        setError(responseObj.Error);
    }
})
        .catch((networkError) => {
            console.log('[usePlayCardAPI] fetchMedias: network error:', networkError.message);
            setIsLoading(false);
            setError('Network error. Please try again.');
        });
}, [state.accessToken, assignProfile, initCards]);

    // --- API: Fetch single card detail (on flip) ---
    const fetchMediaDetail = useCallback((item, retryCount = 0) => {
    console.log('[usePlayCardAPI] fetchMediaDetail: fetching for id:', item.Id);

    const url = WebServices.mediaDetails.replace("{MediaID}", item.Id);

    fetch(WebServices.MainURL + url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + state.accessToken.access_token,
            'Content-Type': 'application/json',
        },
    }, 5000)
        .then((response) => response.text())
        .then((responseJson) => {
            if (Tools.stringIsContains(responseJson, 'denied')) {
                console.log('[usePlayCardAPI] fetchMediaDetail: denied, retry:', retryCount);
                if (retryCount >= 2) {
                    console.log('[usePlayCardAPI] fetchMediaDetail: max retries reached');
                    return;
                }
                if (assignProfile != null) {
                    assignProfile("user", '', '', (_memberID, _access) => {
                        fetchMediaDetail(item, retryCount + 1);
                    });
                }
                return;
            }

            let responseObj;
            try {
                responseObj = JSON.parse(responseJson);
            } catch (parseError) {
               console.log('[usePlayCardAPI] fetchMediaDetail: JSON parse error:', parseError.message, 'raw (first 100):', responseJson?.substring(0, 100));
                return;
            }

            if (!Tools.IsNull(responseObj)) {
                setCardLists((prevCardLists) => {
                    const updatedList = [...prevCardLists];
                    for (let index = 0; index < updatedList.length; index++) {
                        if (updatedList[index].Id == item.Id) {
                            updatedList[index] = { ...responseObj, hasData: true, rotate: 1 };
                            break;
                        }
                    }
                    return updatedList;
                });
                setLoaded(1);
            }
        })
        .catch((networkError) => {
            console.log('[usePlayCardAPI] fetchMediaDetail: network error:', networkError.message);
        });
}, [state.accessToken, assignProfile]);

    // --- API: Find unregistered cards linked to member ---
   const findPlayCard = useCallback((_memberID = null, _access = null, callback = null, retryCount = 0) => {
    console.log('[usePlayCardAPI] findPlayCard: starting request');

    const memberId = _memberID == null ? state.accessToken.MemberID : _memberID;
    const accessToken = _access == null ? state.accessToken.access_token : _access.access_token;

    const url = WebServices.findMemberCards.replace('{MemberID}', memberId);

    fetch(WebServices.MainURL + url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer' + ' ' + accessToken,
        },
    }, 5000)
        .then((response) => response.text())
        .then((responseJson) => {
            if (Tools.stringIsContains(responseJson, 'denied')) {
                console.log('[usePlayCardAPI] findPlayCard: denied, retry:', retryCount);
                if (retryCount >= 2) {
                    console.log('[usePlayCardAPI] findPlayCard: max retries reached');
                    setLoadedUnreg(1);
                    if (callback != null) { callback(); }
                    return;
                }
                if (assignProfile != null) {
                    assignProfile("user", '', '', (_memberID, _access) => {
                        findPlayCard(_memberID, _access, callback, retryCount + 1);
                    });
                }
                setLoadedUnreg(1);
                return;
            }

            let responseObj;
            try {
                responseObj = JSON.parse(responseJson);
            } catch (parseError) {
                console.log('[usePlayCardAPI] findPlayCard: JSON parse error:', parseError.message);
                setLoadedUnreg(1);
                if (callback != null) { callback(); }
                return;
            }

            if (Tools.stringIsEmpty(responseObj.Error)) {
                console.log('[usePlayCardAPI] findPlayCard: success, cards count:', responseObj.Medias?.length);
                initUnregister(responseObj.Medias);
                if (callback != null) { callback(); }
            } else {
                console.log('[usePlayCardAPI] findPlayCard: API error:', responseObj.Error);
                setLoadedUnreg(1);
                if (callback != null) { callback(); }
            }
        })
        .catch((networkError) => {
            console.log('[usePlayCardAPI] findPlayCard: network error:', networkError.message);
            setLoadedUnreg(1);
            if (callback != null) { callback(); }
        });
}, [state.accessToken, assignProfile, initUnregister]);

    // --- API: Search for a card by manual code entry ---
    const searchPlayCard = useCallback((mediaCode, onSuccess, retryCount = 0) => {
         console.log('[usePlayCardAPI] searchPlayCard: mediaCode:', mediaCode, 'type:', typeof mediaCode);
    console.log('[usePlayCardAPI] searchPlayCard: searching for code:', mediaCode);
    setIsLoading(true);
// console.log('[AddPlayCard] calling searchMedia, textVal:', textVal, 'length:', textVal?.length);
    const url = WebServices.searchMediaCard
        .replace('{MemberID}', state.accessToken.MemberID)
        .replace('{MediaCode}', mediaCode);

    fetch(WebServices.MainURL + url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer' + ' ' + state.accessToken.access_token,
        },
    }, 5000)
        .then((response) => response.text())
        .then((responseJson) => {
            if (Tools.stringIsContains(responseJson, 'denied')) {
                console.log('[usePlayCardAPI] searchPlayCard: denied, retry:', retryCount);
                if (retryCount >= 2) {
                    console.log('[usePlayCardAPI] searchPlayCard: max retries reached');
                    setIsLoading(false);
                    Alert.alert(i18n.t("invalidplaycard"));
                    return;
                }
                if (assignProfile != null) {
                    assignProfile("user", '', '', (_memberID, _access) => {
                        searchPlayCard(mediaCode, onSuccess, retryCount + 1);
                    });
                }
                return;
            }

            let responseObj;
            try {
                responseObj = JSON.parse(responseJson);
            } catch (parseError) {
                console.log('[usePlayCardAPI] searchPlayCard: JSON parse error:', parseError.message);
                setIsLoading(false);
                Alert.alert(i18n.t("invalidplaycard"));
                return;
            }

            if (Tools.stringIsEmpty(responseObj.MediaId)) {
                console.log('[usePlayCardAPI] searchPlayCard: card not found');
                setIsLoading(false);
                Alert.alert(i18n.t("invalidplaycard"));
            } else {
                console.log('[usePlayCardAPI] searchPlayCard: found, registering mediaId:', responseObj.MediaId);
                registerPlayCard(mediaCode, responseObj.MediaId, onSuccess);
            }
        })
        .catch((networkError) => {
            console.log('[usePlayCardAPI] searchPlayCard: network error:', networkError.message);
            setIsLoading(false);
            Alert.alert(i18n.t("invalidplaycard"));
        });
}, [state.accessToken, assignProfile]);

    // --- API: Register a card to member account ---
   const registerPlayCard = useCallback((mediaCode, mediaId, onSuccess, retryCount = 0) => {
    console.log('[usePlayCardAPI] registerPlayCard: registering mediaId:', mediaId);
    setIsLoading(true);

    const url = WebServices.registerMediaId
        .replace('{MemberID}', state.accessToken.MemberID)
        .replace('{MediaID}', mediaId);

    fetch(WebServices.MainURL + url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer' + ' ' + state.accessToken.access_token,
        },
    }, 5000)
        .then((response) => response.text())
        .then((responseJson) => {
            if (Tools.stringIsContains(responseJson, 'denied')) {
                console.log('[usePlayCardAPI] registerPlayCard: denied, retry:', retryCount);
                if (retryCount >= 2) {
                    console.log('[usePlayCardAPI] registerPlayCard: max retries reached');
                    setIsLoading(false);
                    Alert.alert(i18n.t("invalidplaycard"));
                    return;
                }
                if (assignProfile != null) {
                    assignProfile("user", '', '', (_memberID, _access) => {
                        registerPlayCard(mediaCode, mediaId, onSuccess, retryCount + 1);
                    });
                }
                return;
            }

            let responseObj;
            try {
                responseObj = JSON.parse(responseJson);
            } catch (parseError) {
                console.log('[usePlayCardAPI] registerPlayCard: JSON parse error:', parseError.message);
                setIsLoading(false);
                Alert.alert(i18n.t("invalidplaycard"));
                return;
            }

            if (responseObj.Result) {
                console.log('[usePlayCardAPI] registerPlayCard: success');
                setIsLoading(false);
                initCards(responseObj.MemberMedias);
                if (onSuccess) { onSuccess(); }
            } else {
                console.log('[usePlayCardAPI] registerPlayCard: failed, error:', responseObj.Error);
                setIsLoading(false);
                if (Tools.stringIsEmpty(responseObj.Error)) {
                    Alert.alert(i18n.t("invalidplaycard"));
                } else {
                    Alert.alert(responseObj.Error);
                }
            }
        })
        .catch((networkError) => {
            console.log('[usePlayCardAPI] registerPlayCard: network error:', networkError.message);
            setIsLoading(false);
            Alert.alert(i18n.t("invalidplaycard"));
        });
}, [state.accessToken, assignProfile, initCards]);

    // --- API: Unregister a card from member account ---
    const unregisterPlayCard = useCallback((mediaId, onSuccess, retryCount = 0) => {
    console.log('[usePlayCardAPI] unregisterPlayCard: unregistering mediaId:', mediaId);
    setIsLoading(true);

    const url = WebServices.unregisterMediaId
        .replace('{MemberID}', state.accessToken.MemberID)
        .replace('{MediaID}', mediaId);

    fetch(WebServices.MainURL + url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer' + ' ' + state.accessToken.access_token,
        },
    }, 5000)
        .then((response) => response.text())
        .then((responseJson) => {
            if (Tools.stringIsContains(responseJson, 'denied')) {
                console.log('[usePlayCardAPI] unregisterPlayCard: denied, retry:', retryCount);
                if (retryCount >= 2) {
                    console.log('[usePlayCardAPI] unregisterPlayCard: max retries reached');
                    setIsLoading(false);
                    Alert.alert(i18n.t("failed"));
                    return;
                }
                if (assignProfile != null) {
                    assignProfile("user", '', '', (_memberID, _access) => {
                        unregisterPlayCard(mediaId, onSuccess, retryCount + 1);
                    });
                }
                return;
            }

            let responseObj;
            try {
                responseObj = JSON.parse(responseJson);
            } catch (parseError) {
                console.log('[usePlayCardAPI] unregisterPlayCard: JSON parse error:', parseError.message);
                setIsLoading(false);
                Alert.alert(i18n.t("failed"));
                return;
            }

            if (responseObj.Result) {
                console.log('[usePlayCardAPI] unregisterPlayCard: success');
                setIsLoading(false);
                initCards(responseObj.MemberMedias);
                if (onSuccess) { onSuccess(); }
            } else {
                console.log('[usePlayCardAPI] unregisterPlayCard: failed, error:', responseObj.Error);
                setIsLoading(false);
                if (Tools.stringIsEmpty(responseObj.Error)) {
                    Alert.alert(i18n.t("failed"));
                } else {
                    Alert.alert(responseObj.Error);
                }
            }
        })
        .catch((networkError) => {
            console.log('[usePlayCardAPI] unregisterPlayCard: network error:', networkError.message);
            setIsLoading(false);
            Alert.alert(i18n.t("failed"));
        });
}, [state.accessToken, assignProfile, initCards]);

    // --- Convenience: Register by index from unregistered cards list ---
    const checkandRegister = useCallback((index, onSuccess) => {
        console.log('[usePlayCardAPI] checkandRegister: index:', index);
        setIsLoading(true);
        registerPlayCard(
            unregcardFullNumbers[index],
            unregcardLists[index].MediaId,
            onSuccess
        );
    }, [unregcardFullNumbers, unregcardLists, registerPlayCard]);

    return {
        // State
        cardLists,
        setCardLists,
        unregcardLists,
        cardNumbers,
        unregcardNumbers,
        unregcardFullNumbers,
        loaded,
        setLoaded,
        loadedUnreg,
        isLoading,
        setIsLoading,
        error,

        // API functions
        fetchMedias,
        fetchMediaDetail,
        findPlayCard,
        searchPlayCard,
        registerPlayCard,
        unregisterPlayCard,
        checkandRegister,

        // Processing helpers
        initCards,
        initUnregister,

        // Card number extraction helpers
        getcardNumber,
        getcardNumberUnReg,
        getcardFullNumberUnReg,
    };
}