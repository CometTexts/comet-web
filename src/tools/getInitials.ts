const getInitials = (name: string, charactersToDisplay: number = 1) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .splice(0, charactersToDisplay)
    .join("")
    .toUpperCase();
};

export default getInitials;
