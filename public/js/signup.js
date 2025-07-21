let path = "http://13.203.161.226:4000";

document.querySelector("form").addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;
  const password = document.querySelector("#password").value;

  const userDetails = {
    name,
    email,
    phone,
    password,
  };
  const message = document.querySelector("#message");

  try {
    const res = await axios.post(`${path}/api/user/add`, userDetails);
    console.log(res);
    message.textContent = res.data.message;
    message.style.color = "green";
    setTimeout(() => {
      window.location.href = "/view/login.html";
    }, 1000);
  } catch (error) {
    console.log(error);
    message.textContent = error.response.data.message;
    message.style.color = "red";
  }
}
