-- ═══════════════════════════════════════════════════════════
--  Qualification Landing Page — Supabase migration
--  Run in Supabase SQL Editor. Safe to re-run (IF NOT EXISTS).
-- ═══════════════════════════════════════════════════════════

-- 1. unique_id + qualification columns on the leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS unique_id         TEXT,
  ADD COLUMN IF NOT EXISTS first_name        TEXT,
  ADD COLUMN IF NOT EXISTS last_name         TEXT,
  ADD COLUMN IF NOT EXISTS loan_purpose      TEXT,
  ADD COLUMN IF NOT EXISTS rent_or_own       TEXT,
  ADD COLUMN IF NOT EXISTS monthly_rent      NUMERIC,
  ADD COLUMN IF NOT EXISTS time_at_residency TEXT,
  ADD COLUMN IF NOT EXISTS annual_income     NUMERIC,
  ADD COLUMN IF NOT EXISTS employment_status TEXT,
  ADD COLUMN IF NOT EXISTS employer_name     TEXT,
  ADD COLUMN IF NOT EXISTS pay_frequency     TEXT,
  ADD COLUMN IF NOT EXISTS time_employed     TEXT,
  ADD COLUMN IF NOT EXISTS address_line1     TEXT,
  ADD COLUMN IF NOT EXISTS address_line2     TEXT,
  ADD COLUMN IF NOT EXISTS city              TEXT,
  ADD COLUMN IF NOT EXISTS zip_code          TEXT,
  ADD COLUMN IF NOT EXISTS qualified_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS qualification_ip  TEXT;

-- unique_id must be unique (also serves as the fast lookup index)
CREATE UNIQUE INDEX IF NOT EXISTS leads_unique_id_key
  ON leads (unique_id) WHERE unique_id IS NOT NULL;

-- 2. ID generator: 5-char base62 with AT LEAST ONE DIGIT
--    (matches middleware.ts UNIQUE_ID_REGEX: ^(?=[a-zA-Z]*\d)[a-zA-Z0-9]{5}$)
CREATE OR REPLACE FUNCTION generate_unique_id()
RETURNS TEXT AS $$
DECLARE
  chars  TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT;
  ok     BOOLEAN := FALSE;
BEGIN
  WHILE NOT ok LOOP
    result := '';
    FOR i IN 1..5 LOOP
      result := result || substr(chars, (floor(random() * 62) + 1)::int, 1);
    END LOOP;
    -- must contain at least one digit AND not collide
    IF result ~ '[0-9]'
       AND NOT EXISTS (SELECT 1 FROM leads WHERE unique_id = result) THEN
      ok := TRUE;
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Auto-assign unique_id on INSERT when not supplied
CREATE OR REPLACE FUNCTION assign_unique_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.unique_id IS NULL THEN
    NEW.unique_id := generate_unique_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assign_unique_id ON leads;
CREATE TRIGGER trg_assign_unique_id
  BEFORE INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION assign_unique_id();

-- 4. Backfill unique_id for existing rows that don't have one
UPDATE leads SET unique_id = generate_unique_id() WHERE unique_id IS NULL;

-- 5. Test row (delete after testing)
-- INSERT INTO leads (full_name, first_name, last_name, phone, email, state,
--                    loan_amount, address_line1, city, zip_code)
-- VALUES ('Grace Hollod', 'Grace', 'Hollod', '8778889999', 'grace@example.com',
--         'AZ', 45000, '3225 Kiersten Ave', 'Kingman', '86401');
-- SELECT unique_id FROM leads WHERE email = 'grace@example.com';
