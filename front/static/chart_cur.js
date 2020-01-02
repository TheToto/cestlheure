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
            window.myCur.data = chart_curmonth;
            document.getElementById("cur_title").innerText = "Classement " + (month < 10 ? '0' + month : month) + "/" + year;
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
                display: false,
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
                        display: false,
                        labelString: 'Jours'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
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