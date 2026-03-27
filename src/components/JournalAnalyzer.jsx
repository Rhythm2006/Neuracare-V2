import React, { useState } from 'react';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const JournalAnalyzer = () => {
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateInsights = async () => {
        setAnalysis('');
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/analyze-journals', {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate insights');
            }

            const data = await response.json();
            setAnalysis(data.analysis);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in text-white min-h-[60vh] flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-neon-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3">
                    <BrainCircuit className="w-10 h-10" />
                    AI Insights
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Let our AI analyze your recent journal entries to provide personalized insights and supportive suggestions.
                </p>
            </div>

            {!analysis && !loading && !error && (
                <button
                    onClick={generateInsights}
                    className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                    <span className="flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5" />
                        Generate Insights
                    </span>
                </button>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-neon-white mb-4" />
                    <p className="text-gray-400 animate-pulse">Analyzing your thoughts...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-6 rounded-xl max-w-lg text-center backdrop-blur-sm">
                    <p>{error}</p>
                    <button
                        onClick={generateInsights}
                        className="mt-4 text-sm underline hover:text-white transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {analysis && (
                <div className="w-full bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-fade-in-up">
                    <div className="text-left w-full">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-display font-bold text-neon-white mb-6 mt-8 border-b border-white/10 pb-2" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-display font-semibold text-neon-white mb-4 mt-8 flex items-center gap-2" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-display font-medium text-neon-blue mb-3 mt-6" {...props} />,
                                p: ({ node, ...props }) => <p className="text-gray-300 font-sans leading-relaxed mb-4 text-lg" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 ml-4 text-gray-300" {...props} />,
                                li: ({ node, ...props }) => <li className="font-sans" {...props} />,
                                strong: ({ node, ...props }) => <strong className="text-neon-accent font-bold" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-neon-blue/30 pl-4 italic text-gray-400 my-6 bg-white/5 py-2 rounded-r-lg" {...props} />,
                            }}
                        >
                            {analysis}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={generateInsights}
                            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors text-sm flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Regenerate Analysis
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalAnalyzer;
