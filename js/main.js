// Init chart
let myChart = echarts.init(document.getElementById('main'));
// Get xAxis values
let mySet = new Set(data.map((item) => {return item.period}));
// Arrays for storing total values
let inTotalValues = [];
let outTotalValues = [];

// Series of bar charts
let mySeries = [
    {
        name: 'В программе ИТ',
        color: '#0078D2',
        type: 'bar',
        stack: 'IN',
        data: getValues("В программе ИТ")
    },
    {
        name: 'В программе ЦП',
        color: '#56B9F2',
        type: 'bar',
        stack: 'IN',
        data: getValues("В программе ЦП")
    },
    {

        name: 'Вне программ ИТ',
        color: '#00724C',
        type: 'bar',
        stack: 'OUT',
        data: getValues("Вне программ ИТ")
    },
    {
        name: 'Вне программ ЦП',
        color: '#22C38E',
        type: 'bar',
        stack: 'OUT',
        data: getValues("Вне программ ЦП"),
    }
];

// Set the initial values
initLabels();

// Chart options
let option = {
    title: {
        text: 'Проекты в программах и вне программ',
        textStyle: {
            fontSize: 14,
        },
        subtext: 'Сумма и процентное соотношение проектов, находящихся в программах и вне программ',
        subtextStyle: {
            color: '#00203399'
        },
        left: '4%'
    },
    tooltip: {
        trigger: 'axis',
        formatter: (params) => createTooltip(params),
    },
    legend: {
        show: true,
        top: 'bottom',
        icon: 'circle',
        selected: {},
        textStyle: {
          color: '#00203399',
        },
        data: ['В программе ИТ', 'В программе ЦП', 'Вне программ ИТ', 'Вне программ ЦП']
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '6%',
        containLabel: true
    },
    xAxis:{
        type: 'category',
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dotted'
            }
        },
        axisLine: {
            show: false,
        },
        axisLabel:{
            color: '#00203399'
        },
        data: [...mySet],
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle:{
                color: '#00416633'
            }
        },
        axisLabel: {
            color: '#00203399'
        },
        show: true
    },
    // Add the auxiliary bars to series for total values
    // Their height is always 0, the total value is displayed with label
    series: [...mySeries,
        {
            name: 'A total of IN',
            type: 'bar',
            tooltip: {
                show: false
            },
            stack: 'IN',
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    color: '#002033',
                    fontSize: 14,
                    fontWeight: 600,
                    formatter: (params) => labelFormatter(params, "IN")
                },
            },
            data: Array(mySet.size).fill(0),
        },
        {
            name: 'A total of OUT',
            type: 'bar',
            tooltip: {
                show: false
            },
            stack: 'OUT',
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    color: '#002033',
                    fontSize: 14,
                    fontWeight: 600,
                    formatter: (params) => labelFormatter(params, "OUT")
                },
            },
            data: Array(mySet.size).fill(0),
        }
    ]
};

// Set the new total values after selecting the legend
myChart.on('legendselectchanged', function (params) {
    let inSum = 0;
    let outSum = 0;
    [inTotalValues.length, outTotalValues.length] = [0, 0];
    for ( let z = 0; z < mySeries[0].data.length; z++){
        for( let i = 0; i < mySeries.length; i++){
            if(params.selected[mySeries[i].name]){
                mySeries[i].stack === "IN" && mySeries[i].name.includes("В программе") ? inSum += mySeries[i].data[z] : outSum += mySeries[i].data[z];
            }
        }
        inTotalValues.push(inSum);
        outTotalValues.push(outSum);
        [inSum, outSum] = [0, 0];
    }
    // Hide the auxiliary bar
    option.legend.selected['A total of IN'] = !inTotalValues.every(elem => elem === 0);
    option.legend.selected['A total of OUT'] = !outTotalValues.every(elem => elem === 0);
    myChart.setOption(option);
});

option && myChart.setOption(option);