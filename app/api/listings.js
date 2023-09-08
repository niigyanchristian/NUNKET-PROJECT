import client from "./client";

const endpoint = "/list";
const endpointid = "/list/";

const getListings = () => client.get(endpoint);

export const addListing = (listing, onUploadProgress) => {
  return client.post(endpoint, listing, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};
export const deleteListing = (id) => {
  return client.post(endpointid+id)
};

export default {
  addListing,
  getListings,
  deleteListing
};
