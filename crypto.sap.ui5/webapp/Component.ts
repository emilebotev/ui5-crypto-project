import BaseComponent from "sap/ui/core/UIComponent";
import { createCryptoModel, createDeviceModel } from "./model/models";

/**
 * @namespace sap.ui5.crypto.Component
 */
export default class Component extends BaseComponent {
  public static metadata = {
    manifest: "json",
    interfaces: ["sap.ui.core.IAsyncContentCreation"],
  };

  public init(): void {
    // call the base component's init function
    super.init();

    // set the device model
    this.setModel(createDeviceModel(), "device");

    // set the shared crypto model
    this.setModel( createCryptoModel(), "cryptoModel")

    // enable routing
    const rootControl = this.getRootControl();

    if (rootControl instanceof Promise) {
      rootControl.then(() => {
        this.getRouter().initialize();
      });
    } else {
      this.getRouter().initialize();
    }
  }
}
