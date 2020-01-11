import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const defaultMargin = {
  top: 5, right: 30, left: 20, bottom: 5,
};

const Graph = props => {

  const { width, height, margin = defaultMargin, data: { data, units }, xAxisKey = 'ts', colorPallette = {} } = props;

  return  <LineChart
            width={ width }
            height={ height }
            data={ data }
            margin={ margin }
          >
            <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={ xAxisKey } />
              {Object.keys( units ).map( metric => {
                const stroke = colorPallette[metric];
                return [<YAxis yAxisId={metric} key={ metric }/>,
                        <Line yAxisId={metric}
                              type="monotone" 
                              dataKey={metric} 
                              stroke={ stroke }
                              key={ metric } />]
              } )}
              <Tooltip formatter = { (value, name ) => {
                const unit = units[name];
                return `${value} ${unit}`;
              } }/>
              <Legend />
          </LineChart>
}

export default Graph;