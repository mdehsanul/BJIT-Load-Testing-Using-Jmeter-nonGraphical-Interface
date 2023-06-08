/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6138888888888889, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38, 500, 1500, "About Us"], "isController": false}, {"data": [1.0, 500, 1500, "Contact-0"], "isController": false}, {"data": [0.475, 500, 1500, "Contact-1"], "isController": false}, {"data": [0.355, 500, 1500, "Technology"], "isController": false}, {"data": [0.375, 500, 1500, "All pages"], "isController": false}, {"data": [0.425, 500, 1500, "News"], "isController": false}, {"data": [0.4, 500, 1500, "Works"], "isController": false}, {"data": [0.42, 500, 1500, "Blog"], "isController": false}, {"data": [1.0, 500, 1500, "Blog-0"], "isController": false}, {"data": [0.44, 500, 1500, "Blog-1"], "isController": false}, {"data": [0.995, 500, 1500, "All pages-0"], "isController": false}, {"data": [0.425, 500, 1500, "About Us-1"], "isController": false}, {"data": [0.42, 500, 1500, "All pages-1"], "isController": false}, {"data": [1.0, 500, 1500, "About Us-0"], "isController": false}, {"data": [1.0, 500, 1500, "Services-0"], "isController": false}, {"data": [0.995, 500, 1500, "Works-0"], "isController": false}, {"data": [0.43, 500, 1500, "Services-1"], "isController": false}, {"data": [0.455, 500, 1500, "Works-1"], "isController": false}, {"data": [0.995, 500, 1500, "Technology-0"], "isController": false}, {"data": [0.45, 500, 1500, "Capabilities-1"], "isController": false}, {"data": [0.405, 500, 1500, "Clients"], "isController": false}, {"data": [0.465, 500, 1500, "FAQ`s-1"], "isController": false}, {"data": [1.0, 500, 1500, "FAQ`s-0"], "isController": false}, {"data": [0.995, 500, 1500, "Capabilities-0"], "isController": false}, {"data": [0.435, 500, 1500, "Contact"], "isController": false}, {"data": [0.435, 500, 1500, "Career-1"], "isController": false}, {"data": [0.42, 500, 1500, "FAQ`s"], "isController": false}, {"data": [0.39, 500, 1500, "Services"], "isController": false}, {"data": [0.995, 500, 1500, "Career-0"], "isController": false}, {"data": [0.425, 500, 1500, "Technology-1"], "isController": false}, {"data": [0.41, 500, 1500, "Capabilities"], "isController": false}, {"data": [0.47, 500, 1500, "News-1"], "isController": false}, {"data": [0.995, 500, 1500, "News-0"], "isController": false}, {"data": [0.445, 500, 1500, "Clients-1"], "isController": false}, {"data": [0.38, 500, 1500, "Career"], "isController": false}, {"data": [1.0, 500, 1500, "Clients-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 0, 0.0, 833.4269444444442, 112, 3487, 923.0, 1552.8000000000002, 1794.9499999999998, 2218.99, 22.99379167624741, 1388.9687284433203, 3.751211565238497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["About Us", 100, 0, 0.0, 1284.5700000000002, 408, 2478, 1216.5, 1892.0, 2033.0999999999995, 2476.5899999999992, 0.6660450246436659, 60.34992340482217, 0.15740517183961636], "isController": false}, {"data": ["Contact-0", 100, 0, 0.0, 136.76999999999995, 112, 248, 131.0, 162.0, 174.79999999999995, 247.89999999999995, 0.6883496816382723, 0.26821437790397523, 0.10284912235415591], "isController": false}, {"data": ["Contact-1", 100, 0, 0.0, 1054.46, 347, 1867, 1028.5, 1499.3000000000002, 1738.1999999999994, 1866.61, 0.687341911360387, 62.01179929788024, 0.07719171856098098], "isController": false}, {"data": ["Technology", 100, 0, 0.0, 1285.81, 575, 2460, 1251.5, 1820.0000000000002, 1991.6999999999998, 2456.5699999999983, 0.6676057654433903, 60.4913411532222, 0.1649455650949002], "isController": false}, {"data": ["All pages", 100, 0, 0.0, 1324.6600000000005, 686, 3487, 1255.0, 1832.1000000000001, 2289.5999999999967, 3477.249999999995, 0.6633103164653519, 60.10213320597776, 0.15157677153602772], "isController": false}, {"data": ["News", 100, 0, 0.0, 1245.5700000000002, 401, 2570, 1208.5, 1690.7, 2036.3999999999978, 2568.2599999999993, 0.6791909477430486, 61.54106728065528, 0.15785883355746633], "isController": false}, {"data": ["Works", 100, 0, 0.0, 1213.0799999999997, 456, 2193, 1151.0, 1718.0000000000002, 1826.8499999999992, 2192.91, 0.6702951980052015, 60.73502895675256, 0.1747742361986219], "isController": false}, {"data": ["Blog", 100, 0, 0.0, 1244.9299999999998, 453, 2285, 1174.5, 1811.8000000000004, 2097.8499999999985, 2284.2299999999996, 0.6775297266167554, 61.39054507266506, 0.16607418103594296], "isController": false}, {"data": ["Blog-0", 100, 0, 0.0, 141.68999999999994, 112, 269, 136.0, 170.9, 186.64999999999992, 268.71999999999986, 0.6791217597403039, 0.2646187325550598, 0.0901958587155091], "isController": false}, {"data": ["Blog-1", 100, 0, 0.0, 1103.2300000000005, 341, 2128, 1041.5, 1655.6000000000004, 1939.2999999999988, 2127.0699999999997, 0.6780718349301925, 61.1754555371346, 0.07615064552438686], "isController": false}, {"data": ["All pages-0", 100, 0, 0.0, 155.10000000000008, 112, 563, 138.5, 240.9, 261.5999999999999, 560.1799999999986, 0.6658454572693677, 0.2594456420414822, 0.07737852481938942], "isController": false}, {"data": ["About Us-1", 100, 0, 0.0, 1141.4499999999998, 285, 2351, 1058.0, 1766.0, 1872.7499999999998, 2349.099999999999, 0.6666000066660001, 60.14047032796721, 0.07486230543612306], "isController": false}, {"data": ["All pages-1", 100, 0, 0.0, 1169.5100000000002, 574, 3243, 1112.5, 1704.7, 2032.649999999998, 3234.3599999999956, 0.6644959797993222, 59.95064559937537, 0.07462601335636919], "isController": false}, {"data": ["About Us-0", 100, 0, 0.0, 143.09, 112, 302, 140.0, 172.8, 183.74999999999994, 301.3499999999997, 0.6684626028596831, 0.2604654087314585, 0.08290502984685522], "isController": false}, {"data": ["Services-0", 100, 0, 0.0, 140.16000000000005, 112, 226, 134.5, 168.9, 176.89999999999998, 225.5999999999998, 0.6692634086923931, 0.2607774414729149, 0.09084727910961196], "isController": false}, {"data": ["Works-0", 100, 0, 0.0, 147.17, 112, 575, 138.0, 174.9, 181.95, 572.5699999999988, 0.6718443471016635, 0.26178310009137085, 0.09972689527290318], "isController": false}, {"data": ["Services-1", 100, 0, 0.0, 1129.5499999999997, 458, 2564, 1034.0, 1749.7000000000003, 2006.8999999999996, 2562.8999999999996, 0.6680517606504152, 60.27144717547716, 0.07502534421366967], "isController": false}, {"data": ["Works-1", 100, 0, 0.0, 1065.8599999999997, 344, 2040, 1009.5, 1542.1000000000001, 1606.85, 2039.9099999999999, 0.6708527880641871, 60.52415510284173, 0.07533991272205227], "isController": false}, {"data": ["Technology-0", 100, 0, 0.0, 145.23000000000005, 112, 525, 138.0, 174.70000000000002, 185.74999999999994, 522.3899999999987, 0.6696667738133505, 0.26093461206203794, 0.0902480613146898], "isController": false}, {"data": ["Capabilities-1", 100, 0, 0.0, 1078.4200000000005, 458, 2151, 1027.0, 1547.4, 1862.9499999999998, 2149.7599999999993, 0.6696039961966493, 60.41148944201898, 0.07519966754161587], "isController": false}, {"data": ["Clients", 100, 0, 0.0, 1262.97, 459, 2532, 1174.0, 1879.6000000000006, 2077.9499999999994, 2531.3499999999995, 0.6730199752328649, 60.98191931836537, 0.15839630276476604], "isController": false}, {"data": ["FAQ`s-1", 100, 0, 0.0, 1069.0799999999995, 349, 2230, 1019.0, 1544.7000000000003, 1747.35, 2229.2699999999995, 0.6843596446804725, 61.74274001348188, 0.0768567960334515], "isController": false}, {"data": ["FAQ`s-0", 100, 0, 0.0, 139.33999999999997, 112, 233, 135.5, 173.0, 179.95, 232.67999999999984, 0.6854667342993844, 0.26709104197798283, 0.10241836948027913], "isController": false}, {"data": ["Capabilities-0", 100, 0, 0.0, 143.15000000000006, 112, 558, 135.5, 167.9, 174.0, 555.0599999999985, 0.6708437873156857, 0.26139323353413924, 0.0890964405028645], "isController": false}, {"data": ["Contact", 100, 0, 0.0, 1191.2399999999996, 461, 2042, 1163.5, 1617.8, 1875.0499999999995, 2041.3899999999996, 0.68667170225915, 62.218893771887664, 0.1797148595756369], "isController": false}, {"data": ["Career-1", 100, 0, 0.0, 1106.9400000000005, 345, 2058, 1064.5, 1682.9, 1886.0999999999985, 2057.6699999999996, 0.6821887343352412, 61.54688107574342, 0.07661299262553979], "isController": false}, {"data": ["FAQ`s", 100, 0, 0.0, 1208.4399999999991, 463, 2372, 1155.5, 1718.7, 1859.3999999999999, 2371.4199999999996, 0.6838074398249453, 61.9593647428884, 0.17896522839168488], "isController": false}, {"data": ["Services", 100, 0, 0.0, 1269.7499999999995, 573, 2694, 1178.5, 1928.1000000000006, 2166.949999999999, 2693.22, 0.6672182337398916, 60.45622714777549, 0.1655013978221997], "isController": false}, {"data": ["Career-0", 100, 0, 0.0, 142.29999999999993, 112, 526, 134.0, 172.8, 177.95, 523.5199999999987, 0.6836064341037579, 0.26636617891347597, 0.08344805103805637], "isController": false}, {"data": ["Technology-1", 100, 0, 0.0, 1140.4999999999998, 461, 2320, 1113.5, 1668.8000000000002, 1855.7999999999997, 2316.499999999998, 0.6682347909761573, 60.287960121418266, 0.07504589937720518], "isController": false}, {"data": ["Capabilities", 100, 0, 0.0, 1221.6, 572, 2300, 1181.5, 1668.9, 2015.0999999999995, 2298.6799999999994, 0.6687889569567427, 60.59854939675236, 0.16393166816029534], "isController": false}, {"data": ["News-1", 100, 0, 0.0, 1102.41, 278, 2445, 1053.5, 1539.8000000000002, 1899.799999999998, 2442.7299999999987, 0.6797773049548967, 61.32932257642396, 0.07634217780255188], "isController": false}, {"data": ["News-0", 100, 0, 0.0, 143.12, 112, 592, 137.0, 166.8, 178.95, 587.9399999999979, 0.6812963707342331, 0.26546606633101466, 0.08183540390655339], "isController": false}, {"data": ["Clients-1", 100, 0, 0.0, 1121.2299999999996, 347, 2413, 1038.5, 1709.9000000000003, 1921.5, 2411.6599999999994, 0.6738726111215936, 60.79660271334807, 0.0756790530068196], "isController": false}, {"data": ["Career", 100, 0, 0.0, 1249.31, 457, 2219, 1219.5, 1823.5000000000002, 2031.7499999999984, 2218.2699999999995, 0.6815935657567392, 61.75876699723955, 0.15974849197423577], "isController": false}, {"data": ["Clients-0", 100, 0, 0.0, 141.68000000000006, 112, 232, 137.0, 171.0, 180.0, 231.55999999999977, 0.6745954114020117, 0.2628550479974635, 0.0830068572623569], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
