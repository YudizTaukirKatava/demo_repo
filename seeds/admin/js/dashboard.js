$(document).ready(async () => {
    let tokenAdmin = localStorage.getItem('AuthorizationAdmin');
    try {
        let oResponse = await _helper.call_API(
            'GET',
            '/admin/getDashboardData',
            {},
            { Authorization: tokenAdmin }
        );

        console.log(oResponse.oEarning[0]);
        let monthlyBNB = oResponse.oEarning[0]?.nMonthlyEarnings[0]?.BNB
            ? oResponse.oEarning[0].nMonthlyEarnings[0].BNB
            : 0;
        let monthlyAVAX = oResponse.oEarning[0]?.nMonthlyEarnings[0]?.AVAX
            ? oResponse.oEarning[0].nMonthlyEarnings[0].AVAX
            : 0;

        let monthlyMATIC = oResponse.oEarning[0]?.nMonthlyEarnings[0]?.MATIC
            ? oResponse.oEarning[0].nMonthlyEarnings[0].MATIC
            : 0;

        let monthlyETH = oResponse.oEarning[0]?.nMonthlyEarnings[0]?.ETH
            ? oResponse.oEarning[0].nMonthlyEarnings[0].ETH
            : 0;

        let yearlyBNB = oResponse.oEarning[0]?.nYearlyEarnings[0]?.BNB
            ? oResponse.oEarning[0].nYearlyEarnings[0].BNB
            : 0;
        let yearlyAVAX = oResponse.oEarning[0]?.nYearlyEarnings[0]?.AVAX
            ? oResponse.oEarning[0].nYearlyEarnings[0].AVAX
            : 0;
        let yearlyMATIC = oResponse.oEarning[0]?.nYearlyEarnings[0]?.MATIC
            ? oResponse.oEarning[0].nYearlyEarnings[0].MATIC
            : 0;
        let yearlyETH = oResponse.oEarning[0]?.nYearlyEarnings[0]?.ETH
            ? oResponse.oEarning[0].nYearlyEarnings[0].ETH
            : 0;

        $('#numberOfUsers').text(oResponse.nTotalRegisterUsers);
        $('#numberOfNFTsOnSale').text(oResponse.nFixedSaleNFTsCount);
        $('#numberOfNFTsOnAuction').text(oResponse.nAuctionNFTsCount);
        $('#numberOfNFTsSold').text(oResponse.nSoldNFTsCount);

        $('#monthlyBNB').text(truncateDecimals(monthlyBNB, 6));
        $('#monthlyAVAX').text(truncateDecimals(monthlyAVAX, 6));
        $('#monthlyMATIC').text(truncateDecimals(monthlyMATIC, 6));
        $('#monthlyETH').text(truncateDecimals(monthlyETH, 6));

        $('#yearlyBNB').text(truncateDecimals(yearlyBNB, 6));
        $('#yearlyAVAX').text(truncateDecimals(yearlyAVAX, 6));
        $('#yearlyMATIC').text(truncateDecimals(yearlyMATIC, 6));
        $('#yearlyETH').text(truncateDecimals(yearlyETH, 6));

        var dates = [];
        var count = [];
        for (let I = 0; I < oResponse.data.length; I++) {
            var date = new Date(oResponse.data[I].date).toUTCString();
            date = date.substr(5, 6);
            dates.push(date);
            count.push(oResponse.data[I].count);
        }
        dates.reverse();
        count.reverse();

        var lineChart = 'activityLine';
        if ($('#' + lineChart).length > 0) {
            var lineCh = document.getElementById(lineChart).getContext('2d');

            var chart = new Chart(lineCh, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: '',
                            tension: 0.4,
                            backgroundColor: 'transparent',
                            borderColor: '#2c80ff',
                            pointBorderColor: '#2c80ff',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 2,
                            pointHoverRadius: 6,
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#2c80ff',
                            pointHoverBorderWidth: 2,
                            pointRadius: 6,
                            pointHitRadius: 6,
                            data: count,
                        },
                    ],
                },

                // Configuration options go here
                options: {
                    legend: {
                        display: false,
                    },
                    maintainAspectRatio: false,
                    tooltips: {
                        callbacks: {
                            title: function (tooltipItem, data) {
                                return (
                                    'Date : ' +
                                    data['labels'][tooltipItem[0]['index']]
                                );
                            },
                            label: function (tooltipItem, data) {
                                return (
                                    data['datasets'][0]['data'][
                                        tooltipItem['index']
                                    ] + ' Users'
                                );
                            },
                        },
                        backgroundColor: '#eff6ff',
                        titleFontSize: 13,
                        titleFontColor: '#6783b8',
                        titleMarginBottom: 10,
                        bodyFontColor: '#9eaecf',
                        bodyFontSize: 14,
                        bodySpacing: 4,
                        yPadding: 15,
                        xPadding: 15,
                        footerMarginTop: 5,
                        displayColors: false,
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    fontSize: 12,
                                    fontColor: '#9eaecf',
                                },
                                gridLines: {
                                    color: '#e5ecf8',
                                    tickMarkLength: 0,
                                    zeroLineColor: '#e5ecf8',
                                },
                            },
                        ],
                        xAxes: [
                            {
                                ticks: {
                                    fontSize: 12,
                                    fontColor: '#9eaecf',
                                    source: 'auto',
                                },
                                gridLines: {
                                    color: 'transparent',
                                    tickMarkLength: 20,
                                    zeroLineColor: '#e5ecf8',
                                },
                            },
                        ],
                    },
                },
            });
        }
    } catch (error) {
        console.log('file: dashboard.js ~ line 6 ~ $ ~ error', error);
        localStorage.clear();
        window.location.href = '/a/signin';
        notify('error', error);
    }
});

truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};
