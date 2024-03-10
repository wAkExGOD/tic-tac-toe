const events = {
  update: "update-field",
  restart: "restart-game",
};

window.addEventListener(events.update, () => {
  const handleClick = (...args) => {
    onTurn(...args);
    window.dispatchEvent(new Event(events.update));
  };

  const restart = () => window.dispatchEvent(new Event(events.restart));
  render(currentRound, handleClick, restart);
});

window.addEventListener(events.restart, () => {
  onRestart();
  window.dispatchEvent(new Event(events.update));
});

window.dispatchEvent(new Event(events.restart));
