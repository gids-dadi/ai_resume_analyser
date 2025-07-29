import type { Route } from "./+types/home";
import NavBar from "~/components/NavBar";
import {resumes} from "../../constant";
import ResumeCard from "~/components/ResumeCard";
import { useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumescan" },
    { name: "description", content: "Smart AI Resume Analyser for your dream Job!" },
  ];
}

export default function Home() {
    const navigate = useNavigate();
    const { auth } = usePuterStore();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated]);

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center">
          <NavBar/>

        <section className="main-section">
          <div className="page-heading py-10">
            <h1>Smart AI Resume Analyser for your dream Job!</h1>
            <h2>Review your applications and check AI-powered feedback</h2>
          </div>
          {
              resumes.length > 0 && (
                  <div className="resumes-section">
                      {resumes.map((resume) => (
                              <ResumeCard key={resume.id} resume={resume} />
                          ))
                      }
                  </div>
              )
          }
        </section>
      </main>

}
