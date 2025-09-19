import { NextApiRequest, NextApiResponse } from "next";
import { v2 } from "cloudinary";

export default function sign(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(401);
  const timestamp = Math.round(new Date().getTime() / 1000);
  const public_id = "test";
  let params: Record<string, any> = {
    timestamp,
    eager: "c_pad,h_300,w_400|c_crop,h_200,w_260",
  };
  if (req.query.folder) params.folder = req.query.folder;
  const signature = v2.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_SECRET as string
  );
  return res
    .status(200)
    .json({ signature, timestamp, folder: req.query.folder });
}
