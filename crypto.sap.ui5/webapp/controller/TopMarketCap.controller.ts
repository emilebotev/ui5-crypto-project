import {
  SearchField$SearchEvent,
  SearchField$SuggestEvent,
} from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import JSONListBinding from "sap/ui/model/json/JSONListBinding";

import FilterOperator from "sap/ui/model/FilterOperator";
import CryptoModel from "../model/cryptoModel";
import Formatter from "../utils/Formatter";
import Table from "sap/ui/table/Table";
import BaseController from "./BaseController.controller";

interface RowClickHandler {
  domRef: HTMLElement;
  handler: (e: Event) => void;
}

/**
 * @namespace sap.ui5.crypto.controller.TopMarketCap
 */
export default class TopMarketCap extends BaseController {
  private cryptoModel: CryptoModel;
  private oResizeObserver: ResizeObserver;
  formatter = Formatter;
  private pollIntervalId: number | undefined;
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
    cryptoModel
      .bindProperty("/selectedCurrency")
      .attachChange(this.onCurrencyChange, this);

    // Load the top 20 cryptocurrencies from the API
    this.cryptoModel.getTopMarketCap();


    //Start polling if not already started
    this.startPolling();
  }

  onAfterRendering() {
    // Get reference to the Crypto table
    const oTable = this.byId("cryptoTable") as Table;

    if (!oTable) {
      console.error("Table was not found by id", oTable);
      return;
    }

    // Attach event for rows updated
    oTable.attachEvent("rowsUpdated", () => {
      const aRows = oTable.getRows();

      aRows.forEach((row) => {
        const rowDomRef = row.getDomRef() as HTMLElement | null;
        if (!rowDomRef) {
          console.error("Dom ref is not found", rowDomRef);
          return;
        }
        // Change the cursor, so the items would look clickable
        rowDomRef.style.cursor = "pointer";
        const oContext = row.getBindingContext("cryptoModel");
        const sId = oContext?.getProperty("symbol");

        const handler = () => this.handleRowClick(sId);

        // Attach click event listener to each row

        rowDomRef.addEventListener("click", handler);

        // Save reference to each and every domref and its click handler to be able to remove onExit
        this.rowClickHandlers.push({
          domRef: rowDomRef as HTMLElement,
          handler,
        });
      });
    });
  }

  private handleRowClick(cryptoId: string) {
    const oRouter = this.getRouter();
    oRouter.navTo("CryptoDetail", { cryptoId });
  }

  private startPolling() {
    if (this.pollIntervalId) {
      return;
    }

    this.pollIntervalId = window.setInterval(() => {
      this.cryptoModel.getTopMarketCap();
    }, 60 * 1000);
    console.info("Started polling getTopMarketCap every 60s");
  }

  private stopPolling(): void {
    if (this.pollIntervalId) {
      window.clearInterval(this.pollIntervalId);
      this.pollIntervalId = undefined;
      console.info("Stopped polling getTopMarketCap");
    }
  }

  onCurrencyChange() {
    this.cryptoModel.getTopMarketCap();
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
    this.stopPolling();
    this.clearRowClickHandlers();
  }
}
