-- Migration number: 0001 	 2024-04-02T14:01:35.156Z
CREATE TABLE `todo` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`done` integer DEFAULT false NOT NULL
);