export class Post {
    userId?: string;
    timestamp: Date;
    comment: string;
    _id?: string;
    
    constructor(comment: string, timestamp: Date, userId?: string, id?: string) {
        this.userId = userId;
        this.timestamp = timestamp;
        this.comment = comment;
        this._id = id;
    }
}