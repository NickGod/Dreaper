/**
 * Created by lema on 2018/3/15.
 */


import React from 'react';
import { BarChart, Bar, Brush, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

export default class LineChartWithTimeRange extends React.Component {
    render () {
        return (
            <BarChart width={600} height={300} data={this.props.itemWithRange}
                      margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="time"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
                <ReferenceLine y={0} stroke='#000'/>
                <Brush dataKey='key' height={30} stroke="#8884d8"/>
                <Bar dataKey= "num" fill="#8884d8" />
            </BarChart>
        );
    }
}
