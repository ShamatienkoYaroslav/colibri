export const validateField = (field, value, message) => {
  if (!value) {
    return { field, message, state: 'error' };
  }
  return null;
};

export const generateErrors = (fieldsValidation) => {
  const e = {};
  for (let i = 0; i < fieldsValidation.length; i += 1) {
    const fieldValidation = fieldsValidation[i];
    if (fieldValidation) {
      const { field, message, state } = fieldValidation;
      e[field] = { message, state };
    }
  }
  return e;
};

export const getValidationState = (fieldValidation) => {
  if (fieldValidation) {
    return fieldValidation.state;
  }
  return null;
};

export const getValidationMessage = (fieldValidation) => {
  if (fieldValidation) {
    return fieldValidation.message;
  }
  return '';
};

export const generateNextErrorsState = (e, field, fieldValidation) => {
  const genE = generateErrors([fieldValidation]);
  if (Object.keys(genE).length !== 0) {
    e[field] = genE[field];
  } else {
    delete e[field];
  }
  return e;
};
