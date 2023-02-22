## Poap app

Includes api which people can call which checks poap claims and adds a claim to a wallet inside the database.

Supabase has two tables:

poap_codes - table which tracks which poap codes are available, along with the number of uses they have

poap_claims - table which tracks the number of claimed poaps for each wallet address
