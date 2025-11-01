import _env from "@/config/env";
import axios, { AxiosHeaderValue } from "axios";

// Get User
async function getUser(username: string, cookieHeader: AxiosHeaderValue) {
  try {
    if (!username) return null;
    const allowed = "qwertyuiopasdfghjklzxcvbnm1234567890_".split("");
    const result = [...username.toLowerCase()].every((char) => allowed.includes(char));
    if (!result) return null;
    // next
    const response = await axios.get(`${_env.backend_api_origin}/api/user/${username}`, {
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Check Username
async function checkValidUsername(username: string) {
  try {
    if (!username || username.length < 4) return null;
    const validateNames = new Set("qwertyuiopasdfghjklzxcvbnm1234567890_".split(""));
    const result = [...username.toLowerCase()].every((char) => validateNames.has(char));
    if (!result) return null;
    const response = await axios.post(`${_env.backend_api_origin}/api/auth/${username}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { getUser, checkValidUsername };
