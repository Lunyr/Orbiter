import registry from '../registry';

const triggerAlias = (store) => (next) => (action) => {
  // TODO: store.dispatch() instead to not skip any middleware
  if (action.type === 'ALIASED' && action.meta && action.meta.trigger) {
    const alias = registry.get(action.meta.trigger);
    if (!alias) {
      return next(action);
    }
    const args = action.payload || [];
    // Trigger alias
    return next(alias(...args));
  }
  return next(action);
};

export default triggerAlias;
