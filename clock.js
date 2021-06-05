export function placeClockHands() {
  const clock_html = `<div id="clock-container">
                            <div id="clock-container-hour" class="clock-container-hand"></div>
                            <div id="clock-container-minute" class="clock-container-hand"></div>
                            <div id="clock-container-second" class="clock-container-hand"></div>
                        </div>`;
  const main_content = document.getElementById(`main-content`);
  main_content.innerHTML += clock_html;
  setInterval(() => {
    const hourHand = document.getElementById(`clock-container-hour`);
    const minuteHand = document.getElementById(`clock-container-minute`);
    const secondHand = document.getElementById(`clock-container-second`);

    const date = new Date();
    const currHour = date.getHours() % 12;
    const currMinute = date.getMinutes();
    const currSecond = date.getSeconds();

    const hourDegree = currHour * 30 + currMinute / 2;
    const minuteDegree = currMinute * 6;
    const secondDegree = currSecond * 6;

    hourHand.style.transform = `rotate(${hourDegree}deg)`;
    minuteHand.style.transform = `rotate(${minuteDegree}deg)`;
    secondHand.style.transform = `rotate(${secondDegree}deg)`;
  }, 1000);
}
