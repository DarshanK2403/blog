"use client";

import { ArrowRight, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SkeletonSection = () => (
  <section className="max-w-4xl mx-auto mb-4 animate-pulse">
    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-4 bg-white rounded shadow-sm"
        >
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </section>
);

const SkeletonUpdates = () => (
  <section className="mb-4 animate-pulse">
    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded p-4 shadow">
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-gray-200 rounded mb-2"></div>
          <div className="flex gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default function Home() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState({
    latestJobs: [],
    latestResults: [],
    jobUpdates: [],
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch("/api/home");
        const data = await res.json();
        if (data.success) {
          setHomeData(data.data);
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysLeft = (lastDate) => {
    const today = new Date();
    const deadline = new Date(lastDate);
    const timeDiff = deadline.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getUpdateTypeColor = (type) => {
    const colors = {
      "Deadline Extension": "bg-yellow-100 text-yellow-800",
      "Admit Card": "bg-blue-100 text-blue-800",
      "Interview Schedule": "bg-purple-100 text-purple-800",
      "Syllabus Update": "bg-green-100 text-green-800",
      "Form Correction": "bg-orange-100 text-orange-800",
      "Vacancy Update": "bg-indigo-100 text-indigo-800",
      "Exam Date": "bg-red-100 text-red-800",
      "Document Verification": "bg-teal-100 text-teal-800",
      "Test Guidelines": "bg-gray-100 text-gray-800",
      "Medical Exam": "bg-pink-100 text-pink-800",
      "Cut-off": "bg-cyan-100 text-cyan-800",
      "Interview Call": "bg-purple-100 text-purple-800",
      "Answer Key": "bg-green-100 text-green-800",
      "Skill Test": "bg-blue-100 text-blue-800",
      "Fee Payment": "bg-yellow-100 text-yellow-800",
      "Result Update": "bg-indigo-100 text-indigo-800",
      "New Notification": "bg-emerald-100 text-emerald-800",
      "New Recruitment": "bg-red-100 text-red-800",
      "Specialist Officer": "bg-orange-100 text-orange-800",
      "Defense Recruitment": "bg-slate-100 text-slate-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto gap-4 bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonUpdates />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Section
          title="Latest Jobs"
          items={homeData.latestJobs}
          onClick={(slug) => router.push(`/posts/${slug}`)}
          getDate={(item) => item?.extraFields?.lastDate}
          getTitle={(item) => item?.title}
          getOrg={(item) => item?.organization?.name}
          renderRight={(item) => (
            <>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(item?.extraFields?.lastDate)}
              </span>
              <span
                className={`text-sm ${
                  getDaysLeft(item?.extraFields?.lastDate) <= 7
                    ? "text-red-600 font-semibold"
                    : getDaysLeft(item?.extraFields?.lastDate) <= 15
                    ? "text-yellow-600 font-medium"
                    : "text-green-600"
                }`}
              >
                ({getDaysLeft(item?.extraFields?.lastDate)} days left)
              </span>
            </>
          )}
        />

        <Section
          title="Latest Results"
          items={homeData.latestResults}
          onClick={(slug) => router.push(`/posts/${slug}`)}
          getTitle={(item) => item?.title}
          getOrg={(item) => item?.organization?.name}
          renderRight={(item) => (
            <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
              {item?.extraFields?.resultType}
            </span>
          )}
        />

        <section className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Job Updates</h2>
            <Link
              href="#"
              className="text-blue-600 text-sm hover:underline flex items-center"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {homeData.jobUpdates.map((update) => (
              <div
                key={update._id}
                className="bg-white rounded-md shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      {update?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {update?.extraFields?.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full font-medium ${getUpdateTypeColor(update?.extraFields?.subject)}`}>
                        {update?.extraFields?.subject}
                      </span>
                      <span className="text-gray-500">
                        {formatDate(update?.date)}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="text-blue-600 hover:text-blue-700 w-5 h-5 mt-1 sm:mt-0" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({ title, items, onClick, getTitle, getOrg, renderRight }) {
  return (
    <section className="mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          href="#"
          className="text-blue-600 text-sm hover:underline flex items-center"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm sm:text-base">
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => onClick(item.slug)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <span className="font-medium text-gray-900 hover:text-blue-600">
                      {getTitle(item)}
                    </span>
                    <span className="text-gray-500"> - </span>
                    <span className="text-blue-600 font-medium">
                      {getOrg(item)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {renderRight(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
