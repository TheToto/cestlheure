function setUp_user() {
    fetch('../graph/user/' + userid)
        .then(function (response) {
            return response.json();
        })
        .then(function (chart_user) {
            // let color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
            window.myUser.data = chart_user;
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