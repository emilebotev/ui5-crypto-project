import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";
import CryptoModel from "./cryptoModel";
import TopMarketCapModel from "./topMarketCapModel";
import CryptoDetailModel from "./cryptoDetailModel";

export function createDeviceModel() {
  const model = new JSONModel(Device);
  model.setDefaultBindingMode("OneWay");
  return model;
}

export function createCryptoModel() {
  const cryptoModel = new CryptoModel();
  cryptoModel.setDefaultBindingMode("OneWay");
  return cryptoModel;
}

export function createTopMarketCapModel(cryptoModel: CryptoModel) {
  const topMarketCapModel = new TopMarketCapModel(cryptoModel);
  topMarketCapModel.setDefaultBindingMode("OneWay");
  return topMarketCapModel;
}

export function createCryptoDetailModel(cryptoModel: CryptoModel) {
  const cryptoDetailModel = new CryptoDetailModel(cryptoModel);
  cryptoDetailModel.setDefaultBindingMode("OneWay");
  return cryptoDetailModel;
}
