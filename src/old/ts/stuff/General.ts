function treatAsUTC(date: Date): Date {
	const result = new Date(date);
	result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
	return result;
}

export function GetDaysBetween(startDate: Date, endDate: Date) {
	const millisecondsPerDay = 24 * 60 * 60 * 1000;
	return (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) / millisecondsPerDay;
}
