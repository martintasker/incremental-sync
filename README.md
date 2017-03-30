# IncrementalSync

## basic algorithm

*	create index
*	when current-list item added, add to index and check for change and, if yet applicable, addition
*	when old-list item added, add to index and check for change and, if yet applicable, deletion
*	when current-list has finished, check globally for deletions
*	when old-list has finished, check globally for additions
*	during this process, when deletion/addition/change is found, emit into results list
*	an end indication can also be emitted when both inputs have ended
