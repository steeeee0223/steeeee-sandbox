import { UserCredential } from "firebase/auth";
import { act } from "react-dom/test-utils";

import { $store, renderHookWithProviders } from "../../test/utils";
import { useAuth } from "./auth";
import { setUser } from "@/stores/auth";

describe(useAuth, () => {
    beforeEach(() => {
        vi.mock("firebase/auth", () => {
            const mockedUser: UserCredential = {
                user: {
                    uid: "user",
                    email: "user@example.com",
                    displayName: "USER",
                },
                providerId: "google.com",
            } as UserCredential;
            const setMockedUser = () =>
                $store.dispatch(setUser(mockedUser.user));

            return {
                getAuth: vi.fn(),
                GithubAuthProvider: class {
                    GITHUB_SIGN_IN_METHOD = "github.com";
                    PROVIDER_ID = "github.com";
                    addScope = vi.fn();
                },
                GoogleAuthProvider: class {
                    GOOGLE_SIGN_IN_METHOD = "google.com";
                    PROVIDER_ID = "google.com";
                    addScope = vi.fn();
                },
                signInWithPopup: vi.fn().mockResolvedValue(mockedUser),
                signOut: vi.fn(),
                onAuthStateChanged: vi.fn(() => setMockedUser),
            };
        });
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
    it("returns initial state", () => {
        const { result } = renderHookWithProviders(useAuth);
        const { isLoggedIn, user } = result.current;
        expect(isLoggedIn).toBeFalsy();
        expect(user).toBeNull();
    });

    it("should sign in with google", async () => {
        const { result } = renderHookWithProviders(useAuth);
        await act(result.current.googleSignIn);
        expect(result.current.isLoggedIn).toBeTruthy();
    });

    it("should sign in with github", async () => {
        const { result } = renderHookWithProviders(useAuth);
        await act(result.current.githubSignIn);
        expect(result.current.isLoggedIn).toBeTruthy();
    });

    it("should sign out successfully", async () => {
        const { result } = renderHookWithProviders(
            useAuth,
            {},
            { preloadedState: { auth: { isLoggedIn: true } } }
        );

        expect(result.current.isLoggedIn).toBeTruthy();
        await act(result.current.signOut);
        expect(result.current.isLoggedIn).toBeFalsy();
    });
});
