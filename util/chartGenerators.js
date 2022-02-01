//Import Chart creator-----------------------------------------------------------------
const QuickChart = require('quickchart-js');

async function createLineChart(data){
    const chart = new QuickChart();
    const labels = Array.from(Array(data.length).keys())
    chart.setWidth(300)
            chart.setHeight(180);

            chart.setConfig({
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgb(255, 99, 132)',
                            data,
                            label: 'Dataset',
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                    xAxes: [
                        {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                        },
                        },
                    ],
                    },
                    title: {
                    text: 'Burnout over Time',
                    display: true,
                    },
                },
            });
            const url = chart.getUrl();
            const image = await chart.toBinary();
            return {url, image};
}


async function createRadarChart(labels, data){
    const chart = new QuickChart();
    chart.setConfig({
        "type": "radar",
        "data": {
          "labels": labels,
          "datasets": [
                {
                "backgroundColor": "rgba(255, 99, 132, 0.5)",
                "borderColor": "rgb(255, 99, 132)",
                data,
                label: 'Your Score'
                },
            ],
            "options": {
                "maintainAspectRatio": true,
                "spanGaps": false,
                "elements": {
                  "line": {
                    "tension": 0.000001
                  }
                },
                "plugins": {
                  "filler": {
                    "propagate": false
                  },
                  "samples-filler-analyser": {
                    "target": "chart-analyser"
                  }
                }
            }
        }
    });

    const url = chart.getUrl();
    const image = await chart.toBinary();
    return {url, image};
}