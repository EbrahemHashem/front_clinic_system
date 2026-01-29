// lib/constants.ts

export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000/api/",
  ENDPOINTS: {
    LOGIN: "core/login/",
    REGISTER: "core/register/",
    FORGET_PASSWORD: "core/forget_password/",
    VERIFY_CODE: "core/verify_code/",
    RESEND_CODE: "core/resend_code/",
    CLINIC: "clinics/", // add , retrieve , update 
    SUBSCRIPTION: "subscription/owner/" ,// two apis one for add subscription and one for retrieve subscriptions
    ALL_STAFF: "staff/all/",
    STAFF: "staff/",
    ADD_USER: "core/add_user/",
    PATIENTS: "patients/",
    ATTACHMENTS: "patients/attach/",
  }
};