import Controller from "sap/ui/core/mvc/Controller";
import CryptoModel from "../model/cryptoModel";
import Formatter from "../utils/Formatter";
import { Select$ChangeEvent } from "sap/m/Select";
import {
  SearchField$SearchEvent,
  SearchField$SuggestEvent,
} from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import JSONListBinding from "sap/ui/model/json/JSONListBinding";
import FilterOperator from "sap/ui/model/FilterOperator";
import Table from "sap/ui/table/Table";

/**
 * @namespace sap.ui5.crypto.controller
 */
export default class View extends Controller {
  private cryptoModel: CryptoModel;
  private oResizeObserver: ResizeObserver;
  formatter = Formatter;

  onInit(): void {
    // Initialize the CryptoModel
    this.cryptoModel = new CryptoModel();

    // Load the available vs_currencies from the API
    this.cryptoModel.loadSupportedCurrencies();

    // Load the top 20 cryptocurrencies from the API
    this.cryptoModel.getTopMarketCap();

    // Bind the model to the view
    this.getView()?.setModel(this.cryptoModel, "cryptoModel");


  }

  onLoadNextPage() {
    this.cryptoModel.loadNextTopMarketCap();
  }
  onLoadPreviousPage() {
    this.cryptoModel.loadPreviousTopMarketCap();
  }

  onCurrencyChange(oEvent: Select$ChangeEvent) {
    const newCurrency = oEvent.getParameter("selectedItem")?.getKey();
    this.cryptoModel.changeSelectedCurrency(newCurrency as string);
    this.cryptoModel.getTopMarketCap();
  }

  onSearch(oEvenet: SearchField$SearchEvent) {
    const query = oEvenet.getParameters().query;
  }

  onSuggest(oEvenet: SearchField$SuggestEvent) {
    const sQuery = oEvenet.getParameter("suggestValue");
    const searchfield = oEvenet.getSource();
    const binding = searchfield.getBinding("suggestionItems");
    if (!binding) {
      return;
    }
    if (!sQuery) {
      (binding as JSONListBinding).filter([]);
    }

    const filter = new Filter({
      filters: [
        new Filter("name", FilterOperator.Contains, sQuery),
        new Filter("symbol", FilterOperator.Contains, sQuery),
      ],
    });
    (binding as JSONListBinding).filter([filter]);
    searchfield.suggest();
  }

  onExit(): void | undefined {
    this.oResizeObserver.disconnect();
  }
}
