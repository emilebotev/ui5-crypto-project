import NumberFormat from "sap/ui/core/format/NumberFormat";

const currencyFormatter = NumberFormat.getCurrencyInstance({
  currencyCode: true,
  minIntegerDigits: 1,
  maxFractionDigits: 4,
});

const percentageFormatter = NumberFormat.getPercentInstance({
  decimals: 2,
  style: "standard",
});

const Formatter = {
  formatCurrency: function (value: number, currency = "USD") {
    if (typeof value !== "number") {
      return "";
    }
    return currencyFormatter.format(
      value,
      Formatter.formatCurrencySign(currency)
    );
  },

  formatPercentage: function (value: number) {
    if (typeof value !== "number") {
      return "";
    }
    const sign = value < 0 ? 0x25bc : 0x25b2;
    return (
      String.fromCharCode(sign) +
      " " +
      percentageFormatter.format(value / 100) +
      " "
    );
  },

  formatCurrencySign: function (currency: string) {
    return currency.toUpperCase();
  },
};

export default Formatter;
