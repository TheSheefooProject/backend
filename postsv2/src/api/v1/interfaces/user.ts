export type Gender = 'Male' | 'Female' | 'Other';
export interface User {
    firstName: string;
    lastName: string;
    person_id: number;
    email: string;
    password: string;
    gender: Gender;
}
