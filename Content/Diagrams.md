User documentation: https://help.obsidian.md/Editing+and+formatting/Advanced+formatting+syntax#Diagram

Obsidian supports diagrams using [Mermaid](https://mermaid-js.github.io/) syntax. Mermaid supports many diagram types, with just a few examples shown here.
## Diagram types
### Flow chart
```mermaid
flowchart TB 
	A --> C 
	A ==> D 
	B -.-> C 
	B -- link label--> D
```
### Gantt chart
```mermaid 
gantt 
  title A Gantt Diagram 
  dateFormat YYYY-MM-DD 
  section Project A 
    Task 1 :a1, 2014-01-01, 30d 
    Task 2 :after a1, 20d 
  section Project B 
    Task 3 :2014-01-12, 12d 
    Task 4 :24d
```
### Pie chart
```mermaid
pie title Animal biomass percentage
  "Arthropods" : 42
  "Fish" : 29
  "Annelids" : 8
  "Molluscs" : 8
  "Cnidarians" : 4
  "Livestock" : 4
  "Humans" : 2.5
  "Nematodes" : 0.8
```
## Links in diagrams
Mermaid diagrams can include links to other notes.
```mermaid 
graph TD 
  Callouts --> Diagrams
  Diagrams --> Embeds
  Embeds --> Footnotes
  
  class Callouts,Diagrams,Embeds,Footnotes internal-link; 
```
