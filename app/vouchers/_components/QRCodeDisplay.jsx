"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@heroui/skeleton";
import QRCode from "qrcode";

export const QRCodeDisplay = ({ code, size = 48 }) => {
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [loading, setLoading] = useState(true);

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const generateQR = async () => {
            try {
                const url = await QRCode.toDataURL(code, {
                    width: size,
                    margin: 1,
                    color: {
                        dark: "#1e293b",
                        light: "#ffffff",
                    },
                });
                setQrDataUrl(url);
            } catch (err) {
                console.error("QR generation failed:", err);
            } finally {
                setLoading(false);
            }
        };

        generateQR();
    }, [code, size]);

    if (loading) {
        return (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80">
                <Skeleton className="h-8 w-8 rounded" />
            </div>
        );
    }

    return (
        <img
            src={qrDataUrl}
            alt={`QR Code for ${code}`}
            className="h-12 w-12 rounded-xl border border-slate-200"
        />
    );
};
