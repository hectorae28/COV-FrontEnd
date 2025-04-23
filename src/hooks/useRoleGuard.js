"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRoleGuard(allowedRoles = []) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        console.log(session);
        if (!session) {
            router.replace("/Login");
            return;
        }
        const role = session.user.role;
        // if (!allowedRoles.includes(role)) {
        //     router.replace("/unauthorized");
        // }
    }, [session, status, allowedRoles, router]);
}
