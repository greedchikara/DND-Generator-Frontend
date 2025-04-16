"use client";
import DescriptionDisplay from "@/components/ui/DescriptionDisplay";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PhotoUploader from "@/components/ui/PhotoUploader";
import Questionnare from "@/components/ui/Questionnare";
import { IAnswers } from "@/lib/type";
import { useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

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

  const uploadPhotos = async () => {
    const uploads = photos.map(photo => chunkUpload(photo));
    const urls = await Promise.all(uploads);
    return { message: "Successfully uploaded photos!", urls: urls };
  }

  const chunkUpload = async (photo: File) => {
    const chunkSize = 1024 * 1024;
    let offset = 0;
    if (!photo) {
      return;
    }
    const totalChunks = Math.ceil(photo.size / chunkSize);
    let chunkNumber = 0;
    let photoUrl = "";
    // TODO: Create a uuid for image name
    while (offset < photo?.size) {
      const chunk = photo.slice(offset, offset + chunkSize);
      const blob = new Blob([chunk], { type: photo.type });
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("name", photo.name);
      formData.append("chunk_number", String(chunkNumber));
      formData.append("total_chunks", String(totalChunks));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/chunks`, {
        body: formData,
        method: "POST"
      });
      const result = await response.json();
      if (result?.file_url) {
        photoUrl = result?.file_url;
      }
      offset += chunkSize;
      chunkNumber += 1;
    }
    return photoUrl;
  }

  const handleGenerate = async () => {
    try {

      if (photos.length === 0) {
        toast.error("Please select atleast one picture!");
        return;
      }
      const photoUploadResponse = await uploadPhotos();
      toast.success(photoUploadResponse.message);

      if (photoUploadResponse?.urls?.length == 0) {
        toast.error("Please select atleast 1 photo!");
        return;
      }

      // const formData = new FormData();
      // formData.append("photos", photoUrls);
      // formData.append('answers', answers);
      const bodyData = {
        photos: photoUploadResponse?.urls,
        answers: answers
      };
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-description`, {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status < 200 || response.status > 299) {
        setLoading(false);
        toast.error("Something went wrong!");
        return;
      }

      const data = await response.json();

      setDescription(data.description);
      toast.success(data?.message);
      setTimeout(() => {
        descriptionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Something went wrong!");
    }
  }

  return (

    <div className="font-sans max-w-2xl mx-auto bg-white md:border-2 md:rounded-lg md:shadow md:border-gray-200 md:my-8">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
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
