import { NextApiRequest, NextApiResponse } from "next";

export default function tt (req: NextApiRequest, res: NextApiResponse){
    console.log(req);

    return res.status(200).json({ ola: 'olaa'})
}