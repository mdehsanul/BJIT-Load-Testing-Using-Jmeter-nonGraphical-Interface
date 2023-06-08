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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6136111111111111, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "About Us"], "isController": false}, {"data": [0.995, 500, 1500, "Contact-0"], "isController": false}, {"data": [0.415, 500, 1500, "Contact-1"], "isController": false}, {"data": [0.375, 500, 1500, "Technology"], "isController": false}, {"data": [0.36, 500, 1500, "All pages"], "isController": false}, {"data": [0.4, 500, 1500, "News"], "isController": false}, {"data": [0.41, 500, 1500, "Works"], "isController": false}, {"data": [0.45, 500, 1500, "Blog"], "isController": false}, {"data": [1.0, 500, 1500, "Blog-0"], "isController": false}, {"data": [0.475, 500, 1500, "Blog-1"], "isController": false}, {"data": [0.99, 500, 1500, "All pages-0"], "isController": false}, {"data": [0.44, 500, 1500, "About Us-1"], "isController": false}, {"data": [0.425, 500, 1500, "All pages-1"], "isController": false}, {"data": [1.0, 500, 1500, "About Us-0"], "isController": false}, {"data": [1.0, 500, 1500, "Services-0"], "isController": false}, {"data": [1.0, 500, 1500, "Works-0"], "isController": false}, {"data": [0.44, 500, 1500, "Services-1"], "isController": false}, {"data": [0.475, 500, 1500, "Works-1"], "isController": false}, {"data": [0.995, 500, 1500, "Technology-0"], "isController": false}, {"data": [0.45, 500, 1500, "Capabilities-1"], "isController": false}, {"data": [0.405, 500, 1500, "Clients"], "isController": false}, {"data": [0.435, 500, 1500, "FAQ`s-1"], "isController": false}, {"data": [1.0, 500, 1500, "FAQ`s-0"], "isController": false}, {"data": [1.0, 500, 1500, "Capabilities-0"], "isController": false}, {"data": [0.375, 500, 1500, "Contact"], "isController": false}, {"data": [0.44, 500, 1500, "Career-1"], "isController": false}, {"data": [0.385, 500, 1500, "FAQ`s"], "isController": false}, {"data": [0.41, 500, 1500, "Services"], "isController": false}, {"data": [0.995, 500, 1500, "Career-0"], "isController": false}, {"data": [0.415, 500, 1500, "Technology-1"], "isController": false}, {"data": [0.41, 500, 1500, "Capabilities"], "isController": false}, {"data": [0.455, 500, 1500, "News-1"], "isController": false}, {"data": [0.995, 500, 1500, "News-0"], "isController": false}, {"data": [0.47, 500, 1500, "Clients-1"], "isController": false}, {"data": [0.405, 500, 1500, "Career"], "isController": false}, {"data": [1.0, 500, 1500, "Clients-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3600, 0, 0.0, 827.7922222222219, 114, 3470, 895.0, 1561.0, 1763.9499999999998, 2294.0, 22.92467969128098, 1384.7939326014416, 3.7399366228126034], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["About Us", 100, 0, 0.0, 1255.4699999999993, 605, 2634, 1159.5, 1731.8000000000002, 2084.199999999998, 2631.0899999999983, 0.6657036154363355, 60.3189885299267, 0.15732448724179018], "isController": false}, {"data": ["Contact-0", 100, 0, 0.0, 144.38, 114, 516, 136.5, 171.8, 185.5499999999999, 513.4499999999987, 0.6886103842445944, 0.26831596026718085, 0.10288807498967084], "isController": false}, {"data": ["Contact-1", 100, 0, 0.0, 1128.66, 358, 2379, 1073.5, 1689.4, 1881.2499999999998, 2376.0799999999986, 0.687616035205941, 62.03653067627037, 0.0772225039537922], "isController": false}, {"data": ["Technology", 100, 0, 0.0, 1247.0200000000002, 633, 3451, 1146.5, 1739.0000000000002, 1987.5999999999997, 3443.049999999996, 0.6686369167814494, 60.58477313149414, 0.1652003319782292], "isController": false}, {"data": ["All pages", 100, 0, 0.0, 1324.9799999999996, 616, 3268, 1245.0, 1851.4, 2257.5999999999976, 3260.819999999996, 0.6611570247933884, 59.90702479338843, 0.15108471074380164], "isController": false}, {"data": ["News", 100, 0, 0.0, 1248.2100000000003, 482, 2294, 1239.0, 1755.8, 2000.95, 2292.9899999999993, 0.6789142802829715, 61.515998615014865, 0.15779452998764376], "isController": false}, {"data": ["Works", 100, 0, 0.0, 1180.7700000000004, 481, 2040, 1139.5, 1612.9, 1745.1999999999994, 2038.6399999999994, 0.6725718474876078, 60.94131474344747, 0.17536785476483527], "isController": false}, {"data": ["Blog", 100, 0, 0.0, 1159.6599999999999, 482, 2538, 1139.0, 1610.9, 1816.5999999999995, 2535.5599999999986, 0.6757076348205658, 61.22544647381971, 0.16562755501949417], "isController": false}, {"data": ["Blog-0", 100, 0, 0.0, 143.84, 115, 187, 140.5, 175.0, 180.84999999999997, 187.0, 0.67736909842173, 0.2639358108108108, 0.08996308338413601], "isController": false}, {"data": ["Blog-1", 100, 0, 0.0, 1015.8000000000001, 363, 2356, 986.5, 1424.8, 1658.0499999999993, 2353.569999999999, 0.6763932008955447, 61.02400963353017, 0.07596212705369886], "isController": false}, {"data": ["All pages-0", 100, 0, 0.0, 164.32000000000002, 116, 529, 146.0, 241.0, 265.0, 528.9499999999999, 0.6637770240220905, 0.25863968025860756, 0.07713815025256716], "isController": false}, {"data": ["About Us-1", 100, 0, 0.0, 1110.2400000000002, 486, 2503, 1019.0, 1590.2, 1925.0499999999977, 2499.9899999999984, 0.6663423800417131, 60.117227324368805, 0.07483337275859081], "isController": false}, {"data": ["All pages-1", 100, 0, 0.0, 1160.6000000000004, 496, 3015, 1074.0, 1614.2000000000003, 2113.699999999998, 3008.989999999997, 0.6625412431923887, 59.774289797196126, 0.07440648727258271], "isController": false}, {"data": ["About Us-0", 100, 0, 0.0, 145.17000000000002, 114, 259, 141.0, 175.0, 183.0, 258.31999999999965, 0.6678643701037194, 0.26023230827283594, 0.08283083496403551], "isController": false}, {"data": ["Services-0", 100, 0, 0.0, 141.98000000000002, 114, 194, 136.0, 175.9, 180.89999999999998, 193.96999999999997, 0.6692813257124499, 0.2607844228117847, 0.09084971120510796], "isController": false}, {"data": ["Works-0", 100, 0, 0.0, 145.39000000000001, 115, 364, 138.0, 177.70000000000002, 181.0, 362.8999999999994, 0.674217907227616, 0.26270795408576053, 0.10007922060409925], "isController": false}, {"data": ["Services-1", 100, 0, 0.0, 1114.3000000000004, 479, 3317, 1021.5, 1650.6, 2169.349999999999, 3310.6399999999967, 0.6678063895715355, 60.24930986383428, 0.07499778789133454], "isController": false}, {"data": ["Works-1", 100, 0, 0.0, 1035.3000000000004, 363, 1920, 981.0, 1473.7, 1586.8499999999997, 1918.5899999999992, 0.6732419968357626, 60.73970886491399, 0.07560823206651632], "isController": false}, {"data": ["Technology-0", 100, 0, 0.0, 145.49999999999994, 115, 567, 133.0, 167.0, 180.84999999999997, 563.9499999999985, 0.6708932944215223, 0.2614125239005736, 0.09041335413102546], "isController": false}, {"data": ["Capabilities-1", 100, 0, 0.0, 1093.9100000000008, 376, 2932, 1058.0, 1613.2000000000005, 1779.5999999999995, 2929.0499999999984, 0.6719436642431899, 60.622573653424894, 0.07546242323043637], "isController": false}, {"data": ["Clients", 100, 0, 0.0, 1197.47, 486, 2126, 1149.0, 1703.3000000000002, 1847.1499999999996, 2125.2799999999997, 0.6738226633514592, 61.05465038711112, 0.1585852166676774], "isController": false}, {"data": ["FAQ`s-1", 100, 0, 0.0, 1117.1799999999998, 362, 2281, 1052.5, 1737.0000000000007, 1988.5999999999995, 2279.379999999999, 0.6855654200802112, 61.85152474034209, 0.07699221026291433], "isController": false}, {"data": ["FAQ`s-0", 100, 0, 0.0, 142.41000000000003, 115, 197, 141.0, 166.0, 178.64999999999992, 196.87999999999994, 0.6865255627793301, 0.2675036128407741, 0.1025765733449585], "isController": false}, {"data": ["Capabilities-0", 100, 0, 0.0, 148.79999999999998, 115, 332, 146.5, 176.9, 184.95, 331.11999999999955, 0.6730652738702599, 0.26225883229905633, 0.08939148168589389], "isController": false}, {"data": ["Contact", 100, 0, 0.0, 1273.1, 483, 2519, 1214.0, 1853.8000000000002, 2000.2999999999997, 2516.4199999999987, 0.68686036128855, 62.235988048629714, 0.1797642351809877], "isController": false}, {"data": ["Career-1", 100, 0, 0.0, 1106.63, 371, 2555, 1068.5, 1619.9000000000003, 1816.8999999999996, 2554.4199999999996, 0.6832187803178333, 61.63981154263968, 0.07672867161772542], "isController": false}, {"data": ["FAQ`s", 100, 0, 0.0, 1259.6200000000003, 485, 2431, 1185.0, 1862.3000000000006, 2114.7, 2429.159999999999, 0.68478610705946, 62.048041169340756, 0.17922136395696803], "isController": false}, {"data": ["Services", 100, 0, 0.0, 1256.3399999999995, 598, 3470, 1172.5, 1817.8000000000002, 2293.499999999999, 3463.969999999997, 0.6671425616940084, 60.44937055099304, 0.1654826276076935], "isController": false}, {"data": ["Career-0", 100, 0, 0.0, 148.48999999999992, 115, 562, 137.5, 172.9, 183.69999999999993, 558.9299999999985, 0.6843034475207687, 0.2666377691023308, 0.08353313568368759], "isController": false}, {"data": ["Technology-1", 100, 0, 0.0, 1101.5000000000002, 503, 3309, 1007.0, 1608.1000000000001, 1855.9999999999998, 3297.9099999999944, 0.6692230989044817, 60.377124992471245, 0.07515689099024943], "isController": false}, {"data": ["Capabilities", 100, 0, 0.0, 1242.7699999999993, 496, 3067, 1204.5, 1758.2000000000003, 1922.249999999999, 3063.9099999999985, 0.671366230278617, 60.83207452165156, 0.16456340214837195], "isController": false}, {"data": ["News-1", 100, 0, 0.0, 1101.0700000000002, 362, 2159, 1097.5, 1620.4, 1880.4499999999998, 2158.0699999999997, 0.6795740429898539, 61.31098433751724, 0.07631935053108711], "isController": false}, {"data": ["News-0", 100, 0, 0.0, 147.10000000000005, 115, 566, 140.0, 174.0, 184.69999999999993, 562.7499999999984, 0.6806286286013762, 0.26520588165229403, 0.08175519659957937], "isController": false}, {"data": ["Clients-1", 100, 0, 0.0, 1050.0999999999997, 368, 1994, 998.5, 1549.0000000000002, 1690.85, 1992.8199999999995, 0.6743497582456117, 60.839650796407064, 0.07573263886547398], "isController": false}, {"data": ["Career", 100, 0, 0.0, 1255.1299999999999, 490, 2684, 1211.5, 1812.7000000000003, 2137.599999999998, 2683.49, 0.6825705607317157, 61.8472919013003, 0.15997747517149585], "isController": false}, {"data": ["Clients-0", 100, 0, 0.0, 147.30999999999997, 115, 252, 139.0, 175.9, 236.89999999999998, 251.88999999999993, 0.6757395969889044, 0.2633008781236063, 0.0831476457232441], "isController": false}]}, function(index, item){
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
