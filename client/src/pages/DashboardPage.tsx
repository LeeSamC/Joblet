import { useState } from "react";

import { useAuthStore } from "../stores/auth.store";

export default function DashboardPage(){

    const user = useAuthStore(state => state.user)


    return(
        <div className="flex items-center justify-center text-2xl">
            <h2>
               Welcome {user?.firstName} 
            </h2>
        </div>
    )
}