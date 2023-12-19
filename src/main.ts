import express, {Request, Response} from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression';
import CouchDBApi from './CouchDBApi';

const app = express()

app.listen(22000, () => console.log('Server listening on 22000'))

app.use(compression())
app.use(cors())
app.use(morgan('tiny'))

app.get('/', async (req: Request, res: Response) => {
    res.send({"acarflowapi": "hello world"})
})

app.get('/frames', async (req: Request, res: Response) => {
    const skip = parseInt(<string>req.query.skip)
    const limit = parseInt(<string>req.query.limit)
    CouchDBApi.all(<string>req.query.regex ?? '(HI)', isNaN(skip) ? 0 : skip, isNaN(limit) ? 10 : limit)
        .subscribe(data => {
            const body = {skipped: skip, frames: data.docs.map(s => s.frame)}
            res.send(body)
            res.end()
        })
})