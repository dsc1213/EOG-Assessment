import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as graphReducer } from '../reducer/graph-reducer';

export default {
  weather: weatherReducer,
  graph: graphReducer,
};
