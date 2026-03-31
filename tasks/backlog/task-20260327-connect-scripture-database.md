# Task: Connect Scripture Database

## Summary

Connect the application to a scripture data source so QT reading can load real Bible content.

## Background

The reading experience cannot function without real scripture text.
The app needs a reliable way to load fixed Bible passages for QT sessions.
This may come from a database, external source, or preloaded scripture dataset, depending on implementation choice.

This task focuses on connecting the reading flow to actual scripture data.

## Goals

* Define how scripture content will be loaded
* Connect the app to a real scripture source
* Support loading fixed passages for QT sessions
* Make scripture retrieval usable by the reading module

## Non-Goals

* Full editorial/admin tooling for scripture content
* Final recommendation engine for passage selection
* Full annotation/highlight support
* Community content integration

## Deliverables

* Scripture data source connection
* Basic scripture query or retrieval layer
* Ability to fetch scripture passages needed for QT
* Interface usable by reading-related application code

## Acceptance Criteria

* The application can retrieve real scripture content from the selected source
* The reading module can consume the scripture data
* The system supports fixed-passage QT usage
* The implementation is stable enough for reading screen integration

## Notes

The exact storage method can vary, but the retrieval interface should stay simple and consistent.
