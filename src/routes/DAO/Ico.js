import React from 'react';

import { Container } from 'semantic-ui-react';

import HeaderSection from './components/HeaderSection';
import DetailsSection from './components/DetailsSection';
import Chart from './components/Chart';
import TokenSection from './components/TokenSection';

const Ico = ({
    auctionDetails,
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
        {auctionDetails && priceDevelopmentString && 
        <DetailsSection
            details={auctionDetails}
            priceDevelopmentString={priceDevelopmentString}
            timeCountDown={timeCountDown}
            currentPercentage={currentPercentage}
            status={status} 
            setSupplyInterval={setSupplyInterval}
            listenForTokenBuy={listenForTokenBuy}
        />
        }
        {chartDataArr.length === 3 && <Chart chartDataArr={chartDataArr} />}
        {tokenCountMsg &&
        <TokenSection
            tokenCountMsg={tokenCountMsg}
            buyToken={buyToken} 
        />
        }
    </Container>
)

export default Ico;