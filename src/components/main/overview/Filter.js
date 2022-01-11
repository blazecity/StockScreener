import "../../../App.css";
import styles from "./Filter.module.css";
import {useEffect, useReducer, useState} from "react";
import Select from "react-select";
import {getOrdinalColorScale} from "../../../scripts/visualization";

const initialQuery = {
    name: "",
    sector: [],
    country: [],
    marketCapCategory: []
};

function queryReducer(state, action) {

    switch (action.type) {
        case "QUERY_NAME":
            return {name: action.value, sector: state.sector, country: state.country, marketCapCategory: state.marketCapCategory};

        case "QUERY_COUNTRY":
            return {name: state.name, sector: state.sector, country: action.value, marketCapCategory: state.marketCapCategory};

        case "QUERY_SECTOR":
            return {name: state.name, sector: action.value, country: state.country, marketCapCategory: state.marketCapCategory};

        case "QUERY_MARKET_CAP_CATEGORY":
            return {name: state.name, sector: state.sector, country: state.country, marketCapCategory: action.value};

        default:
            return state;
    }
}

function getDistinctValues(data, property, groupBy=null) {
    const mapping = {};
    const lookupCache = {};
    if (groupBy == null) {
        const distinctValues = [...new Set(data.map(element => element[property]))].sort();
        return distinctValues.map(element => {
            return {
                label: element,
                value: element.toLowerCase()
            }
        });
    }

    data.forEach(element => {
        const elementPropertyValue = element[property];
        if (elementPropertyValue in lookupCache) {
            return;
        }
        const groupedByValue = element[groupBy];

        if (groupedByValue in mapping) {
            mapping[groupedByValue].push(elementPropertyValue);
            lookupCache[elementPropertyValue] = 0;
            return;
        }

        mapping[groupedByValue] = [elementPropertyValue];
        lookupCache[elementPropertyValue] = 0;
    });

    const options = [];
    for (const [key, value] of Object.entries(mapping)) {
        options.push({
            label: key,
            options: value.map(element => {
                return {
                    label: element,
                    value: element.toLowerCase()
                };
            })
        });
    }

    return options;
}

function getSingleStyles(styleKey, domain = []) {
    let colorScale;
    if (domain.length !== 0) {
        colorScale = getOrdinalColorScale(domain.map(element => element.label));
    }
    const dot = (color = "transparent") => ({
        alignItems: 'center',
        display: 'flex',

        ':before': {
            backgroundColor: color,
            borderRadius: 10,
            content: '" "',
            display: 'block',
            marginRight: 8,
            height: 10,
            width: 10,
        },
    });

    switch (styleKey.toLowerCase()) {
        case "control":
        case "menu":
            return base => ({
                ...base,
                borderRadius: 0,
                border: "1px solid var(--general-theme-color)"
            });
        case "valuecontainer":
            return base => ({
                ...base,
                flexWrap: "no-wrap"
            });

        case "option":
            return (base, state) => {
                let styles = {
                    ...base,
                    backgroundColor: state.isSelected ? "var(--general-theme-color)" : "white",
                };
                if (domain.length !== 0) {
                    styles = {
                        ...styles,
                        ...dot(colorScale(state.label))
                    }
                }
                return styles;
            };

        default:
            return base => ({...base});
    }
}

function getAllStyles(domain) {
    return {
        control: getSingleStyles("control"),
        menu: getSingleStyles("menu"),
        valueContainer: getSingleStyles("valueContainer"),
        option: getSingleStyles("option", domain)
    };
}

function getSelectMenu(options, inputChangeHandler, domainOptions = false, placeholder="All") {
    let domain = [];
    if (domainOptions) domain = options;

    return (
        <Select
            styles={getAllStyles(domain)}
            options={options}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            placeholder={placeholder}
            onChange={inputChangeHandler}>
        </Select>
    )
}

