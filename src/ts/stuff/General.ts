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

function treatAsUTC(date:Date):number {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return (<number><unknown>result);
}

export function GetDaysBetween(startDate:Date, endDate:Date) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}