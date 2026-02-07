import apiClient from "./auth.api";


// Update user profile
export const updateProfile = async (
  token: string,
  formData: { fullname: string; email: string; phone: string }
) => {
  const res = await apiClient.put(`http://localhost:5000/api/users/update-profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  });

  return res.data;
};

// Get user count
export const getUserCount = async () => {
  const res = await apiClient.get(`http://localhost:5000/api/users/count`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};
