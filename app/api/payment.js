import client from "./client";

const endpoint = "/payment/";

export const getBalance = (userId) => client.get(endpoint+userId);

export const makePayment = (data,userId) => {
  return client.post(endpoint+userId, data);
};

export default {
  makePayment,
  getBalance,
};
