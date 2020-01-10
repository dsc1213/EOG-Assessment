import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dropdown from './dropdown';

const useStyles = makeStyles({
  card: {
    margin: '1%',
    height: '700px',
  },
  cardContent: {
    height: '600px'
  },
  selectContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '100px',
    alignItems: 'center',
  },
  graphContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '500px',
    alignItems: 'center',
  },
  loading: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});


const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query {
    getMetrics
  }
`;

export default () => {

  return <Provider value={ client }>
          <MainSection />
        </Provider>
}

const MainSection = () => {
  
  const classes = useStyles();

  const [result] = useQuery({
    query,
  });

  const [selectedMetric, updatedSelectedMetric ] = useState('');
  const { fetching, data, error } = result;

  if ( error ) {
    // Temporary Error Handling
    console.error( '>>ERROR', error.message );
  }

  return (
    <Card className={classes.card}>
      <CardContent className={ classes.cardContent }>
         { !fetching &&  <div>
            <div className={ classes.selectContainer}>
              <Dropdown onChange={ updatedSelectedMetric } value={ selectedMetric } data={ ( data || {} ).getMetrics } />
            </div>
            <div className={ classes.graphContainer }>
              This is Graph Container
            </div>
         </div> }
          { fetching && <div className={ classes.loading }>
              <CircularProgress size={ 20 }/>
            </div>}
      </CardContent>
    </Card>
  );
}
