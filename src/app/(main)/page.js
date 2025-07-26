
import HomePageServer from "./HomePageServer";

export const metadata = {
  title: "Yuva Gujarat · Youth Empowerment Platform",
  description:
    "Stay updated with the latest government job notifications, results, and youth opportunities in Gujarat. Powered by Yuva Gujarat.",
  openGraph: {
    title: "Yuva Gujarat · Youth Empowerment Platform",
    description:
      "Stay updated with the latest government job notifications, results, and youth opportunities in Gujarat.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/yuva-gujarat.png`,
        width: 500,
        height: 500,
        alt: "Yuva Gujarat Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuva Gujarat · Youth Empowerment Platform",
    description:
      "Get instant updates on government jobs, results, and youth schemes in Gujarat.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/yuva-gujarat.png`],
    creator: "@YuvaGujarat",
  },
};

export default function Home() {
  return <HomePageServer />;
}
