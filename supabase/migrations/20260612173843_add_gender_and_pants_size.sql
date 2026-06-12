
ALTER TABLE children ADD COLUMN IF NOT EXISTS gender text;

ALTER TABLE size_history ADD COLUMN IF NOT EXISTS shirt_size text;
ALTER TABLE size_history ADD COLUMN IF NOT EXISTS pants_size text;
ALTER TABLE size_history ADD COLUMN IF NOT EXISTS dress_size text;
