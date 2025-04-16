"use client";
import { copyToClipboard } from '@/lib/util';
import React, { useState } from 'react'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const DescriptionDisplay = ({ description, setDescription }: any) => {

    const [copied, setCopied] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    const handleCopyToClipboard = async () => {
        copyToClipboard(description)
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className='mt-6 font-sans'>
            <div className='flex items-center px-4 py-2 text-xs justify-between select-none rounded-t-[5px] border-t-1 border-x-1 border-gray-300 align-middle'>
                <p className="font-semibold">Your Generated Description</p>
                <div className='flex justify-between'>

                    {copied && (
                        <span className="text-blue-500 font-semibold">
                            Copied!
                        </span>
                    )}
                    <button
                        onClick={handleCopyToClipboard}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Copy to clipboard"
                    >
                        <ClipboardDocumentCheckIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <textarea
                className="w-full border border-gray-300 rounded p-4 pr-10 resize-none shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                rows={5}
                value={description}
                onChange={handleChange}
            />
        </div >
    )
}

export default DescriptionDisplay