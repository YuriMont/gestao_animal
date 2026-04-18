import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type AuthUser = {
	id: string;
	email: string;
	name: string;
	role: string;
	organizationId: string;
};

export const tokenAtom = atomWithStorage<string | null>("token", null);
export const userAtom = atomWithStorage<AuthUser | null>("user", null);

export const isAuthenticatedAtom = atom(
	(get) => !!get(tokenAtom) && !!get(userAtom),
);

export const loginAtom = atom(
	null,
	(_get, set, { token, user }: { token: string; user: AuthUser }) => {
		set(tokenAtom, token);
		set(userAtom, user);
	},
);

export const logoutAtom = atom(null, (_get, set) => {
	set(tokenAtom, null);
	set(userAtom, null);
	window.location.href = "/login";
});
