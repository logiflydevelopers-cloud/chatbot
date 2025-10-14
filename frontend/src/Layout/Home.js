import React from "react";
import AddWebsiteForm from "./AddWebsiteForm";
import styles from "./Home.css";

const Home = ({ user }) => {
  return (
    <div className="home-container">
      {/* Only show welcome message if user is not logged in */}
      {!user && <h1 className={styles.title}>Welcome to Your Dashboard</h1>}

      {user ? (
        <>
          {/* <p className={styles.subtitle}>You can add your websites below:</p> */}
          <AddWebsiteForm user={user} />
        </>
      ) : (
        <p className={styles.loginPrompt}>
          Please <strong>login</strong> to add your website.
        </p>
      )}
    </div>
  );
};

export default Home;
