import { useState, useRef, useCallback } from 'react';
import { Alert, createRef } from 'react-native';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
const i18n = new I18n(translations);
import * as Tools from '../Components/Tools';
import WebServices from '../constants/WebServices';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { useTheme } from '../context/ThemeProvider';

export default function useCardServices(assignProfile) {
    const { state } = useAppContext();
    const Colors = useTheme();
    i18n.translations = state.i18ntranslation;

    // ---- Refs ----
    const isMounted = useRef(true);      // mounted guard
    const isFetching = useRef(false);     // debounce guard for fetchMedias
    const abortRef = useRef(null);        // AbortController for active requests

    // ---- State ----
    const [cardLists, setCardLists] = useState([]);
    const [cardNumber, setCardNumber] = useState([]);
    const [unregcardLists, setUnregcardLists] = useState([]);
    const [unregcardNumber, setUnregcardNumber] = useState([]);
    const [unregcardFullNumber, setUnregcardFullNumber] = useState([]);
    const [loaded, setLoaded] = useState(0);
    const [loadedUnreg, setLoadedUnreg] = useState(0);
    const [findcard, setFindcard] = useState(0);
    const [isLoadingCards, setIsLoadingCards] = useState(false);

    // ---- Refs for GestureFlipView (arrays) ----
    const cardsViewRef = useRef([]);
    const unregcardsViewRef = useRef([]);
    const unregcardsInputRef = useRef([]);

    // ---- Cleanup function (call in useEffect return) ----
    const cleanup = useCallback(() => {
        isMounted.current = false;
        if (abortRef.current) {
            abortRef.current.abort();
        }
    }, []);

    // ---- Helper: get access token (from AppReducer context) ----
    const getToken = useCallback(() => {
        return state.accessToken;
    }, [state.accessToken]);

    // ---- Helper: safe fetch with abort support ----
    const safeFetch = useCallback((url, options, timeoutMs = 10000) => {
        const controller = new AbortController();
        abortRef.current = controller;

        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        return fetch(url, { ...options, signal: controller.signal })
            .finally(() => {
                clearTimeout(timeoutId);
                abortRef.current = null;
            });
    }, []);

    // ---- Card number helpers ----
    const getX = useCallback((len) => {
        let data = "";
        for (let i = 0; i < len; i++) data += 'X';
        return data;
    }, []);

    const getcardNumber = useCallback((cardIn) => {
        if (cardIn.MediaCodes != null && cardIn.MediaCodes.length > 0) {
            for (let t = 0; t < cardIn.MediaCodes.length; t++) {
                if (cardIn.MediaCodes[t].Type === "Default") {
                    return cardIn.MediaCodes[t].Code;
                }
            }
        }
        return '';
    }, []);

    const getcardNumberUnReg = useCallback((cardIn) => {
        if (cardIn.MediaCodes != null && cardIn.MediaCodes.length > 0) {
            for (let t = 0; t < cardIn.MediaCodes.length; t++) {
                if (cardIn.MediaCodes[t].MediaCodeTypeDesc === "Default") {
                    const code = cardIn.MediaCodes[t].MediaCode;
                    return getX(code.length - 4) + code.substring(code.length - 4);
                }
            }
        }
        return '';
    }, [getX]);

    const getcardFullNumberUnReg = useCallback((cardIn) => {
        if (cardIn.MediaCodes != null && cardIn.MediaCodes.length > 0) {
            for (let t = 0; t < cardIn.MediaCodes.length; t++) {
                if (cardIn.MediaCodes[t].MediaCodeTypeDesc === "Default") {
                    return cardIn.MediaCodes[t].MediaCode;
                }
            }
        }
        return '';
    }, []);

    // ---- Color/Image helpers ----
    const getColor = useCallback((parkType) => {
        if (parkType === "Angry Birds World") return Colors.abColor;
        if (parkType === "Virtuocity") return Colors.vcColor;
        if (parkType === "Snow Dunes") return Colors.sdColor;
        return Colors.bgColor;
    }, [Colors]);

    const getbgImage = useCallback((parkType) => {
        if (parkType === "Angry Birds World") return WebServices.abcard;
        if (parkType === "Virtuocity") return WebServices.vccard;
        if (parkType === "Snow Dunes") return WebServices.vccard;
        return WebServices.generalcard;
    }, []);

    // ---- Core data processing ----
    const initCards = useCallback((cardsObj, callbackFn) => {
        if (!isMounted.current) return;
        let _cardsObj = cardsObj || [];
        setLoaded(0);

        const newRefs = [];
        const newNumbers = [];
        for (let t = 0; t < _cardsObj.length; t++) {
            _cardsObj[t].hasData = false;
            newRefs.push(createRef());
            newNumbers.push(getcardNumber(_cardsObj[t]));
        }
        cardsViewRef.current = newRefs;
        setCardNumber(newNumbers);
        setCardLists([..._cardsObj]);  // spread to create new reference
        setLoaded(1);

        if (callbackFn) {
            callbackFn(_cardsObj);
        }
    }, [getcardNumber]);

    const initUnregister = useCallback((cards) => {
        if (!isMounted.current) return;
        const _unregCards = cards || [];
        setLoadedUnreg(0);
        setUnregcardLists([..._unregCards]);

        const newViewRefs = [];
        const newInputRefs = [];
        const newNumbers = [];
        const newFullNumbers = [];

        for (let t = 0; t < _unregCards.length; t++) {
            newViewRefs.push(createRef());
            newInputRefs.push(createRef());
            newNumbers.push(getcardNumberUnReg(_unregCards[t]));
            newFullNumbers.push(getcardFullNumberUnReg(_unregCards[t]));
        }
        unregcardsViewRef.current = newViewRefs;
        unregcardsInputRef.current = newInputRefs;
        setUnregcardNumber(newNumbers);
        setUnregcardFullNumber(newFullNumbers);
        setLoadedUnreg(1);
    }, [getcardNumberUnReg, getcardFullNumberUnReg]);

    // ---- API functions ----
    const fetchMedias = useCallback(() => {
        const token = getToken();
        if (!token || isFetching.current) return;
        isFetching.current = true;
        setIsLoadingCards(true);

        const url = WebServices.MainURL +
            WebServices.mediaSummary.replace("{MemberID}", token.MemberID);

        safeFetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token.access_token,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.text())
        .then(responseJson => {
            isFetching.current = false;
            if (!isMounted.current) return;

            if (Tools.stringIsContains(responseJson, 'denied')) {
                if (assignProfile) {
                    assignProfile("user", '', '', () => { fetchMedias(); });
                }
                setIsLoadingCards(false);
                return;
            }
            setIsLoadingCards(false);
            const responseObj = JSON.parse(responseJson);
            if (Tools.stringIsEmpty(responseObj.Error)) {
                initCards(responseObj.Medias);
            }
        })
        .catch(error => {
            isFetching.current = false;
            if (!isMounted.current) return;
            setIsLoadingCards(false);
        });
    }, [getToken, safeFetch, assignProfile, initCards]);

    const fetchMediaDetail = useCallback((item) => {
        const token = getToken();
        if (!token) return;

        const url = WebServices.MainURL +
            WebServices.mediaDetails.replace("{MediaID}", item.Id);

        safeFetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token.access_token,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.text())
        .then(responseJson => {
            if (!isMounted.current) return;

            if (Tools.stringIsContains(responseJson, 'denied')) {
                if (assignProfile) {
                    assignProfile("user", '', '', () => { fetchMedias(); });
                }
                return;
            }
            const responseObj = JSON.parse(responseJson);
            if (!Tools.IsNull(responseObj)) {
                // Create new array to trigger React re-render
                setCardLists(prev => {
                    const newList = [...prev];
                    const idx = newList.findIndex(c => c.Id === item.Id);
                    if (idx !== -1) {
                        newList[idx] = { ...responseObj, hasData: true, rotate: 1 };
                    }
                    return newList;
                });
                setLoaded(1);
            }
        })
        .catch(error => {
            // silent fail for detail fetch
        });
    }, [getToken, safeFetch, assignProfile, fetchMedias]);

    const findPlayCards = useCallback((memberID = null, access = null, callback = null) => {
        const token = access || getToken();
        if (!token) return;
        setFindcard(0);

        const url = WebServices.MainURL +
            WebServices.findMemberCards.replace('{MemberID}',
                memberID || token.MemberID);

        safeFetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token.access_token,
            },
        })
        .then(response => response.text())
        .then(responseJson => {
            if (!isMounted.current) return;
            setFindcard(1);

            if (Tools.stringIsContains(responseJson, 'denied')) {
                if (assignProfile) {
                    assignProfile("user", '', '', (_mid, _acc) => {
                        findPlayCards(_mid, _acc, callback);
                    });
                }
                setLoadedUnreg(1); // Signal completion even on auth failure
                return;
            }
            const responseObj = JSON.parse(responseJson);
            if (Tools.stringIsEmpty(responseObj.Error)) {
                initUnregister(responseObj.Medias);
                if (callback) callback();
            } else {
                setLoadedUnreg(1); // Signal completion on error
                if (callback) callback();
            }
        })
        .catch(error => {
            if (!isMounted.current) return;
            setFindcard(2);
            setLoadedUnreg(1); // Signal completion on network error
            if (callback) callback();
        });
    }, [getToken, safeFetch, assignProfile, initUnregister]);

    const searchPlayCard = useCallback((mediaCode, access) => {
        const token = access || getToken();
        if (!token) return;
        setIsLoadingCards(true);

        const url = WebServices.MainURL +
            WebServices.searchMediaCard
                .replace('{MemberID}', token.MemberID)
                .replace('{MediaCode}', mediaCode);

        safeFetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token.access_token,
            },
        })
        .then(response => response.text())
        .then(responseJson => {
            if (!isMounted.current) return;

            if (Tools.stringIsContains(responseJson, 'denied')) {
                if (assignProfile) {
                    assignProfile("user", '', '', (_mid, _acc) => {
                        searchPlayCard(mediaCode, _acc);
                    });
                }
                return;
            }
            const responseObj = JSON.parse(responseJson);
            if (Tools.stringIsEmpty(responseObj.MediaId)) {
                setIsLoadingCards(false);
                Alert.alert(i18n.t("invalidplaycard"));
            } else {
                registerPlayCard(mediaCode, token, responseObj.MediaId);
            }
        })
        .catch(error => {
            if (!isMounted.current) return;
            setIsLoadingCards(false);
            Alert.alert(i18n.t("invalidplaycard"));
        });
    }, [getToken, safeFetch, assignProfile]);

    const registerPlayCard = useCallback((mediaCode, access, mediaId, callbackFn) => {
        const token = access || getToken();
        if (!token) return;
        setIsLoadingCards(true);

        const url = WebServices.MainURL +
            WebServices.registerMediaId
                .replace('{MemberID}', token.MemberID)
                .replace('{MediaID}', mediaId);

        safeFetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token.access_token,
            },
        })
        .then(response => response.text())
        .then(responseJson => {
            if (!isMounted.current) return;

            if (Tools.stringIsContains(responseJson, 'denied')) {
                if (assignProfile) {
                    assignProfile("user", '', '', (_mid, _acc) => {
                        registerPlayCard(mediaCode, _acc, mediaId, callbackFn);
                    });
                }
                return;
            }
            const responseObj = JSON.parse(responseJson);
            if (responseObj.Result) {
                setIsLoadingCards(false);
                initCards(responseObj.MemberMedias, callbackFn);
            } else {
                setIsLoadingCards(false);
                const msg = Tools.stringIsEmpty(responseObj.Error)
                    ? i18n.t("invalidplaycard")
                    : responseObj.Error;
                Alert.alert(msg);
            }
        })
        .catch(error => {
            if (!isMounted.current) return;
            setIsLoadingCards(false);
            Alert.alert(i18n.t("invalidplaycard"));
        });
    }, [getToken, safeFetch, assignProfile, initCards]);

    const unregisterPlayCard = useCallback((mediaId) => {
        const token = getToken();
        if (!token) return;
        setIsLoadingCards(true);

        const url = WebServices.MainURL +
            WebServices.unregisterMediaId
                .replace('{MemberID}', token.MemberID)
                .replace('{MediaID}', mediaId);

        safeFetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token.access_token,
            },
        })
        .then(response => response.text())
        .then(responseJson => {
            if (!isMounted.current) return;

            if (Tools.stringIsContains(responseJson, 'denied')) {
                if (assignProfile) {
                    assignProfile("user", '', '', () => {
                        unregisterPlayCard(mediaId);
                    });
                }
                return;
            }
            const responseObj = JSON.parse(responseJson);
            if (responseObj.Result) {
                setIsLoadingCards(false);
                initCards(responseObj.MemberMedias);
            } else {
                setIsLoadingCards(false);
                const msg = Tools.stringIsEmpty(responseObj.Error)
                    ? i18n.t("failed")
                    : responseObj.Error;
                Alert.alert(msg);
            }
        })
        .catch(error => {
            if (!isMounted.current) return;
            setIsLoadingCards(false);
            Alert.alert(i18n.t("failed"));
        });
    }, [getToken, safeFetch, assignProfile, initCards]);

    const checkandRegister = useCallback((index) => {
        const token = getToken();
        if (!token) return;
        setIsLoadingCards(true);
        registerPlayCard(
            unregcardFullNumber[index],
            token,
            unregcardLists[index]?.MediaId
        );
    }, [getToken, unregcardFullNumber, unregcardLists, registerPlayCard]);

    // ---- Return everything ----
    return {
        // State
        cardLists,
        cardNumber,
        unregcardLists,
        unregcardNumber,
        unregcardFullNumber,
        loaded,
        loadedUnreg,
        findcard,
        isLoadingCards,

        // Refs
        cardsViewRef,
        unregcardsViewRef,
        unregcardsInputRef,

        // API functions
        fetchMedias,
        fetchMediaDetail,
        findPlayCards,
        searchPlayCard,
        registerPlayCard,
        unregisterPlayCard,
        checkandRegister,

        // Helpers
        getcardNumber,
        getcardNumberUnReg,
        getcardFullNumberUnReg,
        getColor,
        getbgImage,
        initCards,

        // Cleanup
        cleanup,
    };
}