export default function getTimeString(seconds: number) {
  seconds = Math.abs(seconds); // Make sure it's positive

  if (seconds === Infinity) return "0:00";
  if (isNaN(seconds)) return "0:00";

  // Get the individual components
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Format it accordingly
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = Math.floor(remainingSeconds).toString().padStart(2, "0");

  // Return the formatted string based on the components
  if (hours >= 1) return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  else if (minutes >= 1) return `${formattedMinutes}:${formattedSeconds}`;
  else return seconds.toFixed(1);
}
