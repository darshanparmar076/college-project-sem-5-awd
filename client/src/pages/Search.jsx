import { useEffect, useState } from "react";
import { BlogCard, Container } from "../components";
import { searchPost } from "../api/index.js";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!debouncedSearch) return;

    setLoading(true);
    searchPost(query)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log("🚀 ~ fetch posts ~ error:", error);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  return (
    <div className="mt-8 min-h-screen">
      <Container>
        <div className="flex flex-col space-y-8">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="search"
                className="text-lg font-medium text-gray-800"
              >
                Search Posts
              </label>
              <input
                onChange={(e) => setQuery(e.target.value)}
                type={"text"}
                value={query}
                className="input text-lg"
                placeholder="Search for posts..."
              />
            </div>
          </div>

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
          ) : posts.length > 0 ? (
            <div className="grid h-full gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post._id} className="mb-4">
                  <BlogCard {...post} />
                </div>
              ))}
            </div>
          ) : query && !loading ? (
            <div className="card text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h2>
              <p className="text-gray-600">Try searching with different keywords</p>
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default Search;
