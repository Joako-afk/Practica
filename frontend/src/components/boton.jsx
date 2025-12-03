export default function Button({ text, color = "blue", onClick }) {
  const baseStyle =
    "px-6 py-2 text-white font-semibold rounded-lg transition";
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-black",
    purple: "bg-purple-600 hover:bg-purple-700",
    pink: "bg-pink-500 hover:bg-pink-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${colors[color] || colors.blue}`}
    >
      {text}
    </button>
  );
}
