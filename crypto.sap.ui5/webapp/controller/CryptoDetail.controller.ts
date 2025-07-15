import NavContainer from "sap/m/NavContainer";
import Controller from "sap/ui/core/mvc/Controller";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController.controller";

interface CryptoDetailsRouterParams {
  cryptoId: string;
}

export default class CryptoDetail extends BaseController {
  onInit() {
    const oRouter = this.getRouter();

    oRouter
      .getRoute("CryptoDetail")
      ?.attachPatternMatched(this.onObjectMatched, this);
  }

  private onObjectMatched(oEvent: Route$PatternMatchedEvent) {
    const args = oEvent.getParameter("arguments");
    if (!args) {
      return;
    }
    const sId = (args as CryptoDetailsRouterParams).cryptoId;
    if (!sId) {
      console.error("Id is not provided", sId);
    }
  }
}
