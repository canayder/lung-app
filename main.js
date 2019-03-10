//import { diffDays, diffSize, startDate, VDT, stage } from './functions'

var date1 = document.getElementById("d1");
var date2 = document.getElementById("d2");
var size1 = document.getElementById("s1");
var size2 = document.getElementById("s2");
var result = document.getElementById("results");
var button = document.querySelector("#calculatescan");
var graphs = document.querySelector("#graphs")

$("#vdt").click(function(){
  $("#vdt").addClass("active");
  $("#vdtInput").removeClass("noDisplay");
  $("#scan").removeClass("active");
  $("#scanInputs").addClass("noDisplay");
});
$("#scan").click(function(){
  $("#vdt").removeClass("active");
  $("#vdtInput").addClass("noDisplay");
  $("#scan").addClass("active");
  $("#scanInputs").removeClass("noDisplay");
});

$(document).on("click", "#tumorSize", function() {
  $("#tumorSize").addClass("active");
  $("#curve_chart").removeClass("noDisplay");
  $("#survival").removeClass("active");
  $("#curve_chart_sur").addClass("noDisplay");
});

$(document).on("click", "#survival", function() {
  $("#survival").addClass("active");
  $("#curve_chart_sur").removeClass("noDisplay");
  $("#tumorSize").removeClass("active");
  $("#curve_chart").addClass("noDisplay");
});

function diffDays() {
  var input1 = date1.value;
  var input2 = date2.value;
  d1 = new Date(input1);
  d2 = new Date(input2);
  var timeDiff = (d2.getTime() - d1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  return {
      diffD: diffDays,
      dayOne: new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()),
      dayTwo: new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()),
  }
};

function diffSize() {
  var input3 = Number(size1.value);
  var input4 = Number(size2.value);
  var diffSize = (input4 - input3);
  return {
      diffS: diffSize,
      sizeOne: Number(size1.value),
      sizeTwo: Number(size2.value)
  };
}

function startDate() {
  dS = diffSize();
  daysAgo = dS.sizeOne / rate();
  return Math.round(daysAgo);
}

function VDT() {
  var dD = diffDays();
  var v1 = (Math.PI*((Math.pow(Number(size1.value), 3))/6));
  var v2 = (Math.PI*((Math.pow(Number(size2.value), 3))/6));
  var vdt = Math.round(((dD.diffD)*Math.log(2))/(Math.log(v2/v1)));
  return vdt;
};

function rate() {
  var dD = diffDays();
  var dS = diffSize();
  var rate = dS.diffS / dD.diffD;
  return rate;
}

function stage() {
  var diam2 = size2.value;
  var diamt = rate();
  var tscan2 = diam2/diamt;
  var stageScan2;
  var t;

  if (diam2 < 1 ) {
      stageScan2 = "T1a";
      var t_T1a = 1.01 / diamt;
      t = t_T1a - tscan2;
    } else if (diam2 <= 2) {
      stageScan2 = "T1b";
      var t_T1b = 2.01 / diamt;
      t = t_T1b - tscan2;
    } else if (diam2 <= 3 ){
      stageScan2 = "T1c";
      var t_T1c = 3.01 / diamt;
      t = t_T1c - tscan2;
    } else if (diam2 <= 4) {
      stageScan2 = "T2a";
      var t_T2a = 4.01 / diamt;
      t = t_T2a - tscan2;
    } else if (diam2 <= 5) {
      stageScan2="T2b";
      var t_T2b = 5.01 / diamt;
      t = t_T2b - tscan2;
    } else if (diam2 <= 7) {
      stageScan2="T3";
      var t_T3 = 7.01 / diamt;
      t = t_T3 - tscan2;
    } else  {
      stageScan2="T4";
    }

    return {
        stageScan2: stageScan2,
        t: Math.round(t)
      };
}


function survivalChance(diam) {
  var survivalChance;

  if (diam < 1.1) {
    return survivalChance = 0.90
  } else if (diam < 2.1) {
    return survivalChance = 0.85
  } else if (diam < 3.1) {
    return survivalChance = 0.80
  } else if (diam < 4.1) {
    return survivalChance = 0.73
  } else if (diam < 5.1) {
    return survivalChance = 0.66
  } else if (diam < 6.1) {
    return survivalChance = 0.63 
  } else {
    return survivalChance = 0.57
  }
}


