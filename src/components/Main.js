import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from './CardHeader';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';



const useStyles = makeStyles({
  card: {
    margin: '2%',
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
  select: {
    width: '500px',
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

  return (
    <Card className={classes.card}>
      <CardHeader title="EOG Assessment" />
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

  const Dropdown = ({ onChange, data = [], value  }  ) => {
    
    const classes = useStyles();

    return (
      <TextField
      label="Select"
      select
      value={value}
      margin={ 'dense' }
      onChange={ e => {
        const value = e.target.value || '';
        onChange( value );
      } }
      className={ classes.select }
    >
       <MenuItem value=""> <em>None</em> </MenuItem>
       { data.map( (metric ) => <MenuItem value={ metric } key={ metric }>{ metric }</MenuItem> ) }
    </TextField>
    );
  }