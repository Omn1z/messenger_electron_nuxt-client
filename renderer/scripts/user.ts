export interface ILastSeenAtOnline {
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number
}

export interface IUser {
    uid: number,
    phone?: string
    username: string,
    firstname: string,
    surname?: string,
    avatar: string,
    online: boolean,
    fullName: string,
    lastSeen?: ILastSeenAtOnline
    registered: boolean
}
