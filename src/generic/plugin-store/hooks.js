import { useSelector, shallowEqual } from 'react-redux';
import { useMemo } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function usePluginsCallback(methodName, defaultMethod) {
  const pluginsState = useSelector(state => state.plugins, shallowEqual);
  return useMemo(
    () => () => {
      let result = defaultMethod();
      Object.values(pluginsState).forEach((plugin) => {
        if (plugin[methodName]) {
          result = plugin[methodName](result);
        }
      });
      return result;
    },
    [methodName, defaultMethod, pluginsState],
  );
}
