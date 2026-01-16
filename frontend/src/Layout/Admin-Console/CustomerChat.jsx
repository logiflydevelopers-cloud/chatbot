import { useParams } from "react-router-dom";

const CustomerChat = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Chat with Customer</h2>
      <p>Customer ID: {id}</p>

      <div className="chat-box">
        <div className="chat-msg bot">Hello 👋 How can I help?</div>
        <div className="chat-msg user">I need support</div>
      </div>
    </div>
  );
};

export default CustomerChat;
