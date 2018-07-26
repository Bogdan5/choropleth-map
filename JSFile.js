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
};
