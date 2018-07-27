const getMap = () => {
  let req = new XMLHttpRequest();
  let dataJSON = [];
  let url = 'https://raw.githubusercontent.com/no-stack-dub-sack/';
  url += 'testable-projects-fcc/master/src/data/choropleth_map/counties.json';
  req.open('GET', url, true);
  req.send();
  req.onload = () => {
    dataJSON = JSON.parse(req.responseText);
    console.log('data1', dataJSON);
    drawMap(dataJSON);
  };
};

getMap();

const drawMap = (data) => {
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
  let counties = svg.append('g')
      .attr('id', 'counties')
      .attr('class', 'Blues');

  // create a container for states
  let states = svg.append('g')
    .attr('id', 'states');

  // create paths for each county using the json data
  // and the geo path generator to draw the shapes
  counties.selectAll('path')
      .data(json.features)
      .enter().append('path')
      .attr('class', data ? quantize : null)
      .attr('d', path);

  // create paths for each state using the json data
  // and the geo path generator to draw the shapes
  states.selectAll('path')
    .data(json.features)
    .enter().append('path')
    .attr('d', path);
};
