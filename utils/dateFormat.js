const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  
  // function to format a date using the specified options
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  module.exports = formatDate;