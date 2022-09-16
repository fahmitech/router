# Handling 404 and missing routes

Native apps don't have a server so there are technically no 404s. However, if you're implementing a router universally, then it makes sense to handle missing routes. This is done automatically for each app, but you can also customize it.

You can elevate the not found screen to a top-level route by adding a `NotFound` component to your app in a catch-all route:

`/app/(stack)/[...missing].js`

```tsx
import { NotFound } from "expo-router";

export default NotFound;
```

This will render the default `NotFound` component nested in the current stack. You can export any component you want to render instead. We recommend having a link to `/` so users can navigate back to the home screen.