export const CharacterReducer=(prevState={
    id:0,name:'null'
},action)=>{
    let newState={...prevState}
    switch(action.type){
        case "c":
            newState.id=action.payload.id
            newState.name=action.payload.name
            return newState
        default:
            return prevState
    }
}