function runQuery(data, query) {
    const enteredCompany = query.name.toLowerCase();
    const selectedCountries = query.country.map(element => element.value.toLowerCase());
    const selectedSectors = query.sector.map(element => element.value.toLowerCase());
    const selectedMarketCapCategories = query.marketCapCategory.map(element => element.value.toLowerCase());

    const result = data.filter(element => {
        let nameCheck = enteredCompany.trim().length === 0;
        if (!nameCheck) {
            nameCheck = element.name.toLowerCase().includes(enteredCompany);
            if (!nameCheck) {
                nameCheck = element.ticker.toLowerCase().includes(enteredCompany);
            }
        }
        const foundInCountries = selectedCountries.length === 0 || selectedCountries.findIndex(country => element.country.toLowerCase() === country) !== -1;
        const foundInSectors = selectedSectors.length === 0 || selectedSectors.findIndex(sector => element.sector.toLowerCase() === sector) !== -1;
        const foundInMarketCapCategories = selectedMarketCapCategories.length === 0 || selectedMarketCapCategories.findIndex(marketCapCategory => element.sizeCategory.toLowerCase() === marketCapCategory) !== -1;

        return nameCheck && foundInCountries && foundInSectors && foundInMarketCapCategories;
    });

    return result;
}

function Filter(props) {
    const setFilteredData = props.setFilteredStockData;
    const data = props.initalStockData;
    const [countries, setCountries] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [marketCapCategories, setMarketCapCategories] = useState([]);
    const [queryState, queryDispatch] = useReducer(queryReducer, initialQuery);

    // construct filter entries for country list and sector list
    useEffect(() => {
        setCountries(getDistinctValues(data, "country", "continent"));
        setSectors(getDistinctValues(data, "sector"));
        setMarketCapCategories(getDistinctValues(data, "sizeCategory"));
    }, [data]);

    // querying data
    useEffect(() => {
        const result = runQuery(data, queryState);
        setFilteredData(result);
    }, [queryState, data, setFilteredData]);

    const onCompanyInputHandler = (event) => {
        queryDispatch({type: "QUERY_NAME", value: event.target.value});
    };

    const onCountryChangeHandler = (newValue) => {
        queryDispatch({type: "QUERY_COUNTRY", value: newValue});
    };

    const onSectorChangeHandler = (newValue) => {
        queryDispatch({type: "QUERY_SECTOR", value: newValue});
    };

    const onMarketCapCategoryChangeHandler = (newValue) => {
        queryDispatch({type: "QUERY_MARKET_CAP_CATEGORY", value: newValue});
    }

    return (
        <div>
            <form>
                <div className={styles.form_item}>
                    <label className={styles.label_no_tooltip}>Company</label>
                    <input onBlur={onCompanyInputHandler} type="text" name="company" placeholder="Name, ticker"></input>
                </div>
                <div className={styles.form_item}>
                    <label className={styles.label_no_tooltip}>Country</label>
                    {getSelectMenu(countries, onCountryChangeHandler)}
                </div>
                <div className={styles.form_item}>
                    <label className={styles.label_no_tooltip}>Sector</label>
                    {getSelectMenu(sectors, onSectorChangeHandler, true)}
                </div>
                <div className={styles.form_item}>
                    <div className={styles.label_tooltip}>
                        <label>Market cap category</label>
                        <div className={styles.tooltip_questionmark}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-question-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path
                                    d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                            </svg>
                            <span className={styles.tooltiptext}>
                                <span className={styles.tooltiptext_title}>large cap</span>
                                <span className={styles.tooltiptext_content}>market cap greater than 10b</span>
                                <br/>
                                <span className={styles.tooltiptext_title}>mid cap</span>
                                <span className={styles.tooltiptext_content}>market cap between 2b and 10b</span>
                                <br/>
                                <span className={styles.tooltiptext_title}>small cap</span>
                                <span className={styles.tooltiptext_content}>market cap smaller 2b</span>
                            </span>
                        </div>
                    </div>
                    {getSelectMenu(marketCapCategories, onMarketCapCategoryChangeHandler)}
                </div>
            </form>
        </div>
    )
}

export default Filter
