# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

### Deploy to Vercel

* No extra build command changes needed!  
* The included `vercel.json` configures builds and routes for you.
* To deploy:
  1. [Install Vercel CLI](https://vercel.com/docs/cli) if you haven't: `npm i -g vercel`
  2. Run:  
     ```sh
     vercel --prod
     ```
  3. Or connect your repo in the [Vercel dashboard](https://vercel.com/) and deploy via the UI.

### Deploy to Netlify

* No extra build command changes needed!  
* The included `netlify.toml` configures Netlify to run the build and serve with Netlify Functions.
* To deploy:
  1. [Install Netlify CLI](https://docs.netlify.com/cli/get-started/) if you haven't: `npm i -g netlify-cli`
  2. Run:  
     ```sh
     netlify init    # If you haven't set the site up yet
     netlify deploy --prod
     ```
  3. Or connect your repo in the [Netlify app](https://app.netlify.com/) and deploy via the UI.

### Deploy with Docker (optional)

A production-ready Dockerfile is provided.

Build and run:

```sh
# Build the image
docker build -t remix-weekly-planner .

# Run the app container
docker run --rm -it -p 3000:3000 remix-weekly-planner
```
The app will be available at [http://localhost:3000](http://localhost:3000).

---

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
