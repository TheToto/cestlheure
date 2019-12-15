
function setUp_user() {
    fetch('../graph/user/' + userid)
        .then(function (response) {
            return response.json();
        })
        .then(function (chart_user) {
            console.log(chart_user);
            let labels = Array.from(Array(31 + 1).keys()).slice(1); // [1,2,3,...,31]

            let chart_dataset = [];
            for (let i in chart_user) {
                let days = new Array(31).fill(0);
                for (let j in chart_user[i].days) {
                    days[chart_user[i].days[j].day - 1] = chart_user[i].days[j].count;
                }

                let datas = [];
                let counter = 0;
                for (let day = 0; day < days.length; day++) {
                    
                    counter += days[day];

                    if (chart_user[i]._id.year != new Date().getFullYear()
                            || chart_user[i]._id.month != new Date().getMonth() + 1
                            || day + 1 <= new Date().getDate())
                        datas.push(counter);
                }

                let month = chart_user[i]._id.month < 10 ? "0" + chart_user[i]._id.month : chart_user[i]._id.month;

                let color = "#"+((1<<24)*Math.random()|0).toString(16);
                chart_dataset.push({
                    label: month + "/" + chart_user[i]._id.year,
                    fill: false,
                    backgroundColor: color,
                    borderColor: color,
                    data: datas,
                });
            }
            var data = {
                labels: labels,
                datasets: chart_dataset
            };
            window.myUser.data = data;
            window.myUser.update();
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
                text: 'Details'
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
    var ctx = document.getElementById('detailUser').getContext('2d');
    window.myUser = new Chart(ctx, config);
    setUp_user();
}, false);