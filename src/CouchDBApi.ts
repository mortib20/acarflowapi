import Nano, {MaybeDocument, ServerScope} from 'nano';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';

class MinimizedAcars {
    constructor(public type: string, public channel: string, public receiver: string, public timestamp: number, public label: string, public text: string, public reg: string, public flight: string, public icao: string) {
    }
}

interface iCouchDBAcars extends MaybeDocument {
    frame: MinimizedAcars
}

class CouchDBAcars implements iCouchDBAcars {
    _id: string | undefined
    _rev: string | undefined
    frame: MinimizedAcars

    constructor(frame: MinimizedAcars) {
        this._id = undefined
        this._rev = undefined
        this.frame = frame
    }
}

export default class CouchDBApi {
    private static host = process.env.ACARFLOWDB_ADDRESS ?? 'http://localhost'
    private static nano: ServerScope = Nano(CouchDBApi.host)
    private static db = CouchDBApi.nano.use<CouchDBAcars>('acarflow')
    
    public static all(regex: string, skip: number, limit: number) {
        return fromPromise(CouchDBApi.db.find({selector: { "frame.text": { "$regex": regex } }, sort: [ {"frame.timestamp": "desc"} ], limit, skip}));
    }
}