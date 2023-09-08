import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import listingsApi from "../api/listings";
import UploadScreen from "./UploadScreen";
import useAuth from "../auth/useAuth";
import useFirebase from "../hooks/useFirebase";
import useError from "../hooks/useError";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(1000000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

const categories = [
  {
    backgroundColor: "#fd9644",
    icon: "car",
    label: "Customize",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "airplane",
    label: "Foreign",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "seat-legroom-normal",
    label: "Local",
    value: 4,
  },
];

function ListingEditScreen() {
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const {user}= useAuth();


  const handleSubmit = async (listing, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    useFirebase().uploadImage(listing.images,'images')
  .then(async data => {
    let  Info={
      ownerId:user._id,
      title:listing.title,
      images:data,
      price:listing.price,
      categoryId:listing.category.label,
      description:listing.description
    };
    const result = await listingsApi.addListing({...Info},(progress) => setProgress(progress)
    );
    
    if (!result.ok) {
      setUploadVisible(false);
      return alert(result.problem);
    }
  })
  .catch(error => {
    useError().send('ListingDetailsScreen.js',error.message);
  });
    
  
    resetForm();
    
    

  };

  return (
    <Screen style={styles.container}>
      <ScrollView>

      
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <Form
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <FormField maxLength={255} name="title" placeholder="Title" />
        <FormField
          keyboardType="numeric"
          maxLength={10}
          name="price"
          placeholder="Price"
          width={120}
        />
        <Picker
          items={categories}
          name="category"
          numberOfColumns={2}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton title="Post" />
      </Form>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default ListingEditScreen;
