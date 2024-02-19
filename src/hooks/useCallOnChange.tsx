import { useRef } from "react";

type CallOnChange = {
    ifChanged: any, 
    callback: (ifChanged:any)=>void,
}

const useCallOnChange = ({ ifChanged, callback }:CallOnChange) => {
    const changeRef = useRef<any>(null);
    if (changeRef.current !== ifChanged) callback(ifChanged);
    changeRef.current = ifChanged;
}

export default useCallOnChange;
