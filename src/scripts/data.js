export class MinMaxMetrics {

    constructor() {
        this.cashflow_margin = [0, 0];
        this.equity_ratio = [0, 0];
        this.ebitda_margin = [0, 0];
        this.dividend_yield = [0, 0];
        this.trailing_pe = [0, 0];
        this.trailing_eps = [0, 0];
        this.return_on_equity = [0, 0];
    }
}


/**
 * Defines the different kinds of data that chan be retrived.
 */
export const DataKind = {
    INDIZES: "indizes",
    ALL_STOCKS: "all_stocks",
    SINGLE_STOCK: "single_stock",
    HISTORY: "history",
    METRICS: "metrics"
}

/**
 * This function fetches the data for the dashboard.
 * 
 * INDIZES: 
 * {
 *      "united states": {
 *          "name": "S&P 500", 
 *          "currency": "USD", 
 *          "price": 4675.02, 
 *          "change": -0.003090895867825294
 *      },
 *      "switzerland": {
 *          "name": "SMI PR", 
 *          "currency": "CHF", 
 *         "price": 12403.05, 
 *          "change": -0.0015947690285855742
 *      }
 * }
 * 
 * ALL_STOCKS:
 * [
 *      {
 *          "52WeekChange": 0.49581265,
 *          "change": -0.007252407561526564,
 *          "city": "Redmond",
 *          "country": "United States",
 *          "currency": "USD",
 *          "name": "Microsoft Corporation",
 *          "price": 336.44,
 *          "sector": "Technology"
 *      },
 *      {
 *          "52WeekChange": 0.5484824,
 *          "change": 0.009278711484593805,
 *          "city": "San José",
 *          "country": "United States",
 *          "currency": "USD",
 *          "name": "Cisco Systems, Inc.",
 *          "price": 57.12,
 *          "sector": "Technology"
 *      }
 * ]
 * 
 * SINGLE_STOCK:
 * General info
 * 
 * HISTORY: 
 * Stock history
 *
 * METRICS:
 *
 * 
 * @param {*} dataObject DataKind property
 * @param {*} ticker Ticker symbol for single data (e. g.single stock)
 * @returns Data as object
 */
export async function fetchData(dataObject, ticker = "") {
    try {
        let data;
        switch (dataObject) {
            case DataKind.INDIZES:
                data = await fetch(``);
                break;

            case DataKind.ALL_STOCKS:
                data = await fetch(``);
                break;

            case DataKind.SINGLE_STOCK:
                data = await fetch(``);
                break;

            case DataKind.HISTORY:
                data = await fetch(``);
                break;

            case DataKind.METRICS:
                data = await fetch(``);
                break;

            default:
                throw new Error("Invalid data kind passed to function.");
        }

        const jsonData = await data.json();
        console.log("loader false");
        return jsonData;

    } catch (err) {
        return err;
    }
}
