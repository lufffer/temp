"use client";

import { useEffect, useState } from "react";

const useHash = () => {
  const [hash, setHash] = useState(0);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(Number(location.hash.slice(1) ?? 0));
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return hash;
};

export { useHash };
