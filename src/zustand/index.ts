import { useEffect, useState } from "react";

type ApiType = {
    setState:(partial:Function | object, replace:boolean)=>void;
    getState:()=>object;
    subscribe:(listener:(state:object,prevState:object)=>void)=>void;
    destory:()=>void;
}


export const createStore = function(createState:Function){
    let state: any; //全局变量，好处是：如果setState传入cb的时候，顺带把state给它
    const listeners = new Set<Function>();
    const setState = (partial:Function | object, replace:boolean)=>{
        const nextState = typeof partial === "function" ? partial(state) :state;
        //判等
        if(!Object.is(nextState,state)){
            const previousState = state;
            if(!replace){
                //如果不是替换就做合并
                state = (typeof nextState !== "object" || nextState !==null) 
                    ? nextState 
                    : Object.assign({},state,nextState);
                
            }else{
                //如果是替换就直接替换了吧
                state = nextState;
            }
            //发文档
            listeners.forEach((listener)=>listener(state,previousState));
        }
    }
    const getState = ()=>state;

    //加群组
    const subscribe= (listener:Function)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    }

    const destory = ()=>{
        listeners.clear()
    }
    const api = {setState,getState,subscribe,destory};
    //调用传进来的创建cb,赋予store中的方法
    state = createState(setState,getState,subscribe,destory);
    return api;
}
//加群组，set的时候发报
export function useStore(api:ApiType , selector:Function){
    const [,forceRender] = useState(0);
    useEffect(()=>{
        //add listener, 全局监听，如果变化强制刷新
        api.subscribe((state,prevState)=>{
            const newObj = selector(state);
            const oldobj = selector(prevState);

            if(newObj !== oldobj) {
                forceRender(Math.random());
            } 
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return selector(api.getState());
}


export const create = (createState:Function) => {
    const api = createStore(createState);
    function _useBoundStore(selector:Function) {
        return useStore(api, selector);
    };
    /* Object.assign(_useBoundStore, api); 
    注意_useBoundStore，定义为function操作不会成功，
    因为Object.assign()方法只会将一个对象的可枚举的自身属性从一个或多个源对象复制到目标对象。它将返回目标对象。
    然而，Object.assign()并不直接应用于函数。这是因为函数本质上是一种特殊的对象，所以它们有自己的属性，
    如原型（prototype）、名称（name）和长度（length）。你可以把这些属性看作是函数的元数据。
    然而，你不能直接改变一个函数的主体（即函数的内部代码），所以它的行为是不变的，你也拿不到api中的属性
    即使是将其改成箭头函数也不行，因为如果是箭头函数_useBoundStore的this作为已经被固定，不能修改
    */

    //创建一个this指向当前的空对象
    const useBoundStore = Object.assign((selector:Function) => _useBoundStore(selector), api);
    return useBoundStore;
}
