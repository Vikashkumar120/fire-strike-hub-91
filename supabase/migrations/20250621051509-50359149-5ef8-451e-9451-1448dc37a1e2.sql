
-- First, drop all existing problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid() LIMIT 1),
    false
  );
$$;

-- Create security definer function to get current user id safely
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT auth.uid();
$$;

-- Recreate RLS policies using security definer functions
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (id = public.get_current_user_id());

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (id = public.get_current_user_id());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (id = public.get_current_user_id());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin_user());

-- Fix other tables that might have similar issues
-- Drop and recreate tournament policies
DROP POLICY IF EXISTS "Admins can manage tournaments" ON public.tournaments;
CREATE POLICY "Admins can manage tournaments"
  ON public.tournaments
  FOR ALL
  USING (public.is_admin_user());

-- Fix wallet policies (drop existing ones first)
DROP POLICY IF EXISTS "Users can view their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "System can create wallets" ON public.wallets;

CREATE POLICY "Users can view their own wallet"
  ON public.wallets
  FOR SELECT
  USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can update their own wallet"
  ON public.wallets
  FOR UPDATE
  USING (user_id = public.get_current_user_id());

CREATE POLICY "System can create wallets"
  ON public.wallets
  FOR INSERT
  WITH CHECK (true);

-- Fix wallet transactions policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Admins can manage all transactions" ON public.wallet_transactions;

CREATE POLICY "Users can view their own transactions"
  ON public.wallet_transactions
  FOR SELECT
  USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can create their own transactions"
  ON public.wallet_transactions
  FOR INSERT
  WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Admins can manage all transactions"
  ON public.wallet_transactions
  FOR ALL
  USING (public.is_admin_user());

-- Fix tournament participants policies
DROP POLICY IF EXISTS "Users can view their own participation" ON public.tournament_participants;
DROP POLICY IF EXISTS "Users can join tournaments" ON public.tournament_participants;
DROP POLICY IF EXISTS "Admins can manage all participants" ON public.tournament_participants;

CREATE POLICY "Users can view their own participation"
  ON public.tournament_participants
  FOR SELECT
  USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can join tournaments"
  ON public.tournament_participants
  FOR INSERT
  WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "Admins can manage all participants"
  ON public.tournament_participants
  FOR ALL
  USING (public.is_admin_user());

-- Fix notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (user_id = public.get_current_user_id());

CREATE POLICY "Admins can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (public.is_admin_user());
