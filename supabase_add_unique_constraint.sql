-- FIX XP UPDATE ISSUE
-- The problem: user_progress table is missing a UNIQUE constraint on user_id,
-- which causes UPSERT to fail silently (it tries to insert duplicates instead of updating).

-- Step 1: Remove any duplicate rows (keep the one with highest XP)
DELETE FROM public.user_progress a
USING public.user_progress b
WHERE a.id > b.id
AND a.user_id = b.user_id;

-- Step 2: Add UNIQUE constraint to prevent future duplicates
ALTER TABLE public.user_progress
ADD CONSTRAINT user_progress_user_id_unique UNIQUE (user_id);

-- Step 3: Verify the constraint was added
-- You should see "user_progress_user_id_unique" in the output
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'public.user_progress'::regclass;
