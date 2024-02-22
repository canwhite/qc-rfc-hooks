import React, {useEffect, useMemo, useState } from "react";
import useGlobalState from "./hooks/useGlobalState";
import usePromise from "./hooks/usePromise";
import useEvent from "./hooks/useEvent";
import {IsolationProvider,useIsolationWithDeps} from "./hooks/useIsolation";
import { create } from "./zustand";

//初始化
const useGlobalStep = () => useGlobalState("globalStep", 1);
const useCommonStore = create(()=>({
  count:1,
  todo:[
    {item:1},
    {item:2},
    {item:3}
  ]
}));

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

const App = () => {  

  //useGlobalStep
  const [globalStep, setGlobalStep] = useGlobalStep();
  //usePromise
  const p = useEvent(async ()=>{    
    return "123";
  });
  console.log(usePromise(p));

  //store
  const todo = useCommonStore((state:any)=>state.todo)
  console.log("---todo---",todo);
  console.log("---count---",useCommonStore.getState().count)
  useCommonStore.setState({count:2});
  const count = useCommonStore((state:any)=>state.count)
  console.log("---count---",count)
  


  //useIsolation
  const [x, setX] = React.useState(0)
  useEffect(
    () => {
      let interval = setInterval(() => setX(x => x + 1), 300000)
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [y,] = useState(Math.random())  ;
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

export default App;
