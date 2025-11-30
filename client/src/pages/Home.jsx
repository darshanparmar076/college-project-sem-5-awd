import { useState } from "react";
import { ArrowRight, Monitor, Search, Globe, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const faqs = [
    {
      question: "How do I create a blog post?",
      answer:
        "Simply log in to your account, click on 'New Post' button, and start writing your content using our user-friendly editor.",
    },
    {
      question: "Is there a free plan available?",
      answer:
        "Yes, we offer a free plan that includes basic blogging features. Premium plans are available for advanced features.",
    },
    {
      question: "Can I customize my blog's appearance?",
      answer:
        "Absolutely! You can customize your blog's theme, colors, and layout through our intuitive customization panel.",
    },
  ];

  const features = [
    {
      icon: Monitor,
      title: "Easy to Use",
      description: "Intuitive interface for seamless blogging experience",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description: "Built-in tools to help your content rank better",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description: "Use your own domain name for your blog",
      image:
        "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?w=800&auto=format&fit=crop&q=60",
    },
  ];

  const heroImages = {
    main: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60",
    floating:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60",
  };

  const stats = [
    {
      number: "10K+",
      label: "Active Users",
      icon: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
    },
    {
      number: "50K+",
      label: "Blog Posts",
      icon: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60",
    },
    {
      number: "99%",
      label: "Satisfaction",
      icon: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&auto=format&fit=crop&q=60",
    },
  ];

  const ctaImage =
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60";

  return (
    <div className="min-h-screen  pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="animate-fadeIn space-y-8 text-left">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
                Share Your Story with the{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  World
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-gray-600">
                Create, publish, and grow your blog with our powerful platform
              </p>
              <button className="group flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                <Link to={"/blogs"} className="text-white">
                  Get Started
                </Link>
                <ArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            <div className="animate-float relative">
              <img
                src={heroImages.main}
                alt="Dashboard Preview"
                className="h-96 w-full rounded-2xl object-cover shadow-2xl ring-1 ring-gray-300"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <h2 className="mb-16 text-center text-4xl font-bold text-gray-900">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="relative mb-6 h-48 overflow-hidden rounded-xl">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute left-4 top-4 rounded-lg bg-white p-2 shadow-md border border-gray-200">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-20 text-white shadow-xl">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <img
                  src={stat.icon}
                  alt={stat.label}
                  className="mx-auto mb-4 h-16 w-16 rounded-xl object-cover ring-2 ring-white/20"
                />
                <div className="mb-2 animate-pulse text-5xl font-bold">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-16 text-center text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="card overflow-hidden">
                  <button
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? null : index)
                    }
                    className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                        activeIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeIndex === index ? "max-h-48" : "max-h-0"
                    }`}
                  >
                    <p className="border-t border-gray-200 p-6 leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-24 text-white shadow-xl">
          <div className="bg-pattern absolute inset-0 opacity-10"></div>
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <div className="animate-float">
              <img
                src={ctaImage}
                alt="CTA Icon"
                className="mx-auto mb-8 h-32 w-32 rounded-2xl object-cover shadow-lg ring-2 ring-white/20"
              />
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white">
              Ready to Start Blogging?
            </h2>
            <p className="mb-12 text-xl opacity-90 text-white">
              Join thousands of content creators who trust our platform
            </p>
            <Link
              to={isLoggedIn ? "/create-post" : "/register"}
              className="group mx-auto flex w-fit items-center space-x-2 rounded-2xl bg-white px-8 py-4 font-semibold text-blue-600 transition-all duration-300 hover:shadow-lg"
            >
              <p>Create Your Blog</p>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
