export function IsObjEmpty(obj: object) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
export function WriteError(message?: any, ...optionalParams: any[]) {
    console.error("Error:", message, ...optionalParams);
}
export function WriteLog(message?: any, ...optionalParams: any[]): void {
    //console.log(`Log: ${msg}`);
    console.log("Log:", message, ...optionalParams);
}