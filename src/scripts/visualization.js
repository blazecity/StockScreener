import * as d3 from 'd3';
import {getPrettyNumber} from "./util";
import {DataKind, fetchData} from "./data";

let mapScale = 1;

function calcScale() {
    return [6 / mapScale, 10 / mapScale, 0.3 / mapScale];
}

export function getOrdinalColorScale(data) {
    return d3.scaleOrdinal().domain(data).range(d3.schemeSet3);
}

function translate(attribute) {
    switch (attribute) {
        case "cashflow_margin":
            return "Cashflow Margin";

        case "equity_ratio":
            return "Equity Ratio";

        case "ebitda_margin":
            return "EBITDA Margin";

        case "trailing_pe":
            return "P/E Ratio";

        case "trailing_eps":
            return "Earnings per share";

        case "return_on_equity":
            return "Return on Equity";

        case "dividend_yield":
            return "Dividend Yield";

        default:
            return "";
    }
};

function formatNumber(metric, num) {
    switch (metric) {
        case "cashflow_margin":
        case "equity_ratio":
        case "ebitda_margin":
        case "return_on_equity":
        case "dividend_yield":
            return getPrettyNumber(num, "percent");

        case "trailing_pe":
        case "trailing_eps":
        default:
            return getPrettyNumber(num);
    }
}

function drawErrorMessage(container) {
    d3.select(container)
        .append("div")
        .style("padding", "15px")
        .attr("id", "spider_chart_error")
        .append("span")
        .text("No data available")
        .style("font-size", "2em");
}

