import client from "./client";

const register = (userInfo) => client.post("/register", userInfo);

export default { register };
