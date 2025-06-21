
-- Add missing custom_code column to tournaments table if it doesn't exist
ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS custom_code text;

-- Ensure all required columns exist in tournaments table
ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS map text;
ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS duration text;

-- Update wallet_transactions table to ensure proper structure
ALTER TABLE public.wallet_transactions 
ADD COLUMN IF NOT EXISTS screenshot text,
ADD COLUMN IF NOT EXISTS upi_id text,
ADD COLUMN IF NOT EXISTS transaction_id text;

-- Enable RLS on all required tables
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for tournaments
DROP POLICY IF EXISTS "Public can view tournaments" ON public.tournaments;
CREATE POLICY "Public can view tournaments"
  ON public.tournaments
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can create tournaments"
  ON public.tournaments
  FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update tournaments"
  ON public.tournaments
  FOR UPDATE
  USING (public.is_admin_user());

CREATE POLICY "Admins can delete tournaments"
  ON public.tournaments
  FOR DELETE
  USING (public.is_admin_user());

-- Update wallet policies to allow admin access
CREATE POLICY "Admins can view all wallets"
  ON public.wallets
  FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admins can update all wallets"
  ON public.wallets
  FOR UPDATE
  USING (public.is_admin_user());

-- Update wallet transaction policies for admin access
CREATE POLICY "Admins can view all wallet transactions"
  ON public.wallet_transactions
  FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admins can update all wallet transactions"
  ON public.wallet_transactions
  FOR UPDATE
  USING (public.is_admin_user());

-- Update tournament participants policies
CREATE POLICY "Public can view tournament participants"
  ON public.tournament_participants
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tournament participants"
  ON public.tournament_participants
  FOR ALL
  USING (public.is_admin_user());

-- Update notifications policies
CREATE POLICY "Admins can view all notifications"
  ON public.notifications
  FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admins can manage all notifications"
  ON public.notifications
  FOR ALL
  USING (public.is_admin_user());
