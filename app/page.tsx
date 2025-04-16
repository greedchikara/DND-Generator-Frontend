"use client";
import DescriptionDisplay from "@/components/ui/DescriptionDisplay";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PhotoUploader from "@/components/ui/PhotoUploader";
import Questionnare from "@/components/ui/Questionnare";
import { IAnswers } from "@/lib/type";
import { useRef, useState } from "react";

export default function Home() {

  const [photos, setPhotos] = useState<File[]>([]);
  const [answers, setAnswers] = useState<IAnswers>({
    interest: "",
    personality: "",
    partner_preference: ""
  });
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const descriptionRef = useRef<HTMLDivElement | null>(null)

  const handleGenerate = async () => {

    const formData = new FormData();
    if (photos.length === 0) {
      alert("Please select atleast one picture!");
      return;
    }
    photos.forEach(photo => formData.append('photos', photo));
    formData.append('answers', JSON.stringify(answers));
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-description`, {
      method: "POST",
      body: formData
    });

    if (response.status < 200 || response.status > 299) {
      alert("Something went wrong!");
      setLoading(false);
      return;
    }

    const data = await response.json();

    setDescription(data.description);
    setTimeout(() => {
      descriptionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setLoading(false);
  }

  return (

    <div className="font-sans max-w-2xl mx-auto bg-white md:border-2 md:rounded-lg md:shadow md:border-gray-200 md:my-8">
      {loading && <LoadingOverlay />}
      <div className="border-b-1 border-gray-200 shadow">
        <h1 className="text-lg font-bold p-4 text-center md:text-2xl">Dating Profile Description Generator</h1>
      </div>
      <div className="p-4 pb-18 md:pb-4">
        <PhotoUploader photos={photos} setPhotos={setPhotos} />
        <Questionnare answers={answers} setAnswers={setAnswers} />
        <div ref={descriptionRef}>
          {description && <DescriptionDisplay description={description} setDescription={setDescription} />}
        </div>
      </div>
      <div className="text-center md:border-t-1 md:border-gray-200 md:inset-shadow">
        <button
          disabled={photos.length == 0 || loading}
          onClick={handleGenerate}
          className={`
            fixed bottom-4 left-4 right-4 md:static md:my-6
            mx-auto w-[calc(100%-2rem)] md:w-auto
            bg-blue-600 text-white font-bold
            text-lg md:text-xl px-6 py-3
            rounded-lg shadow-md hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          `}
        >
          {loading ? "Generating...." : "Generate Description"}
        </button>
      </div>
    </div>
  );
}
