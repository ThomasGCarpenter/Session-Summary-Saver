import { configureStore, configureStoreInDevelopment } from './configure-store';

function initializeStore(stateTree) {
  let store;
  if (
    process.env.NODE_ENV === 'PRODUCTION' ||
    (location && location.hostname !== 'localhost')
  ) {
    store = configureStore(stateTree);
  } else {
    store = configureStoreInDevelopment(stateTree);
  }

  return store;
}

const Store = { initializeStore };

export default Store;
