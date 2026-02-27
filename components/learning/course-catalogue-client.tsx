"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  cpd_hours: number;
  lessons: Array<{ id: string }>;
}

export function CourseCatalogueClient() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [source, setSource] = useState("mock");

  useEffect(() => {
    fetch("/api/learning/courses")
      .then((response) => response.json())
      .then((body: { source?: string; courses?: CourseItem[] }) => {
        setCourses(body.courses ?? []);
        setSource(body.source ?? "mock");
      })
      .catch(() => setCourses([]));
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Course data source: {source}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{course.description}</p>
              <p>
                <strong>Category:</strong> {course.category} | <strong>CPD:</strong>{" "}
                {course.cpd_hours} hours
              </p>
              <p>
                <strong>Lessons:</strong> {course.lessons.length}
              </p>
              <Button asChild size="sm">
                <Link href={`/learning/${course.slug}`}>Open course</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
