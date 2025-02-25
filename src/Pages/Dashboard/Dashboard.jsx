import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Dashboard = () => {
  const user = useSelector((state) => state?.auth?.user?.username);
  const store = useSelector((state) => state)
  console.log(store)
  return (
    <div>
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-clip-text text-transparent bg-gradient-to-r from-info via-secondary to-accent text-5xl font-bold"
      >
        Welcome <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-info text-5xl font-bold">{user}</span>
      </motion.p>
      Dashboard
    </div>
  );
};

export default Dashboard;
