import {DependencyList, useCallback, useLayoutEffect, useRef} from 'react';
import useDeepCompareValue from './useDeepCompareValue';

const useDeepCompareCallback = (
    fn: (...args: any[]) => any,
    deps: DependencyList,
) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(fn, useDeepCompareValue(deps));
};

export default useDeepCompareCallback;
