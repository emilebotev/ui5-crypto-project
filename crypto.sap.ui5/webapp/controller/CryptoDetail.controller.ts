import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController.controller";
import CryptoModel from "../model/cryptoModel";
import { SegmentedButton$SelectionChangeEvent } from "sap/m/SegmentedButton";

interface CryptoDetailsRouterParams {
  cryptoId: string;
}

export default class CryptoDetail extends BaseController {
  detailCryptoId: string;
  onInit() {
    const oRouter = this.getRouter();

    oRouter
      .getRoute("CryptoDetail")
      ?.attachPatternMatched(this.onObjectMatched, this);

    //TODO On nav back simulate onDestroy of component. E.g. clear state.
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
    console.log("onObjectMatchedFired");
    this.detailCryptoId = sId;
    const cryptoModel = this.getTypedModel<CryptoModel>("cryptoModel");
    this.getView()?.setModel(cryptoModel);
    cryptoModel.getCoinHistoryById(sId);
  }

  onSelectedDaysChange(oEvent: SegmentedButton$SelectionChangeEvent) {
    const selectedItem = oEvent.getParameter("item");
    if (!selectedItem) {
      console.error("Selected item is not valid", selectedItem);
      return;
    }
    const cryptoModel = this.getTypedModel<CryptoModel>("cryptoModel");

    const newDays = selectedItem.getKey();
    cryptoModel.changeSelectedDays(newDays);
    cryptoModel.getCoinHistoryById(this.detailCryptoId);
  }
}
