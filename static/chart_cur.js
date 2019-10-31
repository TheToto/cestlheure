Date.prototype.monthDays = function () {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
}

const urlParams = new URLSearchParams(window.location.search);

var year = parseInt(urlParams.get("year")) || new Date().getFullYear();
var month = parseInt(urlParams.get("month")) || new Date().getMonth() + 1;

function setUp_cur() {
    fetch('graph/' + year + "/" + month)
        .then(function (response) {
            return response.json();
        })
        .then(function (chart_curmonth) {
            console.log(chart_curmonth);
            let chart_dataset = [];
            for (let i in chart_curmonth) {
                let datas = [];
                let counter = 0;
                let index = 0;
                for (let day = 1; day < 32; day++) {
                    if (chart_curmonth[i].day[index] && day == chart_curmonth[i].day[index]) {
                        counter += chart_curmonth[i].count[index];
                        index++;
                    }
                    if (year != new Date().getFullYear() || month != new Date().getMonth() + 1 || day <= new Date().getDate())
                        datas.push(counter);
                }
                chart_dataset.push({
                    label: chart_curmonth[i].sender[0].name,
                    fill: false,
                    backgroundColor: chart_curmonth[i].sender[0].color,
                    borderColor: chart_curmonth[i].sender[0].color,
                    data: datas,
                });
            }
            let labels = [];
            for (let day = 1; day < new Date(year, month - 1, 1, 0, 0, 0, 0).monthDays() + 1; day++) {
                labels.push(day);
            }
            var data = {
                labels: labels,
                datasets: chart_dataset
            };
            window.myCur.data = data;
            window.myCur.options.title.text = "Classement " + (month < 10 ? '0' + month : month) + "/" + year;
            window.myCur.update();
        });
}


document.addEventListener('DOMContentLoaded', function () {
    var config = {
        type: 'line',
        data: {},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Classement du mois'
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
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Jours'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Points'
                    }
                }]
            }
        }
    };
    var ctx = document.getElementById('curMonth').getContext('2d');
    window.myCur = new Chart(ctx, config);
    setUp_cur();
}, false);

document.getElementById('cur_prev').addEventListener("click", function () {
    month -= 1;
    if (month == 0) {
        year -= 1;
        month = 12;
    }
    setUp_cur();
}, false);

document.getElementById('cur_next').addEventListener("click", function () {
    month += 1;
    if (month == 13) {
        year += 1;
        month = 1;
    }
    setUp_cur();
}, false);