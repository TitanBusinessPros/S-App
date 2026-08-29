import { initializeApp } from "firebase-admin/app";

initializeApp();

export { healthCheck } from "./health";
export { createUserProfile } from "./auth";
export { getWaterFeatures } from "./water";
