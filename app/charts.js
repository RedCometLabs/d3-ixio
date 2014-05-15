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
  },

  yScale: function(_) {
    if (arguments.length === 0) {
      return this._yScale;
    }

    this._yScale = _;
    return this;
  },

  xScale: function(_) {
    if (arguments.length === 0) {
      return this._xScale;
    }

    this._xScale = _;
    return this;
  },

  yAxis: function(_) {
    if (arguments.length === 0) {
      return this._yAxis;
    }

    this._yAxis = _;
    return this;
  },

  xAxis: function(_) {
    if (arguments.length === 0) {
      return this._xAxis;
    }

    this._xAxis = _;
    return this;
  },

  margin: function(_) {
    if (arguments.length === 0) {
      return this._margin;
    }

    this._margin = _;
    return this;
  },

  yTitle: function(_) {
    if (arguments.length === 0) {
      return this._yTitle;
    }

    this._yTitle = _;
    return this;
  },

  xTitle:  function(_) {
    if (arguments.length === 0) {
      return this._xTitle;
    }

    this._xTitle = _;
    return this;
  },

  xColumns:  function(_) {
    if (arguments.length === 0) {
      return this._xColumns;
    }

    this._xColumns = _;
    return this;
  },

  xGroups:  function(_) {
    if (arguments.length === 0) {
      return this._xGroups;
    }

    this._xGroups = _;
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

    _.extend(chart, chartMixins);

  return chart;
};

charts.GroupedBarChart = function () {
  var x0 = d3.scale.ordinal();
  var x1 = d3.scale.ordinal();

  var color = d3.scale.category20c();

  /*var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));
    */


  function chart(selection) {
    var yAxis = chart.yAxis(),
        xAxis = chart.xAxis(),
        yScale = chart.yScale(),
        margin = chart.margin(),
        xColumns = chart.xColumns(),
        xGroups = chart.xGroups();

    xAxis.scale(x0).orient("bottom");

    yAxis
      .scale(yScale)
      .orient("left")
      .tickFormat(d3.format(".2s"));

    selection.each(function (data) {
      var width = chart.width(), // - margin.left - margin.right,
      height = chart.height() - margin.top - margin.bottom;

    color.domain(xGroups);
    yAxis.tickSize(-width);

    x0.rangeRoundBands([0, width], 0.2)
      .domain(xColumns);

    x1.domain(xGroups).rangeRoundBands([0, x0.rangeBand()]);

    yScale.range([height, 0])
      .domain([0, 100]);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>"+ d.name + ":</strong> <span style=' color:"+ color(d.name) +"'>" + parseInt(d.value, 10) + "%</span>";
      });

    var svg = d3.select(this),
        g = svg.append('g').attr('class', 'grouped');

    chart.svg = g;
    svg.append("g")
      .attr("class", "x axis");

    svg.append("g")
      .attr("class", "y axis");

    svg.call(tip);

    svg.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .style("font-size", "15px")
      .attr("y", 20)
      .attr('x', width/2)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(chart.xTitle());

    svg.select('.y.axis')
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 8)
      //.attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(chart.yTitle());

    var income = g.selectAll(".income")
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
      .attr("class", function (d) { return "group-bar income-" + d.name;})
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return yScale(0); })
      .attr("height", function(d) { return height - yScale(0); })
      .style("fill", function(d) { return color(d.name); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .transition()
      .duration(1000)
      .attr("y", function(d) { return yScale(d.value); })
      .attr("height", function(d) { return height - yScale(d.value); });

    incomeBars
      .exit()
      .remove();

    var textValues = income.selectAll('text.values')
      .data(function (d) {console.log('d', d); return d.points;});

    textValues
      .enter()
      .append("text")
      .attr('class', function (d) { return 'values income-values-' +d.name;})
      .style("fill-opacity", 1e-6)
      .transition()
      .duration(2500)
      .style("fill-opacity", 1)
      .attr('x', function (d) { return x1(d.name) + x1.rangeBand() /2;})
      .attr("y", function (d) { return yScale(d.value) - 8; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name.split('')[0];});

    var legend = g.selectAll(".legend")
      .data(xGroups.reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(30," + i * 28 + ")"; });

    var legendRect = legend.append("rect")
      .attr("x", width - 78)
      .attr("width", 65)
      .attr("height", 25)
      .attr("rx", 5)
      .attr("r7", 5)
      .attr('class', 'rect-button')
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 45)
      .attr("y", 11)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d; });

    var last = null;
    legend.on("click", function (name) {

      console.log(arguments);
      incomeBars
      .transition()
      .duration(1000)
      .attr("y", function(d) { return yScale(d.value); })
      .attr("height", function(d) { return height - yScale(d.value); });

    textValues
      .transition()
      .duration(1000)
      .attr("y", function (d) { return yScale(d.value) - 8; })
      .style("fill-opacity", 1);

    if (last !== name) {
      d3.selectAll('.values:not(.income-values-' + name + ')')
        .transition()
        .duration(1000)
        .attr("y", function(d) { return yScale(0); })
        .style("fill-opacity", 1e-6);

        d3.selectAll('.group-bar:not(.income-' + name + ')')
          .transition()
          .duration(1000)
          .attr("y", function(d) { return yScale(0); })
          .attr("height", function(d) { return height - yScale(0); });

          last = name;
          } else {
            last = null;
          }


          });
        });
  }

  chart.remove = function () {
    var graph = chart.svg;

    graph
      .style("fill-opacity", 1)
      .transition()
      .duration(1500)
      .style("fill-opacity", 1e-6)
      .remove();

  };

  _.extend(chart, chartMixins);


  return chart;
};


