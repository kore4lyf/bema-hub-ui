'use client';

import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useSiteDetails } from "@/hooks/useSiteDetails";

const Logo = ({ theme }: { theme: string | undefined}) => {
  const { siteDetails, isLoading, hasLogo, siteName } = useSiteDetails();

  if (isLoading) {
    return <Skeleton className="rounded-md w-10 h-10" />;
  }

  // Use site logo if available, otherwise fallback to default logo
  const logoSrc = siteDetails?.logo ;
  const width = siteDetails?.logo_width;

  return (
    <div>
      { hasLogo ? 
        <img 
            className= { !siteDetails?.themed_logo ? "" : theme === "light" ? "invert-100" : "" }
            draggable="false"
            alt="Bema Hub's Logo"
            loading="eager"
            src={logoSrc}
            width= {width || 1000} 
          /> :
          <p className="text-2xl font-extrabold">{siteName}</p>
        }
    </div>
  );
};

export default Logo;