// https://hashnode.com/post/radar-charts-with-d3js-ckiijv82n00dqm5s184e6acpy
export function drawSpiderChart(data, companyName, sectorName, minMaxMetrics, cont, contLegend, height, width, legendHeight, legendWidth, loaderCallback) {
    const container = d3.select(cont);
    if (container.empty()) {
        return;
    }

    const errorMessage = container.select("#spider_chart_error");
    if (!errorMessage.empty()) {
        errorMessage.remove();
    }

    let svg = container.select("svg");
    if (!svg.empty()) {
        svg.remove();
    }

    if (data[0] == null || data[1] == null) {
        const containerLegend = d3.select(contLegend);
        if (containerLegend.empty()) {
            drawErrorMessage(cont);
            return false;
        }

        let svgLegend = containerLegend.select("svg");
        if (!svgLegend.empty()) {
            svgLegend.remove();
        }
        drawErrorMessage(cont);
        return false;
    }

    let tooltip = d3.select("#spider_chart_tooltip");
    if (!tooltip.empty()) {
        tooltip.remove();
    }

    tooltip = container
        .append("div")
        .style("background-color", "var(--general-theme-color)")
        .style("padding", "10px")
        .style("margin", "14px")
        .style("position", "absolute")
        .style("visibility", "hidden");

    const scaleFunctions = {};
    for (let key in minMaxMetrics) {
        scaleFunctions[key] = d3.scaleLinear().domain(minMaxMetrics[key]).range([0, 1]);
    }

    const datasetCompanies = [];
    const dataSetSector = [];
    const sector = data[0];
    const company = data[1];
    for (let key in company) {
        const translatedMetricName = translate(key);
        datasetCompanies.push({
            name: translatedMetricName,
            value: scaleFunctions[key](company[key]),
            originalValue: formatNumber(key, company[key])
        });

        dataSetSector.push({
            name: translatedMetricName,
            value: scaleFunctions[key](sector[key]),
            originalValue: formatNumber(key, sector[key])
        });
    }

    const numberOfSides = datasetCompanies.length;
    const numberOfLevels = 1;
    const sectorColor = "blue";
    const companyColor = "black";
    const size = height;
    const offset = Math.PI;
    const polyangle = ( Math.PI * 2 ) / numberOfSides;
    const r = 0.8 * size;
    const r_0 = r / 2;
    const center = {
                x: size / 2,
                y: size / 2
    };

    // const genTicks = (levels) => {
    //     const ticks = [];
    //     const step = 100 / levels;
    //     for (let i = 0; i <= levels; i++) {
    //         const num = step * i;
    //         if (Number.isInteger(step)) {
    //             ticks.push(num);
    //         }
    //         else {
    //             ticks.push(num.toFixed(2));
    //         }
    //     }
    //     return ticks;
    // };

    // const ticks = genTicks(numberOfLevels);

    svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", "translate(40, 10)");

    const scale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, r_0])
        .nice();

    const generatePoint = ({ length, angle }) => {
        const point = {
                x: center.x + (length * Math.sin(offset - angle)),
                y: center.y + (length * Math.cos(offset - angle))
        };
        return point;
    };

    const drawPath = (points, parent, color, classLines, classPoints) => {
        const lineGenerator = d3.line()
            .x(d => d.x)
            .y(d => d.y);

        parent.append("path")
            .attr("d", lineGenerator(points))
            .attr("fill", "none")
            .attr("class", classLines)
            .attr("stroke-width", "2.5px")
            .attr("stroke", color)
            .attr("stroke-opacity", 0.5)
            .on("mouseover", () => {
                d3.selectAll(`.${classPoints}`).attr("r", 10).attr("fill-opacity", 1);
                d3.selectAll(`.${classLines}`).attr("stroke-width", "4.5px").attr("stroke-opacity", 1);
            })
            .on("mouseleave", () => {
                d3.selectAll(`.${classPoints}`).attr("r", 7).attr("fill-opacity", 0.5);
                d3.selectAll(`.${classLines}`).attr("stroke-width", "2.5px").attr("stroke-opacity", 0.5);
            });
    };

    const generateAndDrawLevels = (levelsCount, sideCount) => {
        for (let level = 1; level <= levelsCount; level++) {
            const hyp = (level / levelsCount) * r_0;
            const points = [];
            for (let vertex = 0; vertex < sideCount; vertex++) {
                const theta = vertex * polyangle;
                points.push(generatePoint( { length: hyp, angle: theta }));
            }
            const group = g.append("g");
            drawPath([...points, points[0]], group, "var(--general-theme-color)");
        }
    };

    const generateAndDrawLines = (sideCount) => {
        const group = g.append("g");
        for (let vertex = 1; vertex <= sideCount; vertex++) {
            const theta = vertex * polyangle;
            const point = generatePoint({length: r_0, angle: theta});
            drawPath([center, point], group, "var(--general-theme-color)");
        }
    };

    const drawCircles = (points, color, classLines, classPoints) => {
        const mouseEnter = (event, d) => {
            tooltip.style("visibility", "visible");
            const { x, y } = event;
            tooltip.style( "top", `${ y - 20 }px` );
            tooltip.style( "left", `${ x + 15 }px` );
            tooltip.text(d.value);
        };

        const mouseLeave = d => {
            tooltip.style("visibility", "hidden");
        };

        g.append("g" )
            .selectAll("circle")
            .data(points)
            .enter()
            .append("circle")
            .attr("class", classPoints)
            .attr("fill", color)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 7)
            .attr("fill-opacity", 0.5)
            .on("mouseenter", mouseEnter)
            .on("mouseover", () => {
                d3.selectAll(`.${classPoints}`).attr("r", 10).attr("fill-opacity", 1);
                d3.selectAll(`.${classLines}`).attr("stroke-width", "4.5px").attr("stroke-opacity", 1);
            })
            .on("mouseleave", (d) => {
                mouseLeave(d)
                d3.selectAll(`.${classPoints}`).attr("r", 7).attr("fill-opacity", 0.5);
                d3.selectAll(`.${classLines}`).attr("stroke-width", "2.5px").attr("stroke-opacity", 0.5);
            });
    };

    const drawText = (text, point, isAxis, group) => {
        if (isAxis) {
            const xSpacing = text.toString().includes(".") ? 30 : 22;
            group.append("text")
                .attr("x", point.x - xSpacing)
                .attr("y", point.y + 5)
                .html(text)
                .style("text-anchor", "middle" )
                .attr("fill", "black")
                .style("font-size", "12px")
        }
        else {
            group.append("text")
                .attr("x", point.x)
                .attr("y", point.y)
                .html(text)
                .style("text-anchor", "middle")
                .attr("fill", "black")
                .style("font-size", "12px");
        }
    };

    const drawData = (dataset, n, color, classLines, classPoints) => {
        const points = [];
        dataset.forEach((d, i) => {
            const len = scale(d.value);
            const theta = i * (2 * Math.PI / n);
            points.push({
                    ...generatePoint( { length: len, angle: theta } ),
                    value: d.originalValue
                });
        });

        const group = g.append("g").attr("class", "shape");

        drawPath([ ...points, points[0]], group, color, classLines, classPoints);
        drawCircles(points, color, classLines, classPoints);
    };

    // const drawAxis = (ticks, levelsCount) => {
    //     const groupL = g.append("g").attr("class", "tick-lines");
    //     const point = generatePoint({ length: r_0, angle: 0 });
    //     drawPath([center, point], groupL);
    //
    //     const groupT = g.append("g").attr("class", "ticks");
    //
    //     ticks.forEach((d, i) => {
    //         const r = (i / levelsCount) * r_0;
    //         const p = generatePoint({ length: r, angle: 0 });
    //         const points = [
    //                 p,
    //                 {
    //                     ...p,
    //                     x: p.x - 10
    //                 }
    //             ];
    //         drawPath(points, groupL);
    //         drawText(d, p, true, groupT);
    //     } );
    // };

    const drawLabels = (dataset, sideCount) => {
        const groupL = g.append("g").attr("class", "labels");
        for ( let vertex = 0; vertex < sideCount; vertex++) {
            const angle = vertex * polyangle;
            const label = dataset[vertex].name;
            const point = generatePoint({ length: 0.9 * ( size / 2 ), angle });

            drawText(label, point, false, groupL);
        }
    };

    const drawLegend = () => {
        const containerLegend = d3.select(contLegend);
        if (containerLegend.empty()) {
            return;
        }

        let svgLegend = containerLegend.select("svg");
        if (!svgLegend.empty()) {
            svgLegend.remove();
        }

        const legendData = [
            {
                label: companyName,
                color: companyColor,
                x: 30,
                y: 40,
                textX: 50
            }
        ];

        sectorName.split(" ").forEach((word, index) => {
            legendData.push({
                label: word,
                color: index === 0 ? sectorColor : "#fff",
                x: 30,
                y: 40 + (index + 1) * 20,
                textX: 50
            });
        });

        containerLegend.append("svg")
            .attr("height", legendHeight)
            .attr("width", legendWidth)
            .append("g")
            .selectAll("circle")
            .data(legendData)
            .join("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 6)
            .style("fill", d => d.color);

        containerLegend.select("g")
            .selectAll("text")
            .data(legendData)
            .join("text")
            .attr("x", d => d.textX)
            .attr("y", d => d.y)
            .text(d => d.label)
            .attr("text-achor", "left")
            .attr("alignment-baseline", "middle");
    }

    loaderCallback(true);
    generateAndDrawLevels(numberOfLevels, numberOfSides);
    generateAndDrawLines(numberOfSides);
    drawData(dataSetSector, numberOfSides, sectorColor, "spider_sector_lines", "spider_sector_circles");
    drawData(datasetCompanies, numberOfSides, companyColor, "spider_company_lines", "spider_company_circles");
    drawLabels(datasetCompanies, numberOfSides);
    drawLegend();
    loaderCallback(false);
    return true;
}

