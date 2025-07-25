import JSONModel from "sap/ui/model/json/JSONModel";
import Log from "sap/base/Log";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import { getEnvironment } from "../utils/getEnvironment";
import { CG_API_KEY } from "./../utils/local-dev-credentials";
import { CoinHistoryByIdData, CryptoCurrency } from "../types/Cryptocurrencies";
import { CryptoModelPropsDictionary } from "../types/Dictionaries";

export default class CryptoModel extends JSONModel {
  // Fixing the API Base URL to match the one streamlining to CoinGecko with needed Authntication, handled in destinations
  private API_BASE_URL = "/api/";
  private API_BASE_URL_LOCAL = "https://api.coingecko.com/api/v3/";
  private COINS_PATH = "coins/markets";
  private SUPPORTED_CURRENCIES_PATH = "simple/supported_vs_currencies";
  private createCoinByIdPath = (id: string) => `coins/${id}/market_chart`;

  private headers = {
    accept: "application/json",
  };

  constructor() {
    super({ selectedCurrency: "usd" });
  }

  private getBaseUrl() {
    const env = getEnvironment();

    if (env === "dev") {
      return this.API_BASE_URL_LOCAL;
    }

    return this.API_BASE_URL;
  }

  private getHeaders() {
    const env = getEnvironment();
    if (env === "dev") {
      return { ...this.headers, "x-cg-demo-api-key": CG_API_KEY };
    }
    return this.headers;
  }

  public async fetchTopMarketCap(page: number, per_page = 20) {
    const url = this.getBaseUrl() + this.COINS_PATH;
    const vs_currency = this.getProperty(
      CryptoModelPropsDictionary.selectedCurrency
    );
    const oParameters = {
      vs_currency,
      per_page,
      page,
    };

    const oTempModel = new JSONModel();

    try {
      await oTempModel.loadData(
        url,
        oParameters,
        true,
        "GET",
        false,
        false,
        this.getHeaders()
      );
      return oTempModel.getData();
    } catch (error) {
      console.error(
        "Something went wrong while fetching data for Top Market Cap",
        error
      );
    }
  }

  public loadSupportedCurrencies() {
    const url = this.getBaseUrl() + this.SUPPORTED_CURRENCIES_PATH;
    const oTempModel = new JSONModel();

    oTempModel.loadData(url, {}, true, "GET", false, true, this.getHeaders());

    oTempModel.attachRequestCompleted((oEvent) => {
      if (oEvent.getParameter("success")) {
        this.setProperty(
          CryptoModelPropsDictionary.supportedCurrencies,
          oTempModel.getData().map((item: string) => ({ id: item, code: item }))
        );
      }
    });

    oTempModel.attachRequestFailed((oEvent) => {
      const error = `Request failed: ${oEvent.getParameter("message")}`;
      Log.error(error);
    });
  }

  public changeSelectedCurrency(currency: string) {
    this.setProperty(CryptoModelPropsDictionary.selectedCurrency, currency, );
  }

  public async fetchCoinHistoryById(id: string, days: string) {
    const url = `${this.getBaseUrl()}/${this.createCoinByIdPath(id)}`;
    const vs_currency = this.getProperty(
      CryptoModelPropsDictionary.selectedCurrency
    );

    const oParameters = {
      vs_currency,
      days,
    };

    const rawDataModel = new JSONModel();

    try {
      await rawDataModel.loadData(
        url,
        oParameters,
        true,
        "GET",
        false,
        true,
        this.getHeaders()
      );

      return rawDataModel.getData() as Promise<CoinHistoryByIdData>;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
