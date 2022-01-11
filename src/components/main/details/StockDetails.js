import StockHeader from "./StockHeader";
import React, {useContext, useEffect, useState} from "react";
import {StockContext} from "../../context/StockContext";
import HistoryChart from "./HistoryChart";
import SpiderChart from "./SpiderChart";
import styles from './StockDetails.module.css';
import StockSummary from "./StockSummary";

function StockDetails(props) {
    const [stockContext] = useContext(StockContext);
    const [companyMetrics, setCompanyMetrics] = useState();
    const [sectorMetrics, setSectorMetrics] = useState();
    const [minMaxMetrics, setMinMaxMetrics] = useState();

    useEffect(() => {
        if (("sector" in stockContext) && props.metrics != null && props.minMaxMetrics != null) {
            setSectorMetrics(props.metrics[stockContext.sector].sector);
            setCompanyMetrics(props.metrics[stockContext.sector].companies[stockContext.ticker]);
            setMinMaxMetrics(props.minMaxMetrics[stockContext.sector]);
        }
    }, [stockContext, props.metrics, props.minMaxMetrics, setCompanyMetrics, setSectorMetrics, setMinMaxMetrics]);

    return (
        <div className={props.className}>
            <StockHeader stock={stockContext}></StockHeader>
            <HistoryChart stock={stockContext}></HistoryChart>
            <div className={styles.spider_chart_summary_grid}>
                <SpiderChart stock={stockContext} metrics={[sectorMetrics, companyMetrics]} minMaxMetrics={minMaxMetrics}></SpiderChart>
                <StockSummary stock={stockContext}></StockSummary>
            </div>
        </div>
    )
}

export default StockDetails;
