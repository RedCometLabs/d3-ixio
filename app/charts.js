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

        //var xGroups = ["1", "2", "3", "4", "5", "6", "7"],
        //    xColumns = ["unknown", "a", "b", "c", "d", "e", "f", "g", "h", "i"];

        x0.rangeRoundBands([0, width], 0.4)
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


        svg.call(tip);

        svg.select('.x.axis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.select('.y.axis')
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
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
        .attr("class", "group-bar")
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

        var legend = g.selectAll(".legend")
        .data(xGroups.reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 20 + ")"; });

        legend.append("rect")
        .attr("x", width - 58)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        legend.append("text")
        .attr("x", width + 20)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
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

        // Transpose the data into layers by cause.
        // [{value: male-x, name: ClusterGroup}, {
        /*var stackedValues = d3.layout.stack()(xStacks.map(function(cause) {
          return crimea.map(function(d) {
          return {x: parse(d.date), y: +d[cause]};
          });
          }));*/
        // Compute the x-domain (by date) and y-domain (by top).
        //color.domain(xGroups);
        console.log('da', data, d3.max(_.map(data, function (d) { return d.size;})));
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
        .attr("class", "cause")
        .attr("transform", function(d) { return "translate(" + x0(d.name) + ",0)"; });

        // Add a rect for each column.
        var rect = cause.selectAll("rect")
        .data(function (d) { return d.points;})
        .enter()
        .append("rect")
        //.attr("x", function(d) { return x0(d.x); })
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .style("fill", function(d, i) { console.log(d); return color[d.name]; })
        .attr("width", x0.rangeBand())
        .transition()
        .duration(800)
        .attr("height", function(d) { console.log('d', d); return y(d.y0) - y(d.y1); })
        .attr("y", function(d) { return y(d.y1); });

        cause.selectAll('text')
        .data(function (d) {return d.points;})
        .enter()
        .append("text")
        .style("fill-opacity", 1e-6)
        .transition()
        .duration(2500)
        .style("fill-opacity", 1)
        .attr('x', x0.rangeBand()/2 - 7)
        .attr("y", function (d) {return (y(d.y1) + y(d.y0))/2;})
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.value + " " + d.name + "(" + parseInt((d.value / d.size) * 100, 10) + "%)"; });

        svg.select('.x.axis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.select('.y.axis')
        .call(yAxis);


        var legend = svg.selectAll(".legend")
        .data(xGroups.reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 20 + ")"; });

        legend.append("rect")
        .attr("x", width - 58)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) { return color[d];});

        legend.append("text")
        .attr("x", width + 20)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

      });

      chart.remove = function () {
        var bars = chart.svg.selectAll(".cause"),
        legend = chart.svg.selectAll(".legend");

        legend
        .style("fill-opacity", 1)
        .transition()
        .duration(1500)
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
    var color = d3.scale.category20c();

    function chart(selection) {
      var yAxis = chart.yAxis(),
      xAxis = chart.xAxis(),
      //yScale = chart.yScale(),
      //xScale = chart.xScale(),
      xScale = d3.scale.ordinal(),
      yScale = d3.scale.linear(),
      margin = chart.margin(),
      xColumns = chart.xColumns(),
      line = d3.svg.line()
      .interpolate("monotone")
      .x(function (d, i) { return xScale(d.date);})
      .y(function (d) { return yScale(d.value);});

      xAxis.scale(xScale).orient("bottom");

      selection.each(function (data) {

        var width = chart.width(), // - margin.left - margin.right,
        height = chart.height() - margin.top - margin.bottom,
        svg = d3.select(this);

        chart.svg = svg;
        //console.log('da', data, d3.max(_.map(data, function (d) { return d.size;})));
        var allPoints = _.reduce(data, function (all, d) {
          return all.concat(_.map(d.points, function (p) { return p.value;}));
        }, []);

        console.log('xco', xColumns);
        xScale
        .domain(xColumns)
        .rangeRoundBands([0, width + margin.left]);

        yScale.range([height, 0])
        .domain([0, d3.max(allPoints)]);

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
        .attr('class', 'line-group')
        .append("path")
        .attr('class', 'line')
        .style('stroke', function (d, i) { return color(i);});

        function tick () {
          // Add a rect for each column.
          var lines = lineGroup.selectAll(".line")
          .data(function (d) {return [d.points];});

          lines
          .attr("d", line);
          /*.attr("transform",function "translate("+ -width + yScale( +", 0)")
            .transition()
            .duration(100)
            .ease("linear")
            .attr("transform", "translate(0, 0)");*/

          if (startData[0].points.length === data[0].points.length) {
            console.log('done');
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

        /*var legend = svg.selectAll(".legend")
          .data(xGroups.reverse())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(30," + i * 20 + ")"; });

          legend.append("rect")
          .attr("x", width - 58)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function (d) { return color[d];});

          legend.append("text")
          .attr("x", width + 20)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });*/

      });

      chart.remove = function () {
        var cause = chart.svg.selectAll(".line-group");

        cause
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

  charts.RadialGraph = function () {
    /*jshint loopfunc: true */
    function chart(selection) {
      selection.each(function (d) {
        var margin = chart.margin(),
        xColumns = chart.xColumns(),
        cfg = {
          radius: 5,
          w: chart.width() - margin.left - margin.right,
          h: chart.height() -30- margin.top - margin.bottom,
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
          g.selectAll(".levels")
          .data(allAxis)
          .enter()
          .append("svg:line")
          .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
          .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
          .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
          .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
          .attr("class", "line")
          .style("stroke", "grey")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "0.3px")
          .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
        }

        var series;
        //Text indicating at what % each level is
        for(j=0; j<cfg.levels; j++){
          levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
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
          .attr("points",function(d) {
            var str="";
            for(var pti=0;pti<d.length;pti++){
              str=str+d[pti][0]+","+d[pti][1]+" ";
            }
            return str;
          })
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
          });
          series++;
        });
        series=0;


        d.forEach(function(y, x){
          g.selectAll(".nodes")
          .data(y).enter()
          .append("svg:circle")
          .attr("class", "radar-chart-serie"+series)
          .attr('r', cfg.radius)
          .attr("alt", function(j){return Math.max(j.value, 0);})
          .attr("cx", function(j, i){
            dataValues.push([
              cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
              cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
            ]);
            return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
          })
          .attr("cy", function(j, i){
            return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
          })
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
          })
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

        /*g.style("fill-opacity", 1e-6)
          .transition()
          .duration(1000)
          .style('fill-opacity', 1);*/


        g.attr("transform", "translate(-800, -800)")
          .transition()
          .ease("cubic-out")
          .duration(1000)
          .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
      });

    }

    chart.createLegend = function (legendOptions, mainSvg) {
      console.log(legendOptions);
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
      .attr('transform', 'translate(-100,0)') 
      ;
      //Create colour squares
      legend.selectAll('rect')
      .data(legendOptions)
      .enter()
      .append("rect")
      .attr("x", w - 70)
      .attr("y", function(d, i){ return i * 20;})
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", function(d, i){ return colorscale(i);})
      .attr('class', function (d, i) { return 'radar-chart-serie' + i;});
      
      //Create text next to squares
      legend.selectAll('text')
      .data(legendOptions)
      .enter()
      .append("text")
      .attr("x", w - 52)
      .attr("y", function(d, i){ return i * 20 + 12;})
      .attr("font-size", "12px")
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



})(window, window.$, window.d3, window._);
