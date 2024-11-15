import { createClient } from "@supabase/supabase-js";

const form = document.getElementById("registerForm");
const register_button = document.getElementById("register");

register_button.disabled = true;

// Create a single supabase client for interacting with your database
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = form.email.value;
  const pass = form.password.value;
  const username = form.username.value;
  const name = form.name.value;

  form.name.value = "";
  form.username.value = "";
  form.email.value = "";
  form.password.value = "";
  form.pass_confirm.value = "";

  await handleSignup(email, pass, username, name);
});

form.addEventListener("input", function () {
  const isFormComplete = form.checkValidity();
  register_button.disabled = !isFormComplete;
});

// Reset form when page loads (for example, on page refresh)
window.addEventListener("load", function () {
  const form = document.getElementById("registerForm");
  form.reset(); // Resets all form fields
});

async function handleSignup(email, password, username, name) {
  // Step 1: Sign up the user with email and password
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error("Signup failed:", signUpError.message);
    alert("Signup failed: " + signUpError.message);
    return;
  }

  console.log("User signed up successfully:", signUpData);

  // Step 2: Insert additional data into a custom "profiles" table
  const user = signUpData.user;
  if (user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        { id: user.id, username: username, fullname: name, emails: email },
      ]);

    if (profileError) {
      console.error("Failed to add user profile:", profileError.message);
      alert("Failed to add user profile: " + profileError.message);
    } else {
      console.log("User profile created successfully!");
      alert("Signup and profile creation successful!");
    }
  }
}
