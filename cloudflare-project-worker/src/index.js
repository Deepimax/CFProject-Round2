/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/secure") {
      // Step 1: Authenticate the user (use email from headers or session if available)
      const email = request.headers.get("CF-Access-Authenticated-User-Email") || "unknown@example.com";
      const timestamp = new Date().toISOString();
      const cf = request.cf || {};
      const countrycode = request.cf.country || "Unknown";

      // Step 2: Return the identity information as HTML
      const responseHtml = `
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to the Technical Assessment</title>
            <link rel="stylesheet" href="styles.css">
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f9;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            </style>
            </head>
          <body>
            <p>${email} authenticated at ${timestamp} from <a href="/secure/${countrycode}">${countrycode}</a></p>
            <ul>
              <li>City: ${cf.city || "Unknown"}</li>
              <li>Continent: ${cf.continent || "Unknown"}</li>
              <li>Postal Code: ${cf.postalCode || "Unknown"}</li>
              <li>Region: ${cf.region || "Unknown"}</li>
              <li>Timezone: ${cf.timezone || "Unknown"}</li>
            </ul>
          </body>
        </html>`;
      
      return new Response(responseHtml, { headers: { "Content-Type": "text/html" } });
    }

    // Serve country flag at /secure/{COUNTRY}
    const country = pathname.split("/")[2];
    if (country) {
      const object = `https://pub-8e5f4ab5feaf474b821503a01814dac9.r2.dev/${country}.png`;
      const response = await fetch(object);
      const headers = new Headers(response.headers);
      headers.set("Content-Type", "image/png");
      return new Response(response.body, { headers });
      
    }

   return new Response("Not found", { status: 404 });
  }
};
