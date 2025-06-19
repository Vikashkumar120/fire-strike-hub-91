
-- Add coins column to wallets table to support the coin system
ALTER TABLE public.wallets ADD COLUMN coins integer DEFAULT 0;

-- Add coins column to wallet_transactions table to track coin transactions
ALTER TABLE public.wallet_transactions ADD COLUMN coins integer DEFAULT 0;

-- Update existing wallets to have 0 coins if they don't have any
UPDATE public.wallets SET coins = 0 WHERE coins IS NULL;

-- Update existing transactions to have 0 coins if they don't have any
UPDATE public.wallet_transactions SET coins = 0 WHERE coins IS NULL;
