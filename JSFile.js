const getMap = () => {
  let req = new XMLHttpRequest();
  let countiesJSON = [];
  let educationJSON = [];
  let url = 'https://raw.githubusercontent.com/no-stack-dub-sack/';
  url += 'testable-projects-fcc/master/src/data/choropleth_map/counties.json';
  req.open('GET', url, true);
  req.send();
  req.onload = () => {
    countiesJSON = JSON.parse(req.responseText);
    console.log('counties', countiesJSON);
    url = 'https://raw.githubusercontent.com/no-stack-dub-sack';
    url += '/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
    req.open('GET', url, true);
    req.send();
    req.onload = () => {
      educationJSON = JSON.parse(req.responseText);
      console.log('education', educationJSON);
      drawMap(countiesJSON, educationJSON);
    };
  };
};

getMap();

const drawMap = (countiesJSON, dataEducation) => {
  let path = d3.geoPath();

  //container that includes the svg, necessary not to make body's display relative
  let container = d3.select('body')
    .append('div')
    .attr('id', 'container')
    .attr('class', 'container');

  //tooltip
  let tooltip = d3.select('body')
    .append('div')
    .attr('visibility', 'hidden')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip');

  //svg element that includes the map
  let svg = container.append('svg')
    .attr('width', 1000)
    .attr('height', 800)
    .attr('class', 'containerSVG');

  //the education object facilitates the access to information in dataEducation
  //it ties all data on counties to the id
  let education = {};
  dataEducation.forEach((item) => {
    education[item.fips] = {
      state: item.state,
      area_name: item.area_name,
      rate: item.bachelorsOrHigher,
    };
  });

  //scale that uses the domain as an array of thresholds and the range as the colors
  //of the gradient
  let colorArray = ['#ffffff', '#f2ccff', '#e699ff', '#d24dff', '#c61aff', '#9900cc',
  '#730099', '#39004d', '#000000',
  ];
  let tickArray = [3, 12, 21, 30, 39, 48, 57, 66];
  var color = d3.scaleThreshold()
    .domain(tickArray)
    .range(colorArray);

  // create paths for each state using the json data
  // and the geo path generator to draw the shapes
  svg.append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(countiesJSON, countiesJSON.objects.counties).features)
    .enter().append('path')
    .attr('fill', (d) => color(education[d.id].rate))
    .attr('d', path)
    .on('mouseover', (d) => {
      tooltip.style('visibility', 'visible')
      .style('left', `${d3.event.pageX + 10}px`)
      .style('top', `${d3.event.pageY}px`)
      .text(`${education[d.id].area_name} ${education[d.id].state}:
      ${education[d.id].rate} %`);
    })
    .on('mouseout', (d) => {tooltip.style('visibility', 'hidden');
    });

  //draws the borders of states
  svg.append('path')
    .datum(topojson.mesh(countiesJSON, countiesJSON.objects.states,
      function (a, b) { return a !== b; }))
    .attr('class', 'states')
    .attr('d', path);

  //legend
  let legendX = 100;
  let legendY = 720;
  let side = 30;
  let legend = svg.append('g')
      .attr('x', legendX)
      .attr('y', legendY);
  legend.selectAll('rect')
    .data(colorArray)
    .enter()
    .append('rect')
    .attr('class', 'legend')
    .attr('width', side)
    .attr('height', side)
    .attr('x', (d, i) => legendX + i * side)
    .attr('y', legendY)
    .style('fill', (d) => d);

  const axisScale = d3.scalePoint()
    .domain(tickArray)
    .range([0, 7 * side]);
  const xAxis = d3.axisBottom(axisScale);

  const axis = svg.append('g')
    .attr('transform', `translate(${legendX + side - 0.5}, ${legendY + side})`)
    .attr('class', 'x-axis')
    .call(xAxis);
};
