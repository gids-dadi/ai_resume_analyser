import {useState} from 'react'
import NavBar from "~/components/NavBar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constant";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)
    const [statusText, setStatusText] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const handleAnalyse = async ({companyName, jobTitle, jobDescription, file,}:{
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        setIsProcessing(true)
        setStatusText("Uploading the file...")
        const uploadedFile = await fs.upload([file]);

        if(!uploadedFile) return setStatusText("Error: Failed to upload file")
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText("Error: Failed to convert pdf to image")

        setStatusText("Uploading the image...");
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText("Error: Failed to upload image")

        setStatusText("Preparing data for analysis...");
        const uuid = generateUUID()
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: ""

        }

        const feedback = await ai.feedback(
            uploadedFile.path, prepareInstructions({jobTitle, jobDescription, })
        )

        if(!feedback) return setStatusText("Error: Failed to get feedback")

        const feedbackText = typeof feedback.message.content == "string" ? feedback.message.content : feedback.message.content[0].text
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume: ${uuid}`, JSON.stringify(data))
        setStatusText("Analysis complete, redirecting...")
        navigate(`/resume/${uuid}`)
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;
        const file = formData.get("file") as File;

        console.log({ companyName, jobTitle, jobDescription, file });

        if (!file || !(file instanceof File)) {
            console.error("No file selected");
            return;
        }

        handleAnalyse({ companyName, jobTitle, jobDescription, file });
    };


    const handleFileSelect = (file: File | null) => {
        setFile(file)

    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <NavBar />

            <section className="main-section">
                <div className="page-heading py-4">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                        <h2>{statusText}</h2>
                        <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ):(
                        <h2>Drop your resume for an ATS score and improvement</h2>
                        )}
                    {!isProcessing  && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" id="company-name" name="company-name" placeholder="Company Name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" id="job-title" name="job-title" placeholder="job-title" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} id="job-description" name="job-description" placeholder="Job Description" />
                            </div>


                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect}/>
                            </div>

                            <button className="primary-button" type="submit" disabled={isProcessing}>
                                Analyse Resume
                            </button>

                        </form>
                    )

                    }
                </div>
            </section>

        </main>
    )
}
export default Upload
