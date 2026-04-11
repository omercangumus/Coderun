#!/bin/bash
case $GIT_COMMIT in
  72807fb*)
    export GIT_AUTHOR_DATE="Mon Mar 23 10:00:00 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Mar 23 10:00:00 2026 +0000"
    ;;
  b7ed0c9*)
    export GIT_AUTHOR_DATE="Mon Mar 23 11:00:00 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Mar 23 11:00:00 2026 +0000"
    ;;
  fc85bdb*)
    export GIT_AUTHOR_DATE="Mon Mar 30 10:00:00 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Mar 30 10:00:00 2026 +0000"
    ;;
  7d0065b*)
    export GIT_AUTHOR_DATE="Mon Mar 30 11:00:00 2026 +0000"
    export GIT_COMMITTER_DATE="Mon Mar 30 11:00:00 2026 +0000"
    ;;
esac