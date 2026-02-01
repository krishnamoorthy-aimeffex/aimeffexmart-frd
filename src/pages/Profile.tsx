import { useNavigate } from "react-router-dom";
import BackBtn from "../components/ui/BackBtn";

function Profile() {
    const navigate = useNavigate();

    const handleLogout = () => {
    // ✅ Remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // optional

    // ✅ Redirect to login
    navigate("/");
  };

  return (
    <>
      <div className="ml-4 mt-3">
        <BackBtn />
      </div>
      <h1 className="text-3xl font-bold">Profile Page</h1>
      <p className="text-gray-600">Welcome to your profile page!</p>
      <button
        onClick={handleLogout}
        type="button"
        className="w-30 ml-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center cursor-pointer"
      >
        Logout
      </button>
    </>
  );
}

export default Profile;
