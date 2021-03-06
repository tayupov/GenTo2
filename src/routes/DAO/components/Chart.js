import React from 'react';
import { Line } from  'react-chartjs-2';

import moment from 'moment';

const getPointColor = (length) => {
    const defaultColor = 'rgb(255, 99, 132)';
    if(length === 3) {
        return [
            defaultColor,
            'rgb(0, 99, 132)',
            defaultColor
        ]
    } else {
        return defaultColor
    }
}

const Chart = ({ chartDataArr }) => {

    const chartData = {
        datasets: [{
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: getPointColor(chartDataArr.length),
            pointBorderColor: getPointColor(chartDataArr.length),
            fill: false,
            // data: [{x: 1518118421000, y: 1}, {x: 1518118472930, y: 2}, {x: 1518246421000, y: 5}],
            data: chartDataArr,
            xAxisID: 'timeAxis'
        }]
    }
    
    const chartOptions = {
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                id: 'timeAxis',
                type: 'time',
                time: {
                    displayFormats: {
                        day: 'll'
                    }
                }
            }]
        },
        tooltips : {
            callbacks: {
                label: (tooltipItem, data) => (
                    moment(tooltipItem.xLabel).format('LLL') + ": " + tooltipItem.yLabel
                )
            }
        }
    }

    return <Line key={chartData} data={chartData} options={chartOptions} />
}

export default Chart;