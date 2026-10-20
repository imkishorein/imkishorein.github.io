#!/bin/sh
# Runs the Astro dev server and starts it again whenever it exits.
# Ctrl-C (or the app stopping this script) stops everything for real.
cd "$(dirname "$0")/.." || exit 1

child=""
trap '[ -n "$child" ] && kill "$child" 2>/dev/null; exit 0' INT TERM

while true; do
  node_modules/.bin/astro dev --port 4321 --strictPort &
  child=$!
  wait "$child"
  echo "[keepalive] dev server exited (code $?), restarting in 1s"
  sleep 1
done
