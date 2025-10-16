Followup performance improvements

- There's room for caching the `/api/advocates` request on the client side and server side. For the client side, there's a comprehensive guide on [Great Frontend](https://www.greatfrontend.com/questions/system-design/autocomplete#cache) for how to implement caching on an autocomplete component that would be relevant here. For the server side, Next.js probably has documentation about how to implement caching on route handlers that I would look into given more time.
- DB indexes could improve the performance of ordering and querying the advocates table.
- The ahooks `useRequest` is a bit clunky but it's what I'm most familiar with, if I had time I would look for a more lightweight library

Followup UX improvements

- There's a UI state for loading the initial request for results and for no results, but still need a UI state for failed requests and requests slower than `loadingDelay` milliseconds.
- The list of results should scroll back to the top on a new search.
- Look into how to implement a performant pagination component instead of infinite scroll.
- Since advocates may have a long list of specialties, we may want to use a disclosure component to hide the full list. But I'm not sure if this would interfere with the browser's native find in page function that may be used to scan the list of results.
