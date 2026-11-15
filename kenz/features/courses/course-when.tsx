"use client";

/** La ligne de date d'une course : le lieu, la date (et « en cours » avec son pouls). Liste et fiche. */
import type { Course } from "@/content/courses";
import { useLanguage } from "@/i18n/language-provider";
import styles from "./course-when.module.css";
import { formatCourseDate } from "./format-course-date";

interface CourseWhenProps {
  course: Course;
  className?: string;
}

export function CourseWhen({ course, className }: CourseWhenProps) {
  const { t } = useLanguage();
  const ongoing = course.status === "ongoing";
  return (
    <p className={className ? `${styles.when} ${className}` : styles.when}>
      {course.place ? (
        <>
          <span className={styles.place}>{course.place}</span>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
        </>
      ) : null}
      <time dateTime={course.date}>{formatCourseDate(course.date, ongoing, t.sport.courses.date)}</time>
      {ongoing ? (
        <span className={styles.ongoing}>
          <i aria-hidden="true" />
          {t.sport.courses.ongoing}
        </span>
      ) : null}
    </p>
  );
}
