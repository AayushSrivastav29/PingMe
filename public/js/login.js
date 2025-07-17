let path = "http://localhost:3000";

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
    const res = await axios.post(`${path}/api/user/find`, userDetails);
    console.log(res);
    message.textContent = res.data.message;
    message.style.color = "green";
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("name", res.data.name);
    localStorage.setItem("userId", res.data.userId);
    window.location.href = "/view/home.html";
  } catch (error) {
    console.log(error);
    message.textContent = error.response.data.message;
    message.style.color = "red";
  }
}
