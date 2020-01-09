import React from 'react';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from './CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
  card: {
    margin: '1%',
  },
});

export default () => {

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title="EOG Assessment" />
      <CardContent>
        this is main section
      </CardContent>
    </Card>
  );
}
