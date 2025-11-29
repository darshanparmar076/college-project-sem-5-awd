/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export default function CommentCard({ createdAt, content, userName, avtar, commentId }) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  return (
    <div className="flex w-full gap-4 p-3" key={commentId?.timestamp || Date.now()}>
      <div className="flex-shrink-0">
        <img
          src={avtar}
          className="h-10 w-10 rounded-lg object-cover ring-2 ring-gray-300"
          alt="user profile"
        />
      </div>
      <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
        <div className="flex items-center gap-3 text-sm">
          <Link
            to={`/u/${userName}`}
            className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            @{userName}
          </Link>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">{formatDate(createdAt)}</span>
        </div>
        <p className="text-gray-800 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
