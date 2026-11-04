# PixelateBanana

Static site (`index.html`, no build step). Forms are preview-only until you wire them to `/api/submit` (optional, see below).

## Run locally (VS Code)
1. Open the folder in VS Code (File > Open Folder).
2. Install the "Live Server" extension, right-click `index.html` > Open with Live Server.
   (Or in a terminal: `npx serve .`)
3. For the Google Sheets endpoint too: `npm i -g vercel`, `npm install`, then `vercel dev`.

## GitHub
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USER/pixelatebanana.git
git push -u origin main
```
Check `git status` first: `.env*` files must NOT be listed.

## Vercel (temporary hosting)
1. vercel.com > Add New > Project > import the GitHub repo.
2. Framework preset: Other. No build command, no output directory. Deploy.
3. You get a free `*.vercel.app` URL. (Or CLI: `vercel`, then `vercel --prod`.)

## Google Sheets (optional)
One Google Sheet with two tabs named `Quotes` and `Chat`, one Google Cloud service account.
1. console.cloud.google.com > new project > enable "Google Sheets API".
2. IAM > Service Accounts > create > Keys > Add key > JSON (download it, keep it out of the project folder).
3. Share the Sheet with the service account's `client_email` as Editor.
4. Local: copy `.env.example` to `.env.local` and fill in values from the JSON file.
5. Vercel: Project > Settings > Environment Variables, add the same 3 names, then redeploy.
6. Row 1 headers (both tabs): Time, Name, Company, Contact, Phone, Service, Budget, Message.