button.addEventListener("click", function(){
    var dD = diffDays();
    var dS = diffSize();
    var s = stage();
    if (dD.diffD < 0) {
        alert("Please Check the Dates.")
    } else {
    // console.log("========================")
    // console.log("Time Diff: " + dD.diffD);
    // console.log("First Date: " + dD.dayOne);
    // console.log("Second Date: " + dD.dayTwo);
    // console.log("Size Diff: " + dS.diffS);
    // console.log("VDT: " + VDT());
    // console.log("Rate: " + rate());
    // console.log("Stage: " + s.stageScan2);
    // console.log("Days to Next Stage: " + s.t);
    console.log(moment(d1).format("D MM YY"));

    function precise(x) {
      return Number.parseFloat(x).toPrecision(1);
    }
    result.innerHTML = 
    `
    <hr>
    <h4 class="result">Results:</h4>
      <ul>
        <li class="list-group-item">Current stage is ${s.stageScan2}</li>
        <li class="list-group-item">Days to next stage: ${s.t}</li>
        <li class="list-group-item">Loss in Survival: ${precise(survivalChance(dS.sizeOne) - survivalChance(dS.sizeTwo))*100} %</li>
        <li class="list-group-item">Volume Doubling Time: ${VDT()} days</li>
        <li class="list-group-item">Lesion formed ${startDate()} days before the first scan.</li>
      </ul>
    `

    graphs.innerHTML = 
    `
    <ul class="nav nav-tabs">
      <li class="nav-item">
          <a class="nav-link active" id="tumorSize" href="#tumorSize">Tumor Size</a>
      </li>
      <li class="nav-item">
          <a class="nav-link" id="survival" href="#survival">Survival</a>
      </li>
    </ul>

    <div id="curve_chart" class="chart">
      <canvas id="myChart" class=""></canvas>
    </div>
    
    <div id="curve_chart_sur" class="chart noDisplay">
      <canvas id="myChart2" class=""></canvas>
    </div>
    
    `
    $('html, body').animate({
        scrollTop: $("hr").offset().top
    }, 1000);

     google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var dD = diffDays();
        var dS = diffSize();

        var data1 = google.visualization.arrayToDataTable([
          ['Time', 'Tumor Size', 'Stage T1b', 'Stage T1c', 'Stage T2a', 'Stage T2b', 'Stage T3'],
          [dD.dayOne,  dS.sizeOne,    1,          2,              3,         4,           5],
          [dD.dayTwo,  dS.sizeTwo,    1,          2,              3,         4,           5]
        ]);
      
        var options1 = {
          title: 'Tumor Size over Time',
          curveType: 'function',
          legend: 'top',
          chartArea: {'width': '80%', 'height': '80%'},
          vAxis: {
            title: 'Tumor Size in cm',
            gridlines: {count:25},
            direction: -1,
            viewWindowMode:'explicit',
            viewWindow: {
                max: dS.sizeTwo + 1,
                min:0
            }
          },
          hAxis: {
            title: 'Date'
          },
          series: {
            0 : {color: 'red', lineWidth: 3},
            1 : {lineDashStyle: [4, 4], color: '#35ff46'},
            2 : {lineDashStyle: [4, 4], color: '#b1ff34'},
            3 : {lineDashStyle: [4, 4], color: '#f4ff33'},
            4 : {lineDashStyle: [4, 4], color: '#ffcf32'},
            5 : {lineDashStyle: [4, 4], color: '#ff3131'},
          }
        };

        var chart1 = new google.visualization.LineChart(document.getElementById('curve_chart'));
        chart1.draw(data1, options1);
      };
    };

    // var dD = diffDays();
    // var dS = diffSize();

    // var ctx = document.getElementById('myChart').getContext('2d');
    // var scatterChart = new Chart(ctx, {
    //   type: 'scatter',
    //   data: {
    //       datasets: [{
    //           label: 'Scatter Dataset',
    //           data: [{
    //               x: new Date(d1),
    //               y: dS.sizeOne
    //           }, {
    //               x: new Date(d2),
    //               y: dS.sizeTwo
    //           }]
    //       }]
    //   },
    //   options: {
    //     scales: {
    //       xAxes: [{
    //       }]
    //     }
    //   }
    // });

  });


