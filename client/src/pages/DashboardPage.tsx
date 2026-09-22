import { useState } from "react";

import { useAuthStore } from "../stores/auth.store";

export default function DashboardPage(){

    const user = useAuthStore(state => state.user)


    return(
        <div className="flex items-center justify-center text-2xl">
            {!user ? (
                <div className="w-full px-4 py-4 justify-center">
                    <h2>
                        Hello, User
                    </h2>
                </div>
            ): (
                <div className="w-full justify-center">
                    <h2>
                        Welcome, {user.firstName}
                    </h2>
                </div>
            )}
        </div>
    )
}