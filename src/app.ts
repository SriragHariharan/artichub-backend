import express, { Request, Response } from 'express';
const app = express();

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 4444, () => {
    console.log('Example app listening on port ' + (process.env.PORT || 4444));
});