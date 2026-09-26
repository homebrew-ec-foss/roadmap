#!/bin/bash
set -e

mkdir -p build_output
cp -r site/rendered/* build_output/
REPO_NAME=$1
EVENT_NAME=$2
PR_NUMBER=$3

if [[ "$EVENT_NAME" == "pull_request" ]]; then
    BASE_PATH="/$REPO_NAME/PR$PR_NUMBER"
    echo "Preparing PR Preview for $BASE_PATH"
    # Adjust paths for subdirectory
    find build_output -type f \( -name "*.html" -o -name "*.css" -o -name "*.xml" -o -name "*.js" \) -exec sed -i "s|href=\"/|href=\"$BASE_PATH/|g" {} +
    find build_output -type f \( -name "*.html" -o -name "*.css" -o -name "*.xml" -o -name "*.js" \) -exec sed -i "s|src=\"/|src=\"$BASE_PATH/|g" {} +
    find build_output -type f \( -name "*.html" -o -name "*.css" -o -name "*.xml" -o -name "*.js" \) -exec sed -i "s|url(/|url($BASE_PATH/|g" {} +
    find build_output -type f -name "*.html" -exec sed -i "s|fetch('/|fetch('$BASE_PATH/|g" {} +
    find build_output -type f -name "*.html" -exec sed -i "s|a.href = '/|a.href = '$BASE_PATH/|g" {} +
    find build_output -type f -name "*.html" -exec sed -i "s|fx-action=\"/|fx-action=\"$BASE_PATH/|g" {} +

    mv build_output "PR$PR_NUMBER"
    echo "path=PR$PR_NUMBER" >> $GITHUB_OUTPUT
else
    BASE_PATH="/$REPO_NAME"
    echo "Preparing Main Site for $BASE_PATH"
    # Main branch path adjustment
    find build_output -type f \( -name "*.html" -o -name "*.css" -o -name "*.xml" -o -name "*.js" \) -exec sed -i "s|href=\"/|href=\"$BASE_PATH/|g" {} +
    find build_output -type f \( -name "*.html" -o -name "*.css" -o -name "*.xml" -o -name "*.js" \) -exec sed -i "s|src=\"/|src=\"$BASE_PATH/|g" {} +
    find build_output -type f \( -name "*.html" -o -name "*.css" -o -name "*.xml" -o -name "*.js" \) -exec sed -i "s|url(/|url($BASE_PATH/|g" {} +
    find build_output -type f -name "*.html" -exec sed -i "s|fetch('/|fetch('$BASE_PATH/|g" {} +
    find build_output -type f -name "*.html" -exec sed -i "s|a.href = '/|a.href = '$BASE_PATH/|g" {} +
    find build_output -type f -name "*.html" -exec sed -i "s|fx-action=\"/|fx-action=\"$BASE_PATH/|g" {} +

    mv build_output main_site
    echo "path=main_site" >> $GITHUB_OUTPUT
fi
