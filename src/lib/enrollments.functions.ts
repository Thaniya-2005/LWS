import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { canSelfEnroll } from "./enrollment-rules";

export const enrollFreeCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ courseId: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    if (!canSelfEnroll(data.courseId)) throw new Error("This course requires verified payment.");
    const { error } = await context.supabase.from("enrollments").upsert(
      { user_id: context.userId, course_id: data.courseId },
      { onConflict: "user_id,course_id", ignoreDuplicates: true },
    );
    if (error) throw new Error("Couldn't save your enrolment. Please try again.");
    const result = await context.supabase.from("enrollments").select("*")
      .eq("user_id", context.userId).eq("course_id", data.courseId).single();
    if (result.error) throw new Error("Couldn't load your enrolment. Please try again.");
    return result.data;
  });