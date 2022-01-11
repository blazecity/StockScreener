let firstSketchImage = require("./img/first_sketch.png");

function Concept() {
    return (
        <div className="general_container">
            <h1 className="general_title">Concept</h1>
            <h2>Background Information</h2>
            <p>
                With record low interest rates investing has become relevant for everyone. But then the questions arises
                what should you invest in. There comes the stock screener into play. There are many of them out there,
                but very few which only contain the necessary info as compact as possible.
            </p>
            <h2>Visual Design Choices</h2>
            <h3>Foundations Visual Design</h3>
            <p>
                The Stock Screeners goal is to make stock selection for investors as quick as possible. The selection
                follows a kind of top-down approach. The left side of the webpage contains the filterable data over
                the whole collection of stocks whereas the right side contains detail information on a specific stock.
                The selection process for investors usually starts with the region and continues with the sector.
                However our concept makes different selection approaches possible. At last spider chart provides
                information on the company's solidity and allows a quick decision thanks to the sector comparison.
            </p>
            <h3>Fundamental Principals of Analytical Design (Tufte)</h3>
            <p>
                Our webpage takes the six fundamental principles of analytical into account. We provide a
                comparison between a company and its sector with different metrics. The world map and the stock
                table as well as the filter are integrated with each other. The stock screener is documented as well.
                In respect to principle six “Content Counts Most of All”, we only show information which is relevant
                for an investor.
            </p>
            
            <h3>Data-Ink Ratio (Tufte)</h3>
            <p>
                The data-ink ratio should be as high possible. For that reason we avoided labels and numbers on the 52
                week comparison bar, since its interpretation is quite simple even without the numbers. Likewise we
                removed the grid lines on the line chart. Consequently the level lines on the spider chart are
                also left out, since they have no real meaning in our context instead we inserted a tooltip which
                pops out on hovering over the data points.
            </p>
            
            <h3>Human Perception</h3>
            <p>
                Each company is classified by its size (market capitalization). The shapes of the map data points
                represent the size category. Their color represents the sector. We also payed attention to color
                blind people and therefore used red and blue (instead of green) to display losses and profits.
                The webs on the spider chart are highlighted on mouse over for better distinction especially when
                the values between the company and the sector are close together.
            </p>

            <h3>Tasks in Data Visualization</h3>
            <p>
                Our whole set is filterable on the client side, which allows to quickly clear filters and go back
                to the whole collection. To show where the companies are based we chose a zoomable map. Further
                details to the single stocks can be accessed by selecting them on the map or table. The line chart
                is brushable which allows to quickly select the time range of interest. To reset it we provided
                quick filters.
            </p>

            <h3>Interaction Concept</h3>
            <p>
                As mentioned the page is structured with individual blocks where you can follow the two columns
                from top to bottom. The filter on the left impacts the map and the table. Since the dataset could
                be extended at any point, since it is loaded every day, we decided to use classic filter with dropdowns
                and text field. You can either click on a data point on the map or a table row to show the details
                of a certain company which then loads the price chart and the spider chart on the right.
            </p>

            <h2>Research Questions</h2>
            <p>
                Since the concept of the screener is to help find suitable stocks for an investor's portfolio we
                technically didn't cover specific research questions. However the following questions could be
                answered with the help of the stock screener:
            </p>
            <ul>
                <li>
                    Where are companies concentrated in respect to the sector they're operating in? Financial Services
                    for example are mainly located in the financial hubs such as London, Frankfurt, Zurich, New York or
                    Tokyo.
                </li>
                <li>
                    How did the price of a certain stock perform over time? Oracle's stock price for instance
                    shows us two there was a sharp decline around the year 2000, at the time of the Dot-com bubble.
                    However during the financial crisis in 2008 the stock price didn't nearly decrease as strong. Over
                    time the stock performed really well and was definitely a good investment.
                </li>
                <li>
                    How solid is a company compared to other companies in the same sector? Let's take BioNTech as an
                    example. The company outperforms the Healthcare sector on almost every metrics. Only the earnings
                    per share are almost identical in comparison.
                </li>
            </ul>

            <h2>First Sketch</h2>
            <img src={firstSketchImage.default} alt="First sketch"/>

        </div>
    );
}

export default Concept;
