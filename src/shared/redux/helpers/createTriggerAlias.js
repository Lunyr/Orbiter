import registry from '../registry';

export default function createTriggerAlias(name, actionCreator) {
  // register
  registry.set(name, actionCreator);
  
  // factory
  return (...args) => ({
    type: 'ALIASED',
    payload: args,
    meta: {
      trigger: name,
    },
  });
}
