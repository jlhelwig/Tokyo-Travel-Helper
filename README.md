This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stretch Goals

1. **Dynamic Nearby Search:** Have a way to dynamically search for anything on Google (e.g., hospital, breakfast, bakery, whatever) and find the closest option nearby with a walking path plotted.
2. **AI Activity Suggestions:** Add a new button that hits an API or scrapes data to find fresh, fun suggestions for things to do. When an activity is selected, it should automatically display the location on the maps, its current open/closed status, and a short summary of the item.
3. **Offline Mode & Itinerary Caching:** Implement aggressive PWA caching so users can view their saved itineraries, map pins, and hotel directions securely even in airplane mode or when cell coverage drops (like inside complex Tokyo stations).
4. **Weather & "Must-Bring" Alerts:** Add a morning dashboard widget that checks the specific ward's weather and provides actionable advice (e.g., specifically alerting to bring an umbrella for sudden rain or to dress light for high humidity).
