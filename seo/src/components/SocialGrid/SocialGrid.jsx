import { useState } from "react";
import "./SocialGrid.css";

export default function SocialGrid() {
  const posts = [
    {
      id: 1,
      handle: "@brightline.run",
      likes: "2.4k",
      img: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=750&fit=crop",
      aspect: "portrait",
    },
    {
      id: 2,
      handle: "@lumen.skin",
      likes: "3.2k",
      img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop",
      aspect: "square",
    },
    {
      id: 3,
      handle: "@verde.studio",
      likes: "1.7k",
      img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&h=700&fit=crop",
      aspect: "portrait",
    },
    {
      id: 4,
      handle: "@northside.dental",
      likes: "2.9k",
      img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=750&fit=crop",
      aspect: "portrait",
    },
    {
      id: 5,
      handle: "@haven.realty",
      likes: "2,814",
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=700&fit=crop",
      aspect: "portrait",
    },
    {
      id: 6,
      handle: "@parcel.co",
      likes: "1.4k",
      img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
      aspect: "square",
    },
    {
      id: 7,
      handle: "@tallow",
      likes: "3,890",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop",
      aspect: "square",
    },
    {
      id: 8,
      handle: "@kettlebrook",
      likes: "4.1k",
      img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
      aspect: "square",
    },
    {
      id: 9,
      handle: "@fitloop",
      likes: "5.2k",
      img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=750&fit=crop",
      aspect: "portrait",
    },
    {
      id: 10,
      handle: "@lumen.skin",
      likes: "4.5k",
      img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop",
      aspect: "square",
    },
  ];

  return (
    <section className="social-section" id="social-content">
      <div className="social-container">
        {/* Header */}
        <div className="social-header">
          <div className="social-header__left">
            <div className="social-pill">
              <span className="social-pill__dot" />
              <span className="social-pill__text">(06) Content</span>
            </div>
            <h2 className="social-title">Content that stops the scroll.</h2>
          </div>

          <div className="social-header__right">
            <p className="social-desc">
              We plan, shoot, edit and post for our clients every week. Reels,
              carousels and stories made for how each platform actually works.
            </p>
            <div className="social-stats-bar">
              <span>1M+ VIEWS LAST MONTH</span>
              <span>•</span>
              <span>38K SAVES</span>
              <span>•</span>
              <span>91.4% REACH</span>
            </div>
          </div>
        </div>

        {/* Masonry / Grid Gallery */}
        <div className="social-grid">
          {posts.map((post) => (
            <div key={post.id} className="social-card">
              <img src={post.img} alt={post.handle} className="social-card__img" />
              <div className="social-card__overlay">
                <span className="social-card__handle">{post.handle}</span>
                <span className="social-card__likes">♡ {post.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
