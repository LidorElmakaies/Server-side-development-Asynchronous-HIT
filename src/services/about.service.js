const logging = require("../core/logging");
const SERVICE_NAME = process.env.SERVICE_NAME || "unknown-service";

class AboutService {
  getTeamMembers() {
    if (process.env.TEAM_MEMBERS_JSON) {
      const parsed = JSON.parse(process.env.TEAM_MEMBERS_JSON);
      return parsed.map((m) => ({
        first_name: m.first_name,
        last_name: m.last_name,
      }));
    }
    return [{ first_name: "team", last_name: "member" }];
  }

  async getAbout(req, res) {
    await logging.endpointLog(SERVICE_NAME, "GET_ABOUT", req);
    res.json(this.getTeamMembers());
  }
}

module.exports = AboutService;
