import React from 'react';
import { Provider, createClient, useQuery } from 'urql';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { actions } from '../reducer/graph-reducer';

import Graph from './Graph';
import Measurement from './Measurement';

const defaultColorPallette = {
  waterTemp: '#8884d8',
  casingPressure: '#82ca9d',
  injValveOpen: '#82c0ca',
  flareTemp: '#fcba03',
  oilTemp: '#a5d923',
  tubingPressure: '#d95a23',
};

const useStyles = makeStyles({
  graphContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  mesurement: {
    height: '120px',
    margin: '5px',
  },
  graph: {
    height: '400px',
  },
});

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
      <GraphSection {...props} />
    </Provider>
  );
};

// Getting Data for 1 minute
const before = Date.now(); // time in ms
const after = Date.now() - 1000 * 60; // 1 minute before time in ms

const GraphSection = props => {
  
  const classes = useStyles();
  const dispatch = useDispatch();

  const { metrics = [] } = props;

  const input = metrics.map(metricName => {
    return {
      metricName,
      before,
      after,
    };
  });

  const [result] = useQuery({
    query,
    variables: {
      input,
    },
  });

  const { fetching, data, error } = result;

  if (error) {
    return <div> {error.message} </div>;
  }

  if (fetching) return <CircularProgress size={20} />;

  dispatch( actions.graphDataRecevied( data ) );

  return (
    <div className={classes.graphContainer}>
      {metrics && metrics.length > 0 && (
        <div className={classes.measurement}>
          <Measurement metrics={metrics} />
        </div>
      )}
      {metrics && metrics.length > 0 && (
        <div className={classes.graph}>
          <Graph height={450} width={1000} colorPallette={defaultColorPallette} />
        </div>
      )}
    </div>
  );
};
