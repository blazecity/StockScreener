import styles from "./SpiderChart.module.css";
import React, {useEffect, useState} from "react";
import {drawSpiderChart} from "../../../scripts/visualization";
import LoadingSymbol from "../LoadingSymbol";

function SpiderChart(props) {
    const newDimensions = () => {
        const spiderChart = document.getElementById("spider_chart");
        const legend = document.getElementById("spider_chart_legend");
        const dimensions = [spiderChart.clientHeight, spiderChart.clientWidth, legend.clientHeight, legend.clientWidth];
        return dimensions;
    };

    const [dimensions, setDimensions] = useState(() => {
        const spiderChart = document.getElementById("spider_chart");
        const legend = document.getElementById("spider_chart_legend");
        if (spiderChart == null || legend == null) {
            return 0;
        }
        return newDimensions();
    });

    const [spiderChartLoading, setSpiderChartLoading] = useState(true);

    useEffect(() => {
        if (props.metrics == null || props.metrics.length === 0) {
            return;
        }

        if (props.minMaxMetrics == null) {
            return;
        }

        if (dimensions === 0) {
            setDimensions(newDimensions());

            window.addEventListener("resize", () => {
                setDimensions(newDimensions());
            });
        }

        if (props.stock != null) {
            if (("ticker" in props.stock)) {
                drawSpiderChart(props.metrics,
                    props.stock.ticker,
                    props.stock.sector,
                    props.minMaxMetrics,
                    "#spider_chart",
                    "#spider_chart_legend",
                    dimensions[0],
                    dimensions[1],
                    dimensions[2],
                    dimensions[3],
                    setSpiderChartLoading
                );
            }
        }
    }, [props.stock, props.metrics, props.minMaxMetrics, dimensions]);

    return (
        <div className={styles.spider_chart_container}>
            <LoadingSymbol loading={spiderChartLoading}></LoadingSymbol>
            <div id="spider_chart" className={styles.spider_chart}></div>
            <div id="spider_chart_legend" className={styles.spider_chart_legend}></div>
        </div>
    )
};

export default SpiderChart;
