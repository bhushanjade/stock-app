import React, { Component } from 'react';
import StockListing from './components/stock-listing/StockListing';
import StockChart from './components/stock-chart/StockChart';

//css
import './App.css';

//websocket url
const stocksUrl = 'ws://stocks.mnet.website';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'isLoading': true,
            'stocksData': {},
            isLive: false,
            connectionError:false,
        };
        this.saveNewStockValues = this.saveNewStockValues.bind(this);
        this.toggleStockSelection = this.toggleStockSelection.bind(this);
    }

    saveNewStockValues(event) {
        // console.log(event);
        let result = JSON.parse(event.data);
        let now = Date.now();

        let stocks = this.state.stocksData;
        let stockName, stockValue;
        result.map((stock) => {
            [stockName, stockValue] = stock;

            stockValue = Number(stockValue).toFixed(2);
            /*
             * First check is stock already present
             * if yes , update current value & trend
             * Add current value in history, will be used for graph
             * if NO, else part executed.
             * */
            if (stocks[stockName]) {

                stocks[stockName]['history'].push({
                    x: now,
                    y: stockValue,
                });

                stocks[stockName].currentValue = stockValue;
                stocks[stockName].time = now;

                stocks[stockName]['trend'] = this.getTrend(
                    stocks[stockName].initialValue, stockValue); //"initi=" + stocks[stockName].initialValue + "--New--" + stockValue + "---=" +
            } else {
                /*
                 * We have new stock entry which is not present already.
                 * (only for mock. Stock Percentage increase)We will tread First value as Initial Value.
                 * Compare with current value and calc trend and increase/decrease percent and diff between initial and current stock value.
                 * */
                //
                stocks[stockName] = {
                    'trend': 0,
                    'currentValue': stockValue,
                    'initialValue': stockValue,
                    time: now,
                    'history': [
                        {
                            x: Date.now(),
                            y: stockValue,
                        }],
                };
            }

        });

        this.setState({
            stocksData: stocks,
        });
    };

    componentDidMount() {
        this.connection = new WebSocket(stocksUrl);
        this.setState({
            isLive: true,
        });
        this.connection.onmessage = this.saveNewStockValues;
        this.connection.onclose = () => {
            this.setState({connectionError: true, isLive: false});
        };


    };

    getTrend(intialStockValue, currentStockValue) {
        let diff = currentStockValue - intialStockValue;
        // if(currentStockValue < intialStockValue){
        return parseFloat((diff / intialStockValue) * 100).toFixed(2);
        // }
        // if (intialStockValue > currentStockValue) {
        //     return ((intialStockValue - currentStockValue) % intialStockValue) * 100
        // } else {
        //     return ((currentStockValue + intialStockValue) % intialStockValue) * 100
        // }
        return diff;
    }

    toggleStockSelection(stockName) {
        let new_stocks = this.state.stocksData;
        new_stocks[stockName].isSelected = !new_stocks[stockName].isSelected;
        this.setState({stocksData: new_stocks});
    }

    render() {
        return (
            <div className="container">

                {this.state.isLive ? <div className="row">
                    {/* Stock Table */}
                    <div className="card-50 float-left right-border">
                        <div className='card'>
                            <div className='card-header'>
                                <div className='card-header-title'>
                                    Stocks
                                    &nbsp;
                                    {this.state.isLive ?
                                        <span className="status is-live">Live</span> :
                                        <span
                                            className="status is-offline">Offline</span> }
                                </div>
                            </div>
                        </div>
                        <div className='card-content'>
                            <StockListing stocks={this.state.stocksData}
                                          toogleStockSelect={this.toggleStockSelection} />
                        </div>
                    </div>
                    {/* Stock Graph */}
                    <div className="card-50 float-right">
                        <div className='card'>
                            <StockChart stocks={this.state.stocksData} />
                        </div>
                    </div>
                </div>: this.state.connectionError ? <div>Oops ! Something went Wrong</div> : <div> Loading... </div>}
            </div>
        );
    }
}

export default App;
