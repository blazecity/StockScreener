let imageArchitecture = require("./img/davi_architecture.png");

function Documentation() {
    return (
        <div className="general_container">
            <h1 className="general_title">Documentation</h1>
            <h2>Dataset and ETL Process</h2>
            <p>
                Data is retrieved from Yahoo Finance via the <a href="https://github.com/ranaroussi/yfinance">yFinance Python module</a>.
                Every night a timer function (hosted on Azure) extracts and transforms the data as needed. Then the 
                data is loaded into JSON files which are stored on Azure File Storage. Finally the files are accessed 
                via self-implemented Azure Functions (HTTP endpoint).
            </p>
            <br/>
            <img src={imageArchitecture.default} alt="Architecture diagram"/>
            <h2>Attributes</h2>
            <h3>World map and table</h3>
            <p>
                The countries are colored based on the underlying index performance. We use the following attributes:
                <ul>
                    <li><code>country</code>: country name</li>
                    <li><code>shortName</code>: index name</li>
                    <li><code>currency</code>: ISO symbol</li>
                    <li><code>regularMarketPrice</code>: current index price</li>
                    <li><code>regularMarketPricePreviousClose</code>: This is the closing price of the most recent trading day.
                        With this we calculate the price change in percent.</li>
                </ul>
            </p>
            <br/>
            <p>
                To place the single companies on the map, we need the coordinates of their head quarter's location.
                We pass the <code>city</code> attribute to the <code>geopy</code> Python module, which then returns
                the coordinates.
            </p>
            <br/>

            <h3>Line chart</h3>
            <p>
                The line chart is generated with the data of the <code>Close</code> attribute, which gives us the price
                on which the stock closed on the corresponding trading day.
            </p>
            <br/>

            <h3>Spider chart</h3>
            <p>
                At last for the spider chart we calculate some of the metrics by ourselves with the help of the
                following attribtues:
            </p>
            <br/>
            <strong>Operating Cashflow</strong>
            <p>
                Cashflow in relation to the revenue. It describes how much of the revenue is left for investments,
                depreciation and financing activities as well as dividends.
            </p>
            <p>
                <ul>
                    <li><code>Total Cash from Operating Activities</code></li>
                    <li><code>Total Revenue</code></li>
                </ul>
            </p>
            <br/>
            <strong>Equity Ratio</strong>
            <p>
                Equity capital in relation to the the balance sum. The balance consists of assets and liabilities.
                Therefore the balance sum is equal to the total assets and the total liabilities as well.
                This is an important metric for evaluating the capital structure.
            </p>
            <p>
                <ul>
                    <li><code>Total Assets</code></li>
                    <li><code>Total Liabilities</code></li>
                </ul>
            </p>
            <br/>
            <strong>Dividend Yield</strong>
            <p>
                Dividend in relation to the stock price.
            </p>
            <p>Directly taken from the <code>dividendYield</code> attribute.</p>
            <br/>
            <strong>EBITDA Margin</strong>
            <p>
                EBITDA stands for Earnings before Interests, Taxes, Depreciation and Amortization. The EBITDA in relation
                to the revenue returns the EBITDA margin. It tells us how profitable a companies operating business is.
            </p>
            <p>Directly taken from the <code>ebitdaMargins</code> attribute.</p>
            <br/>
            <strong>Trailing P/E (price/earnings) Ratio</strong>
            <p>
                The stock price is set in relation to the earnings per share. The ratio provides an overview of whether
                a company is overvalued or undervalued.
            </p>
            <p>Directly taken from the <code>trailingPE</code> attribute.</p>
            <br/>
            <strong>Trailing EPS (earnings per share)</strong>
            <p>
                This metric is useful for comparison. The profit or loss is divided by the total number of shares.
            </p>
            <p>Directly taken from the <code>trailingEps</code> attribute.</p>
            <br/>
            <strong>Return on Equity</strong>
            <p>
                Return on Equity or RoE basically measures the "interest" on a share holders investment. To calculate
                this metric you set the profit (or loss) or the EBIT in relation to the equity capital.
            </p>
            <p>Directly taken from the <code>returnOnEquity</code> attribute.</p>
        </div>
    );
}

export default Documentation;
