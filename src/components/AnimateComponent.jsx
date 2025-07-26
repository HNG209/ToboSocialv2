import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimateComponent({ trigger, onComplete, children }) {
  const childRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

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
  }, []); // Chỉ set 1 lần là đủ, không nên dùng [children]

  useEffect(() => {
    if (trigger && childRef.current) {
      childRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [trigger]);

  return (
    <motion.div
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
