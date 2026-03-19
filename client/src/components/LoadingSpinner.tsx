import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF9F6]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut"
        }}
        className="relative"
      >
        {/* Logo */}
        <img
          src="/Logo.svg"
          alt="Mann Match Your Self"
          className="w-24 h-24 md:w-32 md:h-32 object-contain"
        />
        
        {/* Spinning ring around logo */}
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-[#C5A059] border-r-[#C5A059] rounded-full"
          style={{
            width: '120px',
            height: '120px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity
          }}
        />
        
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#C5A059]/20"
          style={{
            width: '140px',
            height: '140px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
