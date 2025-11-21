interface MongoError extends Error {
  code?: number;
  message: string;
  errors?: {
    [key: string]: {
      message?: string;
    };
  };
}

// Get unique error field name 
const uniqueMessage = (error: MongoError): string => {
  try {
    const { message } = error;

    const fieldName = message.substring(
      message.lastIndexOf(".$") + 2,
      message.lastIndexOf("_1")
    );

    if (!fieldName) {
      throw new Error("Field not found");
    }

    return (
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      " already exists"
    );
  } catch {
    return "Unique field already exists";
  }
};

// Get the error message from an error object
export const errorHandler = (error: MongoError): string => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = "Something went wrong";
    }
  } else if (error.errors) {
    // Handle validation errors
    for (const errorName in error.errors) {
      const errObj = error.errors[errorName];
      if (errObj?.message) {
        message = errObj.message;
      }
    }
  }

  return message;
};