export function drawLineChart(priceData, width, height, brushHandler) {
    const draw = async () => {
        const cont = d3.select("#linechart_container");
        if (cont.empty()) {
            return;
        }

        const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

        let data = priceData.map(element => {
            return {
                date: parseTime(element.Date),
                value: +element.Close
            };
        });

        let svg = cont.select(".chart");
        if (!svg.empty()) {
            svg.remove();
        }

        const margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 60
        };

        const [computedHeight, computedWidth] = getComputedHeightAndWidth(cont);

        width = computedWidth - margin.left - margin.right;
        height = computedHeight - margin.top - margin.bottom;

        // append the svg object to the body of the page
        svg = cont.append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .range([0, width]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return +d.value;
            }) * 1.3])
            .range([height, 0]);

        const yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        // add clip path
        svg.append("defs")
            .append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // add brushing
        const brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("end", updateChart);

        // add the line
        const line = svg.append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("clip-path", "url(#clip)");

        line.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.date)
                })
                .y(function (d) {
                    return y(d.value)
                })
            );

        line.append("g").attr("class", "brush").call(brush);

        let idleTimeout;
        function idled() {
            idleTimeout = null;
        }

        function updateChart(event, d) {
            const extent = event.selection;
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                x.domain([4, 8]);
                y.domain([4, 8]);
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])]);
                brushHandler(x.domain()[0], x.domain()[1]);
                const filteredData = data.filter(d => d.date > x.domain()[0] && d.date < x.domain()[1]);
                const max = d3.max(filteredData, function(d) {
                    return d.value;
                });
                y.domain([0,  max * 1.3]);
                line.select(".brush").call(brush.move, null);
            }
            xAxis.transition().duration(1000).call(d3.axisBottom(x));
            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            line.select(".line")
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.date)
                    })
                    .y(function (d) {
                        return y(d.value)
                    })
                );
        }
    }
    draw().then();
}

