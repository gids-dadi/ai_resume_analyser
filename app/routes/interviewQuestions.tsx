import React from 'react';
import { useFeedbackStore } from "~/lib/resumeStore";

interface QA {
    question: string;
    answer: string;
}

const QnASection = () => {
    const { feedback } = useFeedbackStore();
    const questions: QA[] = feedback?.likelyInterviewQuestions || [];

    return (
        <section className="w-full px-4 py-12 bg-[url('/images/bg-main.svg')] bg-cover bg-center text-white">
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Most Likely Interview Questions</h2>
                <p className="text-lg text-primary max-w-2xl mx-auto">
                    Prepare for your next opportunity by reviewing likely questions and how to answer them with confidence.
                </p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
                {questions.length > 0 && questions.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:scale-[1.01] transition-transform duration-300"
                    >
                        <div className="flex items-start gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{item.question}</h3>
                        </div>
                        <p className="text-dark-200 leading-relaxed">{item.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default QnASection;
