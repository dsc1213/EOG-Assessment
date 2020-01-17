import React from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const defaultMargin = {
  top: 5,
  right: 30,
  left: 20,
  bottom: 5,
};

const getTsStringFromEpoch = epoch => {
  const date = new Date(epoch);
  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours}:${minutes}:${seconds}`;
};

const formatData = (metricsData = []) => {

  const unitMapping = {}; // used to store metric units mapping
  // format data by epoch
  const dataMapping = metricsData.reduce((acc, current) => {
    const { metric, measurements } = current;
    measurements.forEach(measurement => {
      const { at, value, unit } = measurement;
      const ts = getTsStringFromEpoch(at);
      if (!acc[at]) {
        acc[at] = {
          ts,
          [metric]: value,
        };
      } else {
        acc[at][metric] = value;
      }
      unitMapping[metric] = unit;
    });
    return acc;
  }, {});

  const result = Object.keys(dataMapping).map(key => dataMapping[key]);

  return { data: result, units: unitMapping };
};

const Graph = props => {

  const {
    width,
    height,
    margin = defaultMargin,
    xAxisKey = 'ts',
    colorPallette = {},
  } = props;

  const { data: metricsData } = useSelector( state => state.graph ) || {};
  const { data, units } = formatData( metricsData );

  return (
    <LineChart width={width} height={height} data={data} margin={margin}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xAxisKey} />
      {Object.keys(units).map(metric => {
        const stroke = colorPallette[metric];
        return [
          <YAxis yAxisId={metric} key={metric} />,
          <Line yAxisId={metric} type="monotone" dataKey={metric} stroke={stroke} key={metric} />,
        ];
      })}
      <Tooltip
        formatter={(value, name) => {
          const unit = units[name];
          return `${value} ${unit}`;
        }}
      />
      <Legend />
    </LineChart>
  );
};

export default Graph;
