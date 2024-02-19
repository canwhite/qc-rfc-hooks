import {DependencyList, useMemo} from 'react';
import useDeepCompareValue from './useDeepCompareValue';

const useDeepCompareMemo = <Value extends unknown>(
    fn: () => Value,
    deps: DependencyList,
) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(fn, useDeepCompareValue(deps));
};

export default useDeepCompareMemo;
