import Header from './components/header/Header';
import MainBody from "./components/main/MainBody";
import {React, useEffect, useState} from "react";
import {DataKind, fetchData, MinMaxMetrics} from "./scripts/data";
import {Routes, Route} from "react-router-dom";
import Documentation from "./components/general/Documentation";
import Concept from "./components/general/Concept";
import About from "./components/general/About";

function App() {
    const [metrics, setMetrics] = useState();
    const [minMaxMetrics, setMinMaxMetrics] = useState();

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchData(DataKind.METRICS);
            setMetrics(fetchedData);

            const calculatedMinMaxMetricsPerSector = { };

            for (let sector in fetchedData) {
                if (!(sector in calculatedMinMaxMetricsPerSector)) {
                    calculatedMinMaxMetricsPerSector[sector] = new MinMaxMetrics();
                }
                const entry = fetchedData[sector].companies;
                for (let ticker in entry) {
                    const entryCompanyMetrics = entry[ticker];
                    for (let metric in entryCompanyMetrics) {
                        const [min, max] = calculatedMinMaxMetricsPerSector[sector][metric];
                        const value = entryCompanyMetrics[metric];
                        if (value < min) {
                            calculatedMinMaxMetricsPerSector[sector][metric][0] = value;
                        } else if (value > max) {
                            calculatedMinMaxMetricsPerSector[sector][metric][1] = value;
                        }
                    }
                }
            }

            setMinMaxMetrics(calculatedMinMaxMetricsPerSector);
        };
        getData().then();
    }, [setMetrics, setMinMaxMetrics]);

    return (
        <>
            <Header></Header>
            <div className='app_container'>
                <Routes>
                    <Route path="/" element={<MainBody metrics={metrics} minMaxMetrics={minMaxMetrics}></MainBody>} />
                    <Route path="/documentation" element={<Documentation></Documentation>} />
                    <Route path="/concept" element={<Concept></Concept>} />
                    <Route path="/about" element={<About></About>} />
                </Routes>
            </div>
        </>
    );
}

export default App;
