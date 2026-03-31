# Domain Model - Juyaro Bible Project

## Purpose
This document defines the core domain entities for the Juyaro Bible Project before API, database, and UI implementation.

The goal is to stabilize the core structure early so that product, backend, and frontend decisions remain consistent.

---

## 1. Scripture Domain

### BibleVersion
Represents a Bible translation/version.

Example fields:
- id
- code
- name
- language

### Book
Represents a Bible book within a version.

Example fields:
- id
- version_id
- book_order
- name
- short_name

### Chapter
Represents a chapter within a book.

Example fields:
- id
- book_id
- chapter_number

### Verse
Represents an individual verse.

Example fields:
- id
- chapter_id
- verse_number
- text

---

## 2. Reading Domain

### ReadingPlan
Represents a fixed QT content unit for a given duration.

Example fields:
- id
- title
- duration_type
- description
- start_verse_id
- end_verse_id
- is_active

### ReadingSession
Represents a user's actual reading activity for a reading plan.

Example fields:
- id
- user_id
- reading_plan_id
- started_at
- completed_at
- status

---

## 3. Note Domain

### Bookmark
Represents a saved scripture reference for a user.

Example fields:
- id
- user_id
- verse_id
- created_at

### Note
Represents a user's memo written during or after a reading session.

Example fields:
- id
- user_id
- reading_session_id
- verse_id nullable
- content
- created_at
- updated_at

---

## 4. Reflection Domain

### ReflectionQuestion
Represents a reflection question attached to a reading plan.

Example fields:
- id
- reading_plan_id
- question_text
- sort_order

### ReflectionAnswer
Represents a user's answer to a reflection question.

Example fields:
- id
- user_id
- reading_session_id
- reflection_question_id
- answer_text
- created_at

---

## 5. Community Domain

### Group
Represents a meditation-sharing group.

Example fields:
- id
- name
- description
- visibility
- created_by

### Post
Represents a user post inside a group.

Example fields:
- id
- group_id
- user_id
- reading_session_id nullable
- note_id nullable
- content
- image_url nullable
- created_at

### Comment
Represents a comment or reply on a post.

Example fields:
- id
- post_id
- user_id
- parent_comment_id nullable
- content
- created_at

---

## Modeling Decisions

1. Scripture data is separated into version, book, chapter, and verse.
2. ReadingPlan and ReadingSession are separate because content definition and user activity are different concerns.
3. Notes are primarily attached to a ReadingSession, not only to individual verses.
4. Reflection questions are attached to a ReadingPlan, while answers are attached to a ReadingSession.
5. Community posts can optionally reference a reading session or note, but they remain valid as standalone posts.

---

## Initial Scope
The first implementation should prioritize:
- scripture retrieval
- reading plan structure
- reading session tracking
- note creation
- reflection question flow
- group post and comment structure