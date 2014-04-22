(function (global, $, d3, _) {
  var charts = global.charts = {};

  var chartMixins = {
    width: function(_) {
      if (arguments.length === 0) {
        return this._width;
      }
      this._width = _;
      return this;
    },

    height: function(_) {
      if (arguments.length === 0) {
        return this._height;
      }

      this._height = _;
      return this;
    }
  };

  charts.Line = function () {
    this._width = 100,
    this._height = 100;

    var margin = {top: 0, right: 10, bottom: 5, left: 10},
    xScale = d3.scale.linear(),
    yScale = d3.scale.linear(),
    line = d3.svg.line()
    .x(function (d,i) {return xScale(i);})
    .y(function (d) {return yScale(d.value);});

    var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

    function chart(selection) {
      chart.selection = selection;
      selection.each(function (data) {

        xScale
        .range([0, chart.width()])
        .domain([0, data.length - 1]);

        yScale
        .range([chart.height(), 0]);

        setYDomain(data);

        var svg = d3.select(this).selectAll("svg").data([data]);

        var gEnter = svg.enter().append("svg").append("g");

        gEnter.append("g").attr("class", "x axis");
        gEnter.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

        gEnter.append("path")
        .attr("class", "line")
        .datum(data);

        svg.attr("width", chart.width() + margin.left + margin.right)
        .attr("height",   chart.height() + margin.top + margin.bottom);

        var g = svg.select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        setXaxis(svg, data);

        g.select(".y.axis")
        .call(yAxis);

        g.select('.line')
        .attr("d", line);
      });
    }

    function setXaxis(svg, data) {
      var average = d3.mean(_.map(data, function (item) { return item.value; }));

      svg.select(".x.axis")
      .attr("transform", "translate(0," + yScale(average) + ")")
      .call(xAxis);
    }
    function setYDomain(data) {
      yScale.domain(d3.extent(data, function (d) {
        return d.value;
      }));
    }

    chart.update = function (newData) {
      chart.realtimeData = chart.realtimeData.concat(newData);

      function tick() {
        chart.selection.each(function (data) {

          if (_.isEmpty(chart.realtimeData)) { console.log('done'); return; }

          var item = chart.realtimeData.shift();
          data.push(item);
          console.log(chart.realtimeData.length, item, this);
          var svg = d3.select(this).selectAll('svg').data([data]);
          var path = svg.select('.line');

          setYDomain(data);

          path
          .attr("d", line)
          .attr("transform", null)
          .transition()
          .duration(400)
          .ease("linear")
          .attr("transform", "translate(" + xScale(-1) + ",0)")
          .each("end", tick);

          setXaxis(svg, data); 
        });

      }

      tick();

    },

    chart.realtimeData = [];
    _.extend(chart, chartMixins);


    return chart;
  };


  /* Format: 
ClusterGroup: "AgglomerativeCluster"
packageName: "cluster"
value: 3938
*/
  /*charts.Bubble = function () {

    var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

    var bubble = d3.layout.pack()
    .sort(null);

    function chart(selection) {
    var diameter = chart.diameter();

    console.log(selection);
    selection.each(function (data) {
    bubble
    .size([diameter, diameter])
    .padding(1.5);

    var svg = d3.select(this).append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

    var root = flare;
    console.log('cl', classes(root));
    var node = svg.selectAll(".node")
    .data(bubble.nodes(classes(root))
    .filter(function(d) { return !d.children; }))
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
    .text(function(d) { return d.ClusterGroup + ": " + format(d.size); });

    node.append("circle")
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return color(d.ClusterGroup); });

    node.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.ClusterGroup.substring(0, d.r / 3); });

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {
  var classes = [];

  function recurse(name, node) {
  if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
  else classes.push({packageName: name, ClusterGroup: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
  }
  });
  }

  chart.diameter = function (_) {
  if (arguments.length === 0) {
  return this._diameter;
  }
  this._diameter = _;
  return this;
  };

  return chart;

  };*/

  charts.GroupedBarChart = {

    initialise: function (options) {
      var margin = this.margin = options.margin;

      var x0 = d3.scale.ordinal();
      var x1 = d3.scale.ordinal();
      var y = d3.scale.linear();

      var color = d3.scale.category20c();

      var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

      var div = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);

      function chart(selection) {
        selection.each(function (data) {
          var width = chart.width() - margin.left - margin.right,
          height = chart.height() - margin.top - margin.bottom;

          yAxis.tickSize(-width);

          var clusterNames = ["1", "2", "3", "4", "5", "6", "7"],
          incomeNames = ["unknown", "a", "b", "c", "d", "e", "f", "g", "h", "i"];

          x0.rangeRoundBands([0, width], 0.4)
          .domain(incomeNames);

          x1.domain(clusterNames).rangeRoundBands([0, x0.rangeBand()]);
          y.range([height, 0])
          .domain([0, 100]);

          var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>Group "+ d.name + ":</strong> <span style=' color:"+ color(d.name) +"'>" + parseInt(d.value, 10) + "%</span>";
          });

          var svg = d3.select(this).append("svg")
          .attr("width", chart.width())
          .attr("height", chart.height())
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          svg.call(tip);

          svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

          svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(chart.yTitle());

          var income = svg.selectAll(".income")
          .data(data, function (d) { return d.name; });

          income
          .enter().append("g")
          .attr("class", "income")
          .attr("transform", function(d) { return "translate(" + x0(d.name) + ",0)"; });

          income.exit().remove();

          var incomeBars = income.selectAll("rect")
          .data(function(d) { return d.points; }, function (d) { return d.name;});

          incomeBars
          .enter()
          .append("rect")
          .attr("class", "group-bar")
          .attr("width", x1.rangeBand())
          .attr("x", function(d) { return x1(d.name); })
          .attr("y", function(d) { return y(0); })
          .attr("height", function(d) { return height - y(0); })
          .style("fill", function(d) { return color(d.name); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .transition()
          .duration(1000)
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); });

          incomeBars
          .exit()
          .remove();

          var legend = svg.selectAll(".legend")
          .data(clusterNames.reverse())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(30," + i * 20 + ")"; });

          legend.append("rect")
          .attr("x", width - 48)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

          legend.append("text")
          .attr("x", width + 30)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return "Group: " +d; });

          window.setTimeout(function () {
            var newData = _.map(data, function (d) {
              var points = _.filter(d.points, function(p) {
                if (p.name === "6") {
                  return false;
                }

                return true;
              });

              return {
                name: d.name,
                points: points
              };
            });

            console.log('bb', data);

            var bb = svg.selectAll('.income').data(newData);


            var aa = bb.selectAll(".group-bar").data(function (d) { return d.points;}, function (d) { return d.name;});
            aa.exit()
            .transition()
            .duration(2000)
            .attr("y", y(0))
            .attr('height', height - y(0))
            .remove();
            //income.data(data);
            //incomeBars.data(data);

          }, 5000);

        });

      }

      _.extend(chart, chartMixins);

      chart.yTitle = function(_) {
        if (arguments.length === 0) {
          return this._yTitle;
        }

        this._yTitle = _;
        return this;
      };

      chart.xTitle =  function(_) {
        if (arguments.length === 0) {
          return this._xTitle;
        }

        this._xTitle = _;
        return this;
      };

      return chart;
    }

  };

})(window, window.$, window.d3, window._);
