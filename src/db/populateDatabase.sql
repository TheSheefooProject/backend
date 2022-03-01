
INSERT INTO users 
(
    forename,
    surname,
    username,
    number,
    email,
    password,
    dob,
    gender,
    profile_pic_seed,
    recent_lat,
    recent_lng,
    last_update)
VALUES (
    'John', 
    'Cena',
    'johncena67',
    '+447123456789',
'ucantcme@gmail.com',
 'testpassword',
 '1999-09-19',
 'MALE',
 'ASKJDKAJSDHKJASHDKJASHDKJASHD',
 '51.476342',
 '0.3245467',
 '2021-07-19 18:30:00') 

INSERT INTO place_types (type)
VALUES
  ('Pub'),
  ('Resturant'),
  ('Shop'),
  ('Park'),
  ('Leisure'),
  ('Gym'),
  ('Club'),
  ('BusStop'),
  ('Other');


INSERT INTO places (name, description, type, image_link, address, lat, lng)
VALUES (
        'KFC',
        'Finger licking chicken',
        (SELECT id FROM place_types WHERE type='Pub'),
        'https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fpingu%2Fimages%2F9%2F97%2FKFCLogo.png%2Frevision%2Flatest%3Fcb%3D20170428071912&imgrefurl=https%3A%2F%2Fpingu.fandom.com%2Fwiki%2FKFC&tbnid=99zbZRLshxy4SM&vet=12ahUKEwiFq5ro28bxAhWNgM4BHSXKCK0QMygHegUIARDXAQ..i&docid=aW4UWI-PoEJT-M&w=1024&h=1024&q=kfc&client=safari&ved=2ahUKEwiFq5ro28bxAhWNgM4BHSXKCK0QMygHegUIARDXAQ',
        '6-8 High St, Grays RM17 6LU',
        '51.4781042',
        '0.3228081'
    )



 
 INSERT INTO night_outs (user_id)
VALUES ( (SELECT id FROM users WHERE email = 'ucantcme@gmail.com' ) )
 

    --John Cena has The Rock and Vin Diesel as close friends 
INSERT INTO close_friends VALUES 
    ((SELECT id FROM users WHERE email = 'ucantcme@gmail.com' ),
    '+447123456790', 'The Rock', (SELECT id FROM night_outs WHERE user_id= (SELECT id FROM users WHERE email = 'ucantcme@gmail.com') ) ),
    ((SELECT id FROM users WHERE email = 'ucantcme@gmail.com' ),
    '+447123456791', 'Vin Diesel', (SELECT id FROM night_outs WHERE user_id= (SELECT id FROM users WHERE email = 'ucantcme@gmail.com') ) )


INSERT INTO routes (night_out_id, destination_place_id)
VALUES ( (SELECT id FROM night_outs WHERE user_id = (SELECT id FROM users WHERE email = 'ucantcme@gmail.com') ),
(SELECT id FROM places WHERE name = 'KFC') )

INSERT INTO route_coordinates (lat, lng, route_id)
VALUES
  (51.448, 0.292, (SELECT id FROM routes WHERE night_out_id=(SELECT id FROM night_outs WHERE user_id= (SELECT id FROM users WHERE email = 'ucantcme@gmail.com') ) ) ),
  (51.458, 0.302, (SELECT id FROM routes WHERE night_out_id=(SELECT id FROM night_outs WHERE user_id= (SELECT id FROM users WHERE email = 'ucantcme@gmail.com') ) )),
  (51.468, 0.312, (SELECT id FROM routes WHERE night_out_id=(SELECT id FROM night_outs WHERE user_id= (SELECT id FROM users WHERE email = 'ucantcme@gmail.com') ) )),
  (51.4781042, 0.3228081, (SELECT id FROM routes WHERE night_out_id=(SELECT id FROM night_outs WHERE user_id= (SELECT id FROM users WHERE email = 'ucantcme@gmail.com') ) ));

GO
