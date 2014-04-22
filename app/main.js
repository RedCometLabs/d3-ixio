(function (global,$, d3, _) {
  console.log('hello');
  var charts = global.charts;

  


  var dataStructure = function (rows) {
    var data = {};
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
    initialize: function () {
      this.el = "#chart-area";
      this.$el = $(this.el);

      this.router = new AppRouter();
      Backbone.history.start();
      this.xScale = d3.scale.linear().range([0, this.width()]);
      this.yScale = d3.scale.linear().range([this.height(), 0]);

      this.xAxis = d3.svg.axis()
          .scale(this.xScale)
          .orient("bottom");

      this.yAxis = d3.svg.axis()
          .scale(this.yScale)
          .orient("left");

      /*this.svg = d3.select(this.el)
                  .append("svg")
                  .append("g")
                  .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
                 */
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
       $text.hide('slow', function () {
         fn();
         $text.show('slow');
       });
       return;
     }

     fn();
   },

   displayIntro: function () {
     $('#intro')
      .width($(window).width())
      .height($(window).height())
      .show();
   }

  };

  var AppRouter = Backbone.Router.extend({

      routes: {
        "graph1":                 "help",    // #help
        "(/)": "start"   
      },

      help: function() {
        window.alert('boo');
      },

      start: function(query, page) {
        app.displayIntro();
      }

    });


  $(function () {
    var promise = $.getJSON('/ixio-challenge/_all_docs?include_docs=true&limit=5000');
    promise.then(function (resp) {
      var data = dataStructure(resp.rows);
      app.initialize();
      /*var lineChart = charts.Line()
        .width($("#line-chart-product-join-time").width())
        .height(100);

      d3.select("#line-chart-product-join-time")
        .datum(data)
        .call(lineChart);*/

      //var bubbleChart = charts.Bubble().diameter($("#bubble").width());
      //d3.select("#bubble").datum(data.clusterSizes).call(bubbleChart);
      console.log('d', data);
      //var groupedBarChart = charts.GroupedBarChart().width($("#grouped-bar").width()).height(500).yTitle('Percentage').xTitle('Income Group');
      //d3.select("#grouped-bar").datum(data.IncomeCluster).call(groupedBarChart);

    });
  });

  
})(window, window.jQuery, window.d3, window._);
