// Set the initial labels values
function initLabels(){
    let inSum = 0;
    let outSum = 0;
    for ( let z = 0; z < mySeries[0].data.length; z++){
        for( let i = 0; i < mySeries.length; i++){
            mySeries[i].stack === "IN" && mySeries[i].name.includes("В программе") ? inSum += mySeries[i].data[z] : outSum += mySeries[i].data[z];
        }
        inTotalValues.push(inSum);
        outTotalValues.push(outSum);
        [inSum, outSum] = [0, 0];
    }
}

// Get values by period and series name
function getValues(name) {
    return [...mySet].map((item) => {
        return data.find((row) => {
            return row.period === item && row.name === name
        }).value;
    });
}

// Get value of the label by data index
function labelFormatter(params, stack){
    return stack === "OUT" ? outTotalValues[params.dataIndex] : inTotalValues[params.dataIndex];
}

// Creating tooltip view
function createTooltip(params) {
    // Round mark
    let colorSpan = color => '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + color + '"></span>';
    // Find bar total value
    let totalSum = 0;
    params.map((item) => totalSum += item.value);
    // Sum of items in the program
    let firstSum = 0;
    // Sum of items outside the program
    let secondSum = 0;
    params.map((item) => {
        item.seriesName.includes("В программе") ? firstSum += item.value : secondSum += item.value;
    });
    // Collecting tooltip from the html elements
    let result = `
                <table>
                <tr><th class="left_th_bold">${params[0].name}</th><th class="right_th"></th></tr>
                <tr><th class="left_th_bold">В программе</th><th class="right_th">${Math.round(100 * firstSum / totalSum)}% | ${firstSum} шт.</th></tr>
                `;
    params.forEach((item) => {
        if (item.seriesName.includes("В программе")) {
            result += `<tr><th class="left_th">${colorSpan(item.color)} Проекты ${item.seriesName.slice(-2)}</th> <th class="right_th">${item.value} шт.</th></tr>`
        }
    });
    result += `<tr><th class="left_th_bold">Вне программ</th><th class="right_th">${Math.round(100 * secondSum / totalSum)}% | ${secondSum} шт.</th></tr>`;
    params.forEach((item) => {
        if (item.seriesName.includes("Вне программ")) {
            result += `<tr><th class="left_th">${colorSpan(item.color)}Проекты ${item.seriesName.slice(-2)}</th> <th class="right_th">${item.value} шт.</th></tr>`
        }
    });
    result += `</table>`
    return result;
}