# Frontend themes and learner profile

## Scope
- Keep the existing application, navigation, signup and authentication unchanged.
- Make no backend, API, database or server-function changes. Profile edits are browser-local overlays of existing learner data; they never write to the backend.

## Profile
- Add a shared frontend profile state with per-account browser persistence and immediate saved name/avatar updates in the header.
- Show personal information, skills and Other response, goals, experience, career stage, interests, avatar and appearance. Preserve existing signup values and interest options.
- Calculate the dynamic circular completion indicator from required fields only: name, email, skills (including Other text when selected), goals, experience, career stage and interests. Avatar and About Me remain optional and never block 100%. Label missing required values separately from optional values.
- Complete My Profile opens the first incomplete required section. Email remains read-only; an unavailable account email directs the user to existing sign-in.
- Use actual existing enrolments for statistics, with an empty state when unavailable; never invent numbers.
- Reuse one consistent responsive editor with inline errors, save success/error feedback, cancel restoration and unsaved-change confirmation. Preview completion while editing; cancel restores saved completion. Avatar updates globally upon save.

## Appearance
- Add one Light / Dark / Auto preference shared by Profile and Settings, persisted in browser storage.
- Preserve the approved Light palette. Define complete Dark semantic tokens for every existing page, navigation, overlay, form, card, tooltip and empty state.
- Auto follows and reacts to the device theme. Apply the preference before first paint to avoid a wrong-theme flash.

## Verification
- Test required-field completion and validation, optional fields, local persistence and account isolation.
- Exercise profile editors, cancellation/confirmation, live completion, saved header avatar, theme switching/reload and Auto device changes.
- Check profile sections, circle, appearance and dialogs at 1440, 1024, 768, 390, 375, 360 and 320px.
- Use a real available account for signed-in checks; if no account can be obtained, clearly report authenticated checks as blocked, not passed.

## Technical details
- Add frontend-only providers outside the existing app shell, without altering AuthProvider behavior.
- Browser-local profile values are scoped by account ID; authentication identity and email are never editable or persisted as overrides.
- Use existing design controls, AvatarPicker and UserAvatar; shared CSS semantic tokens theme portal-based controls too.