import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";

export default class BaseController extends Controller {
    public getTypedModel<T>(sName: string): T {
        return this.getView()?.getModel(sName) as  T
    }
}