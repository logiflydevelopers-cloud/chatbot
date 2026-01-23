import { useParams, useNavigate } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer/Footer";
import { blogs } from "./blogData";
import "../Blog/BlogPage.css";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return <h2 style={{ padding: "50px" }}>Blog not found</h2>;
  }

  return (
    <>
      <HomeHeader />

      <section className="blog-detail">
        <div className="container blog-content">

          {/* 🔙 MOBILE BACK BUTTON */}
          <button
            className="blog-back-btn"
            onClick={() => navigate("/blog")}
          >
            ← Back
          </button>

          <h1>{blog.title}</h1>

          <p className="blog-info">
            By {blog.author} / {blog.date}
          </p>

          {blog.content.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
