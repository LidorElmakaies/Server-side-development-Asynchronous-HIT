const Log = require("../../models/log.model");
const logging = require("../core/logging");
const SERVICE_NAME = process.env.SERVICE_NAME || "unknown-service";

class LogsService {
  async listLogs(req, res) {
    await logging.endpointLog(SERVICE_NAME, "GET_LOGS", req);
    const logs = await Log.listLogs();
    res.json(logs);
  }
}

module.exports = LogsService;
