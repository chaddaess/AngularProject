export interface User {
  username: string;
  email: string;
  email_verified: boolean;
  date_joined: string;
  gym: string | null;
  age: number | null;
  birthdate: string | null;
  height: number | null;
  gender: string;
  sleep_hours: number;
  work_hours: number;
  work_intensity: string;
  sport_hours: number;
  sport_intensity: string;
  calories: number;
  weight_unit: string;
}

