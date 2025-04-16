"use client";
import React, { useRef, useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SortablePhoto from './SortablePhoto';

const PhotoUploader = ({ photos, setPhotos }: { photos: File[], setPhotos: (photos: File[]) => void }) => {

    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (maxFileUploadLimitReached()) {
            alert("You can only upload max 4 photos");
            return;
        }
        const files = Array.from(e.target.files || []).slice(0, 4 - photos.length);
        setPhotos([...photos, ...files]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        if (maxFileUploadLimitReached()) {
            alert("You can only upload max 4 photos");
            return;
        }
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files).slice(0, 4 - photos.length);
            setPhotos([...photos, ...newFiles]);
        }
    };

    const maxFileUploadLimitReached = () => {
        return photos.length === 4;
    }

    const removePhoto = (index: number): void => {
        setPhotos(photos.filter((_: File, i: number) => i !== index));
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldId = Number(active.id);
        const newId = Number(over.id);
        const updatedPhotos = arrayMove<File>(photos, oldId, newId);
        setPhotos(updatedPhotos);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    return (
        <div className="my-6">
            <div
                className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <PhotoIcon className="h-8 w-8 mx-auto text-gray-500" />
                <p className="mt-2 text-sm text-gray-600">Drag and drop up to 4 images, or click to upload.
                    <span className='text-red-500'> Required *</span>
                </p>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleChange}
                />
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <SortableContext items={photos.map((_: File, index: number) => index.toString())} strategy={horizontalListSortingStrategy}>
                        {photos.map((file: File, index: number) => (
                            <SortablePhoto
                                id={index.toString()}
                                file={file}
                                key={index}
                                removePhoto={() => removePhoto(index)}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>
        </div >
    )
}

export default PhotoUploader
