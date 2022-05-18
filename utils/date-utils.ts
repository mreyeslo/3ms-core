import { templateJitUrl } from "@angular/compiler";

export class DateUtils {

    static parseIntDate(intDate: number): string {
        if (intDate) {
            const intDateString = intDate.toString();
            if (intDateString && intDateString.length === 8) {
                const month = intDateString.substr(4, 2);
                const date = intDateString.substr(6, 2);
                const year = intDateString.substr(0, 4);
                return `${month}/${date}/${year}`;
            }
        }
        return null;
    }

    static parseDateTime(date: Date): string {
        const dateObject = date ? new Date(date) : null;
        return dateObject ? dateObject.toLocaleDateString() : '';
    }

    static dateToInt(date: Date): number {
        const dateObject = date ? new Date(date) : null;
        return dateObject ? +dateObject.toISOString().split('T')[0].replace(/\-/g, '') : null;
    }

    static isDate(dateStr) {
        var regex = /^(((0[13578]|1[02])[\/\.-](0[1-9]|[12]\d|3[01])[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-2]):(0[0-9]|[1-59]\d):(0[0-9]|[1-59]\d)\s(AM|am|PM|pm))|((0[13456789]|1[012])[\/\.-](0[1-9]|[12]\d|30)[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-2]):(0[0-9]|[1-59]\d):(0[0-9]|[1-59]\d)\s(AM|am|PM|pm))|((02)[\/\.-](0[1-9]|1\d|2[0-8])[\/\.-]((19|[2-9]\d)\d{2})\s(0[0-9]|1[0-2]):(0[0-9]|[1-59]\d):(0[0-9]|[1-59]\d)\s(AM|am|PM|pm))|((02)[\/\.-](29)[\/\.-]((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))\s(0[0-9]|1[0-2]):(0[0-9]|[1-59]\d):(0[0-9]|[1-59]\d)\s(AM|am|PM|pm)))$/g;
        return regex.test(dateStr);
    }

    static addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}
