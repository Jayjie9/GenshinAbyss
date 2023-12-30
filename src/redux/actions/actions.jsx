export function cha(id,name){
    return{
        type:"c",
        payload:{id,name}
    }
}
export function setVersion(version){
    return{
        type:"version",
        payload:version
    }
}
export function setlist(list){
    return{
        type:"list",
        payload:list
    }
}