$(document).on("click", "#survival", function() {
  google.charts.setOnLoadCallback(drawChart_sur);

      function drawChart_sur() {
        var dD = diffDays();
        var dS = diffSize();

        var data2 = google.visualization.arrayToDataTable([
          ['Time',            'Percentage',        'Stage T1b', 'Stage T1c', 'Stage T2a', 'Stage T2b', 'Stage T3'],
          [dD.dayOne,   survivalChance(dS.sizeOne)*100,    83,          77,              68,         60,           56],
          [dD.dayTwo,   survivalChance(dS.sizeTwo)*100,    83,          77,              68,         60,           56]
        ]);

        var options2 = {
          title: 'Survival Rate over Time',
          curveType: 'function',
          legend: 'top',
          chartArea: {'width': '80%', 'height': '80%'},
          vAxis: {
            title: 'Percentage',
            gridlines: {count:25},
            viewWindowMode:'explicit',
            viewWindow: {
                max: 100,
                min: survivalChance(dS.sizeTwo)*100 - 15
            }
          },
          hAxis: {
            title: 'Date'
          },
          series: {
            0 : {color: 'red', lineWidth: 3},
            1 : {lineDashStyle: [4, 4], color: '#35ff46'},
            2 : {lineDashStyle: [4, 4], color: '#b1ff34'},
            3 : {lineDashStyle: [4, 4], color: '#f4ff33'},
            4 : {lineDashStyle: [4, 4], color: '#ffcf32'},
            5 : {lineDashStyle: [4, 4], color: '#ff3131'},
          }
        };

        var chart2 = new google.visualization.LineChart(document.getElementById('curve_chart_sur'));
        chart2.draw(data2, options2);

      };

});




$("#calculatevdt").click(() => {
  var vdtValue = document.querySelector("#vdtValue");
  var inputVdt = Number(vdtValue.value);
  result.innerHTML = 
  ` 
  <hr>
  <h4 class="result">Results:</h4>
  <p>Volume Doubling Time is ${inputVdt}
  `

  graphs.innerHTML = `<div id="curve_chart_vdt" class="chart"></div>`

  $('html, body').animate({
    scrollTop: $("hr").offset().top
}, 1000);

  google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart_vdt);

      function drawChart_vdt() {

        var data3 = google.visualization.arrayToDataTable([
          ['Time', 'Percentage', 'Stage T1b', 'Stage T1c', 'Stage T2a', 'Stage T2b', 'Stage T3'],
          [0,         89,    83,          77,              68,         60,           56],
          [7,         78,    83,          77,              68,         60,           56]
        ]);

        var options3 = {
          title: 'Survival Rate over Time',
          curveType: 'function',
          legend: 'top',
          chartArea: {'width': '80%', 'height': '80%'},
          vAxis: {
            title: 'Percentage',
            gridlines: {count:25},
            viewWindowMode:'explicit',
            viewWindow: {
                max: 100,
                min: 78 - 15
            }
          },
          hAxis: {
            title: 'Year',
            gridlines: {count:7}
          },
          series: {
            0 : {color: 'red', lineWidth: 3},
            1 : {lineDashStyle: [4, 4], color: '#35ff46'},
            2 : {lineDashStyle: [4, 4], color: '#b1ff34'},
            3 : {lineDashStyle: [4, 4], color: '#f4ff33'},
            4 : {lineDashStyle: [4, 4], color: '#ffcf32'},
            5 : {lineDashStyle: [4, 4], color: '#ff3131'},
          }
        };

        var chart3 = new google.visualization.LineChart(document.getElementById('curve_chart_vdt'));
        chart3.draw(data3, options3);

      };

});
