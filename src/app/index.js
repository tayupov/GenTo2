import React, { Component } from 'react';

import View from './View';

import AlertContainer from 'react-alert';
import web3 from 'utils/web3';

class App extends Component {

  constructor() {
    super();
    this.state = {
      account: null,
      network: null,
      active: false,
      daos: [],
      currDao: ''
    }
  }
  
  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  componentWillMount() {
    this.listDaos();
    this.updateNetwork();
    setInterval(this.updateAccount, 1000);
  }

  setCurrDao = (daoName) => {
    this.setState({
      currDao: daoName
    })
  }

  getCurrDao = () => this.state.daos.filter(dao => dao.daoName === this.state.currDao)[0]

  listDaos = () => {
    this.setState({
      daos: [
        {
          daoName: 'Lizax',
          daoWebsite: 'lizax.com',
          daoDescription: 'Lizax is the first DAO to revolutionize the gaming business.',
          dmrReward: 200,
          financePoints: 30,
          productPoints: 50,
          orgPoints: 40,
          partnerPoints: 10,
          minPartic: 15,
          decidingPercentage: 50,
          minVoting: 20,
          maxVoting: 50,
          tokenName: 'LizaxToken',
          tickerSymbol: 'LZX',
          totalSupply: 15000,
          selectedCurrency: 'finney',
          minPrice: 20000,
          maxPrice: 23500,
          saleStart: new Date('06/12/2017'),
          saleEnd: new Date('12/12/2017'),
          shTokens: 478
        },
        {
          daoName: 'TorX',
          daoWebsite: 'TorX.com',
          daoDescription: 'TorX is the first DAO to revolutionize the gaming business.',
          dmrReward: 200,
          financePoints: 30,
          productPoints: 50,
          orgPoints: 40,
          partnerPoints: 10,
          minPartic: 15,
          decidingPercentage: 50,
          minVoting: 20,
          maxVoting: 50,
          tokenName: 'TorXToken',
          tickerSymbol: 'TRX',
          totalSupply: 9000,
          selectedCurrency: 'finney',
          minPrice: 20000,
          maxPrice: 23500,
          saleStart: new Date('06/12/2017'),
          saleEnd: new Date('12/12/2017'),
          shTokens: 235
        },
        {
          daoName: 'Mint',
          daoWebsite: 'Mint.com',
          daoDescription: 'Mint is the first DAO to revolutionize the gaming business.',
          dmrReward: 200,
          financePoints: 30,
          productPoints: 50,
          orgPoints: 40,
          partnerPoints: 10,
          minPartic: 15,
          decidingPercentage: 50,
          minVoting: 20,
          maxVoting: 50,
          tokenName: 'MintToken',
          tickerSymbol: 'MNT',
          totalSupply: 18000,
          selectedCurrency: 'finney',
          minPrice: 20000,
          maxPrice: 23500,
          saleStart: new Date('06/12/2017'),
          saleEnd: new Date('12/12/2017'),
          shTokens: 780
        },
        {
          daoName: 'Zeltox',
          daoWebsite: 'Zeltox.com',
          daoDescription: 'Zeltox is the first DAO to revolutionize the gaming business.',
          dmrReward: 200,
          financePoints: 30,
          productPoints: 50,
          orgPoints: 40,
          partnerPoints: 10,
          minPartic: 15,
          decidingPercentage: 50,
          minVoting: 20,
          maxVoting: 50,
          tokenName: 'ZeltoxToken',
          tickerSymbol: 'ZTX',
          totalSupply: 50000,
          selectedCurrency: 'finney',
          minPrice: 18000,
          maxPrice: 23500,
          saleStart: new Date('06/12/2017'),
          saleEnd: new Date('12/12/2017'),
          shTokens: 13000
        },
      ]
    })
  }

  // temporary function for creating DAOs
  createDAO = (daoDetails) => {
    this.setState({
      daoDetails
    })
  }

  updateNetwork = () => {
    web3.version.getNetwork((err, netId) => {
      if (err) {
        console.log('The network connection could not be established!');
        console.error(err);
      }
      this.setState({
        network: netId
      })
    })
  }

  updateAccount = () => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        console.log('The account could not be updated!');
        console.error(err);
      }
      if(this.state.account !== accounts[0]){
        if(this.state.account !== null)
          this.notify('Account Switched!', 'info');
        this.setState({
          account: accounts[0]
        })
      }
    });
  }

  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'light',
    time: 5000,
    transition: 'fade'
  }


  notify = (message, type) => {
    switch(type) {
      case 'info':
        return this.msg.info(message);
      case 'success':
        return this.msg.success(message);
      case 'error':
        return this.msg.error(message);
      case 'remove':
        return this.msg.removeAll();
    }
  }

  handleContextRef = contextRef => this.setState({ contextRef });

  render() {
    return (
      <div ref={this.handleContextRef}>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <View
          {...this.state}
          notify={this.notify}
          handleShow={this.handleShow}
          handleHide={this.handleHide}
          createDAO={this.createDAO}
          setCurrDao={this.setCurrDao}
          getCurrDao={this.getCurrDao}
        />
      </div>
    );
  }
}

export default App;
