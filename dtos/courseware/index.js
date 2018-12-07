module.exports = {
  Add: class Add {
    constructor(path, name) {
      this.path = path;
      this.name = name;
    }
  },
  Get: class Get {
    constructor(path, name, cover) {
      this.path = path;
      this.name = name;
      this.cover = cover;
    }
  }
}
