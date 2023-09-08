import React from "react";
import { useFormikContext } from "formik";

import Button from "../Button";

function SubmitButton({ title,visible }) {
  const { handleSubmit } = useFormikContext();

  return <Button title={title} visible={visible} onPress={handleSubmit} />;
}

export default SubmitButton;
