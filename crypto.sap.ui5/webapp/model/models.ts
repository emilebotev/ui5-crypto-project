import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";
import CryptoModel from "./cryptoModel";

export function createDeviceModel() {
  const model = new JSONModel(Device);
  model.setDefaultBindingMode("OneWay");
  return model;
}

export function createCryptoModel() {
  const cryptoModel = new CryptoModel();
  cryptoModel.setDefaultBindingMode("OneWay")
  return cryptoModel;
}
