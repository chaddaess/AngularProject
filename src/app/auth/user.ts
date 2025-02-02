export interface User {
  username: string;
  email: string;
  email_verified: boolean;
  is_trustworthy: boolean;
  date_joined: string;
  gym: string | null;
  is_temporary: boolean;
  show_comments: boolean;
  show_english_ingredients: boolean;
  workout_reminder_active: boolean;
  workout_reminder: number;
  workout_duration: number;
  last_workout_notification: string | null;
  notification_language: number;
  age: number | null;
  birthdate: string | null;
  height: number;
  gender: string;
  sleep_hours: number;
  work_hours: number;
  work_intensity: string;
  sport_hours: number;
  sport_intensity: string;
  freetime_hours: number;
  freetime_intensity: string;
  calories: number;
  weight_unit: string;
  ro_access: boolean;
  num_days_weight_reminder: number;
}
