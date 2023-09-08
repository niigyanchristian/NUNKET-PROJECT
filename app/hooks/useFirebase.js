import { ref, getDownloadURL,uploadBytes, deleteObject} from "firebase/storage";
import { storage } from "../utility/firebaseConfig";
import 'firebase/storage'; 
import useError from "./useError";

export default useFirebase = () => {
  
  const uploadImage = async (imageurl,path) => {
    const data = [];
    await Promise.all(imageurl.map(async (element) => {
      const response = await fetch(element)
      const blobFile = await response.blob()
      const reference = ref(storage, path+"/"+Date.now())
       const result = await uploadBytes(reference, blobFile)
       const image = await getDownloadURL(result.ref)
        data.push(image);
    }));
     return data;
 };
 const updateImage = async(newImageurl,oldImageurl,path) =>{
      // Create a reference to the file to delete
      const image=await uploadImage(newImageurl,path)
      const desertRef = ref(storage, oldImageurl);

      // Delete the file
      deleteObject(desertRef).then(async () => {
        // File deleted successfully
      }).catch(async (error) => {
        useError().send('useFirebase.js',"Error occured in image deletion ->",error.message);
      });
 return image;
 }
 const deleteImage = async(oldImageurls) =>{
    await Promise.all(oldImageurls.map(async (element) => {
      const desertRef = ref(storage, element);

      // Delete the file
      deleteObject(desertRef).then(async () => {
        // File deleted successfully
      }).catch(async (error) => {
        useError().send('useFirebase.js',"Error occured in image deletion ->",error.message);
      });
    }));
 return true;
 }

  return { uploadImage,updateImage,deleteImage };
};
