import {useCallback,useRef} from 'react';
//Because the unknown type is a supertype of all types.
const useEvent = <Args extends any[], TRet extends unknown>(
    handler: (...args: Args) => TRet,
) => {
    //常量,初始化就是handler，这样就不用专门设置类型了
    const handlerRef = useRef(handler);
    //赋值
    handlerRef.current = handler;
    //缓存
    return useCallback<(...args: Args) => TRet>((...args) => handlerRef.current(...args),[]);
};

export default useEvent;
