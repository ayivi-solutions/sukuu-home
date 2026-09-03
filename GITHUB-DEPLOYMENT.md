# GitHub deployment guide

## 1. Safe cutover sequence

1. Upload this package to a private GitHub repository and push to `main`.
2. Enable GitHub Pages with **GitHub Actions** as the deployment source.
3. Allow the included workflow to complete and review the temporary `github.io` URL.
4. In repository **Settings → Pages**, enter `sukuux.com` as the custom domain.
5. Add or confirm the DNS records shown by GitHub. Do not remove the existing production records until the GitHub preview is approved.
6. When GitHub confirms the domain, enable **Enforce HTTPS**.
7. Test the root page, mobile navigation, module filters, telephone link, email link and WhatsApp demonstration form.
8. Submit the sitemap in Google Search Console and Bing Webmaster Tools.

## 2. Git commands

```bash
git init
git branch -M main
git add .
git commit -m "Launch comprehensive Sukuu ERP website"
git remote add origin https://github.com/ORG/REPOSITORY.git
git push -u origin main
```

Replace `ORG/REPOSITORY` with the approved repository. Do not put access tokens in the remote URL or any tracked file.

## 3. Domain notes

- `CNAME` is already set to `sukuux.com`.
- The canonical URL, social metadata, sitemap and robots file use `https://sukuux.com/`.
- If the final domain changes, update those values together before deployment.
- Keep `www.sukuux.com` redirected permanently to `https://sukuux.com/`, or reverse the canonical strategy consistently.

## 4. Rollback

GitHub Pages deploys from commits. If a release must be reversed, redeploy a previously approved commit through the Actions tab. Keep the current hosting configuration available until the new release has passed stakeholder and search checks.

## 5. Demonstration form

The form deliberately uses a client-side WhatsApp handoff. It does not store personal data or require server credentials. If a CRM or email service is added later, complete privacy, consent, spam-protection and data-retention review before changing the form action.
