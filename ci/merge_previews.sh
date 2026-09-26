#!/bin/bash
set -e

mkdir -p final_site
TARGETS=$1
EVENT_ACTION=$2
CURRENT_PR_NUMBER=$3
REPO=$4

echo "$TARGETS" | jq -r 'keys[]' | while read name; do
    if [[ "$EVENT_ACTION" == "closed" && "$name" == "PR$CURRENT_PR_NUMBER" ]]; then
        echo "Skipping $name as the PR is closed."
        continue
    fi

    echo "Restoring $name..."
    RUN_ID=$(echo "$TARGETS" | jq -r ".\"$name\".run_id")

    if [ "$name" == "main_site" ]; then
        gh run download "$RUN_ID" -n "main_site" -D final_site --repo "$REPO"
    else
        gh run download "$RUN_ID" -n "$name" -D "final_site/$name" --repo "$REPO"
    fi
done

