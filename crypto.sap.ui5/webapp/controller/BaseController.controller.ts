import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";

export default class BaseController extends Controller {
    public getTypedModel<T>(sName: string): T {
        return this.getView()?.getModel(sName) as  T
    }

    public getRouter() {
        return UIComponent.getRouterFor(this)
    }
}