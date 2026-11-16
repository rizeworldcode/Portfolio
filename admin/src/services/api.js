import { API_BASE_URL, BACKEND_URL } from '../config/urls';

// Exported for components requiring direct backend root or API base access
export { API_BASE_URL, BACKEND_URL };

// ============================================================
// 1. GRAPHICS (Brand Artworks, Posters, Packaging)
// ============================================================
export async function getGraphics() {
  const res = await fetch(`${API_BASE_URL}/graphics`);
  if (!res.ok) throw new Error('Failed to fetch graphics');
  return res.json();
}

export async function createGraphic(data) {
  const res = await fetch(`${API_BASE_URL}/graphics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create graphic');
  return res.json();
}

export async function updateGraphic(id, data) {
  const res = await fetch(`${API_BASE_URL}/graphics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update graphic');
  return res.json();
}

export async function deleteGraphic(id) {
  const res = await fetch(`${API_BASE_URL}/graphics/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete graphic');
  return res.json();
}

// ============================================================
// 2. VIDEOS (Cinema Reels, Commercials)
// ============================================================
export async function getVideos() {
  const res = await fetch(`${API_BASE_URL}/videos`);
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export async function createVideo(data) {
  const res = await fetch(`${API_BASE_URL}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create video');
  return res.json();
}

export async function updateVideo(id, data) {
  const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update video');
  return res.json();
}

export async function deleteVideo(id) {
  const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete video');
  return res.json();
}

// ============================================================
// 3. SEO (Client Rankings, GSC Proof, Traffic Growth)
// ============================================================
export async function getSeo() {
  const res = await fetch(`${API_BASE_URL}/seo`);
  if (!res.ok) throw new Error('Failed to fetch SEO cases');
  return res.json();
}

export async function createSeo(data) {
  const res = await fetch(`${API_BASE_URL}/seo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create SEO case');
  return res.json();
}

export async function updateSeo(id, data) {
  const res = await fetch(`${API_BASE_URL}/seo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update SEO case');
  return res.json();
}

export async function deleteSeo(id) {
  const res = await fetch(`${API_BASE_URL}/seo/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete SEO case');
  return res.json();
}

// ============================================================
// 4. FILE UPLOADER (Images, Posters, Proofs)
// ============================================================
export async function uploadAsset(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  if (data.url.startsWith('http')) return data.url;
  return `${BACKEND_URL}${data.url}`;
}

// ============================================================
// 5. SERVER HEALTH & LIVE STATUS
// ============================================================
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return { online: false };
    const data = await res.json();
    if (data.offline === true || data.online === false) {
      return { online: false };
    }
    return { online: true, ...data };
  } catch {
    return { online: false };
  }
}
