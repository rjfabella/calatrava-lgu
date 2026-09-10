#!/usr/bin/env python3
"""
Sync public posts from the Calatrava PIO Facebook Page into data/news-fb.json.

Runs in GitHub Actions (see .github/workflows/sync-facebook.yml), never in the
browser — the Page token must never reach client-side code. The website itself
stays static: it just reads the JSON this script commits.

Why images are downloaded instead of hotlinked: Facebook's CDN URLs
(scontent.*, full_picture) are signed and expire after a short window, so
linking them directly means photos silently break within weeks. Copying them
into assets/news/ also means the site keeps working when a post is edited or
deleted on Facebook — which matters, because this is a public record.

Environment:
  FB_PAGE_TOKEN        (required) Page or System User access token
  FB_PAGE_ID           (required) numeric Page id, or the page's username
  FB_MIN_MESSAGE_CHARS (optional) skip posts shorter than this. Default 80.
  FB_REQUIRE_HASHTAG   (optional) e.g. "#Bulletin" — if set, only posts
                       containing this hashtag are synced. Use this to give
                       the PIO explicit control over what reaches the website.
  FB_MAX_POSTS         (optional) how many posts to keep. Default 24.
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image

# Pin the API version explicitly. Meta expires versions on a ~2-year cycle, so
# this needs a deliberate bump; an unpinned call would break without warning.
GRAPH_VERSION = "v25.0"
GRAPH = f"https://graph.facebook.com/{GRAPH_VERSION}"

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "data" / "news-fb.json"
IMG_DIR = ROOT / "assets" / "news"
IMG_PREFIX = "fb-"
MAX_IMAGE_PX = 1200

TOKEN = os.environ.get("FB_PAGE_TOKEN", "").strip()
PAGE_ID = os.environ.get("FB_PAGE_ID", "").strip()
MIN_CHARS = int(os.environ.get("FB_MIN_MESSAGE_CHARS", "80"))
REQUIRE_HASHTAG = os.environ.get("FB_REQUIRE_HASHTAG", "").strip().lower()
MAX_POSTS = int(os.environ.get("FB_MAX_POSTS", "24"))

# Hashtags the PIO can use to control the card label, checked in order.
HASHTAG_TAGS = {
    "#advisory": "Advisory",
    "#bulletin": "Bulletin",
    "#ordinance": "Ordinance",
    "#bidding": "Bidding",
    "#bid": "Bidding",
    "#health": "Health",
    "#event": "Event",
    "#announcement": "Announcement",
}

# Fallback when no hashtag is present: first keyword match wins.
KEYWORD_TAGS = [
    (("ordinance", "sangguniang bayan", "resolution"), "Ordinance"),
    (("invitation to bid", "bids and awards", "procurement", "bac "), "Bidding"),
    (("health", "immunization", "medical", "rhu", "dengue", "vaccination"), "Health"),
    (("festival", "fiesta", "parade", "celebration", "anniversary"), "Event"),
    (("advisory", "suspension", "typhoon", "weather", "brownout"), "Advisory"),
]


def fail(msg):
    print(f"::error::{msg}", file=sys.stderr)
    sys.exit(1)


def graph_get(path, **params):
    params["access_token"] = TOKEN
    r = requests.get(f"{GRAPH}/{path}", params=params, timeout=30)
    if r.status_code != 200:
        # Surface Meta's own error text — token expiry and permission problems
        # are the two things that will realistically break this job.
        try:
            err = r.json().get("error", {})
            detail = f"{err.get('type')}: {err.get('message')} (code {err.get('code')})"
        except Exception:
            detail = r.text[:400]
        fail(f"Graph API {path} returned HTTP {r.status_code} — {detail}")
    return r.json()


def clean_text(text):
    text = re.sub(r"\s*#\w+", "", text)          # drop hashtags
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def split_title_summary(message):
    """Facebook posts have no title, so derive one from the opening line."""
    body = clean_text(message)
    if not body:
        return "", ""

    first_line = body.split("\n", 1)[0].strip()
    rest = body.split("\n", 1)[1].strip() if "\n" in body else ""

    # A short opening line is almost always a headline the PIO wrote as one.
    if 0 < len(first_line) <= 110:
        title, summary = first_line, rest
    else:
        parts = re.split(r"(?<=[.!?])\s+", body, maxsplit=1)
        title = parts[0].strip()
        summary = parts[1].strip() if len(parts) > 1 else ""
        if len(title) > 110:
            title = title[:107].rsplit(" ", 1)[0] + "…"

    title = title.strip(" :-–—")
    summary = " ".join(summary.split())
    if len(summary) > 320:
        summary = summary[:317].rsplit(" ", 1)[0] + "…"
    return title, summary


def derive_tag(message):
    low = message.lower()
    for tag_key, label in HASHTAG_TAGS.items():
        if tag_key in low:
            return label
    for keywords, label in KEYWORD_TAGS:
        if any(k in low for k in keywords):
            return label
    return "Update"


def photo_alt_text(post):
    """
    Use the Page's own alt text when it set any. Facebook usually returns
    nothing, in which case the photo is treated as decorative (alt="") — the
    post text sits right beside it and carries the same meaning, which is the
    honest WCAG answer rather than stuffing a caption into alt.
    """
    try:
        attachments = post.get("attachments", {}).get("data", [])
        if not attachments:
            return ""
        target_id = attachments[0].get("target", {}).get("id")
        if not target_id:
            return ""
        data = graph_get(target_id, fields="alt_text_custom")
        return (data.get("alt_text_custom") or "").strip()
    except SystemExit:
        raise
    except Exception:
        return ""


def download_image(url, dest):
    if dest.exists():
        return True
    try:
        r = requests.get(url, timeout=45)
        r.raise_for_status()
        img = Image.open(BytesIO(r.content))
        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")
        if max(img.size) > MAX_IMAGE_PX:
            ratio = MAX_IMAGE_PX / max(img.size)
            img = img.resize((round(img.width * ratio), round(img.height * ratio)), Image.LANCZOS)
        dest.parent.mkdir(parents=True, exist_ok=True)
        img.save(dest, "JPEG", quality=82, optimize=True)
        return True
    except Exception as e:
        print(f"  ! image download failed ({e}) — post kept without a photo")
        return False


def main():
    if not TOKEN:
        fail("FB_PAGE_TOKEN is not set. Add it as a repository secret.")
    if not PAGE_ID:
        fail("FB_PAGE_ID is not set.")

    page = graph_get(PAGE_ID, fields="id,name,link")
    print(f"Page: {page.get('name')} ({page.get('id')})")

    fields = "id,message,created_time,permalink_url,full_picture,attachments{target,media_type}"
    posts = graph_get(f"{PAGE_ID}/posts", fields=fields, limit=50).get("data", [])
    print(f"Fetched {len(posts)} posts")

    items, kept_images = [], set()
    for post in posts:
        if len(items) >= MAX_POSTS:
            break

        message = (post.get("message") or "").strip()
        if not message:
            continue
        if REQUIRE_HASHTAG and REQUIRE_HASHTAG not in message.lower():
            continue
        if not REQUIRE_HASHTAG and len(message) < MIN_CHARS:
            continue

        title, summary = split_title_summary(message)
        if not title:
            continue

        post_id = post["id"].split("_")[-1]
        created = post.get("created_time", "")
        try:
            date = datetime.fromisoformat(created.replace("Z", "+00:00")).strftime("%Y-%m-%d")
        except ValueError:
            date = created[:10]

        image_path, image_alt = "", ""
        if post.get("full_picture"):
            filename = f"{IMG_PREFIX}{post_id}.jpg"
            if download_image(post["full_picture"], IMG_DIR / filename):
                image_path = f"assets/news/{filename}"
                kept_images.add(filename)
                image_alt = photo_alt_text(post)

        items.append({
            "id": f"fb-{post_id}",
            "date": date,
            "tag": derive_tag(message),
            "title": title,
            "summary": summary,
            "image": image_path,
            "imageAlt": image_alt,
            "link": post.get("permalink_url", ""),
            "source": "facebook",
        })
        print(f"  + [{date}] {title[:64]}")

    # Drop images whose posts have rolled off the synced window.
    if IMG_DIR.exists():
        for existing in IMG_DIR.glob(f"{IMG_PREFIX}*.jpg"):
            if existing.name not in kept_images:
                existing.unlink()
                print(f"  - pruned {existing.name}")

    payload = {
        "_comment": "GENERATED FILE — written by scripts/sync_facebook.py. Do not hand-edit; staff-written news belongs in data/news.json.",
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "pageUrl": page.get("link", ""),
        "items": items,
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(items)} items to {OUT_JSON.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
