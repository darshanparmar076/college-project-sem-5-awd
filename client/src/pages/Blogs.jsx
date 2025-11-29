import { useEffect, useState } from "react";
import { BlogCard, Container } from "../components";
import { getPosts } from "../api/index.js";

function Blogs() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts()
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log("🚀 ~ fetch posts ~ error:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mt-8 min-h-screen">
        <Container>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="card flex h-full animate-pulse flex-col justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-300"></div>
                  <div className="h-4 w-40 animate-pulse rounded-md bg-gray-300"></div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="h-4 w-full animate-pulse rounded-xl bg-gray-300"></div>
                  <div className="h-4 w-full animate-pulse rounded-xl bg-gray-300"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded-xl bg-gray-300"></div>
                </div>
                <div className="h-48 w-full animate-pulse rounded-xl bg-gray-300"></div>
              </div>
              <div className="card flex h-full animate-pulse flex-col justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-300"></div>
                  <div className="h-4 w-40 animate-pulse rounded-md bg-gray-300"></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-4 w-full animate-pulse rounded-xl bg-gray-300"></div>
                  <div className="h-4 w-full animate-pulse rounded-xl bg-gray-300"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded-xl bg-gray-300"></div>
                </div>
                <div className="h-48 w-full animate-pulse rounded-xl bg-gray-300"></div>
              </div>
              <div className="card flex h-full animate-pulse flex-col justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-300"></div>
                  <div className="h-4 w-40 animate-pulse rounded-md bg-gray-300"></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-4 w-full animate-pulse rounded-xl bg-gray-300"></div>
                  <div className="h-4 w-full animate-pulse rounded-xl bg-gray-300"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded-xl bg-gray-300"></div>
                </div>
                <div className="h-48 w-full animate-pulse rounded-xl bg-gray-300"></div>
              </div>
            </div>
          ) : !posts.length ? (
            <div className="card text-center">
              <h1 className="text-2xl font-bold text-gray-800">No Posts Found</h1>
              <p className="mt-2 text-gray-600">Be the first to create a blog post!</p>
            </div>
          ) : (
            <div className="grid h-full gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post._id} className="mb-4">
                  <BlogCard {...post} />
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

export default Blogs;
