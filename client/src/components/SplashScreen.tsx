import { motion } from "framer-motion";

type SplashScreenProps = {
  finishLoading: () => void;
};

const SplashScreen = ({ finishLoading }: SplashScreenProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF9F6]">
      <motion.div
        initial={{ scale: 4.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.6,
          ease: [0.45, 0, 0.55, 1], // luxury cinematic curve
        }}
        className="w-48 md:w-72"
      >
        <img
          src="/Logo.svg"
          alt="Mann Match Your Self"
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </div>
  );
};

export default SplashScreen;
