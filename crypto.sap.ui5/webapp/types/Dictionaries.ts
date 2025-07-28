import TopMarketCap from "../controller/TopMarketCap.controller";

export enum ModelNamesDictionary {
  cryptoModel = "cryptoModel",
  topMarketCap = "topMarketCap",
  cryptoDetail = "cryptoDetail",
}

// Crypto Model Properties
export enum CryptoModelPropsDictionary {
  supportedCurrencies = "/supportedCurrencies",
  selectedCurrency = "/selectedCurrency",
}

// Top Market Cap Model properties
export enum TMCModelPropsDictionary {
  page = "/page",
  crypto = "/crypto",
}

export enum CryptoDetailModelPropsDictionary {
  cryptoName = "/cryptoName",
  cryptoDetail = "/cryptoDetail",
  selectedDays = "/selectedDays",
  priceAxisRange = "/priceAxisRange",
}
