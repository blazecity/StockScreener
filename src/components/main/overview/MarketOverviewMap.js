import {useContext, useEffect} from 'react';
import { drawMap } from '../../../scripts/visualization';
import styles from './MarketOverviewMap.module.css';
import StockContext from "../../context/StockContext";
import LoadingSymbol from '../LoadingSymbol';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function MarketOverviewMap(props) {
    let filteredData = props.filteredStockData;
    const [, setSelectedStock] = useContext(StockContext);

    useEffect(() => {
        if (filteredData == null) {
            return;
        }
        const companyClickHandler = (event, d) => {
            setSelectedStock(d);
        };
        drawMap("#map_container", filteredData, companyClickHandler, props.setLoading);
    }, [filteredData, setSelectedStock, props.setLoading]);

    return (
        <div className={`${[props.className, styles.outer_container].join(" ")}`}>
            <LoadingSymbol loading={props.loading}></LoadingSymbol>
            <div id="map_container" className={styles.map_container}></div>
            <div id="legend_container" className={styles.legend_container}></div>
        </div>
    )
}

export default MarketOverviewMap;
