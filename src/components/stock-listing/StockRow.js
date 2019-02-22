import React, {Component} from 'react';
import {timeDifference} from '../../util';
import { Sparklines, SparklinesLine } from 'react-sparklines';

export default function StockRow(props){
    let {name,stock} = props;
    return(
        <tr onClick={props.toogleStockSelect} className={stock.isSelected ? "active" : null}>
            <td>{name}</td>
            <td>{stock.currentValue}</td>
            <td>{stock.initialValue}</td>
            {/*<td>{stock.trend > 0 ? <span className="trending-up"></span> : "down"}{stock.trend}</td>*/}
            <td>{stock.history.length > 1 ? <span className={stock.trend > 0 ? "trend-up" : "trend-down"}>&#10096;</span> : null}&nbsp;&nbsp;{stock.trend}%</td>
            <td>
                <Sparklines data={stock.history.map((history) => { return history.y})}>
                    <SparklinesLine color="blue" />
                </Sparklines>
                {/*<Sparklines  data={currentStock.history.map((history) => { return history.time})} limit={20}>*/}
                {/*<SparklinesLine color="#1c8cdc" />*/}
                {/*/!*<SparklinesSpots />*!/*/}
                {/*</Sparklines>*/}
            </td>
            <td>
                {timeDifference(Date.now(), stock.time)}
            </td>

            {/*<td>*/}
            {/*{*/}
            {/*JSON.stringify(currentStock.history)*/}
            {/*}*/}
            {/*</td>*/}
        </tr>
    );

}