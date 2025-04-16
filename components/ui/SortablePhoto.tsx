import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';
import { XCircleIcon } from '@heroicons/react/24/outline';
import React from 'react'

const SortablePhoto = ({ id, file, removePhoto }: { id: string, file: File, removePhoto: () => void }) => {

    const { attributes, setNodeRef, listeners, transform, transition } = useSortable({ id });
    const style = { transition, transform: CSS.Transform.toString(transform) };

    return (
        <div
            ref={setNodeRef}
            className="relative rounded overflow-hidden border border-gray-200 "
            style={style}
        >
            <div {...attributes}
                {...listeners}
                className="cursor-move touch-none"
            >
                <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${id}`}
                    className="w-full h-28 object-cover"
                />
            </div>
            {/* Delete Icon */}
            <button
                type='button'
                onClick={(e) => {
                    e.preventDefault();
                    removePhoto();
                }}
                className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition-colors"
                aria-label="Remove photo"
            >
                <XCircleIcon className="h-5 w-5 text-red-500" />
            </button>
        </div>
    )
}

export default SortablePhoto;