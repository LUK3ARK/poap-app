// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { claimPoap, supabase } from '../../supabase';

type Data = {
  success: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {poapCode, walletAddress} = req.query;

  if(poapCode == undefined) {
    res.status(401).json({ success: false });
    return
  }

  // Check poap is valid
  const checkRes = await supabase.from("poap_codes")
              .select('id, poap_text, number_of_uses, version')
              .eq('poap_text', String(poapCode))
              .single();

  // Claim if valid
  let success = false;
  if(checkRes.error == null || checkRes.data != null) {
    success = await claimPoap(String(poapCode), String(walletAddress));
  }





  res.status(200).json({ success: true })
}
