import Controller from "sap/ui/core/mvc/Controller";

export default class BaseController extends Controller {
    public getTypedModel<T>(sName: string): T {
        return this.getView()?.getModel(sName) as  T
    }
}