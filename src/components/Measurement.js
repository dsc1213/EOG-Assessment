import React from 'react';
import { Provider, createClient, defaultExchanges, subscriptionExchange, useSubscription } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const subscriptionClient = new SubscriptionClient( 'ws://react.eogresources.com/graphql', {} );

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [...defaultExchanges, subscriptionExchange({
    forwardSubscription: operation => subscriptionClient.request( operation ),
  })]
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

const Measurement = props => {

  const [result] = useSubscription({
                      query,
                    })
  const { data: { newMeasurement } = {} } = result;  
  
  // console.log( '>>>>QUERY', props.metrics, newMeasurement );

  return <div> this is measurement </div>
}

export default props => {
  return (
    <Provider value={client}>
      <Measurement {...props} />
    </Provider>
  );
};