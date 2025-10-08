
const changeColor = document.querySelectorAll("#changeColor");

changeColor.forEach(item => {
  item.addEventListener("mouseenter", () => {
    item.style.color = "#db2777";
  });
  item.addEventListener("mouseleave", () => {
    item.style.color = "";
  });
});


