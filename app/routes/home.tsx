import type { Route } from "./+types/home";
import NavBar from "~/components/NavBar";
import ResumeCard from "~/components/ResumeCard";
import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useEffect, useState} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeFit" },
    { name: "description", content: "Smart AI Resume Analyser for how it fit your dream Job!" },
  ];
}

export default function Home() {
    const navigate = useNavigate();
    const { auth, kv } = usePuterStore();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResume, setLoadingResume] = useState(false)
    useEffect(() => {
        const loadResumes = async() => {
            setLoadingResume(true);
            const resumes = (await kv.list('resume:*', true)) as KVItem[];
            const parsedResumes = resumes?.map(resume => JSON.parse(resume.value) as Resume);
            setResumes(parsedResumes);
            setLoadingResume(false);
        }
        loadResumes();
    }, []);

    useEffect(() => {
        if(!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated]);

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center">
          <NavBar/>
        <section className="main-section">
          <div className="page-heading py-10">
            <h1>Smart AI Resume Analyser for your dream Job!</h1>
              {
                  !loadingResume && resumes.length === 0 ? (
                      <>
                      <h2>No Resume has been uploaded. Get started by uploading a resume for feedback</h2>
                          <div className="flex  w-full gap-10 mt-10 items-center justify-center">
                          <img src="/images/resume_03.png" alt="Scanning" className="w-[200px] h-auto" />
                          <img src="/images/resume_02.png" alt="Scanning" className="w-[200px] h-auto" />
                          <img src="/images/resume_01.png" alt="Scanning" className="w-[200px] h-auto" />
                          </div>
                      </>
                  ): (
            <h2>Review your applications and check AI-powered feedback</h2>
                  )
              }
          </div>
            {
                loadingResume && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <img src="/images/resume-scan-2.gif" alt="Scanning" className="w-[200px]" />
                    </div>
                )
            }
          {
             !loadingResume && resumes.length > 0 && (
                  <div className="resumes-section">
                      {resumes.map((resume) => (
                              <ResumeCard key={resume.id} resume={resume} />
                          ))
                      }
                  </div>
              )}
            {
                !loadingResume && resumes?.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 mt-10">
                        <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
                    </div>
                )
            }
        </section>
      </main>

}
