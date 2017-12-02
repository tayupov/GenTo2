import React from 'react';

import { Container } from 'semantic-ui-react';

import HeaderSection from './components/HeaderSection';
import DetailsSection from './components/DetailsSection';
import TokenSection from './components/TokenSection';

const Dao = ({
    auctionDetailsParsed,
    priceDevelopmentString,
    timeCountDown,
    currentPercentage,
    status,
    tokenCountMsg,
    chartDataArr,
    setSupplyInterval,
    buyToken,
    listenForTokenBuy
}) => (
    <Container style={{ width: '800px' }}>
        <HeaderSection />
        {auctionDetailsParsed && priceDevelopmentString && 
        <DetailsSection
            details={auctionDetailsParsed}
            priceDevelopmentString={priceDevelopmentString}
            timeCountDown={timeCountDown}
            currentPercentage={currentPercentage}
            status={status} 
            setSupplyInterval={setSupplyInterval}
            listenForTokenBuy={listenForTokenBuy}
        />
        }
        {tokenCountMsg &&
        <TokenSection
            tokenCountMsg={tokenCountMsg}
            buyToken={buyToken} 
        />
        }
    </Container>
)

export default Dao;