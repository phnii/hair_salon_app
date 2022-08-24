const getParams = (date) => {return {
  Y: date.getFullYear().toString(),
  M: date.getMonth().toString().padStart(2, "0"),
  D: date.getDate().toString().padStart(2, "0"),
  h: date.getHours().toString().padStart(2, "0"),
  m: date.getMinutes().toString().padStart(2, "0")
}};

module.exports  = {
  ymd: (date) => {
    let params = getParams(date);
    return params.Y + "/" + params.M + "/" + params.D;
  },
  ymdhm: (date) => {
    let params = getParams(date);
    return params.Y + "/" + params.M + "/" + params.D
      + " " + params.h + ":" + params.m;
  },
  hm: (date) => {
    let params = getParams(date);
    return params.h + ":" + params.m;
  }
}