export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const truncateString = (str, num) => {
  if (str.length <= num) return str;
  return str.slice(0, num) + '...';
};
