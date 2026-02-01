import { useNavigate } from 'react-router-dom';

function BackBtn() {
    const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
    >
      ← Back
    </button>
  );
}
export default BackBtn;