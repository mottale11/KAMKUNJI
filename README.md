# Firebase Studio

This is a NextJS starter in Firebase Studio.

**IMPORTANT: To fix permission errors and enable features like product uploads, you must update your Firestore Security Rules, create the required database indexes, and configure Storage CORS settings.**

These are critical steps to ensure your application can read and write data correctly.

### Step 1: Configure Firebase Storage CORS

To allow your website to upload images when you add a new product, you must configure Cross-Origin Resource Sharing (CORS) for your Firebase Storage bucket.

1.  **Install the Google Cloud CLI:** If you don't have it, install it from the [official documentation](https://cloud.google.com/sdk/docs/install).
2.  **Authenticate the CLI:** Run the following command in your terminal and follow the prompts to log in with your Google account:
    ```bash
    gcloud auth login
    ```
3.  **Create a CORS configuration file:** Create a file named `cors.json` on your computer and paste the following content into it. This configuration tells Firebase Storage to trust your Vercel domain.
    ```json
    [
      {
        "origin": ["https://kamkunji-git-main-moses-mwais-projects.vercel.app"],
        "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "responseHeader": ["Content-Type", "Authorization"],
        "maxAgeSeconds": 3600
      }
    ]
    ```
4.  **Apply the CORS configuration:** Find your Storage Bucket URL in your Firebase Console under **Storage -> Files**. It will look like `gs://your-project-id.appspot.com`. Run the following command in your terminal, replacing `gs://your-bucket-name` with your actual bucket URL:
    ```bash
    gcloud storage buckets update gs://your-bucket-name --cors-file=./cors.json
    ```
    (Note: If you deploy to a different domain in the future, you will need to update `cors.json` with the new URL and run this command again.)

### Step 2: Update Firestore Security Rules

1.  Copy the content of the `firestore.rules` file in the root of this project.
2.  Go to your **Firebase Console** -> **Firestore Database** -> **Rules** tab.
3.  Paste the new rules into the editor, replacing the existing ones.
4.  Click **Publish**.

### Step 3: Create Composite Indexes

After you publish the rules and run the application, your browser's developer console will report "Missing or insufficient permissions" errors for queries that require a composite index.

1.  In the error message in the console, **find the link to create the required index**. It will look like this: `https://console.firebase.google.com/project/your-project-id/database/firestore/indexes?create_composite=...`
2.  **Click on this link**. It will take you directly to the index creation screen in the Firebase Console with all the fields pre-filled.
3.  Click **Create Index**. The indexing process may take a few minutes.

You will need to do this for a few different queries in the app (e.g., fetching user orders, fetching new orders for the admin panel). Just look for the links in the console errors and create the indexes as prompted.
