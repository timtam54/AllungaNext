import { getToken } from 'next-auth/jwt'
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) // get JWT token from request

  try {
    return new Promise(async (resolve, reject) => {
        const apiUrl = `https://mdsapi.icyforest-7eae763b.australiaeast.azurecontainerapps.io/api/TechEngineer/{id}?BranchID=24`;

        const response = await fetch(apiUrl, { // example URL
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token?.access_token}`,  // <-- add token to request
              ContentType: "application/json",
            }
          });
          const json = await response.json();
          res.send(JSON.stringify(json, null, 2));               
    });
} catch (e) {
    var error = e;
  }
}
