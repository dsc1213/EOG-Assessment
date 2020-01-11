import React from 'react';
import { Provider, createClient, useQuery } from 'urql';
import CircularProgress from '@material-ui/core/CircularProgress';
import Graph from './Graph';

const defaultColorPallette = {
  waterTemp: '#8884d8',
  casingPressure: '#82ca9d',
  injValveOpen: '#82c0ca',
  flareTemp: '#fcba03',
  oilTemp: '#a5d923',
  tubingPressure: '#d95a23',
}

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
    query($input: [MeasurementQuery]) {
      getMultipleMeasurements(input: $input) {
        metric
        measurements{
          at
          value
          unit
        }
      }
    }
  `;

export default props => {

  return (
    <Provider value={client}>
      <GraphSection {...props}/>
    </Provider>
  );
};

// Getting Data for 1 minute
const before = Date.now(); // time in ms
const after  = Date.now() - ( 1000 * 60 ); // 1 minute before time in ms


const getTsStringFromEpoch = epoch => {
  
  const date = new Date(epoch);
  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours}:${minutes}:${seconds}`;
}

const formatData = ( data = [] ) => {

  const { getMultipleMeasurements: metricsData } = data;

  const unitMapping = {}; // used to store metric units mapping
  // format data by epoch
  const dataMapping = metricsData.reduce( ( acc, current ) => {
    const { metric, measurements } = current;
    measurements.forEach( measurement => {
      
      const { at, value, unit } = measurement;
      const ts = getTsStringFromEpoch(at);
      if( !acc[at] ) {
        acc[at] = {
          ts,
          [metric]: value,
        }
      }
      else {
        acc[at][metric] = value;
      }
      unitMapping[metric] = unit;
    } )
    return acc;
  },{} );

  const result = Object.keys( dataMapping ).map( key => dataMapping[key] );

  return { data: result, units: unitMapping };
};

const GraphSection = props => {

  const { metrics = [] } = props;

  const input = metrics.map( metricName => {
    return {
      metricName,
      before,
      after
    };
  } );

  const [result] = useQuery({
    query,
    variables: {
      input,
    },
  });

  const { fetching, data, error } = result;


  if ( error ) {
    return <div> { error.message } </div>
  }
 
  if ( fetching ) return <CircularProgress size={ 20 }/>;
  const graphData = formatData( data );

  return <Graph data={ graphData } height={ 500 } width={ 1000 } colorPallette={ defaultColorPallette }/>
}
