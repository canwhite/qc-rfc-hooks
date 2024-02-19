import { useState, useCallback, useRef } from "react";
const globalStates: {
  /*[key: string] 是一个索引签名。
  这表示 globalStates 对象可以通过任何字符串来索引，
  并获取其对应的值 */
  [key: string]: {
    state: any;
    sets: ((v: any) => void)[];
  };
} = {};

// <>里可以提前声明一些内部要用的type
export default <D extends unknown>(
  key: string,
  initState?: D 
// Return a tuple containing the state and a function to set it
): [D, (state: D) => void] => { 

  // useState hook to create state management
  // 往state上赋值
  const [globalState, setGlobalState] = useState<D>(
    globalStates[key]?.state === undefined
      ? initState
      : globalStates[key]?.state // Retrieve the state from globalStates if it exists, otherwise use the initialState
  );
  // If the key does not exist in the globalStates object, create it
  if (!globalStates[key]) {
    globalStates[key] = {
      state: globalState,
      sets: []
    };
  }
  // useRef to keep track of whether the state has been pushed
  const pushedRef = useRef(false);
  // If the state hasn't been pushed, push it to the sets array and update pushedRef
  if (!pushedRef.current) {
    globalStates[key].sets.push(setGlobalState);
    pushedRef.current = true;
  }
  // Return a tuple containing the globalState and a function to update it.
  return [
    globalState,
    useCallback(
      (state) => { // The function to update the globalState
        globalStates[key].state = state; // Update the globalState in the globalStates object
        globalStates[key].sets.forEach((fn) => fn(state)); // Run each function in the sets array
        setGlobalState(state); // Update the local/globalState
      },
      [key] // Depend on the key, re-create the function when 'key' changes
    )
  ];
};