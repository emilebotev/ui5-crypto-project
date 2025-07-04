import JSONModel from "sap/ui/model/json/JSONModel";
import Log from "sap/base/Log";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";

export default class CryptoModel extends JSONModel {
  private API_BASE_URL = "https://api.coingecko.com/api/v3/";
  private COINS_PATH = "coins/markets";
  private SUPPORTED_CURRENCIES_PATH = "simple/supported_vs_currencies";
  private headers = {
    accept: "application/json",
  };

  private page = 1;

  constructor() {
    super({ selectedCurrency: "usd" });
    console.log("Crypto model initialized")
  }

  private incrementPage() {
    this.page = this.page + 1;
  }
  private decrementPage() {
    this.page = this.page - 1;
  }


  public getTopMarketCap(numberOfResults = 20) {
    const url = this.API_BASE_URL + this.COINS_PATH;
    const vs_currency = this.getProperty("/selectedCurrency");
    const oParameters = {
      vs_currency: vs_currency,
      per_page: numberOfResults,
      page: this.page,
    };

    const oTempModel = new JSONModel();

    oTempModel.loadData(
      url,
      oParameters,
      true,
      "GET",
      false,
      false,
      this.headers
    );

    oTempModel.attachRequestCompleted((oEvent) => {
      if (oEvent.getParameter("success")) {
        Log.info(
          `Page ${this.page} of top ${numberOfResults} cryptocurrencies was loaded succesfully`
        );
        this.setProperty("/crypto", oTempModel.getData());
      } else {
        Log.error(
          `Failed to load page ${this.page} of top ${
            numberOfResults
          } cryptocurrencies. Status: ${(
            oEvent as Model$RequestFailedEvent
          ).getParameter("statusCode")}`
        );
      }
    });

    oTempModel.attachRequestFailed((oEvent) => {
      const error = `Request failed: ${oEvent.getParameter("message")}`;
      Log.error(error);
    });
  }

  public loadNextTopMarketCap() {
    this.incrementPage();
    this.getTopMarketCap();
  }

  public loadPreviousTopMarketCap() {
    this.decrementPage();
    this.getTopMarketCap();
  }

  public loadSupportedCurrencies() {
    const url = this.API_BASE_URL + this.SUPPORTED_CURRENCIES_PATH;
    const oTempModel = new JSONModel();

    oTempModel.loadData(url, {}, true, "GET", false, true, this.headers);

    oTempModel.attachRequestCompleted((oEvent) => {
      if (oEvent.getParameter("success")) {
        this.setProperty(
          "/supportedCurrencies",
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
    this.setProperty("/selectedCurrency", currency);
  }
}
