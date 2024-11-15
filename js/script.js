// script.js
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// Function to check if session is expired
function isSessionExpired(session) {
  return session.expires_at * 1000 < Date.now(); // Convert to milliseconds
}

// On page load, check for session
document.addEventListener("DOMContentLoaded", async function () {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && session.access_token) {
    console.log("Session from localStorage:", session); // Debugging log
    console.log(session.access_token);
    if (isSessionExpired(session)) {
      console.log("Session has expired.");
      // If the session is expired, remove it from localStorage
      localStorage.removeItem("supabase_session");
      // You could optionally log the user out automatically
      document.getElementById("login-button").style.display = "flex";
      document.getElementById("logout-button").style.display = "none";
    } else {
      // If session is valid, set it in Supabase
      console.log("User is logged in:", session);
      supabase.auth.setSession(session.access_token); // Set the session in Supabase

      // Update UI based on login state
      document.getElementById("login-button").style.display = "none";
      document.getElementById("logout-button").style.display = "flex";
    }
  } else {
    console.log("No session found, user is not logged in");
    // If no session exists, show login button and hide logout button
    document.getElementById("login-button").style.display = "flex";
    document.getElementById("logout-button").style.display = "none";
  }
});

// Handle logout
document
  .getElementById("logout-action")
  .addEventListener("click", async function () {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Logout Failed: ", error.message);
    } else {
      // Clear the session from localStorage and update UI
      localStorage.removeItem("supabase_session");
      document.getElementById("login-button").style.display = "flex";
      document.getElementById("logout-button").style.display = "none";
    }
  });
