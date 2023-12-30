export const Listreducer=(prevState={
    list:[]
},action)=>{
    let newState={...prevState}
    switch(action.type){
        case "list":
            newState.list=action.payload
            return newState
        default:
            return prevState
    }
}