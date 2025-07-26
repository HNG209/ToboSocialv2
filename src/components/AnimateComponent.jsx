import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimateComponent({ trigger, onComplete, children }) {
  const childRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    if (childRef.current) {
      observer.observe(childRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (trigger && childRef.current) {
      childRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [trigger]);

  // Mỗi lần trigger bật, tăng animationKey => ép remount motion.div
  useEffect(() => {
    if (trigger && isVisible) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [trigger, isVisible]);

  return (
    <motion.div
      key={animationKey}
      ref={childRef}
      animate={trigger && isVisible ? { scale: [1, 1.05, 1] } : false}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={() => {
        onComplete?.();
      }}
    >
      {children}
    </motion.div>
  );
}
