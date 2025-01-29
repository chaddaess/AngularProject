export const CONST = {
  accessToken: "accessToken",
  currentUser: "currentUser",
  username: "username",
  password: "password",
  defaultIngredientImage: 'assets/default-img.png',
  chartOptions: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Height (cm)' },
        min: 140,
        max: 220,
        grid: {
          display: false,
        },
      },
      y: {
        title: { display: true, text: 'Weight (kg)' },
        min: 30,
        max: 150,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: true,
        labels: {
          boxWidth: 20,
          boxHeight: 10,
          padding: 15,
        },
      },
    },
  },
  bmiRanges: [
    { label: 'Underweight', minBMI: 0, maxBMI: 18.5, color: '#FDB462' },
    { label: 'Normal', minBMI: 18.5, maxBMI: 24.9, color: '#B3DE69' },
    { label: 'Overweight', minBMI: 24.9, maxBMI: 29.9, color: '#FFD700' },
    { label: 'Obese', minBMI: 29.9, maxBMI: 100, color: '#FF6347' },
  ],
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textColor: '#000000',
    font: '12px Arial',
    tooltipWidth: 160,
    tooltipHeight: 120,
    offset: 10,
  },
};
export const APP_TITLE = "HealthSphere";
export const UI_TEXTS = {
  APP_TITLE: APP_TITLE,
  SIGN_IN_TITLE: "Sign in to your account",
  SIGN_UP_TITLE: "Sign Up",
  CREATE_ACCOUNT_PROMPT: "Don’t have an account yet?",
  EMAIL_LABEL: "Your Email",
  EMAIL_REQUIRED_ERROR: "Email is required.",
  EMAIL_INVALID_ERROR: "Enter a valid email.",
  PASSWORD_LABEL: "Password",
  PASSWORD_REQUIRED_ERROR: "Password is required.",
  USERNAME_LABEL: "Username",
  USERNAME_REQUIRED_ERROR: "Username is required.",
  NUTRITION: "Nutrition",
  WEIGHT: "Weight",
  ROUTINES: "Routines",
  PREFERENCES: "Preferences",
  LOGIN: "Login",
  LOGOUT: "Logout",
  SUBMIT: "Submit",
  BIRTHDATE: "Birthdate",
  SAVE: "Save",
  PROFILE: "Profile",
  HEIGHT: "Height",
  API_ERROR: "An unexpected error occurred. Please try again later.",
  LOGIN_ERROR: "Invalid credentials. Please try again.",
  USER_SETTINGS_UPDATE_SUCCESS: "User settings updated successfully!",
  INVALID_DATA: "Invalid data provided.",
  UNAUTHORIZED: "Unauthorized. Please log in again.",
  BMI: "BMI",
};
