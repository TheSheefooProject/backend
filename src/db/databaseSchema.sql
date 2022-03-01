-- IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'SafeKnightBackend')
-- CREATE DATABASE [SafeKnightBackend]
-- GO


-- Create the database if it does not exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='users')
CREATE TABLE users (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT newid(),
    forename NVARCHAR(33),
    surname NVARCHAR(33),
    username NVARCHAR(25) UNIQUE,
    public_profile BIT DEFAULT 1,
    number NVARCHAR(16),
    email NVARCHAR(255) NOT NULL UNIQUE,
    email_verification BIT DEFAULT 0,
    organizational_email NVARCHAR(255),
    organizational_email_verification BIT DEFAULT 0,
    password NVARCHAR(255) NOT NULL,
    password_forgotten_string NVARCHAR(40),
    profile_pic_seed NVARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender NVARCHAR(16) NOT NULL,
    recent_lat FLOAT,
    recent_lng FLOAT,
    last_update SMALLDATETIME,
    session_id NUMERIC DEFAULT 0,
    session_valid BIT DEFAULT 0,
    PRIMARY KEY (id)
)
GO

-- Create places_types table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='place_types')

CREATE TABLE place_types (
    id INT NOT NULL IDENTITY,
    type NVARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
)
GO

--Create places table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='places')

CREATE TABLE places (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT newid(),
    name NVARCHAR(30) NOT NULL,
    description NVARCHAR(255),
    type INT NOT NULL,
    image_link NVARCHAR(2000) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(type) REFERENCES place_types(id)
)
GO


--Create the night_outs table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='night_outs')

CREATE TABLE night_outs (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT newid(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(user_id) REFERENCES users(id)
)
GO


--Create close friends table with dependancy on person
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='close_friends')

CREATE TABLE close_friends (
    app_user_id uniqueidentifier NOT NULL,
    number NVARCHAR(16) NOT NULL,
    name NVARCHAR(255),
    night_out_id UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (app_user_id, number),
    FOREIGN KEY(app_user_id) REFERENCES users(id),
    FOREIGN KEY(night_out_id) REFERENCES night_outs(id)
)
GO


--Create routes table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='routes')

CREATE TABLE routes (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT newid(),
    night_out_id UNIQUEIDENTIFIER NOT NULL,
    source_place_id UNIQUEIDENTIFIER,
    destination_place_id UNIQUEIDENTIFIER,
    PRIMARY KEY (id),
    FOREIGN KEY(night_out_id) REFERENCES night_outs(id),
    FOREIGN KEY(source_place_id) REFERENCES places(id),
    FOREIGN KEY(destination_place_id) REFERENCES places(id)
)
GO

--Create route_coordinates table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='route_coordinates')

CREATE TABLE route_coordinates (
    id INT NOT NULL IDENTITY,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    route_id UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(route_id) REFERENCES routes(id)
)
GO

