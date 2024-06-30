import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "~/components/ui/avatar";
import Link from "next/link";
import { GoHome, GoTable } from "react-icons/go";
import { signIn, signOut, useSession } from "next-auth/react";
import { CiMap } from "react-icons/ci";
import { BackgroundGradient } from "./ui/background-gradient";

export const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <LeftNavbar />
      {children}
    </>
  );
};

export const LeftNavbar: React.FC = ({}) => {
  const [currentPathname, setCurrentPathname] = useState("/");
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    setCurrentPathname(router.pathname);
  }, [router.pathname]);

  const handleLoginLogout = () => {
    if (session.status === "authenticated") {
      signOut({ redirect: true });
    } else {
      signIn("discord");
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[5000] -translate-x-1/2 transform md:fixed md:bottom-auto md:left-auto md:right-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:transform">
      <BackgroundGradient className="rounded-full">
        <Card className="flex w-auto flex-row items-center space-x-4 rounded-full p-3 md:flex-col md:space-x-0 md:space-y-4">
          <div
            title={session.status === "authenticated" ? "Logout" : "Login"}
            className={`flex h-8 w-8 items-center justify-center rounded-full cursor-pointer ${session.status==='authenticated' ? 'hover:animate-pulse-red' : 'hover:animate-pulse-green'}`}
            onClick={() => handleLoginLogout()}
          >
            <Avatar>
              <AvatarImage src={session.data?.user.image ?? ""} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div
            className={`flex items-center justify-center rounded-full ${currentPathname === "/map" ? "border-2 border-black rounded-full bg-black" : ""}`}
          >
            <Link
              href="/map"
              className="flex h-8 w-8 items-center justify-center"
            >
              <CiMap
                size={24}
                className={currentPathname === "/map" ? "text-white" : ""}
              />
            </Link>
          </div>
          <div
            className={`flex items-center justify-center rounded-full ${currentPathname === "/leaderboard" ? "border-2 border-black bg-black rounded-full" : "border-gray-300"}`}
          >
            <Link
              href="/leaderboard"
              className="flex h-8 w-8 items-center justify-center"
            >
              <GoTable size={24} />
            </Link>
          </div>
          <div
            className={`flex items-center justify-center rounded-full ${currentPathname === "/" ? "border-2 border-black rounded-full bg-black" : ""}`}
          >
            <Link href="/" className="flex h-8 w-8 items-center justify-center">
              <GoHome
                size={24}
                className={currentPathname === "/" ? "text-white" : ""}
              />
            </Link>
          </div>
        </Card>
      </BackgroundGradient>
    </div>
  );
};
