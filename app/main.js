(function (global,$, d3, _) {
  var charts = global.charts;

  var dataStructure = function (data, rows) {
    data.allDocs = _.map(rows, function (row) { return row.doc; });
    data.clusterSizes = _.values(_.reduce(data.allDocs, function (info, doc) {
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
    }, {}));

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
        top: 20,
        bottom: 30
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
                              .xColumns(["1", "2", "3", "4", "5", "6", "7"])
                              .xGroups(["unknown", "a", "b", "c", "d", "e", "f", "g", "h", "i"])
                              .margin(this.margin)
                              .width(this.windowWidth() - 100)
                              .height(this.windowHeight())
                              .yTitle('Percentage')
                              .xTitle('Income Group');

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
      this.setText('Hello, this is a long story of text that I am now writing', '#graph2', true);
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
                              .xColumns(["1", "2", "3", "4", "5", "6", "7"])
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
      this.setText('Hello, this is a long story of text that I am now writing','#graph2', true);
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
              date: key
            };
          })
        };
      });

      console.log(lineData);
      d3.select(".svg-chart-area")
        .datum(lineData)
        .call(lineGraph);

      this.currentChart = lineGraph;
      this.setText('Hello, this is a long story of text that I am now writing','#graph3', true);

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
                              .xColumns(["1", "2", "3", "4", "5", "6", "7"])
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
      this.setText('Hello, this is a long story of text that I am now writing','#graph3', true);

    },

    showRadialInfo: function () {
      this.removeCurrentGraph();

       var radialData = _.map(data.clusterSizes, function (ic) {
         var axi = [];
         _.each(['language', 'culturalProfile'], function (group) {
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
      this.setText('Hello, this is a long story of text that I am now writing','#graph3', true);
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
      $text.text(text);
      $link.prop('href', link);
     };

     if (fadeIn) {
       $textArea.hide('fast', function () {
         fn();
         $textArea.show('fast');
       });
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
        "graph1":                 "graph1",
        "graph2":                 "graph2",
        "graph3":                 "graph3",
        "graph4":                 "graph4",
        "graph5":                 "graph5",
        "(/)": "start"   
      },

      graph1: function() {
        app.hideIntro();
        app.showGender();
      },

      graph2: function() {
        app.showRadialInfo();
      },

      graph3: function() {
        app.showIncomeClusterGroups();
      },

      graph4: function() {
        app.showJoinYear();
      },

      graph5: function() {
        app.showProduct();
      },

      start: function(query, page) {
        app.displayIntro();
      }

    });


  $(function () {
    var promise = $.getJSON('/ixio-challenge/_all_docs?include_docs=true&limit=10000');
    promise.then(function (resp) {
      dataStructure(data, resp.rows);
      app.initialize(data);
      router = new AppRouter();
      Backbone.history.start();
    });
  });

  
})(window, window.jQuery, window.d3, window._);
