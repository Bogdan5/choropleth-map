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

  let container = d3.select('body')
    .append('div')
    .attr('id', 'container')
    .attr('class', 'container');

  let svg = container.append('svg')
    .attr('width', 1000)
    .attr('height', 800)
    .attr('class', 'containerSVG');

  // create a container for counties
  // let counties = svg.append('g')
  //     .attr('id', 'counties')
  //     .attr('class', 'Blues');

  // create a container for states
  let states = svg.append('g')
    .attr('id', 'states');

  // create paths for each state using the json data
  // and the geo path generator to draw the shapes
  // states.selectAll('path')
  // .datum(topojson.feature(data, data.objects.states))
  // .attr('d', path);

  // create paths for each county using the json data
  // and the geo path generator to draw the shapes
  // counties.selectAll('path')
  //     .data()
  //     .enter().append('path')
  //     .attr('class', data ? quantize : null)
  //     .attr('d', path);

  var color = d3.scaleThreshold()
    .domain(d3.range(0, 100))
    .range(d3.schemeBlues[9]);

  // create paths for each state using the json data
  // and the geo path generator to draw the shapes
  svg.append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(countiesJSON, countiesJSON.objects.counties).features)
    .enter().append('path')
    .attr('fill', color(20))
    .attr('d', path)
    .append('title')
    .text(function (d) { return d.rate + '%'; });

  svg.append('path')
    .datum(topojson.mesh(countiesJSON, countiesJSON.objects.states,
      function (a, b) { return a !== b; }))
    .attr('class', 'states')
    .attr('d', path);

  // quantize function takes a data point and returns a number
  // between 0 and 8, to indicate intensity, the prepends a 'q'
  // and appends '-9'
  // function quantize(d) {
  //   return 'q' + Math.min(8, ~~(data[d.geometries.id] * 9 / 12)) + '-9';
  // }
};
