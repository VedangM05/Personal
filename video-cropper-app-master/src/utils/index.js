const secondsToDuration = (seconds) => {
  if (!seconds) return { hour: "00", min: "00", sec: "00" };

  const hour = Math.round(seconds / (60 * 60));
  const min = Math.round((seconds % (60 * 60)) / 60);
  const secRemain = Math.round(seconds % 60);

  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  const formattedMin = min < 10 ? `0${min}` : `${min}`;
  const formattedSec = secRemain < 10 ? `0${secRemain}` : `${secRemain}`;

  return {
    hour: formattedHour,
    min: formattedMin,
    sec: formattedSec,
  };
};

const formatTime = (seconds) => {
  const hour = Math.round(seconds / (60 * 60));
  const mins = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  const formattedMin = mins < 10 ? `0${mins}` : `${mins}`;
  const formattedSec = secs < 10 ? `0${secs}` : `${secs}`;

  return `${formattedHour}:${formattedMin}:${formattedSec}`;
};

export { secondsToDuration, formatTime };
