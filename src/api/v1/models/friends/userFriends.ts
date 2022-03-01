// import dbHelpers from '../../helpers/dbHelpers';
// import { getUserInformation } from '../auth/userAuth';

// export const getUserFriends = async (username: String): Promise<any> => {
//     const uid = await dbHelpers.getQuery(`select person_id from users where username=${username}`);
//     const close_friends = await dbHelpers.getQuery(`select app_user_id from close_friends where person_id=${uid}`);
//     const close_friends_data = close_friends.data;
//     let tempor_friends = "";
//     // Maybe loop thru user table after with each one
//     close_friends_data.forEach((temp:String) => {
//         const x = getUserInformation(temp);
//         tempor_friends = tempor_friends +(x);
//     });

//     return tempor_friends;
// };

// export default { getUserFriends };
