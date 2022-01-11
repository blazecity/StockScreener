import styles from './StockHeader.module.css';
import {getPrettyNumber} from "../../../scripts/util";
import React from "react";

function StockHeader(props) {
    return (
        <div className={styles.stock_header_container}>
            {(props.stock == null || !("ticker" in props.stock)) ? <span className={styles.stock_name}>Please select a stock.</span> :
                <React.Fragment>
                    <div className={styles.flex}>
                        <span className={styles.stock_name}>{props.stock.name}</span>
                        <span className={styles.span}>{props.stock.currency}</span>
                        <span className={styles.span}>{getPrettyNumber(props.stock.price)}</span>
                        <span
                            className={`${styles.span} ${props.stock.change < 0 && styles.red}`}>{getPrettyNumber(props.stock.change, "percent")}</span>
                    </div>
                </React.Fragment>}
        </div>
    );
}

export default StockHeader;
