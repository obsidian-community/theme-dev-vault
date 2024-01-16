
## Unordered lists

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

With longer text that wraps: 

- *Longer item with wrapped text.* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
	- Second level  
		*Additional paragraph after line break.* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
		- Third level
			- Fourth level
	- Second level #2
		- Third level
			- Fourth level

## Ordered lists
Simple numeric list

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar

Nested numbered lists

1. Lorem ipsum dolor sit amet, consectetur 
	1. adipiscing elit, 
		1. sed do eiusmod tempor incididunt 
			1. ut labore et dolore magna aliqua. 
		2. Ut enim ad minim veniam, quis nostrud 
	2. exercitation ullamco laboris nisi ut 
2. aliquip ex ea commodo consequat

Mixed numbered lists

1. Lorem ipsum dolor sit amet, consectetur 
	- adipiscing elit, 
		1. sed do eiusmod tempor incididunt 
			- ut labore et dolore magna aliqua. 
		2. Ut enim ad minim veniam, quis nostrud 
	- exercitation ullamco laboris nisi ut 
2. aliquip ex ea commodo consequat.

## Task lists
### Standard Checkboxes
Supported by all themes

- [ ] incomplete
- [x] x complete

- [ ] nested level 1
	- [ ] nested level 2
		- [ ] nested level 3

### Alternate Checkboxes
Many themes can render additional variations on task list checkboxes. The meanings of symbols differ between themes, but we've tried to list some that have reasonable consensus.
#### Incomplete states
- [ ] incomplete
- [/] / partially done
- [<] < scheduling
#### Complete states
- [x] x complete/done
- [x] X complete/done (treated as failed by Sanctum theme) 
- [-] - canceled
- [>] > deferred/forwarded
#### Other states
- [!] `!` Important
- [?] `?` question

#### Screenshots from themes

##### Ebullientworks

![[ebullientworks-common-tasks.png|400]]
###### Additional types

![[ebullientworks-custom-tasks.png|200]]

###### Sample text

- [R] `R` for review

##### ITS Theme

![[ITS-common-tasks.png|600]]

###### Additional types

![[ITS-custom-tasks.png]]

###### Sample text: 

- [+] `+` Inbox / task that should be processed later
- [b] `b` bookmark 
- [B] `B` brainstorm
- [D] `D` deferred or scheduled
- [I] `I` for Info
- [i] `i` for idea
- [N] `N` for note
- [Q] `Q` for quote
- [R] `R` for research
- [W] `W` for win / success / reward 
- **Pro/Con list**
	- [P] `P` for pro
	- [C] `C` for con


##### Sanctum

![[sanctum-common-tasks.png|500]]

###### Additional types

Sanctum has some adjusted meanings (note differences to ITS)

![[sanctum-custom-tasks.png|300]]

###### Sample text: 

- [a] `a` for alarm
- [b] `b` for bookmark
- [B] `B` for bug
- [n] `n` for note
- [I] `I` for idea
- [i] `i` for information
- [l] `l` for Location
- [<] `<` scheduled
- [>] `>` for deferred / rescheduled
- **Success and failure**
	- [1] `1` for Success
	- [W] `W` for Win / Success / Reward
	- [X] `X` for failure 
- **Money**
	- [s] `s` for savings
	- [S] `S` an alternative for savings
- **Pro/Con list**
	- [P] `p` for pro
	- [c] `c` for con
- **Emoji**
	- [⭐] ⭐ for a starred item
	- [❤] ❤ for a heart item


##### Spectrum

![[spectrum-common-tasks.png|500]]