import User from "@/interface/User";

export interface UserState {
    users: Record<string, User>;
}

export const state: UserState = {
    users: {}
}
