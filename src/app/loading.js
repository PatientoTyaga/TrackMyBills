'use client'

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
        </div>
    )
}
