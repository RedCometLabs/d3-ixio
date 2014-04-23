(function (global,$, d3, _) {
  console.log('hello');
  var charts = global.charts;

  var dataStructure = function (data, rows) {
    data.allDocs = _.map(rows, function (row) { return row.doc; });
    data.clusterSizes = _.values(_.reduce(data.allDocs, function (info, doc) {
      var cg = doc.ClusterGroup;
      if (!info[cg]) {
        info[cg] = {
          clusterGroup: cg,
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
          }
        };
      }

      var group = info[cg];

      group.size = group.size + 1;
      var income = doc.income === "" ? "unknown" : doc.income.toLowerCase() ;
      group.income[income] = group.income[income] + 1;

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
    console.log('inclie', data.IncomeCluster);
    return data;
  };

  var app = {
    initialize: function (data) {
      this.margin = {
        left: 30,
        right: 0,
        top: 20,
        bottom: 30
      };

      this.el = "#chart-area";
      this.$el = $(this.el);
      this.data = data;

      this.xScale = d3.scale.linear().range([0, this.width()]);
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
      var groupedBarChart = charts.GroupedBarChart()
                              .yScale(this.yScale)
                              .xScale(this.xScale)
                              .yAxis(this.yAxis)
                              .xAxis(this.xAxis)
                              .margin(this.margin)
                              .width(this.windowWidth() - 100)
                              .height(this.windowHeight())
                              .yTitle('Percentage')
                              .xTitle('Income Group');

      d3.select(".svg-chart-area")
        .datum(data.IncomeCluster)
        .call(groupedBarChart);

      this.setText('Hello, this is a long story of text that I am now writing', true);
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
  
   setText: function (text, fadeIn) {
     var $text = $('#main-text');
     var fn = function () {
      $text.text(text);
     };

     if (fadeIn) {
       $text.hide('fast', function () {
         fn();
         $text.show('fast');
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
        "graph1":                 "graph1",    // #help
        "(/)": "start"   
      },

      graph1: function() {
        app.hideIntro();
        app.showIncomeClusterGroups(data.IncomeCluster);
      },

      start: function(query, page) {
        app.displayIntro();
      }

    });


  $(function () {
    var promise = $.getJSON('/ixio-challenge/_all_docs?include_docs=true&limit=5000');
    promise.then(function (resp) {
      dataStructure(data, resp.rows);
      console.log('data', data);
      app.initialize(data);
      router = new AppRouter();
      Backbone.history.start();
      /*var lineChart = charts.Line()
        .width($("#line-chart-product-join-time").width())
        .height(100);

      d3.select("#line-chart-product-join-time")
        .datum(data)
        .call(lineChart);*/

      //var bubbleChart = charts.Bubble().diameter($("#bubble").width());
      //d3.select("#bubble").datum(data.clusterSizes).call(bubbleChart);
      //var groupedBarChart = charts.GroupedBarChart().width($("#grouped-bar").width()).height(500).yTitle('Percentage').xTitle('Income Group');
      //d3.select("#grouped-bar").datum(data.IncomeCluster).call(groupedBarChart);

    });
  });

  
})(window, window.jQuery, window.d3, window._);
