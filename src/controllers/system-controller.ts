import { Request, Response } from 'express'

async function health(req: Request, res: Response) {
    res.status(200).send({ status: 'green', version: '1.0.0' })
}

export default { health }
