This repo contains the source code for the Web Animations Demos.
See the [live demo page](https://web-animations.github.io/web-animations-demos/).

## Release

```bash
git pull
gc gh-pages
git rebase master
bower install  # TODO: replace with Yarn

# optional
git add components/
git commit -m "update components"

git push -f
```
