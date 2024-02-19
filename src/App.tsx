import React, { useContext, useEffect, useMemo, useState } from "react";
import useGlobalState from "./hooks/useGlobalState";
import usePromise from "./hooks/usePromise";
import useEvent from "./hooks/useEvent";
import {useIsolation,IsolationProvider,useIsolationWithDeps} from "./hooks/useIsolation";
const MyContext = React.createContext(0);

//初始化
const useGlobalStep = () => useGlobalState("globalStep", 1);

const A = () => {
  const [globalStep] = useGlobalStep();
  return <div>Component A：{globalStep}</div>;
};

const B = () => {
  const [globalStep, setGlobalStep] = useGlobalStep();
  return (
    <div>
      Component B：{globalStep}
      <button onClick={() => setGlobalStep(globalStep - 1)}>
        globalStep - 1
      </button>
    </div>
  );
};

export default () => {  
  const [globalStep, setGlobalStep] = useGlobalStep();
  const p = useEvent(async ()=>{    
    return "123";
  });
  const data =  usePromise(p());
  //和三方合作，这里做下监听
  useEffect(()=>{
    console.log("--",data);
  },[data]);


  const [x, setX] = React.useState(0)
  useEffect(
    () => {
      let interval = setInterval(() => setX(x => x + 1), 1000)
      console.log(interval);
      return () => { clearInterval(interval) }
    },
    []
  )

  /**  
    const x = useIsolation(() => {
      const [x, setX] = React.useState(0)
      useEffect(
        () => {
          let interval = setInterval(() => setX(x => x + 1), 1000)
          console.log(interval);
          return () => { clearInterval(interval) }
        },
        []
      )
      return useMemo(() => x - (x % 2), [x])
    })
  */
  const y = useIsolationWithDeps(()=>{
    const [y,] = useState(Math.random())  ;
    return useMemo(()=>x+y,[y])
  },[x])
  console.log("---y---",y);


  return (
    <IsolationProvider>
      <div>
        <A />
        <B />
        <div>Parent Component：{globalStep}</div>
        <button onClick={() => setGlobalStep(globalStep + 1)}>
          globalStep + 1
        </button>
        <p>{x}</p>

      </div>
    </IsolationProvider>
  );
};
