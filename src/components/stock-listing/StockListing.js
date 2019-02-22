import React, {Component} from 'react';
import StockRow from './StockRow';

export default class StockListing extends Component {
    renderRows(stockData){
        let rows = [];
        for (let stockName in stockData) {
            let currentStock = stockData[stockName];
            rows.push(
               <StockRow key={stockName} name={stockName} stock={currentStock} toogleStockSelect={this.props.toogleStockSelect.bind(this, stockName)}/>
            );
        }
        return rows;
    }
    render() {
        return (
            <table id="table-stock-listings">
                <caption><p>Click on a stock to select/unselect</p></caption>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Initial</th>
                    <th>trend</th>
                    <th>History</th>
                    <th>Last Updated</th>
                    {/*<th>Last Updated</th>*/}
                    {/*<th>Last Updated</th>*/}
                    {/*<th>Last Updated</th>*/}
                </tr>
                </thead>
                <tbody>
                {
                    this.renderRows(this.props.stocks)
                }
                </tbody>
            </table>
        )
    }
}