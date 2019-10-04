import { Map, fromJS } from 'immutable';
import { START_UP } from '../../actions/actionConstants';


const initialState = Map({
  constants: {
    // API_HOST: 'http://127.0.0.1:8000',
    // API_HOST: 'http://api.massenergize.org',
  },
  profile: null
});


const initialImmutableState = fromJS(initialState);
export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case START_UP:
      return state;
    default:
      return state;
  }
}
