# Facebook sync — setup guide

How to connect the Calatrava PIO Facebook Page to the website's News &
Bulletins page. Do this once; after that the sync runs unattended.

**What this does:** a GitHub Action calls the Facebook Graph API every 6 hours,
copies the PIO Page's posts and photos into the repo, and commits them. The
website reads those files like any other content. Nothing on the public site
talks to Facebook, so no visitor data reaches Meta and there is nothing to
consent to under RA 10173.

---

## Before you start

You need:

- **Admin** on the Calatrava PIO Facebook Page
- A **Meta Business Manager** account that owns the Page
- **Admin** on this GitHub repository

You do **not** need to submit anything for App Review. Reading a Page you
administer with an app you own is covered by Standard Access. (App Review is
only required for Pages belonging to someone else.)

---

## 0. Make sure a Business Portfolio owns the Page

System User tokens only exist inside a Business Portfolio (the thing Meta used
to call Business Manager), and it has to **own** the PIO Page — being an admin
of the Page personally is not enough. Skip this step if the Page is already
in one.

1. Go to <https://business.facebook.com/> and create a portfolio if the
   municipality has none. Name it for the LGU, not for a person.
2. **Business Settings** → **Accounts** → **Pages** → **Add** →
   **Add a Page** (claim it — *not* "Request access", which is for Pages
   owned by someone else).
3. You will need to be a Page admin to confirm the claim.

> A Page can only be owned by one portfolio. If the claim fails saying it is
> already owned, someone else's portfolio has it — find out whose before
> going further, rather than creating a second portfolio.

## 1. Create the Meta app

1. Go to <https://developers.facebook.com/apps/> → **Create App**
2. Use case: **Other** → App type: **Business**
3. Name it something identifiable, e.g. `Calatrava LGU Website Sync`
4. Link it to the Business Manager account that owns the PIO Page

## 2. Create a System User and a permanent token

A normal login token expires and would silently kill the sync. A **System
User** token belongs to the organisation rather than to a person, does not
expire, and survives staff turnover — which is why it is the right choice here.

1. **Business Settings** → **Users** → **System Users** → **Add**
   - Name: `Website Sync`, Role: **Employee**
2. With the system user selected → **Assign Assets** → **Pages** → choose the
   **PIO Page** → grant **Full control** (or at minimum *Content* access)
3. Click **Generate New Token**
   - App: the app from step 1
   - Token expiration: **Never**
   - Permissions: tick **`pages_read_engagement`** and
     **`pages_show_list`**
4. **Copy the token now** — Meta will not show it again.

## 3. Find the Page ID

On the Page: **About** → scroll to **Page ID**. Alternatively open
`https://www.facebook.com/<page-name>/about_profile_transparency`.

## 4. Add the credentials to GitHub

In this repository → **Settings** → **Secrets and variables** → **Actions**:

| Type | Name | Value |
|---|---|---|
| **Secret** (tab: Secrets) | `FB_PAGE_TOKEN` | the token from step 2 |
| **Variable** (tab: Variables) | `FB_PAGE_ID` | the numeric Page ID |

The token goes in **Secrets** so it is encrypted and never printed in logs.
Never commit it to a file — the website is public and served from this repo.

## 5. Run it

**Actions** tab → **Sync Facebook posts** → **Run workflow**.

On success it commits `data/news-fb.json` plus any new photos under
`assets/news/`, and the posts appear on the News page within a minute of
GitHub Pages rebuilding. After this it runs by itself every 6 hours.

---

## Controlling what gets published

By default the sync **skips posts shorter than 80 characters**, which filters
out greetings and photo-only posts while keeping real announcements.

To give the PIO explicit control instead, edit
`.github/workflows/sync-facebook.yml` and uncomment:

```yaml
FB_REQUIRE_HASHTAG: '#Bulletin'
```

Then only posts containing `#Bulletin` are published to the website. This is
worth switching on if the Page mixes formal announcements with casual content.

**Card labels** are chosen automatically from hashtags first (`#Advisory`,
`#Ordinance`, `#Bidding`, `#Health`, `#Event`, `#Announcement`), then from
keywords in the text, falling back to "Update".

## Staff-written news still works

`data/news.json` is written by hand and is never touched by the sync;
`data/news-fb.json` is written only by the bot. The News page merges the two
and sorts by date. If the sync breaks, hand-written bulletins keep rendering.

## Maintenance

- **Graph API version** — pinned to `v25.0` in `scripts/sync_facebook.py`.
  Meta retires versions on a roughly two-year cycle, so this needs bumping
  every year or so. The workflow fails loudly with Meta's own error message
  when the version expires.
- **Scheduled workflows are disabled after 60 days of repo inactivity** — a
  GitHub policy. If posts stop appearing, check the Actions tab first.
- **Photos are copied into the repo on purpose.** Facebook's image URLs are
  signed and expire within weeks, so linking them directly would break the
  photos. Copying also means the site keeps its record if a post is later
  edited or deleted on Facebook.
- **If the token is ever revoked**, the workflow fails with a clear
  `OAuthException` in the log. Repeat step 2 and update the secret.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `OAuthException ... code 190` | Token revoked or expired — regenerate it |
| `(#200) Requires pages_read_engagement` | Permission missing on the system user token |
| `Unsupported get request ... code 100` | Wrong `FB_PAGE_ID`, or the system user has no access to that Page |
| Workflow runs but commits nothing | No posts passed the length/hashtag filter — this is normal |
