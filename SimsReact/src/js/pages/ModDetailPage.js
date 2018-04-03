/**
 * Created by lema on 2018/4/2.
 */
import React from 'react';
import axios from 'axios';
import eventProxy from 'react-eventproxy'

import { DateRangePicker } from 'react-dates';
import TimeSeriesData from '../components/TimeSeriesData'

import 'antd/dist/antd.css';

import { Card, Icon, Avatar } from 'antd';
import { Row, Col, Slider } from 'antd';
const { Meta } = Card;


class ModDetailPage extends React.Component{


    constructor(props) {
        super(props)
        this.state = {
            modEntry : null,
            modName:  "Reduced Random Townies Generation (UPDATED 03.13.2018)",

        }

        this.renderTimeSeriesData = this.renderTimeSeriesData.bind(this);
    }

    componentWillMount() {
        axios.post('http://localhost:3000/getModByName', {

                modName:  "Reduced Random Townies Generation (UPDATED 03.13.2018)" ,
        })
            .then(res => {
                console.log("received data");
                // console.log(res.data);
                this.setState({ 'modEntry' : res.data})
            });
    }

    renderTimeSeriesData() {
        const sort_by_date = (a, b) => {
            const timestamp1 = Date.parse(a['date'])/1000;
            const timestamp2 = Date.parse(b['date'])/1000;

            return timestamp1 - timestamp2;
        }

        return (this.state.modEntry === null || this.state.modEntry === undefined) ? null : <TimeSeriesData itemForTimeSeriesData = {this.state.modEntry.time_series_data.sort(sort_by_date)}/>;
    }

    render () {

        return (
            <div className="container">
                <Row gutter={16}>
                    <Col span = {12}>
                        <h1> {this.state.modName} </h1>
                        <Card
                           style={{ width: 400 }}
                            cover={<img alt="mod img" src = { "http:" + this.state.modEntry["preview_image"]} />}
                            actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                        >
                            <Meta
                                title={this.state.modName}
                                description = {Object.keys(this.state.modEntry).map((key, i) => {
                                    if (key !== 'description' && key !== "preview_image"
                                        && !Array.isArray(this.state.modEntry[key]) && typeof this.state.modEntry[key] !== 'object') {
                                        return (
                                            <div className="item_stats" key={i}>
                                                <span>{key} : {this.state.modEntry[key].toString()}</span>
                                            </div>
                                        );
                                    }
                                })}
                            />
                        </Card>
                    </Col>
                    <Col span = {12}>
                        <br/>
                        <br/>
                        <h1> LifeCycle </h1>
                        {this.renderTimeSeriesData()}
                    </Col>
                </Row>

            </div>
        );
    }
};

export default ModDetailPage;


