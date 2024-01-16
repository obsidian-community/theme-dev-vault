---
tags:
  - metadata
  - foo
  - bar
  - baz
aliases:
  - metadata
cssclasses:
  - page--properties
publish: "false"
permalink: properties
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam aliquet arcu lacus, nec ultrices orci auctor vitae. Praesent at rhoncus mi. Donec suscipit id sapien eu ullamcorper.
image: "![[obsidian.jpeg]]"
custom text: Lorem ipsum
custom list:
  - item 1
  - item 2
  - item 3
custom number: "123"
custom checkbox: false
custom date: 2024-01-14
custom date and time: 2024-01-14T16:47:00
---

# Properties

This note has a selection of properties attached, covering the supported types:
- text
- list
- number
- checkbox
- date
- date & time

See also [Properties documentation for users](https://help.obsidian.md/Editing+and+formatting/Properties)

## Default Properties
Some properties are recognised by Obsidian or by plugins to support special behavior.
### Obsidian
|Property|Description|
|---|---|
|`tags`|Additional tags not included in the note body. |
|`aliases`|Alternative names for the note. |
|`cssclasses`|Allows you to style individual notes using [CSS snippets](https://help.obsidian.md/Extending+Obsidian/CSS+snippets).|
### Core Plugins
#### [Publish](https://help.obsidian.md/Obsidian+Publish/Introduction+to+Obsidian+Publish)
|Property|Description|
|---|---|
|`publish`|Specify whether the note should be published. |
|`permalink`|Modify the URL for the published page. |
|`description`|Set HTML description metadata. |
|`image`|Specify a custom image for link previews. |
|`cover`|Alias for `image`  |
