import { createClient } from "@supabase/supabase-js";

const form = document.getElementById("login_form");

// Create a single supabase client for interacting with your database
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;
    console.log("User logged in");
    alert("Login Success");
    // Store session in localStorage
    localStorage.setItem("supabase_session", JSON.stringify(data));

    window.location.href = "/index.html";
  } catch (error) {
    console.error("Login error : ", error.message);
    alert("Error logging in : ", error.message);
  }
});
