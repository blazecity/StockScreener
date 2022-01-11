import styles from './StockTable.module.css';
import {getPrettyNumber, sortData} from "../../../scripts/util";
import {useState, useEffect, useContext} from "react";
import {StockContext} from "../../context/StockContext";
import {drawMinMaxCurrentBar} from "../../../scripts/visualization";
import LoadingSymbol from "../LoadingSymbol";

function StockTable(props) {
    let filteredData = props.filteredStockData;
    const [stockDataElements, setStockDataElements] = useState([]);
    const [selectedStock, setSelectedStock] = useContext(StockContext);
    const [width, setWidth] = useState(() => {
        const col = document.getElementById("fiftyTwoWeekComparison");
        if (col == null) {
            return 0;
        }
        return col.clientWidth;
    });
    const [sortedColumn, setSortedColumn] = useState({
        column: "",
        direction: "",
        htmlElement: null
    });

    useEffect(() => {
        if (filteredData == null) {
            return;
        }

        if (selectedStock == null || !("ticker" in selectedStock)) {
            if (filteredData[0] != null) {
                setSelectedStock(filteredData[0]);
            }
        }

        setStockDataElements(createStockTableElements(filteredData));

        // eslint-disable-next-line
    }, [filteredData, setSelectedStock, sortedColumn]);

    useEffect(() => {
        if (width === 0) {
            const col = document.getElementById("fiftyTwoWeekComparison");
            setWidth(col.clientWidth);
        }
        drawMinMaxCurrentBar(width);
    }, [stockDataElements, width]);

    const createStockTableElements = (data) => {
        let sortedData = data;
        if (sortedColumn.column !== "") {
            sortedData = sortData(data, sortedColumn.column, sortedColumn.direction);
        }

        let listItems = sortedData.map((element, index) => {
        const onClickHandler = () => {
            setSelectedStock(element);
        };

        return (
                <tr onClick={onClickHandler} className={styles.table_row} key={index}>
                    <td>{element.name}</td>
                    <td>{element.country}</td>
                    <td>{element.sector}</td>
                    <td>{element.currency}</td>
                    <td className={styles.col_number}>{getPrettyNumber(element.price).toLocaleString("de-ch")}</td>
                    <td className="col_fiftyTwoWeekComp" price={element.price} high={element.fiftyTwoWeekHigh} low={element.fiftyTwoWeekLow}></td>
                    <td className={`${styles.col_number} ${element.change < 0 && styles.red}`}>{getPrettyNumber(element.change, "percent")}</td>
                    <td>{element.sizeCategory}</td>
                </tr>
            )
        });

        return listItems;
    }

    const mapTableHeaders = (attribute) => {
        switch (attribute) {
            case "name":
                return "Company";

            case "country":
                return "Country";

            case "sector":
                return "Sector";

            case "currency":
                return "Currency";

            case "price":
                return "Price";

            case "change":
                return "Change";

            case "sizeCategory":
                return "Market cap";

            default:
                return "";
        }
    };



    const onTableHeaderClick = (event) => {
        const getAttribute = (htmlElement) => {
            return htmlElement.getAttribute("attribute");
        };

        const resetName = (htmlElement) => {
            if (htmlElement == null) return;
            htmlElement.innerText = mapTableHeaders(getAttribute(htmlElement));
        };

        const attribute = getAttribute(event.target);
        setSortedColumn(prevState => {
            const newDirection = prevState.direction === "" || prevState.direction === "descending" ? "ascending" : "descending";
            const headerName = mapTableHeaders(attribute);
            resetName(prevState.htmlElement);
            if (newDirection === "ascending") {
                event.target.innerText = `${headerName} \u{1F815}`;
            } else if (newDirection === "descending") {
                event.target.innerText = `${headerName} \u{1F817}`;
            }

            return {
                column: attribute,
                direction: prevState.direction === "" || prevState.direction === "descending" ? "ascending" : "descending",
                htmlElement: event.target
            };
        });
    }

    return (
        <StockContext.Provider value={selectedStock}>
            <div className={`${props.className} ${styles.stock_table} ${props.loading ? styles.loading : ""}`}>
                <table className="sortable">
                    {props.loading ? "" : (
                        <thead>
                        <tr>
                            <th onClick={onTableHeaderClick} attribute="name" className={styles.w20}>Company</th>
                            <th onClick={onTableHeaderClick} attribute="country" className={styles.w12}>Country</th>
                            <th onClick={onTableHeaderClick} attribute="sector" className={styles.w15}>Sector</th>
                            <th onClick={onTableHeaderClick} attribute="currency" className={styles.w10}>Currency</th>
                            <th onClick={onTableHeaderClick} attribute="price" className={[styles.col_number, styles.w8].join(" ")}>Price</th>
                            <th className={styles.w15} id="fiftyTwoWeekComparison">52 week comparison</th>
                            <th onClick={onTableHeaderClick} attribute="change" className={[styles.col_number, styles.w8].join(" ")}>Change</th>
                            <th onClick={onTableHeaderClick} attribute="sizeCategory" className={styles.w12}>Market cap</th>
                        </tr>
                        </thead>
                    )}
                    <tbody>
                    {stockDataElements.length !== 0 && stockDataElements}
                    </tbody>
                </table>
                <LoadingSymbol loading={props.loading}></LoadingSymbol>
                {(stockDataElements.length === 0 && !props.loading) && <span className={styles.no_data}>No data found.</span>}
            </div>
        </StockContext.Provider>
    )
}

export default StockTable;
