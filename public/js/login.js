/**
 * Deliverables:

    Make the frontend for the login page.
    Once the user clicks on the submit button take the object and call the corresponding backend api (which you are about to create).
    Also show a button at the botton for signup for (new users)like the way it is in the app.

 */


document.querySelector("form").addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const userDetails = {
    email,
    password,
  };
  const message = document.querySelector("#message");

  try {
    const res = await axios.post(`http://localhost:3000/api/user/find`, userDetails);
    console.log(res);
     message.textContent = res.data.message;
     message.style.color = "green";
  } catch (error) {
    console.log(error);
     message.textContent = error.response.data.message;
     message.style.color = "red";
  }
}
