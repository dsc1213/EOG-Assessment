import React from 'react';
import { Provider, createClient, defaultExchanges, subscriptionExchange, useSubscription } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexFlow: 'row wrap',
  },
});

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', {});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

const query = `
subscription {
  newMeasurement {
    metric
    at
    value
    unit
  }
}`;

const mapping = {};

const Measurement = props => {
  const classes = useStyles();

  const { metrics: selectedMetrics } = props;
  const [result] = useSubscription({
    query,
  });
  const { data: { newMeasurement: { metric, value } = {} } = {} } = result;

  if (selectedMetrics.indexOf(metric) !== -1) {
    mapping[metric] = value;
  } else {
    // mapping[metric] = undefined;
    delete mapping[metric];
  }

  return (
    <div className={classes.container}>
      {Object.keys(mapping).map(key => (
        <TextField variant="outlined" disabled={true} key={key} value={`${key} - ${mapping[key]}`} />
      ))}
    </div>
  );
};

export default props => {
  return (
    <Provider value={client}>
      <Measurement {...props} />
    </Provider>
  );
};
