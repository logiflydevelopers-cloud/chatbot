import { Link } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer/Footer";
import { blogs } from "./blogData";
import "../Blog/BlogPage";

export default function BlogPage() {
  return (
    <>
      <HomeHeader />

      <section className="blog-list">
        <div className="container">
          <h2>Chatbot Marketing</h2>

          <div className="blog-grid">
            {blogs.map((blog) => (
              <Link
                to={`/blog/${blog.slug}`}
                key={blog.slug}
                className="blog-card"
              >
                <img src={blog.image} alt={blog.title} />
                <span>{blog.category}</span>
                <h3>{blog.title}</h3>
                <p>
                  by {blog.author} • {blog.date}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
