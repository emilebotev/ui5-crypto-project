import NavContainer from "sap/m/NavContainer";
import Controller from "sap/ui/core/mvc/Controller";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";

interface CryptoDetailsRouterParams {
  cryptoId: string;
}

export default class CryptoDetail extends Controller {
  onInit() {
    const oRouter = UIComponent.getRouterFor(this);

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
    console.log("Selected crypto Id", sId);
  }
}