charts.StackedBar = function () {
  var x0 = d3.scale.ordinal();
  var color = {
    "Female": "A64260", //d3.scale.category20c();
    "Male": "225B84"
  };

  function chart(selection) {
    var yAxis = chart.yAxis(),
        xAxis = chart.xAxis(),
        yScale123 = chart.yScale(),
        margin = chart.margin(),
        xColumns = chart.xColumns(),
        xGroups = chart.xGroups();

    xAxis.scale(x0).orient("bottom");


    selection.each(function (data) {

      var width = chart.width(), // - margin.left - margin.right,
      height = chart.height() - margin.top - margin.bottom,
      svg = d3.select(this);

    chart.svg = svg;

    x0.rangeRoundBands([0, width], 0.4);

    x0.domain(xColumns);
    yScale123.range([0, height])
      .domain([0, 5000]);

    var y = d3.scale.linear().rangeRound([height, 0]).domain([0, d3.max(_.map(data, function (d) { return d.size;}))]);

    yAxis
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

    // Add a group for each cause.
    var cause = svg.selectAll(".cause")
      .data(data)
      .enter().append("g")
      .attr("class", function (d) { return "group-" + d.name + " cause";})
      .attr("transform", function(d) { return "translate(" + x0(d.name) + ",0)"; });

    // Add a rect for each column.
    var rect = cause.selectAll("rect")
      .data(function (d) { return d.points;})
      .enter()
      .append("rect")
      //.attr("x", function(d) { return x0(d.x); })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); })
      .style("fill", function(d, i) { return color[d.name]; })
      .attr("width", x0.rangeBand())
      .transition()
      .duration(800)
      .attr("height", function(d) { console.log('d', d); return y(d.y0) - y(d.y1); })
      .attr("y", function(d) { return y(d.y1); });

    cause.selectAll('text.values')
      .data(function (d) {return d.points;})
      .enter()
      .append("text")
      .attr('class', 'values')
      .style("fill-opacity", 1e-6)
      .transition()
      .duration(2500)
      .style("fill-opacity", 1)
      .attr('x', x0.rangeBand()/2)
      .attr("y", function (d) {return (y(d.y1) + y(d.y0))/2;})
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return "(" + parseInt((d.value / d.size) * 100, 10) + "%)"; });

    cause.selectAll('text.gender')
      .data(function (d) {return d.points;})
      .enter()
      .append("text")
      .attr('class', 'gender')
      .style("fill-opacity", 1e-6)
      .transition()
      .duration(2500)
      .style("fill-opacity", 1)
      .attr('x', x0.rangeBand()/2)
      .attr("y", function (d) {return ((y(d.y1) + y(d.y0))/2) - 13;})
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name + ": " + d.value;});

    svg.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.select('.y.axis')
      .call(yAxis);


    /*var legend = svg.selectAll(".legend")
      .data(xGroups.reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(30," + i * 20 + ")"; });

      legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d) { return color[d];});

      legend.append("text")
      .attr("x", width - 28)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });*/

    });

    chart.hightLight = function (selected) {
      var svg = chart.svg;

      _.each(selected, function (s) {

        console.log('se', s);
        d3.select('.group-'+s).classed('highlighted', true);
      });

      d3.selectAll('.cause:not(.highlighted)')
        .style("fill-opacity", 1)
        .transition()
        .duration(500)
        .style("fill-opacity", 0.5);
    },

      chart.remove = function () {
        var bars = chart.svg.selectAll(".cause"),
        axis = chart.svg.selectAll(".axis");

        axis
          .style("fill-opacity", 1)
          .transition()
          .duration(1000)
          .style("fill-opacity", 1e-6)
          .remove();

        bars
          .style("fill-opacity", 1)
          .transition()
          .duration(1000)
          .style("fill-opacity", 1e-6)
          .remove();

      };
  }

  _.extend(chart, chartMixins);

  return chart;

};

