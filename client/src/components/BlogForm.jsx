/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuImage } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";
import { createPost, editPost } from "../api";
import { Container } from "./index";
import RichEditor from "./Editor";

function BlogForm({ blogData }) {
  const isEdit = blogData ? true : false;

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Extract blog info from nested structure if needed
  const blogInfo = blogData?.blogSummaryResponse || blogData || {};

  const [title, setTitle] = useState(blogInfo?.title || "");
  const [content, setContent] = useState(blogInfo?.content || "");
  const [featureImage, setFeatureImage] = useState();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };
    
    switch (name) {
      case 'title':
        if (!value || !value.trim()) {
          errors.title = 'Title is required';
        } else {
          delete errors.title;
        }
        break;
      case 'content':
        if (!value || !value.trim()) {
          errors.content = 'Content is required';
        } else {
          delete errors.content;
        }
        break;
      case 'featureImage':
        if (!isEdit && !value) {
          errors.featureImage = 'Feature image is required';
        } else {
          delete errors.featureImage;
        }
        break;
    }
    
    setFieldErrors(errors);
    return !errors[name]; // Return true if this specific field has no errors
  };

  const validateAllFields = () => {
    let errors = {};
    
    // Validate title
    if (!title || !title.trim()) {
      errors.title = 'Title is required';
    }
    
    // Validate content
    if (!content || !content.trim()) {
      errors.content = 'Content is required';
    }
    
    // Validate feature image (only for new posts)
    if (!isEdit && !featureImage) {
      errors.featureImage = 'Feature image is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update form fields when blogData changes (for edit mode)
  useEffect(() => {
    if (blogData && isEdit) {
      // The blog data might be nested in blogSummaryResponse
      const blogInfo = blogData.blogSummaryResponse || blogData;
      
      setTitle(blogInfo.title || "");
      setContent(blogInfo.content || "");
    }
  }, [blogData, isEdit]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFeatureImage(e.target.files[0]);
      validateField('featureImage', e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validate all fields on submit
    const isFormValid = validateAllFields();
    
    if (!isFormValid) {
      return;
    }
    
    if (isEdit) {
      const editPostToast = toast.loading("Updating blog post...");
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (featureImage) {
        formData.append("featureImage", featureImage);
      }

      try {
        const response = await editPost({
          blogId: blogInfo?.blogId || blogInfo?._id || blogData?._id,
          data: formData,
        });

        toast.success("Blog post Updated successfully.", {
          id: editPostToast,
        });
        navigate(`/blog/${blogInfo?.blogId || blogInfo?._id || blogData?._id}`);
      } catch (error) {
        console.log("🚀 ~ edit post submit ~ error:", error);

        const errorMessage = error.response?.data?.message || error.response?.data || "Failed to update post";
        toast.error(errorMessage, {
          id: editPostToast,
        });
      } finally {
        setLoading(false);
      }
    } else {
      const postingToast = toast.loading("Uploading blog post...");
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", uuidv4());
      formData.append("content", content);
      formData.append("featureImage", featureImage);

      try {
        const response = await createPost(formData);

        toast.success(response.message || "Blog post Uploaded successfully.", {
          id: postingToast,
        });
        navigate(`/blog/${response.data.blogId}`);
      } catch (error) {
        console.log("🚀 ~ create post submit ~ error:", error);
        
        const errorMessage = error.response?.data?.message || error.response?.data || "Failed to create post";
        toast.error(errorMessage, {
          id: postingToast,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="my-10">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold transition-colors duration-300 text-gray-900">
            {isEdit ? "Edit Blog Post" : "Create a New Blog Post"}
          </h1>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Title Section */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="title"
                className="text-base font-medium capitalize transition-colors duration-300 text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                placeholder="Enter your blog post title"
                className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  fieldErrors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''
                }`}
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  validateField('title', e.target.value);
                }}
                onBlur={() => validateField('title', title)}
                required
              />
              {fieldErrors.title && (
                <p className="text-sm text-red-400 mt-1">{fieldErrors.title}</p>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="content"
                className="text-base font-medium capitalize transition-colors duration-300 text-gray-700"
              >
                Content
              </label>
              <div className={`w-full rounded-xl border border-gray-300/60 bg-white/90 shadow-inner shadow-gray-300/30 ${
                fieldErrors.content ? 'border-red-500' : ''
              }`}>
                <RichEditor 
                  value={content} 
                  setValue={(value) => {
                    setContent(value);
                    validateField('content', value);
                  }} 
                />
              </div>
              {fieldErrors.content && (
                <p className="text-sm text-red-400 mt-1">{fieldErrors.content}</p>
              )}
            </div>

            {/* Feature Image Section */}
            <div>
              <label
                htmlFor="featureImage"
                className="text-base font-medium capitalize transition-colors duration-300 text-gray-700"
              >
                Feature Image
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  className={`flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:bg-gray-50 md:text-base ${
                    fieldErrors.featureImage ? 'border-red-500' : ''
                  }`}
                >
                  <LuImage className="mr-2 h-4 w-4" />
                  {featureImage ? "Change Image" : "Upload Image"}
                </button>

                {featureImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFeatureImage(null);
                      validateField('featureImage', null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:bg-gray-50 md:text-base"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <input
                id="featureImage"
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              {fieldErrors.featureImage && (
                <p className="text-sm text-red-400 mt-1">{fieldErrors.featureImage}</p>
              )}

              {/* Selected Image Preview */}
              {featureImage && (
                <div className="mt-4 rounded-xl border border-gray-300/60 bg-white/90 px-5 py-3">
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file:{" "}
                    <span className="text-gray-800">{featureImage.name}</span>
                  </p>
                  <img
                    className="mx-auto aspect-video h-96 w-5/6 rounded-lg object-cover ring-1 ring-gray-300/60"
                    src={URL.createObjectURL(featureImage)}
                    alt="Selected image"
                  />
                </div>
              )}

              {/* Current Image (Edit Mode) */}
              {blogInfo && !featureImage && blogInfo.featureImage && (
                <div className="mt-4 rounded-xl border border-gray-300/60 bg-white/90 px-5 py-3">
                  <p className="text-sm text-gray-600 mb-2">Current Image</p>
                  <img
                    className="mx-auto aspect-video h-96 w-5/6 rounded-lg object-cover ring-1 ring-gray-300/60"
                    src={blogInfo.featureImage}
                    alt="Current blog image"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block size-6 animate-spin rounded-full border-4 border-transparent border-t-white"></span>
              ) : isEdit ? (
                "Update Post"
              ) : (
                "Publish Post"
              )}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default BlogForm;
