import { WHY_CHOOSE_FEATURES } from "@/constants/whychoose.constant";
import React from "react";

const HomeWhyChoose = () => {
  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Why BookmarkHub?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {WHY_CHOOSE_FEATURES.map(
            ({ icon: Icon, bgColor, iconColor, title, description }, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {title}
                </h3>
                <p className="text-slate-600">{description}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeWhyChoose;
