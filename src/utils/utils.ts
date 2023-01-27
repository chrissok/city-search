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
