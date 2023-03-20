import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

export function configureStoreInDevelopment(combinedReducers) {
  let store;

  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    store = createStore(
      combinedReducers,
      {}, // initial state
      compose(
        applyMiddleware(thunk),
        // Redux Dev Tools
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )
    );
  } else {
    store = configureStore(combinedReducers);
  }

  return store;
}

export function configureStore(combinedReducers) {
  const store = createStore(
    combinedReducers,
    {},
    compose(applyMiddleware(thunk))
  );

  return store;
}
