export const serialize = (object: any) => {
  let str = [];
  for (let property in object)
    if (object.hasOwnProperty(property)) {
      str.push(
        encodeURIComponent(property) +
          "=" +
          encodeURIComponent(object[property])
      );
    }
  return str.join("&");
};

export const sumArray = (arr: any[]) => {
  return arr.reduce((acc, element) => acc + element);
};

export const isEmpty = (element: string) => {
	if (element === "") return true;
};
