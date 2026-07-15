"use client";

/**
 * Thin React hooks over the data service's subscribe* functions. Each returns
 * { data, loading } and cleans up its subscription on unmount.
 */
import { useEffect, useRef, useState } from "react";
import * as data from "@/lib/data/service";

function useSubscription(subscribeFn, deps = []) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const fnRef = useRef(subscribeFn);
  fnRef.current = subscribeFn;

  useEffect(() => {
    setLoading(true);
    const unsub = fnRef.current((next) => {
      setRows(next);
      setLoading(false);
    });
    return () => unsub && unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data: rows, loading };
}

export const useUsers = () => useSubscription(data.subscribeUsers);
export const useMatchRequests = () => useSubscription(data.subscribeMatchRequests);
export const usePhotoRequests = () => useSubscription(data.subscribePhotoRequests);
export const useChatRooms = () => useSubscription(data.subscribeChatRooms);
export const useMessages = () => useSubscription(data.subscribeMessages);
export const useNotifications = () => useSubscription(data.subscribeNotifications);
export const useReports = () => useSubscription(data.subscribeReports);
export const useCalls = () => useSubscription(data.subscribeCalls);
