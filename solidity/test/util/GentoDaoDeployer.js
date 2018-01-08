const defaultData = {
  totalSupply: 1000000000,
  symbol: "TST",
  name:"TestToken",
  buyPriceStart: 10,
  buyPriceEnd: 100,
  sellPrice: 10,
  saleStart: 1000000,
  saleEnd: 2000000,
  dev: true
}


module.exports=(GentoDao) => {
  return async (customData) => {
    let key;
    if (!customData) customData = {}
    if (key = Object.keys(customData).find(key => !(key in defaultData))) {
      throw `key '${key}' is not a valid parameter!`
    }
    const data = Object.assign({}, defaultData, customData)
    return GentoDao.new(data.totalSupply, data.symbol, data.name, data.buyPriceStart, data.buyPriceEnd, data.sellPrice, data.saleStart, data.saleEnd, data.dev)
  }
}
