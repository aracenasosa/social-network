'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth.store';
import { postService } from '@/services/post.service';
import { Post } from '@/types/post.types';

export default function FeedPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Protect the route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch feed data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Fetching with limit=1 as requested
        const data = await postService.getFeed(1);
        setPosts(data.items);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load feed');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner while redirecting
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-700">
                Hi, {user?.name || 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Sidebar */}
            <div className="hidden md:block col-span-1">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden relative">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{user?.name || 'User Name'}</h3>
                      <p className="text-sm text-gray-500">@{user?.email?.split('@')[0] || 'username'}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                     <nav className="space-y-1">
                        <a href="#" className="bg-blue-50 text-blue-700 block px-3 py-2 rounded-md text-base font-medium">Home</a>
                        <a href="#" className="text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">Profile</a>
                        <a href="#" className="text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">Settings</a>
                     </nav>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Application */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              
              {/* Create Post Widget */}
              <div className="bg-white shadow rounded-lg p-6">
                 <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                       <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden relative">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                       </div>
                    </div>
                    <div className="min-w-0 flex-1">
                       <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                          <label htmlFor="comment" className="sr-only">What's on your mind?</label>
                          <textarea
                             rows={3}
                             name="comment"
                             id="comment"
                             className="block w-full py-3 px-4 border-0 resize-none focus:ring-0 sm:text-sm"
                             placeholder="What's on your mind?"
                          />
                       </div>
                       <div className="pt-2 flex justify-end">
                          <button
                             type="submit"
                             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                             Post
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Feed Items */}
              {isLoading ? (
                // Loading Skeleton
                [1, 2].map((i) => (
                  <div key={i} className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                         <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                         <div>
                            <div className="bg-gray-200 h-4 w-32 rounded mb-1"></div>
                            <div className="bg-gray-100 h-3 w-24 rounded"></div>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="bg-gray-100 h-4 w-full rounded"></div>
                         <div className="bg-gray-100 h-4 w-5/6 rounded"></div>
                      </div>
                      <div className="mt-4 h-64 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-600 text-center">
                  {error}
                </div>
              ) : posts.length === 0 ? (
                 <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                    No posts found. Be the first to share something!
                 </div>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center space-x-3 mb-4">
                         <div className="relative h-10 w-10 flex-shrink-0">
                           {post.author.avatarUrl ? (
                             <Image 
                               src={post.author.avatarUrl} 
                               alt={post.author.userName}
                               fill
                               className="rounded-full object-cover"
                             />
                           ) : (
                             <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                               {post.author.fullName[0]?.toUpperCase()}
                             </div>
                           )}
                         </div>
                         <div>
                            <div className="text-sm font-medium text-gray-900">{post.author.fullName}</div>
                            <div className="text-sm text-gray-500">
                              @{post.author.userName} • {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                         </div>
                      </div>

                      {/* Post Content */}
                      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.text}</p>

                      {/* Post Media */}
                      {post.media && post.media.length > 0 && (
                        <div className={`grid gap-2 mb-4 ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {post.media.map((media, index) => (
                            <div key={index} className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                              {media.type === 'image' ? (
                                <Image
                                  src={media.url}
                                  alt={`Post attachment ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <video 
                                  src={media.url} 
                                  controls 
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Post Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                        <div className="flex space-x-4">
                          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{post.likesCount} Likes</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{post.repliesCount} Comments</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
