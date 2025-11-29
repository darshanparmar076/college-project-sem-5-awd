/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function BlogCard({ _id, title, featureImage, blogAuthorResponseDTO, blogId, createdAt }) {
  
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

  // Use blogId for navigation
  const postId = blogId || _id;
  const linkTo = `/blog/${postId}`;

  return (
    <Link to={linkTo} key={blogId || _id}>
      <div className="card group mx-auto h-full max-w-md overflow-hidden bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 md:max-w-lg lg:max-w-xl">
        <img
          src={featureImage}
          alt={title}
          className="aspect-video h-48 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="p-4">
          <div className="mb-3 flex items-center gap-3">
            <img
              src={blogAuthorResponseDTO.avtar}
              alt={blogAuthorResponseDTO.userName}
              className="h-10 w-10 rounded-lg border-2 border-gray-300 object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              {blogAuthorResponseDTO.userName}
            </span>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 md:text-xl">
            {title}
          </h2>

          <p className="mt-2 text-sm text-gray-500">{formatDate(createdAt)}</p>

          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-500">
            Read More 
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
