import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () =>([
    { title: "Resumescan | Auth" },
    {name: "description", content: "Login to continue."}
])

const Auth = () => {
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();
    const { isLoading, auth } = usePuterStore();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);

    return (
        <div className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-center flex items-center justify-center">
          <div className="gradient-border shadow-lg">
              <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                  <div className="flex flex-col gap-2 items-center text-center">
                      <h1>Welcome</h1>
                      <h2>Login to continue your job search journey</h2>
                  </div>
                  <div>
                  {
                      isLoading ? (
                          <button className="auth-button animate-pulse">
                              <p>Signing you in...</p>
                          </button>

                      ) : (
                          <>
                              { auth.isAuthenticated ? (
                                  <button className="auth-button" onClick={auth.signOut}>
                                  <p>Log out</p>
                                  </button>
                              ) : (
                                  <button className="auth-button" onClick={auth.signIn}>
                                      <p>Log in</p>
                                  </button>

                              )}
                          </>
                      )
                  }
                  </div>
              </section>
          </div>
        </div>
    );
};

export default Auth;
