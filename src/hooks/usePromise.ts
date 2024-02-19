import { useState, useEffect} from "react";

const handlePromise = (promise: Promise<unknown>) =>
  promise.then(data => (data))
    .catch(error => (error));

const usePromise = (promise: Promise<unknown>) => {
  const [result, setResult] = useState<null | unknown>(null);
  useEffect(() => {
    let isMounted = true;
    handlePromise(promise).then(
      value => isMounted && setResult(value)
    );
    return () => { isMounted = false };
  }, [promise]);
  return result;
};
export default usePromise;