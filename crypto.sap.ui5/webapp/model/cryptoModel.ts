import JSONModel from "sap/ui/model/json/JSONModel";
import Log from "sap/base/Log";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import { getEnvironment } from "../utils/getEnvironment";
import { CG_API_KEY } from "./../utils/local-dev-credentials";
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

  private page = 1;

  constructor() {
    super({ selectedCurrency: "usd", selectedDays: 1 });
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

  private incrementPage() {
    this.page = this.page + 1;
  }
  private decrementPage() {
    this.page = this.page - 1;
  }

  public getTopMarketCap(numberOfResults = 20) {
    const url = this.getBaseUrl() + this.COINS_PATH;
    const vs_currency = this.getProperty("/selectedCurrency");
    const oParameters = {
      vs_currency,
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
      this.getHeaders()
    );

    oTempModel.attachRequestCompleted((oEvent) => {
      if (oEvent.getParameter("success")) {
        console.info(
          `Page ${this.page} of top ${numberOfResults} cryptocurrencies was loaded succesfully`
        );
        this.setProperty("/crypto", oTempModel.getData());
      } else {
        Log.error(
          `Failed to load page ${
            this.page
          } of top ${numberOfResults} cryptocurrencies. Status: ${(
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
    const url = this.getBaseUrl() + this.SUPPORTED_CURRENCIES_PATH;
    const oTempModel = new JSONModel();

    oTempModel.loadData(url, {}, true, "GET", false, true, this.getHeaders());

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

  public getCoinHistoryById(id: string) {
    const url = `${this.getBaseUrl()}/${this.createCoinByIdPath(id)}`;
    const vs_currency = this.getProperty("/selectedCurrency");
    const days = this.getProperty("/selectedDays");

    const oParameters = {
      vs_currency,
      days,
    };

    const rawDataModel = new JSONModel();
    rawDataModel.loadData(
      url,
      oParameters,
      true,
      "GET",
      false,
      true,
      this.getHeaders()
    );

    rawDataModel.attachRequestCompleted((oEvent) => {
      if (!oEvent.getParameter("success")) {
        return;
      }
      const { prices, market_caps, total_volumes } = rawDataModel.getData();
      const processedData = prices.map(
        (priceEntry: [number, number], index: number) => {
          const [timeStampRaw, price] = priceEntry;
          const date = new Date(timeStampRaw);
          return {
            date,
            price,
            marketCap: parseFloat(market_caps[index][1].toFixed(2)),
            volume: parseFloat(total_volumes[index][1].toFixed(2)),
          };
        }
      );
      this.setProperty("/cryptoDetail", processedData);
    });
  }

  changeSelectedDays(days: string | undefined) {
    if (!days) {
      console.error("Days argument is not valid!", days);
      return;
    }
    this.setProperty("/selectedDays", days);
  }
}
