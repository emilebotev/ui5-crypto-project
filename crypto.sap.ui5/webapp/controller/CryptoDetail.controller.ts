import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController.controller";
import CryptoModel from "../model/cryptoModel";
import { SegmentedButton$SelectionChangeEvent } from "sap/m/SegmentedButton";
import {
  CryptoDetailModelPropsDictionary,
  CryptoModelPropsDictionary,
  ModelNamesDictionary,
} from "../types/Dictionaries";
import VizFrame from "sap/viz/ui5/controls/VizFrame";
import { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import CryptoDetailModel from "../model/cryptoDetailModel";
import { createCryptoDetailModel } from "../model/models";

interface CryptoDetailsRouterParams {
  cryptoId: string;
}

interface PriceAxisRange {
  min: number;
  max: number;
}

export default class CryptoDetail extends BaseController {
  private detailCryptoId: string;
  private selectedCurrency: string;
  private cryptoDetailModel: CryptoDetailModel;
  private readonly routeName = "CryptoDetail";
  private lastRange: PriceAxisRange | undefined;

  onInit(): void | undefined {
    const cryptoModel = this.getOwnerComponent()?.getModel(
      ModelNamesDictionary.cryptoModel
    );
    if (!cryptoModel) {
      console.error("Crypto Model is not defined", cryptoModel);
      return;
    }
    this.cryptoDetailModel = createCryptoDetailModel(
      cryptoModel as CryptoModel
    );
    this.getView()?.setModel(
      this.cryptoDetailModel,
      ModelNamesDictionary.cryptoDetail
    );

    const selectedCurrency = cryptoModel.getProperty(
      CryptoModelPropsDictionary.selectedCurrency
    );

    this.selectedCurrency = selectedCurrency;

    cryptoModel
      .bindProperty(CryptoModelPropsDictionary.selectedCurrency)
      .attachChange(this.onCurrencyChange, this);
  }

  onBeforeRendering() {
    const oRouter = this.getRouter();

    const cryptoDetailRoute = oRouter.getRoute("CryptoDetail");

    if (!cryptoDetailRoute) {
      console.error(
        "Something went wrong with CryptoDetail route",
        cryptoDetailRoute
      );
      return;
    }

    cryptoDetailRoute.attachPatternMatched(this.onObjectMatched, this);
    oRouter.attachRouteMatched(this.onAnyRouteMatched);
  }

  onAfterRendering(): void | undefined {
    this.setPriceAxisRange();
  }

  private setVizFrameProps(selectedCurrency: string, name?: string) {
    const cryptoVizFrame = this.byId("cryptoDetailVizFrame");
    if (!cryptoVizFrame) {
      console.error("CryptoVizFrame not found", cryptoVizFrame);
      return;
    }
    (cryptoVizFrame as VizFrame).setVizProperties({
      title: {
        visible: true,
        text: `${
          name?.toUpperCase() ?? ""
        } Price (${selectedCurrency.toUpperCase()})`,
      },
      valueAxis: {
        title: {
          visible: true,
          text: `Price (${selectedCurrency.toUpperCase()})`,
        },
      },
    });
  }
  //TODO Determine type for this event. Note: Model$PropertyChange or sap.ui.Base.Event doesn't work.
  private onCurrencyChange(e: any) {
    const newlySelectedCurrency: string = e
      .getSource()
      .getModel()
      .getProperty(CryptoModelPropsDictionary.selectedCurrency);
    this.cryptoDetailModel.getCoinHistoryById(this.detailCryptoId);
    this.setVizFrameProps(newlySelectedCurrency, this.detailCryptoId);
  }

  private onAnyRouteMatched(oEvent: Router$RouteMatchedEvent) {
    if (!this.cryptoDetailModel) {
      return;
    }
    const routeName = oEvent.getParameter("name");
    if (routeName !== this.routeName) {
      this.cryptoDetailModel.setProperty(
        CryptoDetailModelPropsDictionary.priceAxisRange,
        undefined
      );
    }
  }

  private onObjectMatched(oEvent: Route$PatternMatchedEvent) {
    const args = oEvent.getParameter("arguments");
    if (!args) {
      return;
    }
    const sId = (args as CryptoDetailsRouterParams).cryptoId;
    if (!sId) {
      console.error("Id is not provided", sId);
      return;
    }
    this.detailCryptoId = sId;
    this.cryptoDetailModel.getCoinHistoryById(sId);
    this.setPriceAxisRange();
    this.setVizFrameProps(this.selectedCurrency, sId);
  }

  onRenderComplete() {
    this.setPriceAxisRange();
  }

  private setPriceAxisRange() {
    const range: PriceAxisRange | undefined =
      this.cryptoDetailModel.getProperty(
        CryptoDetailModelPropsDictionary.priceAxisRange
      );
    if (!range) {
      console.error("Range not available", range);
      return;
    }

    if (
      this.lastRange &&
      this.lastRange.max === range.max &&
      this.lastRange.min === range.min
    ) {
      return;
    }
    const cryptoVizFrame = this.byId("cryptoDetailVizFrame");
    if (!cryptoVizFrame) {
      console.error("CryptoVizFrame not found", cryptoVizFrame);
      return;
    }

    this.lastRange = range;

    (cryptoVizFrame as VizFrame).setVizProperties({
      // Maximum zoom out always, to avoid horizontal scroll
      plotArea: {
        window: {
          start: null,
          end: null,
        },
      },
      valueAxis: {
        // Applying the range ( with 15% padding ) to the price range axis for better visibility of price action
        scale: {
          fixedRange: true,
          minValue: range.min,
          maxValue: range.max,
        },
      },
    });
  }
  onSelectedDaysChange(oEvent: SegmentedButton$SelectionChangeEvent) {
    const selectedItem = oEvent.getParameter("item");
    if (!selectedItem) {
      console.error("Selected item is not valid", selectedItem);
      return;
    }

    const newDays = selectedItem.getKey();
    this.cryptoDetailModel.changeSelectedDays(newDays);
    this.cryptoDetailModel.getCoinHistoryById(this.detailCryptoId);
    this.setPriceAxisRange();
  }
}
