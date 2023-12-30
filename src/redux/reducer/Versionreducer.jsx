export const Versionreducer=(prevState={
    version:'4.2'
},action)=>{
    let newState={...prevState}
    switch(action.type){
        case "version":
            newState.version=action.payload
            return newState
        default:
            return prevState
    }
}