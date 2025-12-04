import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api/qa";

export const getUserQAs = async (userId) => {
  const res = await axios.get(`${API_BASE}/user/${userId}`);
  return res.data;
};

export const createQA = async (payload) => {
  const res = await axios.post(`${API_BASE}`, payload);
  return res.data;
};

export const updateQA = async (id, payload) => {
  const res = await axios.put(`${API_BASE}/${id}`, payload);
  return res.data;
};

export const deleteQA = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};

export const getQAById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};
