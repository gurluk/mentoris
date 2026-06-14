"use client";

import { getCities } from "./cities.query";

// import { getCities } from "./cities.query";

export default function Cities() {
  const { data, error, isLoading } = getCities();
  console.log("🚀 ~ Cities ~ data:", data);

  return <></>;
}
