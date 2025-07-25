"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Mail, CircleDot } from "lucide-react";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback", {
          method: "GET",
          credentials: "same-origin",
        });
        const { data } = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error("Failed to fetch feedbacks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleSelect = async (item) => {
    setSelected(item);

    if (!item.read) {
      try {
        const res = await fetch(`/api/feedback/${item._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });

        if (!res.ok) throw new Error("Failed to update");

        const { data: updatedItem } = await res.json();

        // Update selected + feedback list
        setSelected(updatedItem); // reflect updated item in detail view
        setFeedbacks((prev) =>
          prev.map((fb) => (fb._id === item._id ? { ...fb, read: true } : fb))
        );
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6 border-b pb-4 border-gray-300">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Feedback Center
        </h1>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-6">
        <div className="border border-gray-300 bg-white max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-gray-500 p-4">Loading...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-gray-500 p-4">No feedback found.</p>
          ) : (
            feedbacks.map((item) => {
              const isCurrent = selected?._id === item._id;

              return (
                <div
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className={`px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    isCurrent ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div
                      className={`text-sm ${
                        item.read
                          ? "text-gray-700 font-normal"
                          : "font-semibold text-gray-900"
                      }`}
                    >
                      {item.name}
                    </div>
                    {!item.read && (
                      <CircleDot className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <Mail className="w-4 h-4 mr-1" />
                    {item.email}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border border-gray-300 bg-white min-h-[200px] p-6">
          {selected ? (
            <div className="space-y-4 text-sm text-gray-800">
              <div className="flex gap-2">
                <span className="font-semibold w-20">Name:</span>
                <span>{selected.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-20">Email:</span>
                <span>{selected.email}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-20">Message:</span>
                <span className="whitespace-pre-wrap">{selected.message}</span>
              </div>
              <div className="text-xs text-gray-400 pt-2">
                Submitted:{" "}
                {new Date(selected.createdAt).toLocaleString("en-IN")}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Select a feedback to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
