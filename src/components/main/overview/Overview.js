import React from "react";
import Filter from "./Filter";
import MarketOverviewMap from "./MarketOverviewMap";
import StockTable from "./StockTable";
import {useEffect, useState} from "react";
import styles from "./Overview.module.css";
import {DataKind, fetchData} from "../../../scripts/data";

function Overview(props) {
    const [stockData, setStockData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const data = await fetchData(DataKind.ALL_STOCKS);
            setStockData(data);
            setFilteredData(data);
            setLoading(false);
        };
        getData().then();
    }, []);

    return (
        <div className={props.className}>
            <Filter initalStockData={stockData} setFilteredStockData={setFilteredData}></Filter>
            <MarketOverviewMap setLoading={setLoading} loading={loading} filteredStockData={filteredData} className={styles.market_overview_map_grid}></MarketOverviewMap>
            <StockTable loading={loading} filteredStockData={filteredData} className={styles.stock_table_grid}></StockTable>
        </div>
    )
}

export default Overview;
