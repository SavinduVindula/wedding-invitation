-- Create a new database for the wedding app (Optional)
-- CREATE DATABASE WeddingApp;
-- GO
-- USE WeddingApp;
-- GO

-- Create the Guests table
CREATE TABLE Guests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    attending VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- Optional: Create an Invitations table for personalized invites
CREATE TABLE Invitations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);
GO
