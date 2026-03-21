import { useState, useEffect } from "react";
import { BASE_URL } from "../config";

interface Reel {
  id: string;
  thumbnail_url: string;
  permalink: string;
}

const InstagramReels = () => {
  const [reels, setReels] = useState<Reel[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/instagram/reels`)
      .then((res) => res.json())
      .then(setReels);
  }, []);

  return (
    <section className="py-24 bg-white">
      <h2 className="text-3xl text-center font-semibold mb-4">
        Follow us on Instagram
      </h2>
      <p className="text-center text-gray-500 mb-12">
        Join our community for daily inspiration
      </p>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 px-6">
        {reels.slice(0, 5).map((reel) => (
          <a
            key={reel.id}
            href={reel.permalink}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl overflow-hidden"
          >
            <img
              src={reel.thumbnail_url}
              className="w-full h-[280px] object-cover"
            />
          </a>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="https://www.instagram.com/mannmatchyourself?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-8 py-4 rounded-lg"
        >
          Visit Instagram
        </a>
      </div>
    </section>
  );
};

export default InstagramReels;
