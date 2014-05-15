(function (global,$, d3, _) {
  var charts = global.charts;

  var dataStructure = function (data, rows) {
    //data.allDocs = _.map(rows, function (row) { return row.doc; });
    /*data.clusterSizes = _.values(_.reduce(data.allDocs, function (info, doc) {
      var cg = doc.ClusterGroup;
      if (!info[cg]) {
      info[cg] = {
      clusterGroup: cg,
      name: cg,
      size: 0,
      male: 0,
      female: 0,
      income: {
      unknown: 0,
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      g: 0,
      h: 0,
      i: 0
      },
      language: {
      "English": 0,
      "Afrikaans": 0
      },
      culturalProfile: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
      },

      favouredProduct: {
      "Null": 0,
      "Product1":0,
      "Product2":0,
      "Product3":0,
      "Product4":0,
      "Product5":0,
      "Product6":0,
      "Product7":0,
      "Product8":0,
      "Product9":0,
      "Product10":0
      }
      };

      info[cg].joinYear = _.reduce(_.range(1985, 2014), function (group, year) {
      group[year.toString()] = 0;
      return group;
      }, {});
      }

      var group = info[cg];

      group.size += 1;
      var income = doc.income === "" ? "unknown" : doc.income.toLowerCase() ;
      group.income[income] += 1;
      group.joinYear[doc.joinYear] +=  1;
      group.language[doc.language] += 1;
      group.culturalProfile[doc.culturalProfile] += 1;
      group.favouredProduct[doc.favouredProduct] += 1;

      if (doc.gender === "Female") {
      group.female = group.female + 1;
      } else {
      group.male = group.male + 1;
      }

      return info;
      }, {}));*/

    data.clusterSizes = [
    {
      "clusterGroup": "1",
      "name": "1",
      "size": 4620,
      "male": 3190,
      "female": 1430,
      "income": {
        "unknown": 374,
        "a": 766,
        "b": 561,
        "c": 735,
        "d": 261,
        "e": 263,
        "f": 351,
        "g": 452,
        "h": 483,
        "i": 374
      },
      "language": {
        "English": 0,
        "Afrikaans": 4620
      },
      "culturalProfile": {
        "1": 14,
        "2": 38,
        "3": 4562,
        "4": 6
      },
      "favouredProduct": {
        "Null": 42,
        "Product1": 3361,
        "Product2": 8,
        "Product3": 315,
        "Product4": 29,
        "Product5": 11,
        "Product6": 240,
        "Product7": 121,
        "Product8": 1,
        "Product9": 1,
        "Product10": 491
      },
      "joinYear": {
        "1985": 0,
        "1986": 0,
        "1987": 24,
        "1988": 63,
        "1989": 107,
        "1990": 114,
        "1991": 197,
        "1992": 194,
        "1993": 165,
        "1994": 231,
        "1995": 138,
        "1996": 287,
        "1997": 259,
        "1998": 220,
        "1999": 217,
        "2000": 117,
        "2001": 137,
        "2002": 112,
        "2003": 78,
        "2004": 131,
        "2005": 167,
        "2006": 187,
        "2007": 197,
        "2008": 218,
        "2009": 255,
        "2010": 252,
        "2011": 185,
        "2012": 199,
        "2013": 169
      }
    },
    {
      "clusterGroup": "2",
      "name": "2",
      "size": 11277,
      "male": 5650,
      "female": 5627,
      "income": {
        "unknown": 0,
        "a": 55,
        "b": 77,
        "c": 435,
        "d": 249,
        "e": 564,
        "f": 995,
        "g": 2075,
        "h": 3061,
        "i": 3766
      },
      "language": {
        "English": 11210,
        "Afrikaans": 67
      },
      "culturalProfile": {
        "1": 383,
        "2": 8594,
        "3": 2294,
        "4": 6
      },
      "favouredProduct": {
        "Null": 29,
        "Product1": 895,
        "Product2": 1,
        "Product3": 7486,
        "Product4": 9,
        "Product5": 372,
        "Product6": 2116,
        "Product7": 30,
        "Product8": 57,
        "Product9": 3,
        "Product10": 279
      },
      "joinYear": {
        "1985": 0,
        "1986": 0,
        "1987": 3,
        "1988": 1,
        "1989": 4,
        "1990": 4,
        "1991": 1,
        "1992": 9,
        "1993": 4,
        "1994": 3,
        "1995": 19,
        "1996": 17,
        "1997": 17,
        "1998": 20,
        "1999": 46,
        "2000": 36,
        "2001": 47,
        "2002": 49,
        "2003": 67,
        "2004": 98,
        "2005": 166,
        "2006": 246,
        "2007": 494,
        "2008": 1038,
        "2009": 1281,
        "2010": 2095,
        "2011": 2208,
        "2012": 2820,
        "2013": 484
      }
    },
    {
      "clusterGroup": "4",
      "name": "4",
      "size": 5445,
      "male": 3517,
      "female": 1928,
      "income": {
        "unknown": 811,
        "a": 1267,
        "b": 825,
        "c": 1060,
        "d": 307,
        "e": 322,
        "f": 325,
        "g": 324,
        "h": 185,
        "i": 19
      },
      "language": {
        "English": 5445,
        "Afrikaans": 0
      },
      "culturalProfile": {
        "1": 1,
        "2": 809,
        "3": 4545,
        "4": 90
      },
      "favouredProduct": {
        "Null": 164,
        "Product1": 4558,
        "Product2": 5,
        "Product3": 153,
        "Product4": 20,
        "Product5": 0,
        "Product6": 111,
        "Product7": 0,
        "Product8": 29,
        "Product9": 4,
        "Product10": 401
      },
      "joinYear": {
        "1985": 0,
        "1986": 0,
        "1987": 0,
        "1988": 0,
        "1989": 0,
        "1990": 0,
        "1991": 1,
        "1992": 0,
        "1993": 0,
        "1994": 0,
        "1995": 6,
        "1996": 16,
        "1997": 44,
        "1998": 70,
        "1999": 130,
        "2000": 113,
        "2001": 133,
        "2002": 156,
        "2003": 186,
        "2004": 269,
        "2005": 323,
        "2006": 336,
        "2007": 464,
        "2008": 555,
        "2009": 493,
        "2010": 574,
        "2011": 557,
        "2012": 561,
        "2013": 458
      }
    },
    {
      "clusterGroup": "5",
      "name": "5",
      "size": 4948,
      "male": 2693,
      "female": 2255,
      "income": {
        "unknown": 233,
        "a": 464,
        "b": 545,
        "c": 1110,
        "d": 427,
        "e": 474,
        "f": 533,
        "g": 646,
        "h": 445,
        "i": 71
      },
      "language": {
        "English": 4947,
        "Afrikaans": 1
      },
      "culturalProfile": {
        "1": 693,
        "2": 3592,
        "3": 662,
        "4": 1
      },
      "favouredProduct": {
        "Null": 32,
        "Product1": 708,
        "Product2": 2,
        "Product3": 3750,
        "Product4": 2,
        "Product5": 99,
        "Product6": 231,
        "Product7": 33,
        "Product8": 51,
        "Product9": 0,
        "Product10": 40
      },
      "joinYear": {
        "1985": 0,
        "1986": 0,
        "1987": 1,
        "1988": 3,
        "1989": 8,
        "1990": 4,
        "1991": 6,
        "1992": 3,
        "1993": 8,
        "1994": 15,
        "1995": 25,
        "1996": 23,
        "1997": 22,
        "1998": 27,
        "1999": 47,
        "2000": 49,
        "2001": 33,
        "2002": 45,
        "2003": 53,
        "2004": 84,
        "2005": 175,
        "2006": 241,
        "2007": 403,
        "2008": 757,
        "2009": 714,
        "2010": 783,
        "2011": 601,
        "2012": 578,
        "2013": 240
      }
    },
    {
      "clusterGroup": "6",
      "name": "6",
      "size": 7281,
      "male": 4241,
      "female": 3040,
      "income": {
        "unknown": 4799,
        "a": 313,
        "b": 391,
        "c": 760,
        "d": 325,
        "e": 246,
        "f": 268,
        "g": 174,
        "h": 5,
        "i": 0
      },
      "language": {
        "English": 7248,
        "Afrikaans": 33
      },
      "culturalProfile": {
        "1": 382,
        "2": 5763,
        "3": 1072,
        "4": 64
      },
      "favouredProduct": {
        "Null": 320,
        "Product1": 392,
        "Product2": 31,
        "Product3": 4791,
        "Product4": 127,
        "Product5": 407,
        "Product6": 1118,
        "Product7": 12,
        "Product8": 30,
        "Product9": 0,
        "Product10": 53
      },
      "joinYear": {
        "1985": 0,
        "1986": 0,
        "1987": 0,
        "1988": 0,
        "1989": 2,
        "1990": 1,
        "1991": 1,
        "1992": 0,
        "1993": 2,
        "1994": 13,
        "1995": 12,
        "1996": 12,
        "1997": 15,
        "1998": 12,
        "1999": 31,
        "2000": 22,
        "2001": 32,
        "2002": 25,
        "2003": 27,
        "2004": 41,
        "2005": 101,
        "2006": 150,
        "2007": 250,
        "2008": 466,
        "2009": 571,
        "2010": 842,
        "2011": 775,
        "2012": 851,
        "2013": 3027
      }
    },
    {
      "clusterGroup": "7",
      "name": "7",
      "size": 4317,
      "male": 3029,
      "female": 1288,
      "income": {
        "unknown": 152,
        "a": 811,
        "b": 468,
        "c": 699,
        "d": 257,
        "e": 314,
        "f": 373,
        "g": 381,
        "h": 468,
        "i": 394
      },
      "language": {
        "English": 4317,
        "Afrikaans": 0
      },
      "culturalProfile": {
        "1": 162,
        "2": 235,
        "3": 3916,
        "4": 4
      },
      "favouredProduct": {
        "Null": 38,
        "Product1": 3761,
        "Product2": 1,
        "Product3": 180,
        "Product4": 1,
        "Product5": 5,
        "Product6": 80,
        "Product7": 97,
        "Product8": 15,
        "Product9": 15,
        "Product10": 124
      },
      "joinYear": {
        "1985": 0,
        "1986": 4,
        "1987": 252,
        "1988": 363,
        "1989": 439,
        "1990": 327,
        "1991": 382,
        "1992": 341,
        "1993": 258,
        "1994": 309,
        "1995": 234,
        "1996": 266,
        "1997": 233,
        "1998": 212,
        "1999": 189,
        "2000": 109,
        "2001": 83,
        "2002": 54,
        "2003": 47,
        "2004": 43,
        "2005": 31,
        "2006": 39,
        "2007": 27,
        "2008": 18,
        "2009": 19,
        "2010": 21,
        "2011": 10,
        "2012": 7,
        "2013": 0
      }
    }
    ];

    data.IncomeCluster = _.values(_.reduce(data.clusterSizes, function (group, cs) {
      _.each(cs.income, function (val, key) {
        var item = {
          value: (val / cs.size) * 100,
        name: cs.clusterGroup
        };

        group[key].points.push(item);
      });

      return group;
    }, {
      unknown: {
        name: 'unknown',
      points: []
      },
      a: {
        name: 'a',
      points: []
      },
      b: {
        name: 'b',
        points: []
      },
      c: {
        name: 'c',
        points: []
      },
      d: {
        name: 'd',
        points: []
      },
      e: {
        name: 'e',
        points: []
      },
      f: {
        name: 'f',
        points: []
      },
      g: {
        name: 'g',
        points: []
      },
      h: {
        name: 'h',
        points: []
      },
      i: {
        name: 'i',
        points: []
      }
    }));
    return data;
  };

  var app = {
    initialize: function (data) {
      this.margin = {
        left: 50,
        right: 0,
        top: 100,
        bottom: 50
      };

      this.el = "#chart-area";
      this.$el = $(this.el);
      this.data = data;

      this.xScale = d3.scale.ordinal().range([0, this.width()]);
      this.yScale = d3.scale.linear().range([this.height(), 0]);

      this.xAxis = d3.svg.axis()
        .scale(this.xScale)
        .orient("bottom");

      this.yAxis = d3.svg.axis()
        .scale(this.yScale)
        .orient("left");

      this.svg = d3.select(this.el)
        .append("svg")
        .append("g")
        .attr('class', 'svg-chart-area')
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


      this.svg.append("g")
        .attr("class", "x axis");
      //.attr("transform", "translate(0," + this.height() + ")")
      //.call(this.xAxis);

      this.svg.append("g")
        .attr("class", "y axis");
      //.call(this.yAxis);

      var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    },

    showIncomeClusterGroups: function () {
      this.removeCurrentGraph();
      var groupedBarChart = charts.GroupedBarChart()
        .yScale(this.yScale)
        .xScale(this.xScale)
        .yAxis(this.yAxis)
        .xAxis(this.xAxis)
        .xColumns(["1", "2", "4", "5", "6", "7"])
        .xGroups(["unknown", "a", "b", "c", "d", "e", "f", "g", "h", "i"])
        .margin(this.margin)
        .width(this.windowWidth() - 100)
        .height(this.windowHeight())
        .yTitle('Percentage')
        .xTitle('Cluster Groups');

      var barData = _.map(data.clusterSizes, function (ic) {
        var incomes = _.map(ic.income, function (val, key) {
          return {
            name: key,
            value: parseInt((val / ic.size) * 100, 10)
          };
        });

        return {
          name: ic.clusterGroup,
          points: incomes
        };
      });

      d3.select(".svg-chart-area")
        .datum(barData)
        .call(groupedBarChart);

      this.currentChart = groupedBarChart;
      this.setText('Hello, this is a long story of text that I am now writing', '#graph5', true);
    },

    showGender: function () {
      this.removeCurrentGraph();
      var groupedBarChart = charts.StackedBar()
        .yScale(this.yScale)
        .xScale(this.xScale)
        .yAxis(this.yAxis)
        .xAxis(this.xAxis)
        .margin(this.margin)
        .width(this.windowWidth() - 100)
        .height(this.windowHeight())
        .xColumns(["1", "2", "4", "5", "6", "7"])
        .xGroups(["Male", "Female"])
        .yTitle('Percentage')
        .xTitle('Cluster Groups');

      var barData = _.map(data.clusterSizes, function (ic) {
        var y0 = 0;
        return {
          name: ic.clusterGroup,
          size: ic.size,
          points: [
      {
        name: "Male",
          value: ic.male,
          size: ic.size,
          y0: y0,
          y1: y0 += ic.male 
      },
          {
            name: "Female",
          value: ic.female,
          size: ic.size,
          y0: y0,
          y1: y0 += ic.female
          }
      ]
        };
      });


      console.log(barData);
      d3.select(".svg-chart-area")
        .datum(barData)
        .call(groupedBarChart);

      this.currentChart = groupedBarChart;
      this.setText('The data is broken into 6 Cluster Groups. The Cluster Groups vary in size as well as number of <strong style="color:#A64260">Males</strong> to <strong style="color:#225B84">Females</strong>.','#graph2', false);
    },

    showGender2: function () {
      if (!this.currentChart) { this.showGender(); }

      this.currentChart.hightLight(["2", "7"]);
      this.setText('Cluster Groups 2 is the largest Cluster and has the most equal ratio of males to females. Cluster Group 7 is the smallest and has the largest male ratio','#graph3', true);
    },

    showJoinYear: function () {
      this.removeCurrentGraph();

      var lineGraph = charts.LineGraph()
        .yScale(this.yScale)
        .xScale(this.xScale)
        .yAxis(this.yAxis)
        .xAxis(this.xAxis)
        .margin(this.margin)
        .width(this.windowWidth() - 100)
        .height(this.windowHeight())
        .xColumns(_.map(_.range(1985, 2014), function (d) { return d;}))
        //.xGroups(["Male", "Female"])
        .yTitle('Number of people joined')
        .xTitle('Year');

      var lineData = _.map(data.clusterSizes, function (ic) {
        return {
          name: ic.clusterGroup,
          points: _.map(ic.joinYear, function (val, key) { 
            return {
              value: val,
          date: parseInt(key, 10)
            };
          })
        };
      });

      console.log(lineData);
      d3.select(".svg-chart-area")
        .datum(lineData)
        .call(lineGraph);

      this.currentChart = lineGraph;
      this.setText('Hello, this is a long story of text that I am now writing','#graph6', true);

    },

    showJoinYear2: function () {
      if (!this.currentChart) { this.showJoinYear2(); }

      console.log('zom');
      this.currentChart.zoom();
      this.setText('Hello, this is a long story of text that I am now writing','#graph7', true);
    },

    showProduct: function () {
      this.removeCurrentGraph();

      var forceBubble = charts.ForceBubble()
        .yScale(this.yScale)
        .xScale(this.xScale)
        .yAxis(this.yAxis)
        .xAxis(this.xAxis)
        .margin(this.margin)
        .width(this.windowWidth() - 100)
        .height(this.windowHeight())
        .xColumns(["1", "2", "4", "5", "6", "7"])
        //.xGroups(["Male", "Female"])
        .yTitle('Number of people joined')
        .xTitle('Year');

      var forceData = _.map(data.clusterSizes, function (ic) {
        return {
          name: ic.name,
          nodes: _.map(ic.favouredProduct, function (val, key) {
            return {
              value: parseInt((val / ic.size) * 100, 10),
          name: key
            };
          })
        };
      });

      console.log(forceData);
      d3.select(".svg-chart-area")
        .datum(forceData)
        .call(forceBubble);

      this.currentChart = forceBubble;
      this.setText('Hello, this is a long story of text that I am now writing','#graph1', true);

    },

    showRadialInfo: function () {
      this.removeCurrentGraph();

      var radialData = _.map(data.clusterSizes, function (ic) {
        var axi = [];
        _.each(['culturalProfile', 'language'], function (group) {
          _.each(ic[group], function (val, key) {
            var axis = key;
            if (group === 'culturalProfile') {
              axis = 'Cultural Profile ' + key;
            }

            axi.push({
              axis: axis,
              value: val / ic.size
            });
          });
        });
        return axi;
      });

      var radialGraph = charts.RadialGraph()
        .yScale(this.yScale)
        .xScale(this.xScale)
        .yAxis(this.yAxis)
        .xAxis(this.xAxis)
        .margin(this.margin)
        .width(this.windowWidth() - 100)
        .height(this.windowHeight())
        .xColumns(_.map(data.clusterSizes, function (d) { return 'Cluster Group ' + d.clusterGroup;}))
        //.xGroups(["Male", "Female"])
        .yTitle('Number of people joined')
        .xTitle('Year');

      console.log(radialData);
      d3.select(".svg-chart-area")
        .datum(radialData)
        .call(radialGraph);

      this.currentChart = radialGraph;
      this.setText('There are four cultural profiles and 2 language groups. This radial graph explores spread of the language and culture profiles within the various Cluster Groups. <br/><small>(Hover over a Cluster Group colour on the graph to see its full profile )</small>','#graph4', true);
    },

    removeCurrentGraph: function () {
      if (this.currentChart) { 
        this.currentChart.remove();
      }
    },

    margin: {
      top: 0, 
      right: 10, 
      bottom: 5, 
      left: 10
    },

    width: function () {
      return this.$el.width();
    },

    height: function () {
      return this.$el.height();
    },

    setText: function (text, link, fadeIn) {
      var $text = $('#main-text-span'),
      $textArea = $('#main-text'),
      $link = $('#text-link');
      var fn = function () {
        $text.html(text);
        $link.prop('href', link);
      };

      $textArea.show();

      if (fadeIn) {
        d3.select('#main-text')
          .style("opacity", 1)
          .transition()
          .duration(500)
          .style("opacity",  1e-6)
          .each('end', fn)
          .transition()
          .duration(500)
          .style("opacity", 1);
        return;
      }

      fn();
    },

    windowHeight: function () {
      return $(window).height();
    },

    windowWidth: function () {
      return $(window).width();
    },

    displayIntro: function () {
      $('#intro')
        .width(this.windowWidth())
        .height(this.windowHeight())
        .show();
    },

    hideIntro: function () {
      $('#intro').hide();
    }

  };

  var data = {}, router;

  var AppRouter = Backbone.Router.extend({

    routes: {
      "graph1":                 "showGender",
      "graph2":                 "hightLightGender",
      "graph3":                 "showRadial",
      "graph4":                 "showIncome",
      "graph5":                 "showJoinYear",
      "graph6":                 "showJoinYear2",
      "graph7":                 "showProduct",
      "(/)": "start"   
    },

      showGender: function() {
        app.hideIntro();
        app.showGender();
      },

      hightLightGender: function () {
        app.showGender2();
      },

      showRadial: function() {
        app.showRadialInfo();
      },

      showIncome: function() {
        app.showIncomeClusterGroups();
      },

      showJoinYear: function() {
        app.showJoinYear();
      },

      showJoinYear2: function() {
        app.showJoinYear2();
      },

      showProduct: function() {
        app.showProduct();
      },

      start: function(query, page) {
        app.displayIntro();
      }

  });


  $(function () {
    dataStructure(data);
    app.initialize(data);
    router = new AppRouter();
    Backbone.history.start();
  });


})(window, window.jQuery, window.d3, window._);
