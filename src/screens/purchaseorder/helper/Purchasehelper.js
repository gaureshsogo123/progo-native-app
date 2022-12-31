import axiosInstance from "../../../axiosInstance";

export const fetchProducts = async (
  userId,
  categoryId,
  searchText,
  pageNumber = 1,
  pageSize = 500
) => {
  return axiosInstance
    .post("/product", {
      user_id: userId,
      category_id: categoryId,
      search_text: searchText,
      page_number: pageNumber,
      page_size: pageSize,
    })
    .then((res) => {
      const products = res.data.data;
      return { data: products };
    })
    .catch((err) => {
      return { error: err.message };
    });
};
