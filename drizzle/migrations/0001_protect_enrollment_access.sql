REVOKE UPDATE ON public.enrollments FROM authenticated;
GRANT UPDATE (progress, completed_at, last_accessed_at) ON public.enrollments TO authenticated;