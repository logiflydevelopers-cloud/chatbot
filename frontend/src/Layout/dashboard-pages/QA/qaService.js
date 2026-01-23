import axios from "axios";

const API = "http://localhost:4000/api/qa";

/* CREATE */
export const createQA = async (payload) => {
  const res = await axios.post(API, payload);
  return res.data;
};

/* GET ALL BY USER */
export const getUserQAs = async (userId) => {
  const res = await axios.get(`${API}/all/${userId}`);
  return res.data;
};

/* GET SINGLE */
export const getQAById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data; // 🔥 must include label
};

/* UPDATE */
export const updateQA = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload);
  return res.data;
};

/* DELETE */
export const deleteQA = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
