ALTER TABLE activities ADD COLUMN IF NOT EXISTS hours_estimate numeric;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS poc_name text;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS poc_phone text;
