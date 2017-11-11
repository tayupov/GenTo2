import React from 'react';

import { Container } from 'semantic-ui-react';

import HeaderSection from './HeaderSection';
import DetailsSection from './DetailsSection';
import Chart from './Chart';
import TokensSection from './TokensSection';

const View = ({
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
        <Chart chartDataArr={chartDataArr} />
        {tokenCountMsg &&
        <TokensSection
            tokenCountMsg={tokenCountMsg}
            buyToken={buyToken} 
        />
        }
    </Container>
)

export default View;