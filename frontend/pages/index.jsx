import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyContent, setStoryContent] = useState('');
  const [userInput, setUserInput] = useState('');
  const [charLimit] = useState(500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`);
      setStories(response.data);
    } catch (error) {
      console.error('Fel vid hämtning av berättelser:', error);
    }
  };

  const startNewStory = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`, {
        content: userInput,
      });
      setSelectedStory(response.data);
      setStoryContent(response.data.content);
      setUserInput('');
      fetchStories();
    } catch (error) {
      console.error('Fel vid skapande av berättelse:', error);
    } finally {
      setLoading(false);
    }
  };

  const continueStory = async () => {
    if (!selectedStory) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stories/${selectedStory.id}/continue`,
        { content: userInput }
      );
      setSelectedStory(response.data);
      setStoryContent(response.data.content);
      setUserInput('');
      fetchStories();
    } catch (error) {
      console.error('Fel vid fortsättning av berättelse:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectStory = async (storyId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}`
      );
      setSelectedStory(response.data);
      setStoryContent(response.data.content);
      setUserInput('');
    } catch (error) {
      console.error('Fel vid hämtning av berättelse:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">📖 Story Builder</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Berättelser lista */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Aktiva Berättelser</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => selectStory(story.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedStory?.id === story.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <p className="font-semibold truncate">{story.title}</p>
                  <p className="text-sm opacity-75">
                    {story.turns} turn{story.turns !== 1 ? 's' : ''}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            {selectedStory ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedStory.title}</h2>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-6 min-h-64 max-h-96 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{storyContent}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skriv din fortsättning ({userInput.length}/{charLimit} tecken)
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value.slice(0, charLimit))}
                    placeholder="Fortsätt berättelsen här..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max {charLimit} tecken per tur
                  </p>
                </div>

                <button
                  onClick={continueStory}
                  disabled={!userInput.trim() || loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Sparar...' : 'Fortsätt Berättelsen'}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Starta en ny berättelse</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Börja din berättelse ({userInput.length}/{charLimit} tecken)
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value.slice(0, charLimit))}
                    placeholder="Börja skriva din historia här..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="8"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max {charLimit} tecken för att starta
                  </p>
                </div>

                <button
                  onClick={startNewStory}
                  disabled={!userInput.trim() || loading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Skapar...' : 'Starta Berättelse'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
