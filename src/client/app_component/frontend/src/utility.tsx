export function convertDurationToTime(seconds) {
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const remainingSeconds = seconds % 60;

   // Format the result
   const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(Math.round(remainingSeconds)).padStart(2, '0')}`;

   return formattedTime;
};