import React from 'react'
import {Line} from 'react-chartjs-2';

import { chartJsConfig, chartColors, chartDataset } from '../../chartConfig'

class StockChart extends React.Component {

    // too big a function?
    updateChart = () => {
        let chart = this.refs.chart.chartInstance;

        if(Object.keys(this.props.stocks).length === 0)
        {
            chart.data.datasets = [];
            return chart.update();
        }

        Object.keys(this.props.stocks).map((stockName, index) =>
        {
            let current_stock = this.props.stocks[stockName];
            let chart_dataset = chart.data.datasets.find((dataset) => {
                return dataset.label === stockName.toUpperCase()
            });

            if(current_stock.isSelected)
            {
                let currentStock = this.props.stocks[stockName];
                if(chart_dataset)
                {
                    chart_dataset.data = this.getStockValues(currentStock);
                }
                else
                {
                    if(currentStock)
                    {
                        chart.data.datasets = chart.data.datasets.concat(
                            [
                                chartDataset(stockName, chartColors[index], this.getStockValues(currentStock))
                            ]
                        )
                    }
                }
            }
            else
            {
                if(chart_dataset)
                {
                    chart.data.datasets.splice(chart.data.datasets.indexOf(chart_dataset), 1);
                }
            }
            chart.update();
        })
    }

    componentDidUpdate = () => {
        this.updateChart();
    }

    // returns an array of objects, {t: timestamp, y: value}
    getStockValues = (stock) =>{
        return stock.history.map((history) => {
            return {t: new Date(history.x), y: history.y};
        })
    }


    render() {
        return (
            <div className={'card column'} >
                <div className='card-header'>
                    <div className='card-header-title'>
                        Graph
                    </div>
                </div>
                <div className='card-content'>
                    <p className='size-12 text-center'>
                        Select Stock in Table to see graph.
                    </p>

                    <Line
                        data={{datasets: []}}
                        options={chartJsConfig}
                        ref='chart'
                    />
                </div>
            </div>
        );
    }
}

export default StockChart;