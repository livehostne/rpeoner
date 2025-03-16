import { useState } from 'react';

interface EmbedInfoProps {
    title: string;
    embedUrl: string;
    onClose: () => void;
}

export default function EmbedInfo({ title, embedUrl, onClose }: EmbedInfoProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(embedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="mb-6">
                    <h3 className="text-white mb-2 font-medium">URL do Embed:</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={embedUrl}
                            readOnly
                            className="w-full bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-red-500"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                    Copiar
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-900 p-4 rounded">
                    <h3 className="text-white mb-2 font-medium">Código para Incorporar:</h3>
                    <div className="bg-gray-800 p-4 rounded text-gray-300 font-mono text-sm overflow-x-auto">
                        {`<iframe
    src="${embedUrl}"
    frameborder="0"
    allowfullscreen
    style="width: 100%; height: 100%; min-height: 500px;"
></iframe>`}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-white mb-2 font-medium">Pré-visualização:</h3>
                    <div className="aspect-video w-full bg-black rounded overflow-hidden">
                        <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 