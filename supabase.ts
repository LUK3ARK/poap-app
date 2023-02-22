import { createClient } from '@supabase/supabase-js'
import * as dotenv from "dotenv"

dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
)


export async function claimPoap(poapCode: string, walletAddress: string) {
    let success = false;
    let retries = 5;
    while (retries > 0) {
        try {
            const { data, error } = await supabase
                .from('poap_codes')
                .select('id, poap_text, number_of_uses, version')
                .eq('poap_text', poapCode)
                .gte('number_of_uses', 0)
                .single();


            if (error) {
                console.error(error);
                throw Error('Failed to read ticket')
                //return { success: false, message: 'Failed to read ticket' };
            }

            if (data.number_of_uses <= 0) {
                throw Error('Sold out')
            }

            const newRemaining = data.number_of_uses - 1;
            const newVersion = data.version + 1;

            const { data: updatedTicket, error: updateError } = await supabase
                .from('poap_codes')
                .update({ number_of_uses: newRemaining, version: newVersion })
                .eq('id', data.id)
                .eq('version', data.version)
                .select('id, poap_text, number_of_uses, version')
                .single();

            if (updateError) {
                console.error(updateError);
                throw Error('Failed to update ticket')
                //return { success: false, message: 'Failed to update ticket' };
            }

            if (updatedTicket == undefined) {
                throw Error('Ticket already sold out')
                //return { success: false, message: 'Ticket already sold out' };
            }


            // check if user record exists
            let userExists = true;
            const userRes = await supabase.from('poap_claims')
                            .select('id, wallet_address, number_of_poaps_claimed')
                            .eq('wallet_address', walletAddress)
                            .single();

            if(userRes.error != null || userRes.data == null)
                userExists = false
                    

            // Now add this claimed poap to the user
            let updateRes = null;
            if(userExists) {
                updateRes = await supabase.from('poap_claims')
                        .update({
                            number_of_poaps_claimed: userRes.data?.number_of_poaps_claimed + 1
                        })
                        .eq('wallet_address', walletAddress)
                        .select('number_of_poaps_claimed, version, id')
                        .single()
            } else {
                updateRes = await supabase.from('poap_claims')
                    .insert({
                        wallet_address: walletAddress,
                        number_of_poaps_claimed: 1
                    })
                    .select('number_of_poaps_claimed, version, id')
                    .single();
            }

            if(updateRes == undefined || updateRes == null) {
                throw Error("Unable to update")
            }



            if(updateRes!.data!.version == newVersion){
                success = true;
                break;
            }

            if(retries <= 0) {
                success = false;
                break;
            }
        } catch(e) {
            retries--;
        } finally {
            if(success)
                break
        }
    }
    return success
}