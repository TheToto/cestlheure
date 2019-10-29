const next_date = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
}

let fill_param = false;

function compare_date(date1, date2) {
    if (date1.year > date2.year)
        return 1
    if (date1.year == date2.year) {
        if (date1.month > date2.month)
            return 1;
        if (date1.month == date2.month)
            return 0; // (equality)
    }
    return -1; // (date 2 greater)
}

function add_one_date(date) {
    date.month += 1;
    if (date.month >= 13) {
        date.month = 1;
        date.year += 1;
    }
    return date;
}

function background_color(col) {
    let amt = 95;
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function setUp_global() {
    fetch('graph/global')
        .then(function (response) {
            return response.json();
        })
        .then(function (chart_bymonth) {
            console.log(chart_bymonth);
            let chart_dataset = [];
            for (let i in chart_bymonth) {
                let date = {
                    year: 2018,
                    month: 12
                };
                let datas = [];
                let index = 0;
                while (compare_date(next_date, date) != -1) {
                    if (chart_bymonth[i].date[index] && compare_date(date, chart_bymonth[i].date[index]) == 0) {
                        datas.push(chart_bymonth[i].count[index]);
                        index++;
                    } else {
                        datas.push(null);
                    }
                    date = add_one_date(date);
                }
                chart_dataset.push({
                    label: chart_bymonth[i].sender[0].name,
                    fill: fill_param,
                    backgroundColor: background_color(chart_bymonth[i].sender[0].color),
                    borderColor: chart_bymonth[i].sender[0].color,
                    data: datas,
                });
            }
            let labels = [];
            let date = {
                year: 2018,
                month: 12
            };
            while (compare_date(next_date, date) != -1) {
                labels.push((date.month < 10 ? '0' + date.month : date.month) + "/" + date.year);
                date = add_one_date(date);
            }
            let data = {
                labels: labels,
                datasets: chart_dataset
            };
            window.myGlobal.data = data;
            window.myGlobal.update();
        });
}


document.addEventListener('DOMContentLoaded', function () {
    let config = {
        type: 'line',
        data: {},
        options: {
            fill: false,
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Classement par mois'
            },
            tooltips: {
                mode: 'nearest',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: false
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Mois'
                    }
                }],
                yAxes: [{
                    stacked: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Points'
                    }
                }]
            }
        }
    };
    var ctx = document.getElementById('byMonth').getContext('2d');
    window.myGlobal = new Chart(ctx, config);
    setUp_global();
}, false);

document.getElementById('switch_graph').addEventListener("click", function () {
    document.getElementById('switch_graph').innerHTML = fill_param ? "Score par équipe" : "Score solo";
    fill_param = !fill_param;
    window.myGlobal.options.scales.yAxes[0].stacked = fill_param;
    for (let i in window.myGlobal.data.datasets) {
        window.myGlobal.data.datasets[i].fill = fill_param;
        window.myGlobal.data.datasets[i].lineTension = fill_param ? false : undefined;
    }
    window.myGlobal.update();
}, false);