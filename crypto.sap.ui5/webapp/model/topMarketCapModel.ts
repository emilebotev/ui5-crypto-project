import JSONModel from "sap/ui/model/json/JSONModel";
import CryptoModel from "./cryptoModel";
import { TMCModelPropsDictionary } from "../types/Dictionaries";
import Context from "sap/ui/model/Context";

export default class TopMarketCapModel extends JSONModel {
  constructor(private cryptoModel: CryptoModel) {
    super({ page: 1 });
  }

  getTopMarketCap() {
    const dataRequest = this.cryptoModel.fetchTopMarketCap(
      this.getProperty(TMCModelPropsDictionary.page)
    );

    if (!dataRequest) {
      return;
    }

    dataRequest
      .then((crypto) => {
        this.setProperty(TMCModelPropsDictionary.crypto, crypto);
      })
      .catch(console.error);
  }

  private incrementPage() {
    const currentPage = this.getProperty(
      TMCModelPropsDictionary.page
    );
    this.setProperty(
      TMCModelPropsDictionary.page,
      currentPage + 1
    );
  }
  private decrementPage() {
    const currentPage = this.getProperty(
      TMCModelPropsDictionary.page
    );
    this.setProperty(
      TMCModelPropsDictionary.page,
      currentPage - 1
    );
  }

  public loadNextTopMarketCap() {
    this.incrementPage();
    this.getTopMarketCap();
  }

  public loadPreviousTopMarketCap() {
    this.decrementPage();
    this.getTopMarketCap();
  }
}
