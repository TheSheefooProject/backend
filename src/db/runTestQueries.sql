
-- delete from users where email='jeesonjohnson100@outlook.com'
-- UPDATE users SET email='jeesonjohnson@outlook.com' WHERE id='209BD6D4-EF25-4067-BDA6-B3A188CCCCFA'
SELECT *
FROM users

-- UPDATE users
-- SET username="JOSH"
-- WHERE id='836C2A3A-D6BC-47B0-810C-BA68B7CE55CF'


-- UPDATE users SET username="JOSH" WHERE id='836C2A3A-D6BC-47B0-810C-BA68B7CE55CF'
GO
-- select * from users
-- select * from users where email="johnny3@surrey.ac.uk" AND password="password123"
-- select id from users where email = 'johnny3@surrey.ac.uk' and password='password123'

-- IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='todelme')
-- BEGIN
-- CREATE TABLE todelme (id INT NOT NULL, PRIMARY KEY (id))
-- GO
-- END
--SELECT id FROM user_gender WHERE user_gender.gender='Male'


--SELECT * FROM users
--INSERT INTO people VALUES (555, 'HabibLawal', '07990757944')
--INSERT INTO users (person_id, username, email, organisation_email, password, salt, dob, gender) VALUES
--(555, 'habiblawal', 'test@email.com', '98765@surrey.ac.uk', 'undefined', 'undefined', '1999-09-19', (SELECT id FROM user_gender WHERE user_gender.gender='Male'))

--DROP TABLE users


-- --Create close friends table with dependancy on person
-- IF NOT EXISTS (SELECT * FROM sys.objects WHERE name='close_friends')
-- BEGIN
-- CREATE TABLE close_friends (
--     app_user_id uniqueidentifier NOT NULL,
--     number NVARCHAR(16) NOT NULL,
--     name NVARCHAR(255),
--     night_out_id INT NOT NULL,
--     PRIMARY KEY (app_user_id, number),
--     FOREIGN KEY(app_user_id) REFERENCES users(id),
--     FOREIGN KEY(night_out_id) REFERENCES night_outs(id)
-- )
-- GO
-- END

-- INSERT INTO close_friends VALUES 
--     ((SELECT id FROM users WHERE email = 'ucantcme@gmail.com' ),
--     '+447123456790', 'The Rock', 1),
--     ((SELECT id FROM users WHERE email = 'ucantcme@gmail.com' ),
--     '+447123456791', 'Vin Diesel', 1)

-- INSERT INTO people
-- VALUES 
-- (111, 'John Cena', '+447123456789'),
-- (112, 'The Rock', '+447123456790'),
-- (113, 'Vin Diesel', '+447123456791');

--  SELECT * FROM close_friends
