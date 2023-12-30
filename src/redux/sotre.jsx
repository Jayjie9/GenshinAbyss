import {combineReducers, createStore} from "redux"
import { CharacterReducer } from "./reducer/CharacterReducer";
import { Versionreducer } from "./reducer/Versionreducer";
import { Listreducer } from "./reducer/Listreducer"
const allReducers={
    cState:CharacterReducer,
    version:Versionreducer,
    list:Listreducer
}
const rootReducer=combineReducers(allReducers);
const store=createStore(rootReducer);
export default store;