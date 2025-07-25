import JSONModel from "sap/ui/model/json/JSONModel";
import CryptoModel from "./cryptoModel";
import { CryptoDetailModelPropsDictionary } from "../types/Dictionaries";

export default class CryptoDetailModel extends JSONModel {
  constructor(private cryptoModel: CryptoModel) {
    super({ cryptoDetail: {}, selectedDays: 1, priceAxisRange: {} });
  }

  getCoinHistoryById(id: string) {
    const dataRequest = this.cryptoModel.fetchCoinHistoryById(
      id,
      this.getProperty(CryptoDetailModelPropsDictionary.selectedDays)
    );
    if (!dataRequest) {
      console.error("Request for coinHistoryById not succesfull");
      return;
    }

    dataRequest
      .then((data) => {
        if (!data) {
          console.error("Data is not available ", data);
          return;
        }
        const { prices, market_caps, total_volumes } = data;
        const processedData = prices.map((priceEntry, index) => {
          const [timeStampRaw, price] = priceEntry;
          const date = new Date(timeStampRaw);
          return {
            date,
            price,
            marketCap: parseFloat(market_caps[index][1].toFixed(2)),
            volume: parseFloat(total_volumes[index][1].toFixed(2)),
          };
        });
        this.setProperty(
          CryptoDetailModelPropsDictionary.cryptoDetail,
          processedData
        );
        const pricesOnly = processedData.map((entry) => entry.price);
        const minPrice = Math.min(...pricesOnly);
        const maxPrice = Math.max(...pricesOnly);

        // Add 15% padding to both ends for visual clarity
        const padding = (maxPrice - minPrice) * 0.15;
        const paddedMin = Math.floor(minPrice - padding);
        const paddedMax = Math.ceil(maxPrice + padding);

        // Store for controller access
        this.setProperty(CryptoDetailModelPropsDictionary.priceAxisRange, {
          min: paddedMin,
          max: paddedMax,
        });
      })
      .catch(console.error);
  }

  changeSelectedDays(days: string) {
    this.setProperty(CryptoDetailModelPropsDictionary.selectedDays, days);
  }
}
