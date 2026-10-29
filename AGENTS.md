<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use shared Page and PageTitle layouts for content routes, with optional full-width illustrated banners; this keeps reference styling consistent without inventing learner data.
- Keep one AuthProvider around all routes and one identity-change subscriber; clear query and learner state before signing out to prevent stale private data.
- Save free enrolments through an authenticated server function and restrict enrolment identity columns from learner updates; paid access requires verified payment.
