# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

**IMPORTANT: To fix permission errors, you must update your Firestore Security Rules and create the required indexes.**

This is a critical step to ensure your application can read and write data from the database.

### Step 1: Update Security Rules

1.  Copy the content of the `firestore.rules` file in the root of this project.
2.  Go to your **Firebase Console** -> **Firestore Database** -> **Rules** tab.
3.  Paste the new rules into the editor, replacing the existing ones.
4.  Click **Publish**.

### Step 2: Create Composite Indexes

After you publish the rules and run the application, Firestore will report "Missing or insufficient permissions" errors in your browser's developer console for queries that require a composite index.

1.  In the error message in the console, find the link to create the required index. It will look something like this: `https://console.firebase.google.com/project/your-project-id/database/firestore/indexes?create_composite=...`
2.  Click on this link. It will take you directly to the index creation screen in the Firebase Console with all the fields pre-filled.
3.  Click **Create Index**. The indexing process may take a few minutes.

You will need to do this for a few different queries in the app (e.g., fetching user orders, fetching all orders for the admin panel). Just look for the links in the console errors and create the indexes as prompted.
