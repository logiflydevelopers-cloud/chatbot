// src/Home.js
import React from "react";
import AddWebsiteForm from "./AddWebsiteForm";
import styles from "./Home.css";
import N8nDataDisplay from "./N8nDataDisplay"; // નવો કમ્પોનન્ટ ઇમ્પોર્ટ કરો

const Home = ({ user }) => {
  return (
    <div className="home-container">
      {/* Only show welcome message if user is not logged in */}
      {!user && <h1 className={styles.title}>Welcome to Your Dashboard</h1>}

      {user ? (
        <>
          {/* <p className={styles.subtitle}>You can add your websites below:</p> */}
          <AddWebsiteForm user={user} />
          {/* અહીં N8nDataDisplay કમ્પોનન્ટ ઉમેરો */}
          <N8nDataDisplay />
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
