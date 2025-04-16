import { questions } from '@/lib/data';
import React from 'react';


const Questionnare = ({ answers, setAnswers }: any) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
    }

    return (
        <div>
            <label className="block mb-2 font-semibold">Tell us bit more about yourself (optional)</label>

            {questions.map((question: any, i: number) => (
                <input
                    type="text" key={i}
                    name={question.name}
                    placeholder={question.label}
                    className="block w-full p-2 mb-2 text-sm border rounded border-gray-300"
                    value={answers[question.name]}
                    onChange={handleChange}
                />
            ))}
        </div>
    )
}

export default Questionnare;