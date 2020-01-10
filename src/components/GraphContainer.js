import React, { useState, useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import CircularProgress from '@material-ui/core/CircularProgress';



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

  if ( fetching ) return <CircularProgress size={ 20 }/>;

  console.log( '>>>>>>>', data );

  return <React.Fragment>
            This is Graph Containerdsgads
        </React.Fragment>
}
