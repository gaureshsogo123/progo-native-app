export const validateMobile = (mobileNumber) => {
  const regex = new RegExp(/^\d{10}$/);
  return regex.test(mobileNumber);
};
