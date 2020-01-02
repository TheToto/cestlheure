let fill_param = false;

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
            window.myGlobal.data = chart_bymonth;
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

document.getElementById('global_switch').addEventListener("click", function () {
    document.getElementById('global_switch').innerHTML = fill_param ? "Score par équipe" : "Score solo";
    fill_param = !fill_param;
    window.myGlobal.options.scales.yAxes[0].stacked = fill_param;
    document.getElementById("global_title").innerText = fill_param ? "Classement par mois (par équipe)" : "Classement par mois";
    for (let i in window.myGlobal.data.datasets) {
        window.myGlobal.data.datasets[i].fill = fill_param;
        window.myGlobal.data.datasets[i].lineTension = fill_param ? false : undefined;
    }
    window.myGlobal.update();
}, false);