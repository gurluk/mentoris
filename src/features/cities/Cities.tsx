"use client";

import { getCities } from "./cities.query";

export default function Cities() {
  const { data, error, isLoading } = getCities();

  return (
    <div className="bg-card">
      {/* {data?.data?.map((city: any) => {
        return <Button key={city.label}>{city.label}</Button>;
      })}
      <Input /> */}
    </div>
  );
}
