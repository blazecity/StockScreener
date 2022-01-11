import styles from "./HistoryChart.module.css";
import {drawLineChart} from "../../../scripts/visualization";
import {useEffect, useRef, useState} from "react";
import {DataKind, fetchData} from "../../../scripts/data";
import LoadingSymbol from "../LoadingSymbol";

function HistoryChart(props) {
    const newDimensions = () => {
        const element = document.getElementById("linechart_container");
        return [element.clientHeight, element.clientWidth];
    };

    const periods = ["1m", "3m", "6m", "YTD", "1y", "5y", "Max"];

    const toDateInput = useRef();
    const fromDateInput = useRef();

    const [loading, setLoading] = useState(false);
    const [stockHistory, setStockHistory] = useState({});
    const [dimensions, setDimensions] = useState(() => {
        const element = document.getElementById("linechart_container");
        if (element == null) {
            return 0;
        }
        return newDimensions();
    });

    useEffect(() => {
        setLoading(true);
        fetchData(DataKind.HISTORY, props.stock.ticker).then(data => setStockHistory(data)).then(() => setLoading(false));
    }, [props.stock])

    const getFromToDate = () => {
        const fromDate = new Date(fromDateInput.current.value);
        const toDate = new Date(toDateInput.current.value);
        return [fromDate, toDate];
    };

    const dateChangeHandler = () => {
        const [selectedFromDate, selectedToDate] = getFromToDate();
        filterAndDraw(selectedFromDate, selectedToDate);
    };

    const getDatePickerFormat = (date) => {
        return date.toISOString().substr(0, 10);
    };

    const getMinElement = () => {
        const minElement = stockHistory.data.reduce((previous, current) => {
            const previousDate = new Date(previous.Date);
            const currentDate = new Date(current.Date);
            return previousDate < currentDate ? previous : current;
        });
        return minElement;
    };

    const filterAndDraw = (from, to) => {
        if (from == null) {
            drawLineChart(stockHistory.data, dimensions[1], dimensions[0], brushHandler);
            const minElement = getMinElement();
            const minDate = new Date(minElement.Date);
            fromDateInput.current.value = getDatePickerFormat(minDate);
            toDateInput.current.value = getDatePickerFormat(to);
            return;
        }
        const filteredData = stockHistory.data.filter(element => {
            const date = new Date(element.Date);
            return date >= from && date <= to;
        });
        fromDateInput.current.value = getDatePickerFormat(from);
        toDateInput.current.value = getDatePickerFormat(to);
        drawLineChart(filteredData, dimensions[1], dimensions[0], brushHandler);
    };

    const onClickHandler = (event) => {
        const today = new Date();
        switch (event.target.innerText.toLowerCase()) {
            case "1d":
                filterAndDraw(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), new Date(2021, 10, 30));
                break;

            case "1m":
                filterAndDraw(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()), new Date());
                break;

            case "3m":
                filterAndDraw(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()), new Date());
                break;

            case "6m":
                filterAndDraw(new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()), new Date());
                break;

            case "ytd":
                filterAndDraw(new Date(today.getFullYear(), 0, 0), new Date());
                break;

            case "1y":
                filterAndDraw(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()), new Date());
                break;

            case "5y":
                filterAndDraw(new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()), new Date());
                break;

            case "max":
                filterAndDraw(null, new Date());
                break;

            default:
                console.log("default");
        }
    };

    const getDefaultDate = () => {
        return getDatePickerFormat(new Date());
    };

    const brushHandler = (from, to) => {
        const newFromDate = from.toISOString().substr(0, 10);
        const newToDate = to.toISOString().substr(0, 10)
        fromDateInput.current.value = newFromDate;
        toDateInput.current.value = newToDate;
    };

    useEffect(() => {
        if (dimensions === 0) {
            setDimensions(newDimensions());
            window.addEventListener("resize", () => {
                setDimensions(newDimensions());
            });
        }
        if (("data" in stockHistory)) {
            filterAndDraw(null, new Date());
        }
        // eslint-disable-next-line
    }, [stockHistory, dimensions]);

    return (
        <div className={`${styles.linechart}`}>
            <div className={styles.controls}>
                <div className={styles.buttons}>
                    {periods.map(element => <button key={element} onClick={onClickHandler} className={`${styles.general_control} ${styles.button}`}>{element}</button>)}
                </div>
                <div className={styles.date_pickers}>
                    <input ref={fromDateInput} defaultValue={getDefaultDate()} onChange={dateChangeHandler} className={`${styles.general_control} ${styles.date_picker}`} type="date"></input>
                    <input ref={toDateInput} defaultValue={getDefaultDate()} onChange={dateChangeHandler} className={`${styles.general_control} ${styles.date_picker}`} type="date"></input>
                </div>
            </div>
            <div id="linechart_container" className={styles.chart_container}>
                <LoadingSymbol loading={loading}></LoadingSymbol>
            </div>
        </div>

    );
}

export default HistoryChart;
