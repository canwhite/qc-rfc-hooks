import { useState, useEffect} from "react";

async function handlePromise(promise: Promise<any>) {
  try {
    const data = await promise;
    return data;
  } catch (error) {
    return error;
  }
}
const usePromise = (promise: Promise<any>) =>{
  const [result, setResult] = useState<null | any>(null);
  useEffect(() => {
    let isMounted = true;
    handlePromise(promise).then(
      value => isMounted && setResult(value)
    );
    return () => { isMounted = false };
  }, [promise]);
  return result;
}

export default usePromise;
