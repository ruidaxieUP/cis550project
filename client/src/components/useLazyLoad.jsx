import { useEffect, useState, useRef } from 'react';


export const useLazyLoad = () => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); 
          observer.disconnect(); 
        }
      },
      { threshold: 0.1 } 
    );

    const currentRef = imgRef.current; 
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.disconnect(); 
    };
  }, []);

  return { imgRef, isVisible };
};