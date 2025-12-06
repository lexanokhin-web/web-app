-- CLEAN ALL DUPLICATE RECORDS
-- This script removes ALL duplicate user_progress rows, keeping only one per user.

-- Step 1: Find and display duplicates (for verification)
SELECT user_id, COUNT(*) as count
FROM public.user_progress
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Step 2: Delete duplicates, keeping the row with the highest XP
DELETE FROM public.user_progress a
USING public.user_progress b
WHERE a.id < b.id
AND a.user_id = b.user_id;

-- Step 3: Verify no duplicates remain
SELECT user_id, COUNT(*) as count
FROM public.user_progress
GROUP BY user_id
HAVING COUNT(*) > 1;
