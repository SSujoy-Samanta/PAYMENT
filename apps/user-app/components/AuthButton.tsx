'use client';
import { useState, useEffect } from "react";
import { PrimaryButton } from "./Buttons/PrimaryButton";
import { useSession, signIn, signOut } from "next-auth/react";

export const AuthButton = () => {
  const { data: session } = useSession(); 
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);

  return (
    <div>
      {isAuthenticated ? (
        <PrimaryButton onClick={() => signOut()}>Log Out</PrimaryButton> // Log Out button
      ) : (
        <PrimaryButton onClick={() => signIn()}>Log In</PrimaryButton> // Log In button
      )}
    </div>
  );
};
