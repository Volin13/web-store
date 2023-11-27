const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  // Створюю новий тип
  async create(req, res, next) {
    try {
      const { name } = req.body;
      const type = await Type.create({ name });
      return res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    // Повертаю всі типи
    const types = await Type.findAll();
    return res.json(types);
  }
}

module.exports = new TypeController();
