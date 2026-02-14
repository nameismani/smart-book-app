import TickIcon from "@/assets/TickIcon";
import AuthUI from "@/components/AuthUI";
import { createSupabaseServerClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const Home = async () => {
  let user = null;
  let isAuthenticated = false;

  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (authUser && !error) {
      user = authUser;
      isAuthenticated = true;
    }
  } catch (error) {
    console.error("Auth check error:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Marketing Content */}
            <div className="text-center lg:text-left">
              {/* Logo & Badge */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  BookmarkHub
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Never Lose an
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Important Link Again
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Your personal bookmark manager that helps you save, organize,
                and access your favorite websites instantly from anywhere.
              </p>

              {/* Feature List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 justify-center lg:justify-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <TickIcon />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">
                      Smart Organization
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Automatically categorize and tag your bookmarks for easy
                      retrieval
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-center lg:justify-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <TickIcon />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">
                      Lightning Search
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Find any bookmark in seconds with powerful search and
                      filters
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-center lg:justify-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <TickIcon />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">
                      Access Anywhere
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Sync across all your devices - desktop, tablet, and mobile
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                </div>
                <p className="text-sm text-slate-600">
                  Join{" "}
                  <span className="font-semibold text-slate-900">500+</span>{" "}
                  users organizing their web
                </p>
              </div>
            </div>

            {/* Right Side - Auth Component */}
            <div className="flex justify-center lg:justify-end">
              <AuthUI user={user as User} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why BookmarkHub?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Save Everything
              </h3>
              <p className="text-slate-600">
                Articles, videos, recipes, products - save any link with a
                single click and never lose track of important content.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Stay Organized
              </h3>
              <p className="text-slate-600">
                Create collections, add tags, and organize bookmarks your way.
                Perfect for work, research, or personal use.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-slate-600">
                Your bookmarks are encrypted and stored securely. Only you have
                access to your personal library.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-slate-600">
            <p>
              © {new Date().getFullYear()} BookmarkHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
