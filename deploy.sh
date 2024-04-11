git fetch --tags

latestTag=$(git describe --tags "$(git rev-list --tags --max-count=1)")

echo $latestTag

git checkout $latestTag
