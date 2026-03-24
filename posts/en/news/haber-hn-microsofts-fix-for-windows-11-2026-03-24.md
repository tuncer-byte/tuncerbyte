---
title: "Microsoft's 'fix' for Windows 11"
date: "2026-03-24"
excerpt: "Microsoft spent four years stuffing Windows 11 with ads, forced Copilot integrations, and bloatware, now they want applause for promising to remove it."
tags: ["Gündem", "Hacker News", "Developer"]
category: "Gündem"
---

![Microsoft's 'fix' for Windows 11](https://www.sambent.com/content/images/size/w1200/2026/03/microsoft-plan-fix-windows-11-gaslighting-1.jpg)

> **Kaynak:** Hacker News  &nbsp;·&nbsp;  **Puan:** 837  &nbsp;·&nbsp;  **Yazar:** https://www.facebook.com/TheOfficialSamBent/

**Microsoft spent four years stuffing Windows 11 with ads, forced Copilot integrations, and bloatware, now they want applause for promising to remove it.**

Microsoft just announced a 7-point plan to fix Windows 11 , and the tech press is treating it like a redemption arc. Pavan Davuluri, the Windows president, admitted in January 2026 that "Windows 11 had gone off track" and said Microsoft was entering a mode called "swarming" where engineers would be pulled off new features to fix existing problems.

I saw this headline and my first thought was: it's like being in an abusive relationship. They beat you, then show up with flowers saying they've changed. And everyone around you says "see, they're getting better." But the bruises are still there and the apology only covers the hits people noticed.

I want to walk through what Microsoft actually did to Windows 11 over the past four years, because this "fix" announcement only makes sense when you see the full damage list and realize that the worst offenses aren't even part of the repair plan.

The Copilot invasion started September 26, 2023 , when Microsoft pushed their AI chatbot into Windows 11 ahead of the formal 23H2 release. The icon appeared between your Start menu and system tray, you couldn't move it, you couldn't remove it through normal settings, and it hijacked the Win+C keyboard shortcut. Over the next two years, Copilot buttons metastasized into Snipping Tool, Photos, Notepad, Widgets, File Explorer context menus, Start menu search, and system Settings. Microsoft even planned to force-install the Microsoft 365 Copilot app directly onto Start menus of "eligible PCs." The new plan promises to remove all of that. They want credit for pulling their hand out of your pocket.

On April 24, 2024 , Microsoft shipped update KB5036980, which injected advertisements into the Windows 11 Start menu's "Recommended" section. These showed up labeled "Promoted" and pushed apps like Opera browser and some password manager nobody asked for. And the Start menu was just one surface, they also placed ads on the lock screen, in the Settings homepage hawking Game Pass subscriptions, inside File Explorer pushing OneDrive, and through "tip" notifications that were thinly veiled product pitches. The "fix" promises "fewer ads." Fewer. The operating system you paid $139 for at retail should have exactly zero ads, and the fact that "fewer" is supposed to impress anyone shows how thoroughly Microsoft has lowered the bar.

The privacy angle is where this gets dangerous. When Windows 11 launched in October 2021, Home edition required a Microsoft account during setup. By October 2025 , Microsoft had systematically hunted down and killed every single workaround for creating a local account, the `oobe\bypassnro` command, the BypassNRO registry toggle, the `ms-cxh:localonly` trick, even the old fake email method. Amanda Langowski from Microsoft stated it plainly: they were "removing known mechanisms for creating a local account in the Windows Setup experience."

A Microsoft account means your identity is tied to your OS from first boot. Your activity, your app usage, your browsing through Edge, your files through OneDrive, all funneled into a profile Microsoft controls. And this particular abuse is nowhere in the 7-point fix plan.

OneDrive got the same treatment. Microsoft silently changed Windows 11 setup in 2024 so that OneDrive folder backup enables automatically with no consent dialog, syncing your Desktop, Documents, Pictures, Music, and Videos to Microsoft's cloud. When people discovered this and tried to turn it off, their files disappeared from their local machine because OneDrive had moved them, transferred ownership of your personal files to their cloud service without asking. Author Jason Pargin went viral describing how OneDrive activated itself, moved his files, then started deleting them when he hit the free 5GB storage limit. Microsoft's response to this was silence. Also not in the fix plan.

Windows Recall is worth lingering on. Announced May 2024, it's an AI feature that screenshots everything on your screen every few seconds and makes it searchable. Security researcher Kevin Beaumont demonstrated that the entire Recall database was stored in plaintext in an AppData folder where any malware could extract it. Bank numbers, Social Security numbers, passwords, all sitting in an unencrypted SQLite database.

The UK's Information Commissioner's Office got involved. Microsoft delayed it, made it opt-in, added encryption, and quietly relaunched it for Insiders in November 2024. They built a surveillance feature, shipped it broken, got caught, and called the patch "responding to feedback."

But the abuse pattern goes back way further than Windows 11. In 2015 and 2016, Microsoft ran the GWX (Get Windows 10) campaign , full-screen nag dialogs that pushed Windows 10 upgrades on Windows 7 and 8 users. In May 2016, they changed the behavior of the red X button so that clicking it, which for decades had meant "close" or "cancel", instead scheduled the Windows 10 upgrade . Microsoft's own security advice told users to close suspicious dialogs using the X button, and they weaponized that trained behavior against their own customers. A woman named Teri Goldstein sued after the forced upgrade bricked her travel agency PC and won $10,000 . Microsoft appealed, then dropped the appeal and paid. They eventually admitted they "went too far."

And right now, Microsoft is about to force 240 million PCs into the landfill . Windows 10 hit end of life on October 14, 2025, and Windows 11 requires TPM 2.0, specific CPU generations, UEFI Secure Boot, hardware requirements that excluded roughly 20% of all PCs worldwide. Perfectly functional machines, rendered "obsolete" by arbitrary software restrictions. If you want to keep getting security patches on Windows 10, Microsoft will charge you $30 per year , paying for patches to an operating system you already bought a license for. Enterprise customers pay $61 per device for Year 1, $122 for Year 2, and $244 for Year 3 , with the price doubling each year.

Edge is its own disaster. Mozilla commissioned an independent report titled "Over the Edge" that documented specific dark patterns including confirmshaming (pop-ups implying you're "shopping in a dumb way" if you don't use Edge), disguised ads injected into Google.com and the Chrome Web Store, and default browser settings that hijack back to Edge without notification. Certain Windows web links still force-open in Edge regardless of your default browser setting . Despite all this manipulation, Edge holds just 5.35% global market share . Even with the full weight of an operating system monopoly forcing their browser on people, almost nobody chooses to use it.

And the telemetry question. On Windows 11 Home and Pro, you cannot fully disable telemetry . Setting `AllowTelemetry` to 0 in the registry on non-Enterprise editions gets silently overridden back to 1. Only Enterprise and Education editions can actually turn it off. The operating system you paid for reports data about you to Microsoft, and the setting to stop it is a lie on consumer editions. Also not in the fix plan.

I haven't even mentioned the EU fining Microsoft over 2.2 billion euros across multiple antitrust rulings, including 561 million euros specifically for breaking a browser ballot promise, a Windows 7 update silently removed the choice screen for 14 months, affecting 15 million users, and it was the first time the EU fined a company for violating a "commitment decision." Or the _NSAKEY controversy from 1999 where a second crypto key labeled literally `_NSAKEY` was found embedded in Windows NT. Or the time in August 2024 when a Microsoft update bricked Linux dual-boot systems across Ubuntu, Mint, and other distros, and it took 9 months to fully fix.

The bottom four rows are the ones that matter. The privacy-hostile changes, the forced Microsoft accounts, the telemetry that lies about being disabled, OneDrive hijacking your files, the pre-installed garbage, none of that is part of the fix plan. Microsoft's "swarming" effort targets the most visible UI annoyances, the ones that generate bad headlines. Data collection, vendor lock-in, forced accounts, those stay because those are the revenue model.

Microsoft spent four years deliberately degrading an operating system that people paid $139 or more for, and now they're announcing the removal of their own damage as if it's a gift. The "fix" is them taking their foot off your neck and expecting applause. The ads should have never been there, the Copilot buttons should have never been forced, and the taskbar should have never been crippled in the first place. And the things they're choosing to keep, the telemetry, the forced accounts, the data harvesting, those are the real product, because at this point, you are.

---

[Orijinal makaleyi oku →](https://www.sambent.com/microsofts-plan-to-fix-windows-11-is-gaslighting/) &nbsp;·&nbsp; [Hacker News tartışması →](https://news.ycombinator.com/item?id=47500335)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._