import styles from "./StockSummary.module.css";
import React, {useEffect, useState} from "react";
import {DataKind, fetchData} from "../../../scripts/data";
import LoadingSymbol from "../LoadingSymbol";

function StockSummary(props) {
    const [stockInfo, setStockInfo] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [noSummaryAvailable, setNoSummaryAvailable] = useState(true);

    useEffect(() => {
        setSummaryLoading(true);
        fetchData(DataKind.SINGLE_STOCK, props.stock.ticker)
            .then(data => {
                setStockInfo(data.longBusinessSummary);
                return data.longBusinessSummary;
            })
            .then((summary) => {
                if (summary == null) {
                    setNoSummaryAvailable(true);
                }
                else {
                    setNoSummaryAvailable(false);
                }
                setSummaryLoading(false);
        });
    }, [props.stock]);

    return (
        <div className={[styles.summary, summaryLoading ? styles.loading : ""].join(" ")}>
            <LoadingSymbol loading={summaryLoading}></LoadingSymbol>
            {(noSummaryAvailable && !summaryLoading) ? <span className={styles.no_summary}>No summary available</span> : (
                <div>
                    <span>{stockInfo}</span>
                </div>
            )}
        </div>
    );
};

export default StockSummary;