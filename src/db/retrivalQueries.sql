--Describe table
--exec sp_columns <tableName>

--Get all data and place names from Routes table
--SELECT routes.id, routes.night_out_id, routes.source_place_id AS "Source Id", s.name AS "Souce Name", routes.destination_place_id AS "Destination Id", d.name AS "Destination Name" FROM routes LEFT JOIN places s ON routes.source_place_id=s.id LEFT JOIN places d ON routes.destination_place_id=d.id 

--Get all data from Route_coordinates table
--SELECT * FROM route_coordinates

--Get all data from Place_types table
--SELECT * FROM place_types

--Get all data from Places table with type name
--SELECT places.id, places.name, places.description, place_types.type, places.image_link, places.address, places.lat, places.lng FROM places LEFT JOIN place_types ON places.type = place_types.id

--Get all data from People table
--SELECT * FROM people

--Get all data from user_gender table
--SELECT * FROM user_gender

--Get all data but password from users table with gender name
--SELECT person_id, username, email, organisation_email, dob, user_gender.gender, recent_lat, recent_lng, last_update FROM users LEFT JOIN user_gender ON users.gender = user_gender.id;

--Get all data from users table
SELECT * FROM users

--Get all data from close_friends table with the names too
--SELECT a.id AS "User Id", a.name AS "User Name", b.id AS "Friend Id", b.name AS "Friend Name" FROM close_friends LEFT JOIN people a ON close_friends.app_user_id = a.id LEFT JOIN people b ON close_friends.person_id=b.id

--User's close friends
--SELECT app_user_id, users.username, name AS 'Friend Number', close_friends.number AS 'Friend Name', night_out_id FROM close_friends LEFT JOIN users on close_friends.app_user_id = (SELECT id FROM users WHERE username = 'johncena67')

--OLD get a user's close friends
--SELECT people.name AS "Friend Name", people.phone_number AS "Phone Number" FROM people INNER JOIN close_friends ON people.id = close_friends.person_id WHERE close_friends.app_user_id=(SELECT id FROM people WHERE name = 'John Cena')

-- Night_outs - all data with username
--SELECT night_outs.id AS "Night Out Id", people.name AS "User Name", people.id AS "User Id" FROM night_outs LEFT JOIN people ON night_outs.user_id=people.id

-- close_friends - all data
--SELECT * FROM close_friends
/*
(INNER) JOIN: Returns records that have matching values in both tables
LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table
RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table
FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table
*/