export class RegexUtils {
    /**
     * checks alphabetical letters
     */
    static get charRegex(): RegExp{
        return new RegExp(/[a-zA-Z]/g);
    }
    static get emailRegex(): RegExp{
        return new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
    static get numberRegex(): RegExp{
        return new RegExp(/\d{1,3}\.{0,1}\d{0,1}$/);
    }
    /**
     * regex for incoming dates properties ex: 2008-08-30T01:45:36
     */
    static get validIncomingDate(): RegExp{
        // tslint:disable-next-line:max-line-length
        return new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[0-1]|0[1-9]|[1-2][0-9])T(2[0-3]|[0-1][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[0-1][0-9]):[0-5][0-9])?$/g);
    }
}
