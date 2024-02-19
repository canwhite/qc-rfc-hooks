import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useEvent from './useEvent';
import useCallOnChange from './useCallOnChange';
import useGlobalState from './useGlobalState';

type HookFunction = (...args: any[]) => any;
interface HookInfo {
    hook: HookFunction;
    callback: HookFunction;
}
type IsolationProviderProps = {
    children: React.ReactNode 
}

const useGlobalHooks = () => useGlobalState("globalHooks", 
   [] as HookInfo[]
);

export  const  useIsolation = (unsafeHook: HookFunction)=> {
  const hook: HookFunction = useEvent(unsafeHook);
  const [result, setResult] = useState<any>(null);
  const [hookInfo,setHookInfo] = useGlobalHooks();
   
  useEffect(() =>{
    const info = {
        hook,
        callback: (...args: [any]) => setTimeout(() => setResult(...args), 0)
     }
    setHookInfo(hookInfo.concat([info]));
    return ()=>{
        setHookInfo(hookInfo.filter(item => item.hook !== info.hook))
    }
  } , []);
  
  return result;
}

export const useIsolationWithDeps = (unsafeHook: HookFunction, deps: any[]) => {
    const hook: HookFunction = useEvent(unsafeHook);
    const [result, setResult] = useState<any>(null);
    const [hookInfo,setHookInfo] = useGlobalHooks();
    useEffect(() => {
      const existingHookInfo = hookInfo.find(info => info.hook === unsafeHook);
      // If this hook does not exist, we add it.
      if (!existingHookInfo) {
        const info = {
          hook,
          callback: (...args:[any]) => setTimeout(() => setResult(...args), 0)
        }
        setHookInfo(hookInfo.concat([info]));
      }
      // Cleanup: remove this hook info when the component unmounts or when this hook changes.
      return () => {
        setHookInfo(hookInfo.filter(info => info.hook !== unsafeHook));
      }
    }, deps); // Re-run the effect if dependencies change.
    return result;
}

export const IsolationProvider:React.FC<IsolationProviderProps> = React.memo(({children})=>{
    console.log('render isolation provider');
    const [hookInfo,] = useGlobalHooks();
    return (
        <>
            {children}
            {hookInfo.map((info, i) =>
                <Isolation key={i} info={info} />
            )}
        </>
    );
});

const Isolation: React.FC<{ info: HookInfo }> = React.memo(({ info }) => {
    const { callback, hook } = info;
    const result = hook();
    console.log('hook executed', result);
    useCallOnChange({ ifChanged: result, callback });
    return null;
});






