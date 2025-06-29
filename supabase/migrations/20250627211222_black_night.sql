/*
  # Create company data and documents tables

  1. New Tables
    - `company_data`
      - `id` (text, primary key) - Unique identifier for company data records
      - `data` (jsonb) - JSON data containing company information
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record last update timestamp
    
    - `documents`
      - `id` (text, primary key) - Unique identifier for documents
      - `name` (text) - Document name
      - `type` (text) - Document file type
      - `size` (text) - Document file size
      - `url` (text) - Document storage URL
      - `category` (text) - Document category classification
      - `access_level` (text) - Document access permissions
      - `created_at` (timestamptz) - Document upload timestamp
      - `updated_at` (timestamptz) - Document last update timestamp
      - `downloads` (integer) - Download count tracker

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
*/

-- Create company_data table
CREATE TABLE IF NOT EXISTS company_data (
  id text PRIMARY KEY,
  data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  size text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  access_level text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  downloads integer DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE company_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for company_data table
CREATE POLICY "Allow authenticated users to read company data"
  ON company_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert company data"
  ON company_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update company data"
  ON company_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for documents table
CREATE POLICY "Allow authenticated users to read documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (true);