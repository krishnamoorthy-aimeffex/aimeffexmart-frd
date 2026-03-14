import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, LogOut } from "lucide-react";
import BackBtn from "../components/ui/BackBtn";
import Spinner from "../components/ui/Spinner";
import Header from "../components/dashboad/Header";
import { useUpdateProfileMutation } from "../redux/api/userApi";
import { useGetCartCountQuery } from "../redux/api/cartApi";

function Profile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  // RTK Query mutation
  const [updateProfileMut] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  // ✅ Load user from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const userString = localStorage.getItem("user");
      console.log("User from localStorage:", userString);
      if (userString) {
        try {
          const user = JSON.parse(userString);
          console.log("Parsed user:", user);
          setFormData({
            fullname: user.fullname || user.name || "",
            email: user.email || "",
            phone: user.phone || user.mobile || "",
          });
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      } else {
        console.log("No user data found in localStorage");
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ Save profile to DB
  const handleSave = async () => {
    try {
      const res = await updateProfileMut(formData)
        .unwrap();

      if (res && res.message === "Profile updated successfully") {
        localStorage.setItem("user", JSON.stringify(res.user));
        setIsEditing(false);
        alert("Profile updated successfully");
      } else {
        alert(res?.message || "Error updating profile");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      alert(err?.data?.message || "Error updating profile");
    }
  };

    const { data: cartCountData } = useGetCartCountQuery(undefined, {
      skip: !isLoggedIn,
    });
  
    const cartCount = isLoggedIn
      ? cartCountData?.count || 0
      : JSON.parse(localStorage.getItem("cart") || "[]").length; 

  if (isLoading) return <Spinner />;

  const firstLetter = formData.fullname?.charAt(0).toUpperCase();

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="ml-4 mt-3">
        <BackBtn />
      </div>

      <div className="flex items-start justify-center min-h-screen">
        {/* 🔹 Single Profile Card */}
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          {/* Header with Title and Edit Icon */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Profile Detail</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-purple-100 rounded-full transition"
              >
                <Edit2 className="w-5 h-5 text-purple-600" />
              </button>
            )}
          </div>

          {/* Avatar and Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-4xl font-bold mb-4">
              {firstLetter}
            </div>
            {/* {!isEditing && (
              <h3 className="text-xl font-semibold text-center">{formData.fullname}</h3>
            )} */}
          </div>

          {/* Form or Display */}
          <div className="space-y-5">
            {isEditing ? (
              <>
                <InputField
                  label="Full Name"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                />

                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  disabled
                />

                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                {/* Save and Cancel Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <DisplayField label="Name" value={formData.fullname} />
                <DisplayField label="Email" value={formData.email} />
                <DisplayField label="Phone" value={formData.phone} />

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function InputField({ label, ...props }: { label: string; [key: string]: any }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

function DisplayField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm text-gray-700">{label}</label>
      <p className="text-base text-gray-800 p-3">{value || "—"}</p>
    </div>
  );
}

export default Profile;
