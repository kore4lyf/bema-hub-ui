import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

export const useAuthCheck = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
};

export const useGuestCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && pathname !== '/signup/verify') {
      router.push("/hub");
    }
  }, [isAuthenticated, router, pathname]);

  return !isAuthenticated || pathname === '/signup/verify';
};