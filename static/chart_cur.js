Date.prototype.monthDays = function () {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
}

function setUp_cur() {

    let chart_dataset = [];
    for (let i in chart_curmonth) {
        let datas = [];
        let counter = 0;
        let index = 0;
        console.log("here");
        for (let day = 1; day < new Date().monthDays() + 1; day++) {
            if (chart_curmonth[i].day[index] && day == chart_curmonth[i].day[index]) {
                counter += chart_curmonth[i].count[index];
                index++;
            }
            if (day <= new Date().getDate())
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
    for (let day = 1; day < new Date().monthDays() + 1; day++) {
        labels.push(day);
    }
    var config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: chart_dataset
        },
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
}


document.addEventListener('DOMContentLoaded', function () {
    setUp_cur();
}, false);