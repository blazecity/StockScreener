import Overview from "./overview/Overview";
import StockDetails from "./details/StockDetails";
import styles from "./MainBody.module.css";
import StockContext from "../context/StockContext";
import {useState} from "react";

function MainBody(props) {
    const [selectedStock, setSelectedStock] = useState({});

    return (
        <main>
            <StockContext.Provider value={[selectedStock, setSelectedStock]}>
                <Overview className={styles.overview_grid}></Overview>
                <StockDetails className={styles.stock_details_grid} metrics={props.metrics} minMaxMetrics={props.minMaxMetrics}></StockDetails>
            </StockContext.Provider>
        </main>
    )


}

export default MainBody;
