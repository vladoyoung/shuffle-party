# Shuffle Party
#### Video Demo:  Soon!
#### Description:
This is a frontend application created for a final project submission for the Harvard CS50x course. Howerver, it's also a practical project I've been having in mind for some time.

Disclaimer: For the official app on the [Shuffle party website](https://shuffle-party.vercel.app/), I'm using the Spotify developer license/mode and since this is an app created primarily for private use, I have no plans of submitting for a commercial license. In order to use this app, you need to be added as a user manually.

The purpose of it is to simplify a music listening game we do with my girlfriend. Up to this point, we used to open our Spotify liked songs playlists and take turns in choosing a song to play while having the "shuffle" option on. This is a two-person game/app for now. The person leading the "shuffle party" would queue the song that the other person got from the Spotify shuffle and shared verbally. The leader person's song gets queued automatically, because their device is the one playing the music. This process is repeated practically every two songs, when it's turn to queue up the non-leading person's song.

The purpose of this game is to see how the taste of two people blindly choosing songs will turn out. The ultimate guilty pleasure, hard to listen to, cheesy and depressing songs mixer to test your music compatibility!

This app has the purpose of removing the manual steps of the game in order to save time and electricity. Once you've logged in all you have to do is choose whether you want to mix or update your shared songs. At the moment each user contributes to the mix with 25 random songs from their liked songs library. The app will generate a new "Shuffle Party" Spotify public playlist containing the mixed songs from both the chosen user, and the one creating the mix. 

The app turned out to be more complicated than I expected, primarily because of the Spotify Auth methods and restrictions. Because of this, some extra steps are required from the users that I initially tried to avoid. But hey, it works and serves the ultimate purpose of reducing user input by about 48 times and saving 7-10 minutes for each 50 song shuffle party! With a couple of clicks you can generate an about 3-4 hours long mixed playlist you and your party buddy can enjoy!

#### Instructions:
Below are some instructions on how to use the app in either two ways:

##### If you want to mix:
1. Log in with Spotify
2. Choose a user to mix with
3. Click the "Start party mixing"
4. That's it! Now you have a new playlist called "Shuffle Party" in your Spotify account containing the mixed songs.

##### If you want to update your shared songs:
1. Log in with Spotify
2. Click the "Update shared songs" button
3. That's it! Now other users can use your shared songs to mix a playlist together.

#### Technical information:
For this app I decided to use the time to test out some tools I've been wanting to try out for some time. Supabase for the backend and authentication, Svelte for the frontend, Shadcn for the components and styling library and the Spotify Web API as I'm a big Spotify user. All other tools I'm pretty familiar with already.

I've decided that logging in with an OAuth2.0 authentication method through Spotify would be enough for this app. No need for passwords or usernames within the Shuffle Party app itself. All the necessary information and access codes are supplied through the OAuth2.0 login. The user information is stored in a secure way. You can read more about that in the [Supabase Auth Docs](https://supabase.com/docs/guides/auth).

One interesting approach to the shuffling of songs is that unlike Spotify's unknown approach where you often get the same songs for weeks, this app will probe your liked songs to see how many of them you have and then grab the songs at random. The app does a one song API request so the endpoint can return the total number of songs in the user's liked songs library. The actual song returned from that endpoint is not used because it's not random, but the total number of songs is used to randomly choose 25 numbers, store them in an array and use them to offset the 25 next API requests for one random song each.

For the "update shared songs" functionality, the same 25 songs fetch is used, but with a push to the database to update the "shared_songs" column for the user's profile. These shared songs are later used by the user mixing the playlist.

Before creating a new "Shuffle Party" playlist, the app will check if the user already has a playlist with that name in their library. If they do, the app will only update the songs and description of that playlist instead of deleting the whole playlist and creating a new one. The description update includes a date and timestamp of the last update to the playlist.

#### Installation:
If you need to run this locally, you will need to set up your Supabase environemnt variables first, alongside configuring your own Spotify developer account. You can follow [this Supabase guide](https://supabase.com/docs/guides/auth/social-login/auth-spotify) for more information. You will also need to set up your Supabase authentication settings and profile tables for Postgres. I will not include these in the installation guide as it's fairly easy to just follow the code in the repo for reference.

After than, simply do `npm install` and then `npm run dev` to run in dev mode. `npm run build` for production mode and `npm run preview` if you need to preview your production mode build.

#### Potential improvements:
- [ ] See if there's a way to remove the need for the "Update shared songs" step. This might be tricky with authorization and Spotify access tokens.
- [ ] Wait and see if Spotify will implement the API ability to add songs through collaborative approaches so the app can display which user added which songs.
- [ ] Possibly some kind of songs visualisation within the app, before you go to the playlist.