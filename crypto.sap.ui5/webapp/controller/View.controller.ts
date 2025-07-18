import {
  SearchField$SearchEvent,
  SearchField$SuggestEvent,
} from "sap/m/SearchField";
import { Select$ChangeEvent } from "sap/m/Select";
import Filter from "sap/ui/model/Filter";
import JSONListBinding from "sap/ui/model/json/JSONListBinding";

import FilterOperator from "sap/ui/model/FilterOperator";
import CryptoModel from "../model/cryptoModel";
import Formatter from "../utils/Formatter";
import BaseController from "./BaseController.controller";
import { Button$ClickEvent } from "sap/ui/webc/main/Button";
import NavContainer from "sap/m/NavContainer";

interface RowClickHandler {
  domRef: HTMLElement;
  handler: (e: Event) => void;
}

/**
 * @namespace sap.ui5.crypto.controller.View
 */
export default class View extends BaseController {
  private cryptoModel: CryptoModel;
  private oResizeObserver: ResizeObserver;
  formatter = Formatter;
  private rowClickHandlers: RowClickHandler[] = [];

  onBeforeRendering(): void {
    // Get the already initialized CryptoModel
    const view = this.getView();

    if (!view) {
      console.error("View is not initialized or is undefined");
      return;
    }

    const cryptoModel = this.getTypedModel<CryptoModel>("cryptoModel");
    if (!cryptoModel) {
      console.error("Crypto Model is not defined", cryptoModel);
      return;
    }
    this.cryptoModel = cryptoModel;
    // Load the available vs_currencies from the API
    this.cryptoModel.loadSupportedCurrencies();
  }

  public handlePageNav() {
    const navContainer = this.byId("routerTarget") as NavContainer;
    navContainer.back();
    const oRouter = this.getRouter();
    oRouter.navTo("RouteView", {}, true);
  }

  handleNav(e: Button$ClickEvent) {
    const targetText = e.getSource().getText();
    console.log(targetText);
    if (targetText === "Home") {
      this.getRouter().navTo("TopMarketCap");
    }
  }

  onCurrencyChange(oEvent: Select$ChangeEvent) {
    const newCurrency = oEvent.getParameter("selectedItem")?.getKey();
    this.cryptoModel.changeSelectedCurrency(newCurrency as string);
  }

  onLoadNextPage() {
    this.cryptoModel.loadNextTopMarketCap();
  }
  onLoadPreviousPage() {
    this.cryptoModel.loadPreviousTopMarketCap();
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

  private clearRowClickHandlers() {
    this.rowClickHandlers.forEach(({ domRef, handler }) => {
      domRef.removeEventListener("click", handler);
    });
    this.rowClickHandlers = [];
  }

  onExit(): void | undefined {
    this.oResizeObserver.disconnect();
    // this.stopPolling();
    this.clearRowClickHandlers();
  }
}
