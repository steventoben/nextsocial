
export interface ParsedDate {
    year: number;
    month: number;
    day: number;
}
export interface ParsedTime {
    second: number;
    minute: number;
    hour: number;
    timezoneOffset: number;
}
export interface DateTime extends ParsedDate, ParsedTime {

}

export function parseDateString(dateString: string) {
    const [dateSplit, timeSplit] = dateString.split('T');
    const [year, month, day] = dateSplit.split('-');
    const date: ParsedDate = {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day)
    }

    const timeString = timeSplit.slice(0, timeSplit.indexOf('Z'));
    const [hour, minute, second] = timeString.split(':');
    const time: ParsedTime = {
        hour: parseInt(hour),
        minute: parseInt(minute),
        second: parseInt(second),
        timezoneOffset: 0
    }

    const dateTime: DateTime = {
        ...date,
        ...time
    };
    return dateTime;
}
export function getTimeSince(dateString: string): string {
    const dateTime: DateTime = parseDateString(dateString);
    const nowDateTime: DateTime = parseDateString(new Date().toISOString());
    console.log(dateTime);
    console.log(nowDateTime);
    console.log(Date.parse(dateString));
    console.log(Date.parse(new Date().toISOString()));
    const now = new Date();
    const nowString = now.toISOString();
    const diff = Date.parse(nowString) - Date.parse(dateString);
    console.log(diff);
    const YEAR_IN_MS = 31536000000;
    const MONTH_IN_MS = 2628002880;
    const DAY_IN_MS = 86400000;
    const HOUR_IN_MS = 3600000;
    const MINUTE_IN_MS = 60000;
    console.log(diff);
    console.log(`years:   ${diff / YEAR_IN_MS}`);
    console.log(`months:   ${diff / MONTH_IN_MS}`);
    console.log(`days:   ${diff / DAY_IN_MS}`);
    let value = diff;
    console.log('VALUE: ')
    console.log(value)
    if(value / YEAR_IN_MS >= 1) {
        value /= YEAR_IN_MS;
        const yearsElapsed = value;//value / YEAR_IN_MS;
        console.log(yearsElapsed);
        console.log(`${Math.floor(yearsElapsed)} year${Math.floor(yearsElapsed)>1?'s':''} ago`);
        return `${Math.floor(yearsElapsed)} year${Math.floor(yearsElapsed)>1?'s':''} ago`;
    }
    console.log('year:')
    console.log(value)
    if(value / MONTH_IN_MS >= 1) {
        value /= MONTH_IN_MS;
        const monthsElapsed = value;//value / YEAR_IN_MS;
        console.log(monthsElapsed);
        return `${Math.floor(monthsElapsed)} month${Math.floor(monthsElapsed)>1?'s':''} ago`;
    }
    console.log('month:')
    console.log(value)
    if(value / DAY_IN_MS >= 1) {
        value /= DAY_IN_MS;
    }
    console.log('day:')
    console.log(value)
    return '';
}
