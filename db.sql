CREATE DATABASE regreeen;
USE regreeen;

CREATE TABLE native_species (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  land_type VARCHAR(100),
  rainfall_min INT,
  rainfall_max INT,
  temperature_min FLOAT,
  temperature_max FLOAT,
  description TEXT
);

CREATE TABLE land_parcels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  land_type VARCHAR(100),
  rainfall INT,
  temperature FLOAT,
  slope FLOAT,
  soil_ph FLOAT
);

-- Example native trees
INSERT INTO native_species (name, land_type, rainfall_min, rainfall_max, temperature_min, temperature_max, description)
VALUES
('Acacia nilotica', 'grassland', 300, 1200, 18, 34, 'Good for dry zones, nitrogen fixer.'),
('Melia volkensii', 'dryland', 200, 600, 20, 36, 'Fast-growing dryland tree.'),
('Croton megalocarpus', 'forest', 800, 1800, 15, 28, 'Common in high rainfall zones.');

-- Example parcels
INSERT INTO land_parcels (name, land_type, rainfall, temperature, slope, soil_ph)
VALUES
('Parcel A', 'grassland', 400, 22, 5, 6.5),
('Parcel B', 'dryland', 300, 30, 8, 6.8);