export function drawMinMaxCurrentBar(width) {
    const allCells = d3.selectAll(".col_fiftyTwoWeekComp");
    if (allCells.empty()) {
        return;
    }

    const outerWidth = 3;
    const svgData = [
        {
            x: 0,
            y: 8,
            width: width,
            fill: "var(--general-theme-color)",
            height: 4,
            className: "whole",
            rotate: 0
        },
        {
            x: 0,
            y: 0,
            width: outerWidth,
            fill: "var(--general-theme-color)",
            height: 20,
            className: "left",
            rotate: 0
        },
        {
            x: width - outerWidth,
            y: 0,
            width: outerWidth,
            fill: "var(--general-theme-color)",
            height: 20,
            className: "right",
            rotate: 0
        }
    ];

    allCells.each(function(d) {
        const sel = d3.select(this);
        const high = sel.attr("high");
        const low = sel.attr("low");
        const price = sel.attr("price");
        const diff = high - low;
        const scalingFactor = width / diff;
        const distance = price - low;
        const scaledDistance = distance * scalingFactor;;
        svgData.push({
            x: scaledDistance,
            y: 3,
            width: 5,
            fill: "darkblue",
            height: 14,
            className: "left",
            rotate: 0
        });

        let svg = sel.select("svg");
        if (svg.empty()) {
            svg = sel.append("svg");
        }

        svg.attr("class", "minMaxCurrent")
            .attr("width", width)
            .attr("height", 20)
            .selectAll("rect")
            .data(svgData)
            .join("rect")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("height", d => d.height)
            .attr("width", d => d.width)
            .attr("fill", d => d.fill)
            .attr("transform", d => `rotate(${d.rotate} ${d.width} ${d.height})`);

        svgData.pop();
    });
}

let sectors = [];

