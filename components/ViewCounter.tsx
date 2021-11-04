import { useEffect } from "react";
import useSWR from "swr";

const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};

export default function ViewCounter(id: number) {
  const { data } = useSWR(`/api/views/${id}`, fetcher);
  const views = new Number(data?.total);

  useEffect(() => {
    const registerView = () =>
      fetch(`/api/views/${id}`, {
        method: "POST",
      });

    registerView();
  }, [id]);

  return `${views > 0 ? views.toLocaleString() : "–––"} views`;
}
