mport { useEffect, useState } from "react";
const handlePromise = (promise: Promise<unknown>) =>
  promise.then((data) => data).catch((error) => error);
const usePromise = (promiseFunc: () => Promise<unknown>) => {
  const [result, setResult] = useState<null | unknown>(null);
  useEffect(() => {
    let isMounted = true;
    const promise = promiseFunc();
    handlePromise(promise).then((value) => {
      if (isMounted) {
        setResult(value);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [promiseFunc]); 
  return result;
};
export default usePromise;
