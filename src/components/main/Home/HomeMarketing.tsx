import TickIcon from "@/assets/TickIcon";
import { FEATURES } from "@/constants/marketing.constant";

const HomeMarketing = () => {
  return (
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
        <span className="text-2xl font-bold text-slate-900">BookmarkHub</span>
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
        Your personal bookmark manager that helps you save, organize, and access
        your favorite websites instantly from anywhere.
      </p>

      {/* Feature List */}
      <div className="space-y-4 mb-8">
        {FEATURES.map(({ title, description }, index) => (
          <div
            key={index}
            className="flex items-start gap-3 justify-center lg:justify-start"
          >
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <TickIcon />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="text-slate-600 text-sm">{description}</p>
            </div>
          </div>
        ))}
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
          Join <span className="font-semibold text-slate-900">500+</span> users
          organizing their web
        </p>
      </div>
    </div>
  );
};

export default HomeMarketing;
