'use client';

import { useState } from 'react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import Button from '@/components/ui/Button';
import { deserializeFromString } from '@/lib/editor';
import { SAMPLE_USERS } from '@/lib/constants';

export default function Home() {
  const [editorValue, setEditorValue] = useState<string>('');

  const handleSave = () => {
    console.log('Editor content:', editorValue);
    alert('Content saved! Check console for details.');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Rich Text Editor with Mentions
          </h1>
          <p className="text-lg text-gray-600">
            Type @ to mention someone. Supports bold, italic, lists, and more!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-3 mb-6">
          <RichTextEditor
            value={deserializeFromString(editorValue, SAMPLE_USERS)}
            onChange={(value: string) => setEditorValue(value)}
            placeholder="Start typing your message here..."
          />
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={handleSave}
            className="px-6 py-3 rounded-lg cursor-pointer bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Save content to console
          </Button>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 overflow-hidden">
          {/* Enhanced Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">✨</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Features Included
              </h2>
              <p className="text-base text-gray-500 font-medium">Everything you need for professional editing</p>
            </div>
          </div>
          
          {/* Enhanced Grid - Responsive: 1 col mobile, 2 tablet, 3 desktop, 4 large */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">💬</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">@Mention System</div>
                <div className="text-sm text-gray-600 mt-1">Like Slack/Discord</div>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">✨</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Rich Formatting</div>
                <div className="text-sm text-gray-600 mt-1">Bold, italic, underline</div>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">📝</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Block Elements</div>
                <div className="text-sm text-gray-600 mt-1">Headings and lists</div>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">⌨️</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Keyboard Navigation</div>
                <div className="text-sm text-gray-600 mt-1">Arrow keys support</div>
              </div>
            </div>
            
            {/* Card 5 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">👤</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">User Avatars</div>
                <div className="text-sm text-gray-600 mt-1">In mention popup</div>
              </div>
            </div>
            
            {/* Card 6 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">🔍</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Real-time Search</div>
                <div className="text-sm text-gray-600 mt-1">Filter as you type</div>
              </div>
            </div>
            
            {/* Card 7 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">🔒</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">TypeScript</div>
                <div className="text-sm text-gray-600 mt-1">Full type safety</div>
              </div>
            </div>
            
            {/* Card 8 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">🎨</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Tailwind CSS</div>
                <div className="text-sm text-gray-600 mt-1">Modern styling</div>
              </div>
            </div>
            
            {/* Card 9 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">🛠️</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Custom Toolbar</div>
                <div className="text-sm text-gray-600 mt-1">Quick formatting</div>
              </div>
            </div>
            
            {/* Card 10 */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">📱</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Responsive Design</div>
                <div className="text-sm text-gray-600 mt-1">Mobile-friendly</div>
              </div>
            </div>

            {/* New Card 11: Emoji Picker */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">😊</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Emoji Picker</div>
                <div className="text-sm text-gray-600 mt-1">200+ emojis to insert</div>
              </div>
            </div>

            {/* New Card 12: Spoiler Text */}
            <div className="group relative p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">👻</div>
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Spoiler Text</div>
                <div className="text-sm text-gray-600 mt-1">Hide/reveal on hover</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}