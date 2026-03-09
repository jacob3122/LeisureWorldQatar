/**
 * StorePageSkeleton.js
 *
 * Skeleton loading placeholder for the Store page.
 * Shown while catalog data is being fetched (isLoading=true).
 *
 * Extracted from original StorePage.js getLoading() function.
 * Uses react-content-loader/native with exact same dimensions and layout.
 */

import React from 'react';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import ContentLoader, { Rect } from 'react-content-loader/native';

/**
 * @param {object} props
 * @param {object} props.Colors - Theme colors from useTheme()
 */
const StorePageSkeleton = ({ Colors }) => {
    const randHeight = 30;

    return (
        <ContentLoader
            speed={0.7}
            width={widthPercentageToDP(93)}
            height={heightPercentageToDP(90)}
            style={{ alignSelf: 'center' }}
            backgroundColor={Colors.whiteColor}
            foregroundColor={Colors.bgColor}
        >
            <Rect
                x="0"
                y={40}
                rx="2"
                ry="2"
                width={widthPercentageToDP(93)}
                height={heightPercentageToDP(3)}
            />
            <Rect
                x="0"
                y={40 + heightPercentageToDP(4)}
                rx="2"
                ry="2"
                width={widthPercentageToDP(93)}
                height={heightPercentageToDP(6)}
            />
            <Rect
                x="0"
                y={40 + heightPercentageToDP(12)}
                rx={widthPercentageToDP(2)}
                ry={widthPercentageToDP(2)}
                width={widthPercentageToDP(93)}
                height={heightPercentageToDP(randHeight - 1)}
            />
            <Rect
                x="0"
                y={40 + heightPercentageToDP(12 + randHeight)}
                rx={widthPercentageToDP(2)}
                ry={widthPercentageToDP(2)}
                width={widthPercentageToDP(93)}
                height={heightPercentageToDP(randHeight - 1)}
            />
            <Rect
                x="0"
                y={40 + heightPercentageToDP(12 + (2 * randHeight))}
                rx={widthPercentageToDP(2)}
                ry={widthPercentageToDP(2)}
                width={widthPercentageToDP(93)}
                height={heightPercentageToDP(randHeight - 1)}
            />
        </ContentLoader>
    );
};

export default React.memo(StorePageSkeleton);