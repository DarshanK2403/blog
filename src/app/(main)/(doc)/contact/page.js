// app/contact/page.js
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | Yuva Gujarat",
  description:
    "Get in touch with us for job updates, suggestions, or feedback.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">📞 Contact Us</h1>

      <p className="text-gray-700 mb-4">
        We&#39;re here to help! If you have questions, feedback, or want to
        report an issue, please feel free to reach out.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        📬 General Inquiries
      </h2>
      <p className="text-gray-600 mb-4">
        You can use the form below or email us directly with your questions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        📢 Feedback & Suggestions
      </h2>
      <p className="text-gray-600 mb-4">
        Have an idea for improving Yuva Gujarat? We’d love to hear it! (Note:
        feedback may be used without compensation.)
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        🛠️ Report an Issue
      </h2>
      <p className="text-gray-600 mb-4">
        Found an error or broken link? Please let us know so we can fix it
        quickly.
      </p>

      {/* Contact Form Placeholder */}
      <div className="bg-gray-50 p-6 rounded-md shadow mt-8">
        <ContactForm />
      </div>

      {/* Footer Links */}
      <div className="mt-10 text-sm text-gray-600 space-y-1">
        <div className="mb-6 text-lg font-medium">
          {/* 📧 Email:{" "} */}
          {/* <span className="text-gray-800">support@yuvagujarat.in</span> */}
          <p className="text-sm !text-red-500">(*Email support coming soon)</p>
        </div>
        <p>📍 Location: Gujarat, India</p>
        <p>
          📄 Related:{" "}
          <Link href="/privacy-policy" className="text-blue-600 underline">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link
            href="/terms"
            className="text-blue-600 underline"
          >
            Terms of Conditions
          </Link>
        </p>
      </div>
    </div>
  );
}