charts.LineGraph = function () {
  var x0 = d3.scale.ordinal();
  var color = d3.scale.category20();

  function chart(selection) {
    var yAxis = chart.yAxis(),
        xAxis = chart.xAxis(),
        //yScale = chart.yScale(),
        //xScale = chart.xScale(),
        xScale = d3.scale.linear(),
        yScale = d3.scale.linear(),
        margin = chart.margin(),
        xColumns = chart.xColumns(),
        line = d3.svg.line()
          .interpolate("monotone")
          .x(function (d, i) { return xScale(d.date);})
          .y(function (d) { return yScale(d.value);});

    xAxis.scale(xScale).orient("bottom");

    selection.each(function (data) {
      var groups = _.map(data, function (d) { return d.name;});
      color.domain(groups);

      var width = chart.width(), // - margin.left - margin.right,
      height = chart.height() - margin.top - margin.bottom,
      svg = d3.select(this);

    chart.svg = svg;
    chart.xScale = xScale;
    chart.yScale = yScale;
    chart.xAxis = xAxis;
    chart.yAxis = yAxis;

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Group "+ d.name + ":</strong> <span style=' color:"+ color(d.name) +"'>" + d.value + "</span>";
      });

    svg.call(tip);

    var allPoints = _.reduce(data, function (all, d) {
      return all.concat(_.map(d.points, function (p) { return p.value;}));
    }, []);

    xScale
      .domain([1985, 2013])
      .range([0, width]);
    //.rangeRoundBands([0, width]);

    yScale.range([height, 0])
      .domain([0, d3.max(allPoints)]);

    xAxis
      .ticks(xColumns.length)
      .tickFormat(function (d) { return d;});

    yAxis
      .scale(yScale)
      .orient("left")
      .tickFormat(d3.format(".2s"));

    var startData = [],
        endData = [];

    _.each(data, function (d) {
      startData.push({
        name: d.name,
        points: []
      });

      endData.push({
        name: d.name,
        points: d.points.slice(0)
      });
    });
    // Add a group for each cause.
    console.log('sd', startData);
    var lineGroup = svg.selectAll(".line-group")
      .data(startData, function (d) { return d.name;});

    var LinesEnter = lineGroup
      .enter()
      .append("g")
      .attr('class', function (d) { return 'line-group group-' + d.name; })
      .append("path")
      .attr('class', 'line')
      .style('stroke', function (d, i) { return color(d.name);});

    var legend = svg.selectAll(".legend")
      .data(groups.reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { console.log('d', i); return "translate(" + (width - 70 - i * 70)  + "," + -25 + ")"; });

    var legendRect = legend.append("rect")
      //.attr("y", 0)
      .attr("width", 65)
      .attr("height", 25)
      .attr("rx", 5)
      .attr("r7", 5)
      .attr('class', 'rect-button')
      .style("fill", color);

    legend.append("text")
      .attr("x", 32)
      .attr("y", 12)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return 'Group ' + d; });

    var last = null;
    legend.on("click", function (name) {

      d3.selectAll('.line-group')
      .transition()
      .duration(500)
      .style("opacity", 1);

    if (last !== name) {
      d3.selectAll('.line-group:not(.group-' + name + ')')
        .transition()
        .duration(500)
        .style("opacity", 0.1);
        last = name;
        } else {
          last = null;
        }
        });

      chart.zoom = function () {
        xScale.domain([2007, 2013]);

        xAxis.ticks(7);

        svg.select(".x.axis")
          .transition()
          .duration(1000)
          .call(xAxis);

        var lines = lineGroup.selectAll(".line")
          .data(function (d) { return [_.filter(d.points, function (p) { return p.date >= "2007";})];});

        d3.selectAll('.dot').remove();

        window.setTimeout(function () {
          lineGroup.selectAll('.dot')
          .data(function (d) { return _.map(d.points, function (p) { 
            p.name = d.name; 
            return p;
          });})
        .enter()
          .append("circle")
          .attr("cx", function(d,i){return xScale(d.date);})
          .attr("cy",function(d,i){return yScale(d.value);})
          .attr("r",5)
          .attr('fill', function (d) { return color(d.name);})
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
        }, 1010);

        lines
          .transition()
          .duration(1000)
          .attr("d", line);


      };

      function tick () {
        // Add a rect for each column.
        var lines = lineGroup.selectAll(".line")
          .data(function (d) {return [d.points];});

        lines
          .attr("d", line);

        if (startData[0].points.length === data[0].points.length) {
          console.log('done');
          lineGroup.selectAll('.dot')
            .data(function (d) { return _.map(d.points, function (p) { 
              p.name = d.name; 
              return p;
            });})
          .enter()
            .append("circle")
            .attr('class', 'dot')
            .attr("cx", function(d,i){return xScale(d.date);})
            .attr("cy",function(d,i){return yScale(d.value);})
            .attr("r",5)
            .attr('fill', function (d) { return color(d.name);})
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
          return;
        }

        window.setTimeout(function () {
          _.each(startData, function (st, i) {
            st.points.push(endData[i].points.shift());
          });

          tick();
        }, 150);

      }

      tick();

      svg.select('.x.axis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.select('.y.axis')
        .call(yAxis);

    });

    chart.remove = function () {
      var cause = chart.svg.selectAll(".line-group, .legend, .axis");

      cause
        .style("fill-opacity", 1)
        .transition()
        .duration(500)
        .style("fill-opacity", 1e-6)
        .remove();

    };

  }

  //window.setTimeout(function () { chart.zoom(); }, 5000);

  _.extend(chart, chartMixins);

  return chart;

};