export function drawMap(container, stockData, companyClickHandler, loaderCallback) {
    // check if data is empty, if so end the function
    if (stockData.length === 0) {
        return;
    }

    // check if there is already a map drawn.
    let svg = d3.select("#map");
    let toUpdate = true;
    if (svg.empty()) {
        toUpdate = false;
        svg = d3.select(container)
            .append("svg")
            .attr("id", "map")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("background-color", "white");
    }

    // general preparations
    let [height, width] = getComputedHeightAndWidth(svg);
    const projection = d3.geoNaturalEarth1().translate([width / 2, height / 1.7]);
    const mapZoom = d3.zoom().scaleExtent([0.5, 8]).on("zoom", (event) => {
        d3.selectAll(".group-worldmap").attr("transform", event.transform);
        mapScale = event.transform.k;
        const scales = calcScale();
        d3.select("#group-companies-large").selectAll("circle").attr("r", scales[0]).attr("stroke-width", scales[2]);
        d3.select("#group-companies-mid").selectAll("rect").attr("height", scales[1]).attr("width", scales[1]).attr("stroke-width", scales[2]);
        d3.select("#group-companies-small").selectAll("rect").attr("height", scales[1]).attr("width", scales[1]).attr("stroke-width", scales[2]);
    });
    svg.call(mapZoom);

    const initialDraw = async () => {
        sectors = [...new Set(stockData.map(element => element.sector))].sort();
        try {
            const mapData = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
            const indexData = await fetchData(DataKind.INDIZES);

            const [minChangePositive, maxChangePositive] = d3.extent(indexData, d => {
                if (d.change > 0) return d.change;
            });
            const [minChangeNegative, maxChangeNegative] = d3.extent(indexData, d => {
                if (d.change < 0) return d.change;
            });

            // tooltip
            const tooltip = d3.select(container)
                .append("div")
                .style("background-color", "var(--general-theme-color)")
                .style("visibility", "hidden")
                .style("padding", "10px")
                .style("margin", "14px")
                .style("position", "absolute");

            svg.on("mouseover", () => {
                tooltip.style("visibility", "hidden");
            });

            const mousemove = (event, d) => {
                event.preventDefault();
                if (d.stockIndex.isDummyIndex) {
                    tooltip.style("visibility", "hidden");
                    return;
                }
                tooltip.style("visibility", "visible")
                    .style("left", d3.pointer(event, svg)[0] + "px")
                    .style("top", d3.pointer(event, svg)[1] + "px")
                    .html(`<span style="font-size: 14px; font-weight: bold; margin-bottom: 10px">${d.stockIndex.name}</span>
                            <br>
                            <span style="font-size: 12px; margin-bottom: 10px;">${d.stockIndex.currency} ${d.stockIndex.price.toLocaleString("de-ch")}</span>
                            <span style="font-size: 14px; margin-bottom: 10px; ${d.stockIndex.change >= 0 ? "color: black;": "color: red;"}">${getPrettyNumber(d.stockIndex.change, "percent")}</span>`);
            };

            const mouseleave = (event, d) => {
                tooltip.style("visibility", "hidden");
            }

            // index coloring and map drawing
            const indexColorScalePositive = d3.scaleSequential(d3.interpolateBlues).domain([minChangePositive, maxChangePositive]);
            const indexColorScaleNegative = d3.scaleSequential(d3.interpolateReds).domain([maxChangeNegative, minChangeNegative]);

            const drawLegend = (container, indexColorScale, gradientId, inverted = false) => {
                const legendContainer = d3.select(container);
                if (legendContainer.empty()) return;

                const legendSvg = legendContainer.append("svg")
                    .attr("height", 30)
                    .attr("width", 200);

                const defs = legendSvg.append("defs");
                const linearGradient = defs.append("linearGradient")
                    .attr("id", gradientId);

                const scaleData = inverted ? indexColorScale.ticks().reverse() : indexColorScale.ticks();

                linearGradient.selectAll("stop")
                    .data(scaleData.map((t, i, n) => ({
                        offset: `${100 * i / n.length}%`,
                        color: indexColorScale(t)
                    })))
                    .join("stop")
                    .attr("offset", d => {
                        return d.offset;
                    })
                    .attr("stop-color", d => d.color);

                legendSvg.append("g")
                    .append("rect")
                    .attr("height", 20)
                    .attr("width", 200)
                    .attr("transform", `translate(0, ${0})`)
                    .style("fill", `url(#${gradientId})`);

                let range = [0, 200];
                if (inverted) {
                    range = [200, 0];
                }

                const axisScale = d3.scaleSequential().domain(indexColorScale.domain()).range(range);
                const axisBottom = g => g.attr("class", `x-axis`)
                    .attr("transform", `translate(0, ${20})`)
                    .call(d3.axisBottom(axisScale).ticks(3).tickFormat(d => `${d * 100}%`).tickSize(-10));

                legendSvg.append("g").call(axisBottom);
            };

            drawLegend("#legend_container", indexColorScaleNegative, "left_gradient", true);
            drawLegend("#legend_container", indexColorScalePositive, "right_gradient");



            mapData.features.forEach(element => {
                const countryName = element.properties.name.split(" ").join("").toLowerCase();
                const stockIndex = indexData.find(stockIndexEntry => {
                     const indexCountryName = stockIndexEntry.country.split(" ").join("").toLowerCase();
                     return indexCountryName === countryName;
                });
                if (stockIndex == null) {
                    const dummyIndex = {
                        isDummyIndex: true,
                        coloring: "white"
                    };
                    element.stockIndex = dummyIndex;
                    return;
                }
                if (stockIndex.change > 0) {
                    stockIndex.coloring = indexColorScalePositive(stockIndex.change);
                } else {
                    stockIndex.coloring = indexColorScaleNegative(stockIndex.change);
                }
                stockIndex.isDummyIndex = false;
                element.stockIndex = stockIndex;
            });

            svg.append("g")
                .attr("class", "group-worldmap")
                .attr("id", "group-map")
                .selectAll("path")
                .data(mapData.features)
                .join("path")
                .attr("fill", d => d.stockIndex.coloring)
                .attr("d", d3.geoPath().projection(projection))
                .attr("stroke", "black")
                .attr("stroke-width", 0.5)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

            svg.append("g")
                .attr("class", "group-worldmap")
                .attr("id", "group-companies-small");

            svg.append("g")
                .attr("class", "group-worldmap")
                .attr("id", "group-companies-mid");

            svg.append("g")
                .attr("class", "group-worldmap")
                .attr("id", "group-companies-large");

        } catch (err) {
            console.log("Error occured while drawing the map initially => ", err);
        }
    };

    const visualizeCompanies = () => {
        const splitData = {
            small: [],
            mid: [],
            large: []
        };

        stockData.forEach(element => {
            if (element.sizeCategory === "large cap") {
                splitData.large.push(element);
            } else if (element.sizeCategory === "mid cap") {
                splitData.mid.push(element);
            } else {
                splitData.small.push(element);
            }
        });

        const colorScaleSectors = d3.scaleOrdinal().domain(sectors).range(d3.schemeSet3);

        const scales = calcScale();
        svg.select("#group-companies-large")
            .selectAll("circle")
            .data(splitData.large)
            .join("circle")
            .attr("cx", d => projection([d.longitude, d.latitude])[0])
            .attr("cy", d => projection([d.longitude, d.latitude])[1])
            .attr("r", scales[0])
            .attr("fill", d => colorScaleSectors(d.sector))
            .attr("stroke", "black")
            .attr("stroke-width", 0.3)
            .on("click", companyClickHandler)
            .on("mouseover", function(d) {d3.select(this).style("cursor", "pointer")});

        svg.select("#group-companies-mid")
            .selectAll("rect")
            .data(splitData.mid)
            .join("rect")
            .attr("x", d => projection([d.longitude, d.latitude])[0])
            .attr("y", d => projection([d.longitude, d.latitude])[1])
            .attr("height", scales[1])
            .attr("width", scales[1])
            .attr("fill", d => colorScaleSectors(d.sector))
            .attr("transform", d => `rotate(45 ${projection([d.longitude, d.latitude])[0]} ${projection([d.longitude, d.latitude])[1]})`)
            .attr("stroke", "black")
            .attr("stroke-width", scales[2])
            .on("click", companyClickHandler)
            .on("mouseover", function(d) {d3.select(this).style("cursor", "pointer")});

        svg.select("#group-companies-small")
            .selectAll("rect")
            .data(splitData.small)
            .join("rect")
            .attr("x", d => projection([d.longitude, d.latitude])[0])
            .attr("y", d => projection([d.longitude, d.latitude])[1])
            .attr("height", scales[1])
            .attr("width", scales[1])
            .attr("fill", d => colorScaleSectors(d.sector))
            .attr("stroke", "black")
            .attr("stroke-width", scales[2])
            .on("click", companyClickHandler)
            .on("mouseover", function(d) {d3.select(this).style("cursor", "pointer")});
    };

    if (!toUpdate) {
        loaderCallback(true);
        initialDraw().then(() => visualizeCompanies()).then(loaderCallback(false));
    } else {
        visualizeCompanies();
    }
}

function getComputedHeightAndWidth(element) {
    try {
        let el = element.node().getBoundingClientRect();
        return [el.height, el.width];
    } catch {
        return [0, 0];
    }
}
