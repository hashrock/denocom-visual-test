tried to write visual regression test with deno

# take screenshot

checkout feature main and execute:

```sh
deno run -A screenshot.ts http://localhost:8000/ old
```

then checkout the feature branch and execute:

```sh
deno run -A screenshot.ts http://localhost:8000/ new
```

and compare by:

```sh
deno run -A pixelmatch.ts old new
```

then you got:

![Alt text](image.png)