charts.RadialGraph = function () {
  /*jshint loopfunc: true */
  function chart(selection) {
    selection.each(function (d) {
      var margin = chart.margin(),
      xColumns = chart.xColumns(),
      cfg = {
        radius: 5,
      w: chart.width() - chart.width()/4 - margin.left - margin.right,
      h: chart.height() - chart.height()/4 - margin.top - margin.bottom,
      factor: 1,
      factorLegend: 0.85,
      levels: 3,
      maxValue: 0,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: margin.left,
      TranslateY: margin.top,
      ExtraWidthX: 200,
      ExtraWidthY: 500,
      color: d3.scale.category10()
      };

    chart.color = cfg.color;

    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}));}));
    var allAxis = (d[0].map(function(i, j){return i.axis;}));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var format = d3.format('%');

    //d3.select(this).select("svg").remove();

    var g =  d3.select(this)
      .append("g")
      .attr('class', 'radial')
      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");


    var tooltip,
        levelFactor,
        j;
    chart.svg = g;

    //Circular segments
    for(j=0; j<cfg.levels-1; j++){
      levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      console.log('le', levelFactor, (cfg.w/2-levelFactor));
      g.selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:line")
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")")
        .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
        .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
        .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
        .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));});
    }

    var series;
    //Text indicating at what % each level is
    for(j=0; j<cfg.levels; j++){
      levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      console.log('le2', levelFactor);
      g.selectAll(".levels")
        .data([1]) //dummy data
        .enter()
        .append("svg:text")
        .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
        .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
        .attr("class", "legend")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
        .attr("fill", "#737373")
        .text(format((j+1)*cfg.maxValue/cfg.levels));
    }

    series = 0;

    var axis = g.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d;})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", "translate(0, -10)")
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


    var dataValues;
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
      .data(y, function(j, i){
        dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
      });
    dataValues.push(dataValues[0]);
    g.selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-serie"+series)
      .style("stroke-width", "2px")
      .style("stroke", cfg.color(series))
      .style("fill", function(j, i){return cfg.color(series);})
      .style("fill-opacity", cfg.opacityArea)
      .on('mouseover', function (d){
        var z = "polygon."+d3.select(this).attr("class");
        g.selectAll("polygon")
        .transition(200)
        .style("fill-opacity", 0.1); 
      g.selectAll(z)
        .transition(200)
        .style("fill-opacity", 0.7);
      })
    .on('mouseout', function(){
      g.selectAll("polygon")
      .transition(200)
      .style("fill-opacity", cfg.opacityArea);
    })
    .attr('points', function (d) { return cfg.w/2 + "," + cfg.h/2 + ' ' + cfg.w/2 + "," + cfg.h/2 + ' ' + cfg.w/2 + "," + cfg.h/2 + ' ' + cfg.w/2 + "," + cfg.h/2 + ' ' + cfg.w/2 + "," + cfg.h/2 + ' ' + cfg.w/2 + "," + cfg.h/2 + ' ' + cfg.w/2 + "," + cfg.h/2;})
      .transition()
      .duration(2000)
      .attr("points",function(d) {
        var str="";
        for(var pti=0;pti<d.length;pti++){
          str=str+d[pti][0]+","+d[pti][1]+" ";
        }
        return str;
      });
    series++;
    });
    series=0;


    d.forEach(function(y, x){
      var enteredNode = g.selectAll(".nodes")
      .data(y).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie"+series)
      .attr('cy', cfg.h/2)
      .attr('cx', cfg.w/2)
      .attr('r', cfg.radius)
      .attr("alt", function(j){return Math.max(j.value, 0);})
      .attr("data-id", function(j){return j.axis;})
      .style("fill", cfg.color(series)).style("fill-opacity", 0.9)
      .on('mouseover', function (d){
        var newX =  parseFloat(d3.select(this).attr('cx')) - 10;
        var newY =  parseFloat(d3.select(this).attr('cy')) - 5;

        tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(format(d.value))
        .transition(200)
        .style('opacity', 1);

      var z = "polygon."+d3.select(this).attr("class");
      g.selectAll("polygon")
        .transition(200)
        .style("fill-opacity", 0.1); 
      g.selectAll(z)
        .transition(200)
        .style("fill-opacity", 0.7);
      })
    .on('mouseout', function(){
      tooltip
      .transition(200)
      .style('opacity', 0);
    g.selectAll("polygon")
      .transition(200)
      .style("fill-opacity", cfg.opacityArea);
    });

    enteredNode
      .transition()
      .duration(2000)
      .attr("cx", function(j, i){
        dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
      })
    .attr("cy", function(j, i){
      return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
    });

    enteredNode
      .append("svg:title")
      .text(function(j){return Math.max(j.value, 0);});

    series++;
    });

    //Tooltip
    tooltip = g.append('text')
      .style('opacity', 0)
      .style('font-family', 'sans-serif')
      .style('font-size', '13px');

    chart.createLegend(xColumns, g);

    /*g.attr("transform", "translate(-800, -800)")
      .transition()
      .ease("cubic-out")
      .duration(1000)
      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");*/
    });

  }

  chart.createLegend = function (legendOptions, mainSvg) {
    var margin = chart.margin(),
        w = chart.width() - margin.left - margin.right,
        h = chart.height() - margin.top - margin.bottom,
        colorscale = chart.color;

    var svg = mainSvg
      .append('g')
      .attr("width", 100)
      .attr("height", 200);

    //Initiate Legend	
    var legend = svg.append("g")
      .attr("class", "legend")
      .attr("height", 100)
      .attr("width", 200)
      .attr('transform', 'translate(-150,0)') 
      ;
    //Create colour squares
    legend.selectAll('rect')
      .data(legendOptions)
      .enter()
      .append("rect")
      .attr("x", w - 70)
      .attr("y", function(d, i){ return i * 24;})
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i){ return colorscale(i);})
      .attr('class', function (d, i) { return 'radar-chart-serie' + i;});

    //Create text next to squares
    legend.selectAll('text')
      .data(legendOptions)
      .enter()
      .append("text")
      .attr("x", w - 50)
      .attr("y", function(d, i){ return i * 24 + 14;})
      .attr("font-size", "14px")
      .attr("fill", "#666")
      .text(function(d) { return d; })
      ;	
  },

    chart.remove = function () {
      var graph = chart.svg;

      graph
        .transition()
        .ease("cubic-out")
        .duration(1000)
        .attr("transform", "translate(-800, -800)")
        .remove();
    };

  _.extend(chart, chartMixins);

  return chart;

};


