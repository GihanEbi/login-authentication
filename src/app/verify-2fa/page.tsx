"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await fetch("/api/auth/user/get-user", {
      method: "POST",
      body: JSON.stringify({ userId: id }),
    });
    const data = await res.json();
    if (data) {
      setIs2FAEnabled(data.is2FAEnabled);
    } else {
      setError("Failed to get user data");
    }
  };

  // Step 1: Get QR code
  const handleSetup = async () => {
    const res = await fetch("/api/auth/2fa/setup", {
      method: "POST",
      body: JSON.stringify({ userId: id }),
    });

    const data = await res.json();

    if (data.qrCodeUrl) {
      setQrCode(data.qrCodeUrl);
      fetchUser();
    } else {
      setError("Failed to generate QR code");
    }
  };

  // Step 2: Verify entered OTP
  const handleVerify = async () => {
    const res = await fetch("/api/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ userId: id, token }),
    });

    const data = await res.json();
    if (data.authenticated) {
      setIsVerified(true);
      router.push("/home");
    } else {
      setError(data.error || "Verification failed");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Set Up 2FA</CardTitle>
              <CardDescription>
                Setup 2 factor authentication to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!is2FAEnabled && (
                <Button
                  className="cursor-pointer w-full mt-3"
                  onClick={() => {
                    handleSetup();
                  }}
                >
                  Generate QR Code
                </Button>
              )}
              {qrCode && (
                <>
                  <p>
                    Scan this QR code using Google or Microsoft Authenticator:
                  </p>

                  <img
                    src={qrCode}
                    alt="2FA QR Code"
                    className="mx-auto w-48 h-48"
                  />
                </>
              )}
              {is2FAEnabled && (
                <>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                  <Button
                    className="w-full mt-3"
                    onClick={() => {
                      handleVerify();
                    }}
                  >
                    Verify OTP
                  </Button>

                  {isVerified && (
                    <p className="text-green-600">
                      ✅ 2FA has been successfully enabled!
                    </p>
                  )}
                  {error && <p className="text-red-600">❌ {error}</p>}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Setup2FA;
