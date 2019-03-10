export { diffDays, diffSize, startDate, VDT, rate, stage }

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