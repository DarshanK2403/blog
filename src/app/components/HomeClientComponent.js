// app/(main)/HomeContent.jsx
"use client";

import { ArrowRight, Bell } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "@/redux/homeSlice";

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

export default function HomeContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { latestJobs, latestResults, jobUpdates, loading } = useSelector(
    (state) => state.home
  );

  useEffect(() => {
    if (
      latestJobs.length === 0 &&
      latestResults.length === 0 &&
      jobUpdates.length === 0
    ) {
      dispatch(fetchHomeData());
    }
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  if (loading) {
    return (
      <div className="max-h-screen max-w-4xl mx-auto gap-4 bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonSection />
        <SkeletonSection />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Section
          title="Latest Recruitment"
          items={latestJobs}
          onClick={(slug) => router.push(`/posts/${slug}`)}
          getDate={(item) => item?.extraFields?.lastDate}
          getTitle={(item) => item?.title}
          getOrg={(item) => item?.organization?.name}
          renderRight={(item) => (
            <span className={`text-sm text-red-600 font-medium`}>
              (<span className="text-nowrap">Last Date: </span>{" "}
              <span className="text-nowrap">
                {item?.extraFields?.["last-date"] || "No Date"}
              </span>)
            </span>
          )}
        />

        <Section
          title="Result Updates"
          items={latestResults}
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
          <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-base sm:text-xl font-bold text-gray-900">
              Job Notifications
            </h2>
            <Link
              href="#"
              className="text-sm sm:text-base text-blue-600 hover:underline flex items-center"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4 w-full">
            {jobUpdates.map((update) => (
              <button
                key={update._id}
                onClick={() => router.push(`/posts/${update.slug}`)}
                className="w-full text-left"
              >
                <div className="border-l-4 rounded-md border-blue-600 bg-white p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="line-clamp-2">{update.title}</span>
                      </h3>
                      {update.extraFields?.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                          {update.extraFields.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span
                          className={`px-2 py-1 rounded-full font-medium ${getUpdateTypeColor(
                            update.extraFields?.subject
                          )}`}
                        >
                          {update.extraFields?.subject || "-"}
                        </span>
                        <span className="text-gray-500">
                          {formatDate(update.createdAt)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="text-blue-600 hover:text-blue-700 w-5 h-5 hidden sm:block" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({ title, items, onClick, getTitle, getOrg, renderRight }) {
  return (
    <section className="mb-5 mt-5">
      <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-2">
        <h2 className="text-base sm:text-xl font-bold text-gray-900">{title}</h2>
        <Link
          href="#"
          className="text-sm sm:text-base text-blue-600 hover:underline flex items-center"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm md:text-base">
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-300"
                onClick={() => onClick(item.slug)}
              >
                <td className="px-2 py-2 w-full">
                  <div className="hidden sm:flex flex-row justify-between items-center gap-2">
                    <div className="flex gap-1">
                      <span className="font-medium font-sans text-gray-900 hover:text-blue-600 truncate">
                        {getTitle(item)}
                      </span>
                      <span className="text-blue-600 font-medium truncate max-w-[14rem]">
                        {/* {getOrg(item)} */}
                      </span>
                    </div>
                    <div className="text-sm text-right whitespace-nowrap">
                      {renderRight(item)}
                    </div>
                  </div>
                  <div className="flex sm:hidden flex-col gap-0.5">
                    <span className="font-medium text-gray-900 hover:text-blue-600 truncate">
                      {getTitle(item)}
                    </span>
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span className="text-blue-600 font-medium truncate">
                        {getOrg(item)}
                      </span>
                      <span className="text-gray-500 whitespace-nowrap">
                        {renderRight(item)}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}