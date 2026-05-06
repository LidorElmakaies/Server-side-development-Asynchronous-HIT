const Log = require("../../models/log.model");
const logging = require("../core/logging");

class LogsService {
  async listLogs(req, res) {
    await logging.endpointLog("main-server", "GET_LOGS", req);
    const logs = await Log.find({}, { _id: 0 }).sort({ createdAt: -1 }).lean();
    res.json(logs);
  }
}

module.exports = LogsService;
