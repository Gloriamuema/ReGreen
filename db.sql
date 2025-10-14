CREATE DATABASE IF NOT EXISTS regreeen_db;
USE regreeen_db;

CREATE TABLE IF NOT EXISTS land_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location_name VARCHAR(100),
  soil_type VARCHAR(100),
  rainfall VARCHAR(50),
  tree_species VARCHAR(255)
);

INSERT INTO land_data (location_name, soil_type, rainfall, tree_species)
VALUES
("Kakamega Forest", "Loamy", "High", "Prunus Africana, Croton megalocarpus"),
("Tsavo", "Sandy", "Low", "Acacia tortilis, Commiphora africana");
