"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  cpd_hours: number;
}

export function CoursesManager() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadCourses() {
    const response = await fetch("/api/admin/courses");
    const body = (await response.json()) as { courses?: CourseItem[]; message?: string };
    if (!response.ok) {
      throw new Error(body.message ?? "Unable to load courses");
    }
    setCourses(body.courses ?? []);
  }

  useEffect(() => {
    loadCourses().catch((requestError) =>
      setError(requestError instanceof Error ? requestError.message : "Unable to load"),
    );
  }, []);

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug }),
    });

    const body = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(body.message ?? "Unable to create course");
      return;
    }

    setTitle("");
    setSlug("");
    await loadCourses();
  }

  async function removeCourse(id: string) {
    const response = await fetch(`/api/admin/courses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError(body.message ?? "Unable to delete course");
      return;
    }
    await loadCourses();
  }

  return (
    <div className="space-y-4">
      <form className="grid gap-2 md:grid-cols-3" onSubmit={createCourse}>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Course title"
        />
        <Input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="course-slug"
        />
        <Button type="submit">Create course</Button>
      </form>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="space-y-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">{course.title}</p>
              <p className="text-muted-foreground">{course.slug}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => removeCourse(course.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
