export function IsObjEmpty(obj: object) {
	for (const key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}

	return true;
}
export function WriteError(message?: any, ...optionalParams: any[]) {
	console.error('Error:', message, ...optionalParams);
}
export function WriteLog(message?: any, ...optionalParams: any[]): void {
	// console.log(`Log: ${msg}`);
	console.log('Log:', message, ...optionalParams);
}

function treatAsUTC(date: Date): Date {
	const result = new Date(date);
	result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
	return result;
}

export function GetDaysBetween(startDate: Date, endDate: Date) {
	const millisecondsPerDay = 24 * 60 * 60 * 1000;
	return (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) / millisecondsPerDay;
}
