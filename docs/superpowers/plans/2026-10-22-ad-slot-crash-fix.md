# Ad slot crash fix

The user approved the independent ad component approach and authorized pushing and deploying after verification.

## Scope

Fix the reproduced `adsbygoogle.push()` exception when ResultPage first returns null while localized cards load. Preserve the existing BlogPostPage.tsx working-tree change. Keep the existing publisher/slot configuration; account-side slot validity is outside this fix.

## Steps

- [x] Establish repository structure and verification rules in AGENTS.md.
- [x] Add `scripts/verify-ads.mjs` and `verify:ads` using existing TypeScript and Node dependencies. Run the first regression against the unfixed ResultPage: no ad submission may happen before an ad container exists.
- [x] Add `src/components/AdSlot.tsx` containing the existing ins element. Use its DOM ref in an effect; deduplicate attempts per DOM node with a WeakSet, including StrictMode replays. Skip containers already processed by AdSense. Poll every 200 ms for at most 10 seconds when the script is unavailable. Catch push errors, report a warning, stop retries, and clean up timers when unmounted.
- [x] Replace ResultPage's ad effect and inline ins with AdSlot, mounted only when the reading UI is rendered.
- [x] Verify immediate/delayed/unavailable scripts, thrown initialization, StrictMode replay, remounting, externally processed slots, and timer cleanup. Run build and SPA verification.
- [x] Browser-check card reveal, repeat draw, all spread types, locale changes, and funny mode. Review the diff and stage only repair files.
- [ ] Commit and push the fix, inspect GitHub Actions and the existing production deployment, then verify the deployed reading flow.

## Acceptance

An ad exception never escapes into React; no submission occurs before the ins is mounted; each DOM container gets at most one submission attempt; polling is bounded and cleaned up; repeated readings still work; build and verification commands pass. Report deployment blockers accurately if the existing host cannot be accessed.

## Verification evidence

The original ResultPage failed three of the seven initial checks: submission before container mount, an uncaught ad exception, and resubmitting a previously processed slot. The repaired implementation passes those cases. An eighth case additionally verifies containment of synchronous initialization errors. Browser checks use the real AdSense script rather than disabling advertising.

All eight lifecycle checks passed. `npm run build` and `npm run verify:spa` passed. Chrome verified all three spreads, repeated draws, Chinese/English result switching, and funny mode with no error/warning console entries. Deployment records show both GitHub Pages and Cloudflare Pages integrations; the production URL is https://ztrcloud.com/.
