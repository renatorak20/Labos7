export class User {
    username: string;
    password: string;
    name: string;
    email: string;
    _id?: string;

    constructor(username: string, password: string, name: string, email: string, userId?: string) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this._id = userId;
    }
}