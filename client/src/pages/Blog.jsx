/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Container, BlogPost, Loader } from "../components/index";
import { useParams } from "react-router-dom";
import { getPost, getUserProfile } from "../api";

function Blog() {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const { blogId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const postResponse = await getPost(blogId);
        
        // Set the complete response data
        setPost(postResponse.data);
      } catch (error) {
        console.error("Error loading blog post:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div>
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <>
              <BlogPost {...post} setPost={setPost} />
          </>
        )}
      </Container>
    </div>
  );
}

export default Blog;
