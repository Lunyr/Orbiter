import { configureStore } from '../shared/redux/store';

export default () => {
  const { store } = configureStore({}, 'orbiter-main', false);
  store.subscribe(() => {
    global.state = store.getState();
  });
  return store;
};
