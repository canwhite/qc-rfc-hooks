import equal from 'fast-deep-equal/es6/react';
import {useRef} from 'react';

const useDeepCompareValue = <T extends unknown>(value: T) => {
    const ref = useRef<T>(value);

    if (!equal(value, ref.current)) {
        ref.current = value;
    }
    
    return ref.current;
};

export default useDeepCompareValue;
