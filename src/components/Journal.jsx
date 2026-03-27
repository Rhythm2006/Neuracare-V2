import React, { useState, useEffect } from 'react';
import { Send, BookOpen, Loader2, Trash2 } from 'lucide-react';

const Journal = () => {
    const [journals, setJournals] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJournals();
    }, []);

    const fetchJournals = async () => {
        try {
            const response = await fetch('/api/journals');
            if (!response.ok) {
                throw new Error('Failed to fetch journals');
            }
            const data = await response.json();
            setJournals(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/journals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                throw new Error('Failed to create journal');
            }

            const newJournal = await response.json();
            setJournals([newJournal, ...journals]);
            setTitle('');
            setContent('');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this journal entry?')) return;

        try {
            const response = await fetch(`/api/journals/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete journal');
            }

            setJournals(journals.filter((journal) => journal._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in text-white">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-neon-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    Your Mind Sanctuary
                </h2>
                <p className="text-gray-400 text-lg">
                    Unload your thoughts, reflect on your day, and track your mental journey.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Write Journal Section */}
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                        <span className="p-1.5 bg-white/10 rounded-lg">
                            <BookOpen className="w-5 h-5" />
                        </span>
                        New Entry
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give your thought a name..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all min-h-[200px] resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Save Entry
                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {error && (
                            <p className="text-red-400 text-sm mt-2 bg-red-400/10 p-2 rounded text-center">
                                {error}
                            </p>
                        )}
                    </form>
                </div>

                {/* Journal List Section */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-xl font-semibold mb-6 text-white sticky top-0 bg-transparent z-10">
                        Recent Entries
                    </h3>

                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-white/20" />
                        </div>
                    ) : journals.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No entries yet. Start writing today!</p>
                        </div>
                    ) : (
                        journals.map((journal) => (
                            <div
                                key={journal._id}
                                className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl p-5 transition-all duration-300 cursor-default relative"
                            >
                                <button
                                    onClick={() => handleDelete(journal._id)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-white/5 rounded-lg"
                                    title="Delete Entry"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="flex justify-between items-start mb-2 pr-8">
                                    <h4 className="font-semibold text-lg text-white group-hover:text-neon-white transition-colors">
                                        {journal.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                        {new Date(journal.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                                    {journal.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Journal;
