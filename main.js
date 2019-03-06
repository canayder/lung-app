var date1 = document.getElementById("d1");
var date2 = document.getElementById("d2");
var size1 = document.getElementById("s1");
var size2 = document.getElementById("s2");
var result = document.getElementById("results");
var button = document.querySelector("#calculate")

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

button.addEventListener("click", function(){
    var dD = diffDays();
    var dS = diffSize();
    if (dD.diffD < 0) {
        alert("Please Check the Dates.")
    } else {
    console.log("========================")
    console.log("Time Diff: " + dD.diffD);
    console.log("First Date: " + dD.dayOne);
    console.log("Second Date: " + dD.dayTwo);
    console.log("Size Diff: " + dS.diffS);
    console.log("VDT: " + VDT());
    console.log("Rate: " + rate());
    var s = stage();
    console.log("Stage: " + s.stageScan2);
    console.log("Days to Next Stage: " + s.t);
    result.innerHTML = 
    `<hr>
    <h4>Results:</h4>
      <ul>
        <li class="list-group-item">Current stage is ${s.stageScan2}</li>
        <li class="list-group-item">Days to next stage: ${s.t}</li>
        <li class="list-group-item">Volume Doubling Time: ${VDT()} days</li>
        <li class="list-group-item">Lesion formed ${startDate()} days before the first scan.</li>
    </ul>`
    }

google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
      var dD = diffDays();
      var dS = diffSize();

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Time', 'Tumor Size', 'Stage T1b', 'Stage T1c', 'Stage T2a', 'Stage T2b', 'Stage T3'],
          [dD.dayOne,  dS.sizeOne,    1,          2,              3,         4,           5],
          [dD.dayTwo,  dS.sizeTwo,    1,          2,              3,         4,           5]
        ]);

        var options = {
          title: 'Tumor Size over Time',
          curveType: 'function',
          legend: 'top',
          chartArea: {'width': '80%', 'height': '80%'},
          vAxis: {
            title: 'Tumor Size in cm',
            gridlines: {count:25},
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
            1 : {lineDashStyle: [4, 4]},
            2 : {lineDashStyle: [4, 4]},
            3 : {lineDashStyle: [4, 4]},
            4 : {lineDashStyle: [4, 4]},
            5 : {lineDashStyle: [4, 4]},
          }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
});

