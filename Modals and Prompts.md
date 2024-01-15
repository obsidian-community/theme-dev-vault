# Modals and Prompts
Obsidian and its core plugins use modals with three main designs:
- **Prompts** (e.g. the Command Palette) are for quick selection from a list.
- **Modals with sidebars** (e.g. Settings) provide access to a hierarchy of controls.
- **Other** sidebars support a range of functions, including are-you-sure requests, font selection, and small sets of settings.

> [!info]
> Note that not all modals have unique HTML classes to identify them independently. The tables below list the best available parent class to style each modal.
## Prompt modals
| Modal | Plugin | Parent Class | How to open |
| ---- | ---- | ---- | ---- |
| Command palette | Command palette | `.prompt` | `Ctrl+P`<br>`Cmd+P` (macOS) |
| Quick Switcher | Quick Switcher | `.prompt` | `Ctrl+O`<br>`Cmd+O` (macOS) |
| Insert template | Templates | `.prompt` | Button in ribbon |
| Workspaces prompt | Workspaces | `.prompt` | Workspaces: Load workspace layout |
## Modals with Sidebar Layout
| Modal | Plugin | Parent Class | How to open |
| ---- | ---- | ---- | ---- |
| Community themes | - | `.modal.mod-community-modal.mod-sidebar-layout.mod-community-theme` | Appearance → Themes → Manage |
| Settings | - | `modal mod-settings mod-sidebar-layout` | Button in ribbon |
| Sync history | File Recovery | `.modal.mod-sync-history.mod-sidebar-layout` | Settings → File Recovery → Snapshots → View |
| Sync version history | Sync | `.mod-sync-history` | Sync: View Sync version history |
## Other modals
| Modal | Plugin | Parent Class | How to open |
| ---- | ---- | ---- | ---- |
| Activate license | - | `.modal` | Settings → General → Commercial license → Activate |
| Debug info | - | `.modal` | Command palette → "Debug" |
| Excluded files | - | `.modal` | Settings → Files & Links → Excluded Files → Manage |
| Interface font | - | `.modal` | Settings → Appearance → Interface font → Manage |
| Log in | - | `.modal` | General → Your account → Log in |
| Monospace font | - | `.modal` | Settings → Appearance → Monospace font → Manage |
| Rename file | - | `.mod-file-rename` | RIght click on link → rename |
| Ribbon configuration | - | `.modal` | Settings → Appearance → Ribbon menu → Manage |
| Spellcheck dictionary | - | `.modal` | Settings → Editor → Spellcheck → Cog icon |
| Text font | - | `.modal` | Settings → Appearance → Text font → Manage |
| Export to PDF | - | `.modal.mod-narrow` | Right-click on tab → Export to PDF... |
| Add bookmark | Bookmarks | `.modal.mod-bookmark` | Right-click on tab → Bookmark... |
| Clear history | File Recovery | `.modal` | Settings → File Recovery → Clear history → Clear |
| Delete file | Files | `.mod-confirmation` | Right-click on file → Delete |
| Delete folder | Files | `.mod-confirmation` | Right-click on file → Delete |
| Format converter | Format converter | `.modal` | Button in ribbon |
| Manage sites | Publish | `.modal.mod-publish` | Button in ribbon |
| Create new vault | Sync |  | Settings → Sync → Remote Vault → Manage → Create new vault |
| Deleted files | Sync | `.modal:has(.sync-file-tree-container)` | Settings → Sync → Deleted files → View |
| Deleted files | Sync | `.modal:has(.sync-file-tree-container)` | Settings → Sync → Deleted files → Bulk restore |
| Manage excluded folders | Sync | `.modal` | Settings → Sync → Excluded folders → Manage |
| Setting files | Sync | `.modal` | Settings → Sync → Settings version history → View |
| Sync log | Sync | `.modal:has(.sync-file-tree-container)` | Settings → Sync → Sync activity → View |
| Your remote vaults | Sync | `.modal:has(.vault-list)` | Settings → Sync → Remote Vault → Manage |
| Manage workspace layouts | Workspaces | `.modal` | Button in ribbon |
| Manage workspace layouts | Workspaces | `.modal` | Workspaces: Manage workspace layouts |