charts.ForceBubble = function () {
  /*<div id="view_selection" class="btn-group">
        <a href="#" id="all" class="btn active">All Grants</a>
        <a href="#" id="year" class="btn">Grants By Year</a>
      </div>
   */

  function chart(selection) {
    var margin = chart.margin(),
        width = chart.width() - margin.left - margin.right,
        height = chart.height() - margin.top - margin.bottom,
        padding = 6, // separation between nodes
        maxRadius = 12,
        groups = chart.xColumns(),
        tick,
        nodes = [];

    selection.each(function (data) {

      var padding = 6, // separation between nodes
      maxRadius = 10;

    //var n = 200, // total number of nodes
    var m = data.length; // number of distinct clusters

    var color = d3.scale.category20()
      .domain(groups);

    var xGroup = d3.scale.ordinal()
      .domain(groups)
      .rangePoints([0, width -margin.left - margin.right], 1);

    var products = [ "Null", "Product1", "Product2", "Product10", "Product4", 
                     "Product5", "Product6", "Product7", "Product8" , "Product9" , "Product3"];

    var xProducts = d3.scale.ordinal()
      .domain(products)
      .rangePoints([0, width -margin.left - margin.right], 1);

    var nodes = [];
    _.each(data, function (d, i) {
      var node = _.map(d.nodes, function(node) {
        var v = node.value;
        return {
          name: node.name,
          group: d.name,
          radius: Math.sqrt(v) * maxRadius,
          color: color(d.name),
          cx: xGroup(d.name),
          cy: i % 2 === 0 ? height / 2 : height/3,
          i: i
        };
      });

      nodes = nodes.concat(node);
    });


    var svg = d3.select(this);

    var circleNode = svg.selectAll('.circleNodes')
      .data(nodes)
      .enter()
      .append('g')
      .attr("transform", function(d) { 
        return "translate(" + d.x + ","+ d.y + ")"; });

    var circle = circleNode
      .append("circle")
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d) { return d.color; });

    circleNode
      .append('text')
      .attr("x", 0)
      .attr("y", ".31em")
      .attr("text-anchor", "middle")
      .style('stroke', '#000')
      .text(function(d) { return d.name.replace('Product', ''); });

    function tickGroup(e) {
      
      circleNode
        .each(gravityGroup(0.5 * e.alpha))
        .each(collide(0.5))
        .attr("transform", function(d) { 
          return "translate(" + d.x + ","+ d.y + ")";
        });
    }

    function tickProduct(e) {
      circleNode
        .each(gravityProduct(0.5 * e.alpha))
        .each(collide(0.5))
        .attr("transform", function(d) { 
          return "translate(" + d.x + ","+ d.y + ")";
        });
    }

    var force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(-0.01)
      .charge(0.9)
      .on("tick", tickGroup)
      .start();

    circleNode
      .call(force.drag);

    chart.circleNode = circleNode;
    chart.force = force;

    var yPos = function (i) {
      var group1 = ["Null","Product3","Product6","Product9"],
          group2 = ["Product1","Product4","Product7","Product10"],
          group3 = ["Product2","Product5","Product8","Product11"];

      if (group1.indexOf(i) > -1) {
        return 100;

      } else if (group2.indexOf(i) > -1) {
        return height/2;
      } else if (group3.indexOf(i) > -1) {
        return height - 90;

      } else {
        console.log('un', i);
      }
    };

    // Move nodes toward cluster focus.
    function gravityGroup(alpha) {
      return function(d) {
        d.cx = xGroup(d.group);
        d.cy = d.i % 2 === 0 ? height / 2 : height/3;
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
      };
    }

    function gravityProduct(alpha) {
      return function(d) {
        d.cx = xProducts(d.name);
        d.cy = yPos(d.name);

        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
      };
    }

    // Resolve collisions between nodes.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
          y = d.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }

    var $button = $("#bubble-selection");
    $button
      .show()
      .on('click', function (e) {
        console.log('clicked');
        $('.select-btn-group').removeClass('active');
        $(e.target).addClass('active');
        var selection = $(e.target).attr('id');
        var changedTick;

        if (selection === "btn-cluster-group") {
          changedTick = tickGroup;

        } else {
          changedTick = tickProduct;
        }

        force.on('tick', changedTick);
        force.resume();
        
      });

    var legend = svg.selectAll(".legend")
      .data(groups.reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(30," + i * 28 + ")"; });

    var legendRect = legend.append("rect")
      .attr("x", width - 78)
      .attr("width", 65)
      .attr("height", 25)
      .attr("rx", 5)
      .attr("r7", 5)
      .attr('class', 'rect-button')
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 45)
      .attr("y", 11)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return 'Group ' + d; });

    });


  }

  chart.remove = function () {
    var force = chart.force,
        circleNode = chart.circleNode;

    var newTick = function () {
      circleNode
        .each(function (d) {
          d.x += (d.cx + d.x) * 0.01;
        })
      .attr("transform", function(d) { 
        return "translate(" + d.x + ","+ d.y + ")";
      });
    };

    force.on('tick', newTick);
    force.resume();

    window.setTimeout(function () {
      force.stop();
      circleNode.remove();
    }, 1000);

  };

  _.extend(chart, chartMixins);

  return chart;

};



})(window, window.$, window.d3, window._);
