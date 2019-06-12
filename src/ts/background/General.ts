export function IsObjEmpty(obj: object) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
export function WriteError(error: string, obj1?:any) {
    console.log("Error:", error, obj1);
}
export function WriteLog(msg: string, obj1?:any) {
    //console.log(`Log: ${msg}`);
    console.log("Log:", msg, obj1);
}