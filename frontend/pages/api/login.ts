// pages/api/login.ts
import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { headers, body } = req

  try {
    const { data, headers: returnedHeaders } = await axios.post(
      'http://localhost:3000/v1/auth/login/', // Node.js backend path
      body, // Login body (email + password)
    )
    //  Update headers on requester using headers from Node.js server response
    Object.entries(returnedHeaders).forEach((keyArr) =>
      res.setHeader(keyArr[0], keyArr[1] as string)
    )
    res.send(data) // Send data from Node.js server response
  } catch (err : any) {
      const status = err.response.status;
      const data = err.response.data;

    // Send status (probably 401) so the axios interceptor can run.
    res.status(status).json(data)
  }
}